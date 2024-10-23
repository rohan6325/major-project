# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from phe import paillier
from datetime import datetime
import os
from supabase import create_client, Client
import uuid
import json
import bcrypt
from dotenv import load_dotenv, dotenv_values

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

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

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Generate keypair for the admin
    public_key, private_key = election_system.generate_new_keypair()
    
    # Save private key to a secure location
    key_directory = "keys"
    
    # Ensure the 'keys' directory exists
    if not os.path.exists(key_directory):
        os.makedirs(key_directory)  # Create the directory if it doesn't exist
    
    # Save private key to a secure location
    private_key_location = os.path.join(key_directory, f"admin_{uuid.uuid4()}.key")
    
    try:
        admin_data = {
            'admin_id': str(uuid.uuid4()),
            'username': username,
            'password': hashed_password,  # Hash this in production
            'private_key_location': private_key_location,
            'created_at': datetime.now().isoformat()
        }
        
        result = supabase.table('Admin').insert(admin_data).execute()
        
        # In production, store private_key securely
        with open(private_key_location, 'w') as f:
            f.write(serialize_private_key(private_key))
        
        return jsonify({'success': True, 'admin_id': admin_data['admin_id']})
    
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
        election_data = {
            'election_id': str(uuid.uuid4()),
            'election_name': election_name,
            'public_key': serialize_public_key(public_key),
            'start_time': start_time,
            'end_time': end_time,
            'status': 'created',
            'created_at': datetime.now().isoformat()
        }
        
        result = supabase.table('Election').insert(election_data).execute()
        
        return jsonify({
            'success': True,
            'election_id': election_data['election_id']
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