# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from phe import paillier
from datetime import datetime
import os
from supabase import create_client, Client
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives.ciphers import aead
from base64 import b64encode, b64decode
from datetime import datetime
import uuid
import json
import bcrypt
from dotenv import load_dotenv, dotenv_values

config = dotenv_values(".env")

app = Flask(__name__)
CORS(app)

# Initialize Supabase client
supabase_url = config["SUPABASE_URL"]
supabase_key = config["SUPABASE_KEY"]
supabase: Client = create_client(supabase_url, supabase_key)

class SecureKeyStorage:
    def __init__(self, master_key_env='MASTER_KEY'):
        """
        Initialize secure storage with a master key.
        Master key should be set as an environment variable.
        """
        self.master_key = config[master_key_env]
        if not self.master_key:
            raise ValueError(f"Environment variable {master_key_env} not set")
        
        # Convert master key from hex string to bytes
        self.master_key = bytes.fromhex(self.master_key)
        
    def _generate_key_id(self):
        """Generate a unique identifier for the key"""
        return str(uuid.uuid4())

    def encrypt_private_key(self, private_key_data):
        """
        Encrypt a private key using AES-GCM.
        Returns: (encrypted_key, key_id)
        """
        # Generate a unique salt for this encryption
        salt = os.urandom(16)
        
        # Generate a unique nonce for AES-GCM
        nonce = os.urandom(12)
        
        # Generate an encryption key using PBKDF2
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = kdf.derive(self.master_key)
        
        # Create AESGCM cipher
        aesgcm = aead.AESGCM(key)
        
        # Encrypt the private key
        ciphertext = aesgcm.encrypt(
            nonce,
            private_key_data.encode() if isinstance(private_key_data, str) else private_key_data,
            None  # Additional data if needed
        )
        
        # Combine salt, nonce, and ciphertext for storage
        encrypted_data = salt + nonce + ciphertext
        
        # Generate a unique ID for this key
        key_id = self._generate_key_id()
        
        return b64encode(encrypted_data).decode('utf-8'), key_id

    def decrypt_private_key(self, encrypted_data):
        """
        Decrypt an encrypted private key.
        """
        # Decode from base64
        encrypted_data = b64decode(encrypted_data)
        
        # Extract components
        salt = encrypted_data[:16]
        nonce = encrypted_data[16:28]
        ciphertext = encrypted_data[28:]
        
        # Regenerate the encryption key
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = kdf.derive(self.master_key)
        
        # Decrypt
        aesgcm = aead.AESGCM(key)
        decrypted_data = aesgcm.decrypt(nonce, ciphertext, None)
        
        return decrypted_data

def store_election_keys(election_id, private_key, supabase):
    """
    Store election keys securely in the database.
    """
    try:
        # Initialize secure storage
        key_storage = SecureKeyStorage()

        # Serialize the private key
        serialized_private_key = serialize_private_key(private_key)
        
        # Encrypt the private key (which is now in bytes format)
        encrypted_key, key_id = key_storage.encrypt_private_key(serialized_private_key)
        
        # Store encrypted key data
        key_data = {
            'key_id': key_id,
            'election_id': election_id,
            'encrypted_private_key': encrypted_key,
            'created_at': datetime.now().isoformat()
        }
        
        # Store in separate secure table
        result = supabase.table('ElectionKeys').insert(key_data).execute()
        
        return key_id
        
    except Exception as e:
        raise Exception(f"Failed to store election keys: {str(e)}")

def serialize_private_key(private_key):
    """
    Serialize the Paillier private key into a JSON string.
    """
    return json.dumps({
        'p': str(private_key.p),
        'q': str(private_key.q)
    }).encode('utf-8')  # Convert to bytes for encryption

def retrieve_private_key(election_id, supabase):
    """
    Retrieve and decrypt a private key for an election.
    """
    try:
        # Get encrypted key data
        result = supabase.table('ElectionKeys')\
            .select('encrypted_private_key')\
            .eq('election_id', election_id)\
            .execute()
        
        if not result.data:
            raise Exception("No key found for this election")
            
        encrypted_key = result.data[0]['encrypted_private_key']
        
        # Initialize secure storage and decrypt
        key_storage = SecureKeyStorage()
        private_key = key_storage.decrypt_private_key(encrypted_key)
        
        return private_key
        
    except Exception as e:
        raise Exception(f"Failed to retrieve private key: {str(e)}")

class ElectionSystem:
    def __init__(self):
        self.public_key, self.private_key = None, None

    def generate_new_keypair(self):
        self.public_key, self.private_key = paillier.generate_paillier_keypair()
        return self.public_key, self.private_key

election_system = ElectionSystem()

def serialize_public_key(public_key):
    return json.dumps({
        'n': str(public_key.n),
        'g': str(public_key.g)
    })

