from database.db_config import get_db_connection, close_db_connection
import random

def _insert_preferences(cur, student_id, preferences_list):
    #get the student and loop through his/her preferences while adding their indexes too
    print(f"Inserting {len(preferences_list)} preferences for student {student_id}")
    for index, stream_name in enumerate(preferences_list, start=1):
        print(f"  [{index}] Looking up stream: '{stream_name}'")
        cur.execute("SELECT stream_id FROM streams WHERE stream_name = %s", (stream_name,))
        row = cur.fetchone()
        if not row:
            print(f"  ❌ ERROR: Stream '{stream_name}' not found in database!")
            # Show available streams
            cur.execute("SELECT stream_name FROM streams")
            available = [r['stream_name'] for r in cur.fetchall()]
            print(f"  Available streams in database: {available}")
            raise ValueError(f"Stream '{stream_name}' not found in database. Available streams: {available}")
        stream_id = row['stream_id']
        print(f"  ✅ Found stream_id: {stream_id}")

        cur.execute(
            "INSERT INTO student_preferences (student_id, stream_id, preference_rank) VALUES (%s, %s, %s)",
            (student_id, stream_id, index)
        )
        print(f"  ✅ Inserted preference rank {index}")

def create_preferences(student_id, preferences_list):
    print(f"\n=== CREATE_PREFERENCES MODEL ===")
    print(f"Student ID: {student_id}")
    print(f"Preferences list: {preferences_list}")

    if (student_id is None) or not preferences_list:
        raise ValueError("Student ID or/and preferences list cannot be empty")

    conn = None

    try:
        print(f"Getting database connection...")
        conn = get_db_connection()
        print(f"✅ Database connected")

        with conn.cursor() as cur:
            print(f"Checking if preferences already exist for student {student_id}...")
            cur.execute(
                "SELECT COUNT(*) FROM student_preferences WHERE student_id = %s", (student_id,))
            count = cur.fetchone()['count']
            print(f"Existing preferences count: {count}")

            if count > 0:
                print(f"❌ ERROR: Preferences already exist for student {student_id}")
                raise ValueError("Preferences already exist. Use update instead.")

            print(f"✅ No existing preferences, proceeding to insert...")
            _insert_preferences(cur, student_id, preferences_list)
            print(f"✅ All preferences inserted successfully")

        print(f"Committing transaction...")
        conn.commit()
        print(f"✅✅✅ COMMIT SUCCESSFUL! The preferences list for student {student_id} was saved to database")

    except Exception as e:
        print(f"\n❌❌❌ EXCEPTION CAUGHT in create_preferences!")
        print(f"Error: {e}")
        print(f"Error type: {type(e)}")
        if conn:
            print(f"Rolling back transaction...")
            conn.rollback()
            print(f"✅ Rollback complete")
        print(f"Re-raising error...")
        raise # propagate error

    finally:   #This bloc executes no matter what, and it disconnects from the DB(even if an Exception error was raised)
        if conn:  #if there is a connection
            close_db_connection(conn)   #close it (for safety reasons)


#-----------------------------------------------------------------------------------------------------------------------------------------------------------
def get_student_preferences(student_id):     #I think the preference list is gonna be made here
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute('''
                SELECT sp.preference_rank, s.stream_name
                FROM student_preferences sp
                JOIN streams s ON sp.stream_id = s.stream_id
                WHERE sp.student_id = %s
                ORDER BY sp.preference_rank
            ''', (student_id,))
            preferences = cur.fetchall()
            
            formatted_preferences = [f"{row['preference_rank']}. {row['stream_name']}" for row in preferences]
            return formatted_preferences
        
    except Exception as e:
        print(f"Error while getting student preferences: {e}")
        raise

    finally:
        if conn:
            close_db_connection(conn)


#-----------------------------------------------------------------------------------------------------------------------------------------------------------
def update_preference(student_id, preferences_list):
    """Update existing student preferences"""
    if (student_id is None) or not preferences_list:
        raise ValueError("Student ID or/and preferences list cannot be empty")

    conn = None
    try:
        conn = get_db_connection()

        with conn.cursor() as cur:
            # Delete existing preferences
            cur.execute("DELETE FROM student_preferences WHERE student_id = %s", (student_id,))

            # Insert new preferences
            _insert_preferences(cur, student_id, preferences_list)

        conn.commit()
        print(f"The preferences list for student {student_id} was successfully updated")

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Failed to update preferences: {e}")
        raise

    finally:
        if conn:
            close_db_connection(conn)


