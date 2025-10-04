import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from database.db_config import get_db_connection, close_db_connection


conn = get_db_connection()

cur = conn.cursor()

def get_all_students():
    try:
        cur.execute("SELECT name FROM students")
        tables = cur.fetchall()
        print(tables)
    except Exception as e:
        print(f"e")

get_all_students()

def get_student_by_id(student_id):
    # TODO: Teammate to implement
    pass

def create_student(name, email, registration_number, gpa):
    # TODO: Teammate to implement
    pass

def update_student():
    # TODO: Teammate to implement
    pass

def delete_student():
    # TODO: Teammate to implement
    pass