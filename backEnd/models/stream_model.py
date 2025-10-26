import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from database.db_config import get_db_connection, close_db_connection


def get_all_streams():
    """Get all streams from the database"""
    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT stream_id, stream_name, stream_code, total_capacity FROM streams ORDER BY stream_name")
        rows = cur.fetchall()

        return [
            {
                "stream_id": r['stream_id'],
                "stream_name": r['stream_name'],
                "stream_code": r['stream_code'],
                "total_capacity": r['total_capacity']
            }
            for r in rows
        ]

    except Exception as e:
        print(f"Error in get_all_streams: {e}")
        return {"error": str(e)}

    finally:
        if cur:
            cur.close()
        if conn:
            close_db_connection(conn)


def get_stream_by_id(stream_id):
    """Get a specific stream by ID"""
    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "SELECT stream_id, stream_name, stream_code, total_capacity FROM streams WHERE stream_id = %s",
            (stream_id,)
        )
        row = cur.fetchone()

        if row:
            return {
                "stream_id": row['stream_id'],
                "stream_name": row['stream_name'],
                "stream_code": row['stream_code'],
                "total_capacity": row['total_capacity']
            }
        return None

    except Exception as e:
        print(f"Error in get_stream_by_id: {e}")
        return {"error": str(e)}

    finally:
        if cur:
            cur.close()
        if conn:
            close_db_connection(conn)


def stream_capacity_by_id(stream_id):
    """
    Get capacity information for a specific stream
    Returns: capacity, current applicants, available slots
    """
    conn = None
    cur = None

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Get stream info
        cur.execute(
            "SELECT stream_name, stream_code, total_capacity FROM streams WHERE stream_id = %s",
            (stream_id,)
        )
        stream_row = cur.fetchone()

        if not stream_row:
            return None

        # Get count of applicants for this stream
        cur.execute(
            "SELECT COUNT(DISTINCT student_id) as applicant_count FROM student_preferences WHERE stream_id = %s",
            (stream_id,)
        )
        applicant_row = cur.fetchone()

        total_capacity = stream_row['total_capacity']
        current_applicants = applicant_row['applicant_count'] if applicant_row else 0
        available_slots = max(0, total_capacity - current_applicants)

        return {
            "stream_id": stream_id,
            "stream_name": stream_row['stream_name'],
            "stream_code": stream_row['stream_code'],
            "total_capacity": total_capacity,
            "current_applicants": current_applicants,
            "available_slots": available_slots,
            "capacity_percentage": round((current_applicants / total_capacity * 100), 2) if total_capacity > 0 else 0
        }

    except Exception as e:
        print(f"Error in stream_capacity_by_id: {e}")
        return {"error": str(e)}

    finally:
        if cur:
            cur.close()
        if conn:
            close_db_connection(conn)
