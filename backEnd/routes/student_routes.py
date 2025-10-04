from flask import Blueprint, request, jsonify


#Create a blueprint(group of related routes)
student_bp = Blueprint('students', __name__)


#Route 1: get all students
@student_bp.route('/students', methods=['GET'])
def get_students():
    #fetch response from models student_model

    return jsonify({'message': 'Get all students'}), 200


# Route 2: Get one student by ID
@student_bp.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    # student_id is automatically extracted from the URL

    return jsonify({'message': f'Get student {student_id}'}), 200


# Route 3: Create a NEW student
@student_bp.route('/students', methods=['POST'])
def add_student():
    # data = request.get_json()  ← Get the data React sent
    # Then insert it into the database using the model functions
    
    return jsonify({'message': 'Create student'}), 201


#update and delete student