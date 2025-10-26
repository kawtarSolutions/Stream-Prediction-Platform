import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from database.db_config import get_db_connection, close_db_connection

def get_all_students():
    """Récupère tous les étudiants"""
    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT first_name, last_name, email, code_apoge, avg_api, student_id FROM students")
        rows = cur.fetchall()

        return [
            {
                "first_name": r['first_name'],
                "last_name": r['last_name'],
                "email": r['email'],
                "code_apoge": r['code_apoge'],
                "avg_api": float(r['avg_api']) if r['avg_api'] else None,
                "student_id": r['student_id']
            }
            for r in rows
        ]

    except Exception as e:
        print(f"Error in get_all_students: {e}")
        return {"error": str(e)}

    finally:
        if cur:
            cur.close()
        if conn:
            close_db_connection(conn)

def get_student_by_id(student_id):
    """Récupère un étudiant par son ID"""
    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "SELECT first_name, last_name, email, code_apoge, avg_api, student_id FROM students WHERE student_id = %s",
            (student_id,)
        )
        row = cur.fetchone()

        if row:
            return {
                "first_name": row['first_name'],
                "last_name": row['last_name'],
                "email": row['email'],
                "code_apoge": row['code_apoge'],
                "avg_api": float(row['avg_api']) if row['avg_api'] else None,
                "student_id": row['student_id']
            }
        return None

    except Exception as e:
        print(f"Error in get_student_by_id: {e}")
        return {"error": str(e)}

    finally:
        if cur:
            cur.close()
        if conn:
            close_db_connection(conn)


def create_student(first_name, last_name, email, code_apoge, avg_api):
    """Crée un nouvel étudiant"""
    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "INSERT INTO students (first_name, last_name, email, code_apoge, avg_api) VALUES (%s, %s, %s, %s, %s) RETURNING first_name, last_name, email, code_apoge, avg_api, student_id",
            (first_name, last_name, email, code_apoge, avg_api)
        )
        row = cur.fetchone()
        conn.commit()

        if row:
            return {
                "first_name": row['first_name'],
                "last_name": row['last_name'],
                "email": row['email'],
                "code_apoge": row['code_apoge'],
                "avg_api": float(row['avg_api']) if row['avg_api'] else None,
                "student_id": row['student_id']
            }
        return None

    except Exception as e:
        print(f"Error in create_student: {e}")
        print(f"Error type: {type(e)}")
        print(f"Error details: {repr(e)}")
        import traceback
        traceback.print_exc()
        if conn:
            conn.rollback()
        return {"error": str(e)}

    finally:
        if cur:
            cur.close()
        if conn:
            close_db_connection(conn)


def update_student(student_id, first_name=None, last_name=None, email=None, code_apoge=None, avg_api=None):
    """Met à jour un étudiant"""
    conn = None
    cur = None

    try:
        # Validation: au moins un champ à modifier
        updates = []
        params = []

        if first_name:
            updates.append("first_name = %s")
            params.append(first_name)
        if last_name:
            updates.append("last_name = %s")
            params.append(last_name)
        if email:
            updates.append("email = %s")
            params.append(email)
        if code_apoge:
            updates.append("code_apoge = %s")
            params.append(code_apoge)
        if avg_api is not None:
            updates.append("avg_api = %s")
            params.append(avg_api)

        if not updates:
            return {"error": "Aucune modification à effectuer"}

        conn = get_db_connection()
        cur = conn.cursor()

        params.append(student_id)
        query = f"UPDATE students SET {', '.join(updates)} WHERE student_id = %s RETURNING first_name, last_name, email, code_apoge, avg_api, student_id"

        cur.execute(query, params)
        row = cur.fetchone()
        conn.commit()

        if row:
            return {
                "first_name": row['first_name'],
                "last_name": row['last_name'],
                "email": row['email'],
                "code_apoge": row['code_apoge'],
                "avg_api": float(row['avg_api']) if row['avg_api'] else None,
                "student_id": row['student_id']
            }
        return None

    except Exception as e:
        print(f"Error in update_student: {e}")
        if conn:
            conn.rollback()
        return {"error": str(e)}

    finally:
        if cur:
            cur.close()
        if conn:
            close_db_connection(conn)


def delete_student(student_id):
    """Supprime un étudiant"""
    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "DELETE FROM students WHERE student_id = %s RETURNING first_name, last_name, email, code_apoge, avg_api, student_id",
            (student_id,)
        )
        row = cur.fetchone()
        conn.commit()

        if row:
            return {
                "first_name": row['first_name'],
                "last_name": row['last_name'],
                "email": row['email'],
                "code_apoge": row['code_apoge'],
                "avg_api": float(row['avg_api']) if row['avg_api'] else None,
                "student_id": row['student_id']
            }
        return None

    except Exception as e:
        print(f"Error in delete_student: {e}")
        if conn:
            conn.rollback()
        return {"error": str(e)}

    finally:
        if cur:
            cur.close()
        if conn:
            close_db_connection(conn)