#-----------------------------------------------------------------------------------------------------------------------------------------------------------
def calculate_probability(student_id):
    """
    Calculate admission probability for student's first choice stream
    Based on:
    - Student's average grade (avg_api)
    - Average of all applicants for that stream
    - Stream capacity
    - Total number of applicants
    """
    conn = None
    try:
        conn = get_db_connection()

        with conn.cursor() as cur:
            # Get student's average and first choice stream
            cur.execute('''
                SELECT s.avg_api, sp.stream_id
                FROM students s
                JOIN student_preferences sp ON s.student_id = sp.student_id
                WHERE s.student_id = %s AND sp.preference_rank = 1
            ''', (student_id,))

            result = cur.fetchone()
            if not result:
                raise ValueError(f"Student {student_id} not found or has no preferences")

            student_avg = float(result['avg_api'])
            stream_id = result['stream_id']

            # Get stream capacity
            cur.execute('SELECT total_capacity FROM streams WHERE stream_id = %s', (stream_id,))
            capacity_row = cur.fetchone()
            if not capacity_row:
                raise ValueError(f"Stream {stream_id} not found")

            stream_capacity = capacity_row['total_capacity']

            # Get all applicants for this stream with their averages
            cur.execute('''
                SELECT s.avg_api
                FROM student_preferences sp
                JOIN students s ON sp.student_id = s.student_id
                WHERE sp.stream_id = %s
                ORDER BY s.avg_api DESC
            ''', (stream_id,))

            applicants = cur.fetchall()
            total_applicants = len(applicants)

            if total_applicants == 0:
                probability = 100.0  # Only applicant
            else:
                # Calculate average of all applicants
                all_averages = [float(row['avg_api']) for row in applicants]
                stream_avg = sum(all_averages) / len(all_averages)

                # Calculate student's rank (how many students have higher average)
                rank = sum(1 for avg in all_averages if avg > student_avg) + 1

                # Base probability based on capacity vs applicants
                if total_applicants <= stream_capacity:
                    base_probability = 95.0  # High chance if capacity isn't full
                else:
                    base_probability = (stream_capacity / total_applicants) * 100

                # Adjust based on student's performance relative to stream average
                performance_factor = (student_avg / stream_avg) if stream_avg > 0 else 1.0

                # Adjust based on rank
                rank_factor = 1 - ((rank - 1) / total_applicants) if total_applicants > 0 else 1.0

                # Final probability calculation
                probability = base_probability * (0.5 * performance_factor + 0.5 * rank_factor)

                # Ensure probability is between 0 and 100
                probability = max(0, min(100, probability))

            # Store probability in database
            cur.execute('''
                UPDATE student_preferences
                SET probability_first_choice = %s
                WHERE student_id = %s AND preference_rank = 1
            ''', (probability, student_id))

        conn.commit()
        print(f"Probability calculated for student {student_id}: {probability:.2f}%")
        return probability

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error calculating probability: {e}")
        raise

    finally:
        if conn:
            close_db_connection(conn)


#-----------------------------------------------------------------------------------------------------------------------------------------------------------
def get_probability(student_id):
    """Get the stored probability for a student's first choice"""
    conn = None
    try:
        conn = get_db_connection()

        with conn.cursor() as cur:
            cur.execute('''
                SELECT probability_first_choice
                FROM student_preferences
                WHERE student_id = %s AND preference_rank = 1
            ''', (student_id,))

            result = cur.fetchone()
            if not result:
                raise ValueError(f"No preferences found for student {student_id}")

            probability = result['probability_first_choice']

            # If probability hasn't been calculated yet, calculate it now
            if probability is None:
                probability = calculate_probability(student_id)

            return float(probability)

    except Exception as e:
        print(f"Error getting probability: {e}")
        raise

    finally:
        if conn:
            close_db_connection(conn)


