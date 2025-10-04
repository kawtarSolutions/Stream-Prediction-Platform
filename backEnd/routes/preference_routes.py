from flask import Blueprint, request, jsonify

# Create a Blueprint for preference-related routes
preference_bp = Blueprint('preferences', __name__)


# Route 1: Save student preferences
@preference_bp.route('/preferences', methods=['POST'])
def add_preferences():
    """
    What this does:
    - URL: POST /api/preferences
    - React sends: {"student_id": 5, "choice1": "2AP", "choice2": "GI", ...}
    - Saves the student's stream choices to database
    """
    return jsonify({'message': 'Preferences saved'}), 201

# Route 2: Get preferences for a student
@preference_bp.route('/preferences/<int:student_id>', methods=['GET'])
def get_preferences(student_id):
    """
    What this does:
    - URL: GET /api/preferences/5
    - Returns what choices student #5 made
    - Example: {"choice1": "2AP", "choice2": "GC", ...}
    """
    return jsonify({'message': f'Get preferences for student {student_id}'}), 200


# Route 3: Get probability for a student
@preference_bp.route('/preferences/probability/<int:student_id>', methods=['GET'])
def get_probability(student_id):
    """
    What this does:
    - URL: GET /api/preferences/probability/5
    - Returns calculated probabilities
    - Example: {"2AP": 0.85, "GC": 0.45, "GI": 0.12}
    """
    return jsonify({'message': f'Get probability for student {student_id}'}), 200

# Route 4: Calculate/Recalculate probability
@preference_bp.route('/preferences/calculate/<int:student_id>', methods=['POST'])
def calculate_probability(student_id):
    """
    What this does:
    - URL: POST /api/preferences/calculate/5
    - Triggers the algorithm to calculate probabilities
    - Saves results to database
    """
    return jsonify({'message': f'Calculate probability for student {student_id}'}), 200