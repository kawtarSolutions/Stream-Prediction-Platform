from flask import Blueprint, request, jsonify
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.preference_model import (create_preferences, get_student_preferences, get_probability, calculate_probability, update_preference)

# Create a Blueprint for preference-related routes
preference_bp = Blueprint('preferences', __name__)


# Route 1: Save student preferences
@preference_bp.route('/preferences', methods=['POST'])
def add_preferences_route():
    data = request.get_json()
    print(f"=== PREFERENCES ROUTE ===")
    print(f"Received data: {data}")

    student_id = data.get('student_id')
    preferences_list = data.get('preferences_list')

    print(f"Student ID: {student_id}")
    print(f"Preferences list: {preferences_list}")

    if not student_id or not preferences_list:
        print("ERROR: Missing student_id or preferences_list")
        return jsonify({'error': 'Missing student_id or preferences_list'}), 400

    try:
        print(f"Calling create_preferences...")
        create_preferences(student_id, preferences_list)
        print(f"✅ Preferences created successfully!")
        return jsonify({'message': 'Preferences saved successfully'}), 201
    except Exception as e:
        print(f"❌ ERROR creating preferences: {e}")
        print(f"Error type: {type(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Route 2: Get preferences for a student
@preference_bp.route('/preferences/<int:student_id>', methods=['GET'])
def get_preferences_route(student_id):
    try:
        preferences = get_student_preferences(student_id)
        return jsonify({'preferences': preferences}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route 3: Get probability for a student
@preference_bp.route('/preferences/probability/<int:student_id>', methods=['GET'])
def get_probability_route(student_id):
    try:
        result = get_probability(student_id)
        return jsonify({'result': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
# Route 4: Calculate/Recalculate probability
@preference_bp.route('/preferences/calculate/<int:student_id>', methods=['POST'])
def calculate_probability_route(student_id):
    try:
        result = calculate_probability(student_id)
        return jsonify({'message': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

#Route 5: update preferences list
@preference_bp.route('/preferences/<int:student_id>', methods=['PUT'])
def update_preferences_route(student_id):
    data = request.get_json()   #No need to add preferences_list as a parameter, cause the json body has it
    preferences_list = data.get('preferences_list')
    
    if not preferences_list:
        return jsonify({'error': 'Missing preferences_list'}), 400
    
    try:
        update_preference(student_id, preferences_list)
        return jsonify({'message': 'Preferences updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500