def serialize_private_key(private_key):
    return json.dumps({
        'p': str(private_key.p),
        'q': str(private_key.q)
    })

@app.route('/api/admin/create', methods=['POST'])
def create_admin():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        # Generate a unique admin ID
        admin_id = str(uuid.uuid4())

        # Prepare the admin data for insertion
        admin_data = {
            'admin_id': admin_id,
            'username': username,
            'password': hashed_password,
            'created_at': datetime.now().isoformat()
        }

        # Insert admin data into Supabase Admin table
        result = supabase.table('Admin').insert(admin_data).execute()

        # Check if the insertion was successful
        if result.get('status_code', 200) == 200:
            return jsonify({'success': True, 'admin_id': admin_data['admin_id']})
        else:
            return jsonify({'error': 'Failed to create admin account'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    try:
        # Retrieve the admin data from the Supabase Admin table
        result = supabase.table('Admin').select('*').eq('username', username).execute()

        # Check if the admin exists
        if not result.data:
            return jsonify({'error': 'Admin not found'}), 404

        admin_data = result.data[0]

        # Check if the password matches
        if bcrypt.checkpw(password.encode('utf-8'), admin_data['password'].encode('utf-8')):
            return jsonify({'success': True, 'admin_id': admin_data['admin_id']})
        else:
            return jsonify({'error': 'Invalid password'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/election/create', methods=['POST'])
def create_election():
    data = request.json
    election_name = data.get('election_name')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    
    # Generate new keypair for this election
    public_key, private_key = election_system.generate_new_keypair()
    
    try:
        election_id = str(uuid.uuid4())

        election_data = {
            'election_id': election_id,
            'election_name': election_name,
            'public_key': serialize_public_key(public_key),
            'start_time': start_time,
            'end_time': end_time,
            'status': 'ongoing',
            'created_at': datetime.now().isoformat()
        }
        
         # Store the election data
        result = supabase.table('Election').insert(election_data).execute()
        
        # Store the private key securely
        key_id = store_election_keys(election_id, private_key, supabase)

        return jsonify({
            'success': True,
            'election_id': election_id,
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/voter/register', methods=['POST'])
def register_voter():
    data = request.json
    
    try:
        voter_data = {
            'voter_id': str(uuid.uuid4()),
            'name': data.get('name'),
            'email': data.get('email'),
            'gender': data.get('gender'),
            'public_key': data.get('public_key'),
            'created_at': datetime.now().isoformat()
        }
        
        result = supabase.table('Voter').insert(voter_data).execute()
        
        return jsonify({
            'success': True,
            'voter_id': voter_data['voter_id']
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/vote/cast', methods=['POST'])
def cast_vote():
    data = request.json
    election_id = data.get('election_id')
    encrypted_vote = data.get('encrypted_vote')
    random_value = data.get('random_value')  # For vote verification
    
    try:
        # Check if election is active
        election = supabase.table('Election')\
            .select('*')\
            .eq('election_id', election_id)\
            .execute()
        
        if not election.data:
            return jsonify({'error': 'Election not found'}), 404
        
        election = election.data[0]
        current_time = datetime.now()
        
        if current_time < datetime.fromisoformat(election['start_time']) or \
           current_time > datetime.fromisoformat(election['end_time']):
            return jsonify({'error': 'Election is not active'}), 400
        
        vote_data = {
            'vote_id': str(uuid.uuid4()),
            'election_id': election_id,
            'encrypted_vote': encrypted_vote,
            'random_value': random_value,
            'created_at': datetime.now().isoformat()
        }
        
        result = supabase.table('Votes').insert(vote_data).execute()
        
        return jsonify({
            'success': True,
            'vote_id': vote_data['vote_id']
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/election/<election_id>/results', methods=['GET'])
def get_election_results(election_id):
    try:
        # Get election details
        election = supabase.table('Election')\
            .select('*')\
            .eq('election_id', election_id)\
            .execute()
        
        if not election.data:
            return jsonify({'error': 'Election not found'}), 404
        
        election = election.data[0]
        
        # Check if election has ended
        if datetime.now() < datetime.fromisoformat(election['end_time']):
            return jsonify({'error': 'Election is still ongoing'}), 403
        
        # Get all votes for this election
        votes = supabase.table('Votes')\
            .select('*')\
            .eq('election_id', election_id)\
            .execute()
        
        # In a real implementation, you would:
        # 1. Load the private key securely
        # 2. Decrypt all votes
        # 3. Tally the results
        # 4. Return the final count
        
        # This is a placeholder response
        return jsonify({
            'success': True,
            'total_votes': len(votes.data),
            'results': {
                'candidate1': 0,
                'candidate2': 0,
                'candidate3': 0
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)