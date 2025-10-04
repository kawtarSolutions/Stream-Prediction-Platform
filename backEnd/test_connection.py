from database.db_config import get_db_connection, close_db_connection

try:
    conn = get_db_connection()
    print("Database connection successful")

    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    tables = cur.fetchall()

    print("\nTables in your database:")
    for table in tables:
        print(f"  - {table['table_name']}")

    cur.close()
    close_db_connection(conn)

except Exception as e:
    print(f"connection failed: {e}")