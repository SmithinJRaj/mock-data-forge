import sqlite3

conn = sqlite3.connect('test.db')
cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        full_name TEXT,
        email_address TEXT
    )
''')

conn.commit()
conn.close()
print("✅ SQLite database 'test.db' and table 'users'created.")