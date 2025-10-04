from database.db_config import get_db_connection, close_db_connection

conn = get_db_connection()

cur = conn.cursor()

def create_preferences(student_id, preferences_list):
    # TODO: Teammate to implement
    try:
        cur.execute("SELECT * FROM students")
        tables = cur.fetchall()
        print(tables)
    except Exception as e:
        print(f"e")
    pass

def get_student_preferences(student_id):
    # TODO: Teammate to implement
    pass

def get_probability(student_id):
    #TODO: Teammate to implement - get student probability
    pass

def calculate_probability(student_id):
    # TODO: Teammate to implement - calculate probability and update database
    pass

def update_preference():
     # TODO: Teammate to implement - update preference
    pass