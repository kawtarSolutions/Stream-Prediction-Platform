from flask import Blueprint, request, jsonify
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.student_model import (
    get_all_students,
    get_student_by_id,
    create_student,
    update_student,
    delete_student
)

student_bp = Blueprint('students', __name__)


# Route 1: Get all students
@student_bp.route('/students', methods=['GET'])
def get_students():
    students = get_all_students()
    if isinstance(students, dict) and 'error' in students:
        return jsonify(students), 500
    return jsonify(students), 200

# Route 2: Get one student by ID
@student_bp.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student = get_student_by_id(student_id)
    if student is None:
        return jsonify({'error': 'Student not found'}), 404
    if isinstance(student, dict) and 'error' in student:
        return jsonify(student), 500
    return jsonify(student), 200

# Route 3: Create a NEW student
@student_bp.route('/students', methods=['POST'])
def add_student():
    data = request.get_json()
    print(f"Received data: {data}")

    if not data:
        return jsonify({'error': 'Missing JSON data'}), 400

    print(f"Creating student with:")
    print(f"  first_name: {data.get('first_name')}")
    print(f"  last_name: {data.get('last_name')}")
    print(f"  email: {data.get('email')}")
    print(f"  code_apoge: {data.get('code_apoge')}")
    print(f"  avg_api: {data.get('avg_api')}")

    new_student = create_student(
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        code_apoge=data.get('code_apoge'),
        avg_api=data.get('avg_api')
    )

    print(f"Result: {new_student}")

    if new_student is None or 'error' in new_student:
        error_msg = new_student.get('error') if isinstance(new_student, dict) else 'Unknown error'
        print(f"Failed to create student: {error_msg}")
        return jsonify({'error': error_msg}), 400
    return jsonify(new_student), 201

# Route 4: Update student
@student_bp.route('/students/<int:student_id>', methods=['PUT'])
def edit_student(student_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Missing JSON data'}), 400

    updated_student = update_student(
        student_id,
        first_name=data.get('first_name'),
        last_name=data.get('last_name'),
        email=data.get('email'),
        code_apoge=data.get('code_apoge'),
        avg_api=data.get('avg_api')
    )
    if updated_student is None:
        return jsonify({'error': 'Student not found or update failed'}), 404
    if 'error' in updated_student:
        return jsonify(updated_student), 500
    return jsonify(updated_student), 200

# Route 5: Delete student
@student_bp.route('/students/<int:student_id>', methods=['DELETE'])
def remove_student(student_id):
    deleted_student = delete_student(student_id)
    if deleted_student is None:
        return jsonify({'error': 'Student not found'}), 404
    if 'error' in deleted_student:
        return jsonify(deleted_student), 500
    return jsonify(deleted_student), 200