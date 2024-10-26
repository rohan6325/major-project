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

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

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
            return jsonify({'success': True}), 201
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

        # # Check if the admin exists
        # if not result.data:
        #     return jsonify({'error': 'Admin not found'}), 404

        admin_data = result.data[0]

        # Check if the password matches
        if bcrypt.checkpw(password.encode('utf-8'), admin_data['password'].encode('utf-8')):
            return jsonify({'success': True})
        else:
            return jsonify({'error': 'Invalid password'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/election/<uuid:election_id>', methods=['GET'])
def get_election(election_id):
    # Fetch election details from Supabase
    try:
        # Query the election table for the given election_id
        response = supabase.table('Election').select('*').eq('election_id', election_id).execute()
        
        # Check if any rows were returned
        if response.data:
            # Return the first (and presumably only) election record
            return jsonify(response.data[0]), 200
        else:
            return jsonify({'error': 'Election not found'}), 404
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
    election_id = data.get("election_id")
    
    # Validate that the election_id is provided and is a valid UUID
    if not election_id:
        return jsonify({'error': 'Election ID is required'}), 400

    try:
        # Validate that election_id is a valid UUID
        election_id = uuid.UUID(election_id)
        
        # Step 1: Retrieve the public key from the Election table using election_id
        election_result = supabase.table('Election').select('public_key').eq('election_id', str(election_id)).single().execute()
        
        election_data = election_result.data
        
        if election_data is None:
            return jsonify({'error': 'Election not found'}), 404
        
        election_public_key = election_data['public_key']

        # Step 2: Check if the voter already exists based on email
        existing_voter_result = supabase.table('Voter').select('voter_id', 'public_key').eq('email', data.get('email')).single().execute()
        existing_voter_data = existing_voter_result.data

        if existing_voter_data:
            # If voter exists, update the public_key
            update_result = supabase.table('Voter').update({'public_key': election_public_key}).eq('voter_id', existing_voter_data['voter_id']).execute()
            return jsonify({
                'success': True,
                'message': 'Voter public key updated',
                'voter_id': existing_voter_data['voter_id']
            })
        else:
            # If voter does not exist, create a new entry
            voter_data = {
                'voter_id': str(uuid.uuid4()),
                'name': data.get('name'),
                'email': data.get('email'),
                'gender': data.get('gender'),
                'public_key': election_public_key,
                'created_at': datetime.now().isoformat()
            }

            # Insert the voter data into the Voter table
            result = supabase.table('Voter').insert(voter_data).execute()

            return jsonify({
                'success': True,
                'message': 'Voter registered successfully',
                'voter_id': voter_data['voter_id']
            })
    
    except ValueError:
        return jsonify({'error': 'Invalid election_id format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/voter', methods=['POST'])
def get_voter_id():
    # Get the JSON data from the request
    if request.method == 'OPTIONS':
        # Send the correct CORS headers for preflight requests
        return jsonify({'status': 'OK'}), 200
    else:
        data = request.json
        email = data.get('email')

        # Check if email is provided
        if not email:
            return jsonify({'error': 'Email is required'}), 400

        # Fetch the voter ID from the database
        response = supabase.table('Voter').select('voter_id').eq('email', email).execute()

        if (response.data):
            voter = response.data[0]      
        # Check if the voter exists
        if voter:
            return jsonify({'voter_id': voter['voter_id']}), 200  # Adjust according to your DB schema
        else:
            return jsonify({'error': 'Voter not found'}), 404

# @app.route('/api/voter/<voter_id>', methods=['GET'])
# def get_voter(voter_id):
    
@app.route('/api/election/candidates/<voter_id>', methods=['GET'])
def get_election_candidates(voter_id):
    try:
        # Query the Voter table for the voter_id
        voter_result = supabase.table('Voter').select('*').eq('voter_id', voter_id).execute()
        voter_data = voter_result.data
        
        if not voter_data:
            return jsonify({'error': 'Voter not found'}), 404

        voter_public_key = voter_data[0].get('public_key')

        # Query the Election table to find the election_id, start_time, and end_time using the voter's public key
        election_result = supabase.table('Election').select('election_id', 'start_time', 'end_time').eq('public_key', voter_public_key).execute()
        election_data = election_result.data

        if not election_data:
            return jsonify({'error': 'Election not found'}), 404
        
        election_info = election_data[0]
        election_id = election_info.get('election_id')
        start_time = election_info.get('start_time')
        end_time = election_info.get('end_time')

        # Query the Candidate table to find all candidates for the election_id
        candidates_result = supabase.table('Candidate').select('*').eq('election_id', election_id).execute()
        candidates = candidates_result.data

        if not candidates:
            return jsonify({'error': 'No candidates found for this election'}), 404
        print("time",start_time, end_time)
        # Return candidates along with election start and end times
        return jsonify({
            'success': True,
            'candidates': candidates,
            'start_time': start_time,
            'end_time': end_time
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/voters/', methods=['POST'])
def get_voters():
    data = request.json
    election_id = data.get('election_id')
    # election_id = request.args.get('election_id')

    # Validate that the election_id is provided
    if not election_id:
        return jsonify({'error': 'Election ID is required'}), 400

    try:
        # Validate that election_id is a valid UUID
        election_id = uuid.UUID(election_id)

        # Step 1: Retrieve the public key from the Election table using election_id
        election_result = supabase.table('Election').select('public_key').eq('election_id', str(election_id)).single().execute()
        
        # Access the 'data' attribute instead of using subscripting
        election_data = election_result.data
        
        if election_data is None:
            return jsonify({'error': 'Election not found'}), 404
        
        election_public_key = election_data['public_key']

        # Step 2: Query the Voter table to find voters whose public key matches the election's public key
        voters_result = supabase.table('Voter').select('*').eq('public_key', election_public_key).execute()

        # Access the voters data
        voters = voters_result.data

        # Step 3: Return the filtered list of voters
        return jsonify({
            'success': True,
            'voters': voters
        })
    
    except ValueError:
        return jsonify({'error': 'Invalid election_id format'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/candidate/create', methods=['POST'])
def create_candidate():
    data = request.json  # Get the JSON data from the request
    election_id = data.get('election_id')
    party_name = data.get('party_name')
    name = data.get('candidate_name')
    # avatar_url = data.get['avatar_url']

    try:
        # Insert candidate into the Supabase candidates table
        response = supabase.table('Candidate').insert({
            'candidate_id': str(uuid.uuid4()),
            'election_id': election_id,
            'party_name': party_name,
            'name': name,
            # 'avatar_url': avatar_url,
        }).execute()

        # Check for errors
        if not response.data:
            return jsonify({'error':"something bad happended"}), 400

        return jsonify({'message': 'Candidate created successfully', 'candidate': response.data}), 201
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/candidates/<election_id>', methods=['GET'])
def get_candidates(election_id):
    try:
        # Query the candidates for the specified election ID
        response = supabase.table('Candidate').select('*').eq('election_id', election_id).execute()
        
        # Return the list of candidates
        return jsonify({'candidates': response.data}), 200
    
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