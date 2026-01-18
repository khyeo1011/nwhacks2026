from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import os
from dotenv import load_dotenv
from src.DBHelper import DBHelper

load_dotenv()

app = Flask(__name__)
CORS(app)

db_helper = DBHelper(
    url=os.getenv('SUPABASE_URL'),
    key=os.getenv('SUPABASE_KEY')
)

PROMPTS = [
    ("a red car", "not a red car"),
    ("a fluffy cat", "not a fluffy cat"),
    ("a snowy mountain", "not a snowy mountain")
]

@app.route('/api/quest-details/<int:quest_id>', methods=['GET'])
def get_quest_details(quest_id):
    # 1. Call DBHelper (Convert int to str because DBHelper expects str)
    quest_data = db_helper.get_quest_details(str(quest_id))
    
    # 2. Handle case where quest is not found
    if not quest_data:
        return jsonify({"error": "Quest not found"}), 404

    # 3. Map Participants from DB format to Frontend format
    #    DB: timetaken -> Frontend: time
    #    DB: userid    -> Frontend: userId
    #    DB: questid   -> Frontend: questId
    mapped_participants = []
    
    # We need to calculate the winner. 
    # Logic: Highest score wins. If tie, lowest time wins.
    winner_id = None
    best_score = -1
    best_time = float('inf')

    raw_participants = quest_data.get('participants', [])

    for p in raw_participants:
        # Create the participant object for frontend
        mapped_p = {
            'questId': p.get('questid'),
            'userId': p.get('userid'),
            'score': p.get('score'),
            'time': p.get('timetaken'), # Mapping timetaken -> time
            'photo': p.get('photo')
        }
        mapped_participants.append(mapped_p)

        # Logic to determine winner
        # Skip if score is None (participant hasn't finished)
        p_score = p.get('score')
        p_time = p.get('timetaken')
        
        if p_score is not None:
            # Check for higher score OR (equal score AND faster time)
            if p_score > best_score:
                best_score = p_score
                best_time = p_time
                winner_id = p.get('userid')
            elif p_score == best_score and p_time < best_time:
                best_time = p_time
                winner_id = p.get('userid')

    # 4. Construct final object matching QuestDetails interface
    response_data = {
        'questId': quest_data.get('questid'),
        'prompt': quest_data.get('prompt'),
        'hostId': quest_data.get('hostid'),
        'date': quest_data.get('datecreated'), # Mapping datecreated -> date
        'winner': winner_id,                   # Calculated field
        'participants': mapped_participants
    }
    
    return jsonify(response_data), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
