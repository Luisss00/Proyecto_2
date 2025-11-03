import psycopg2

try:
    conn = psycopg2.connect(
        dbname="fashion_store",
        user="fashion_user",
        password="fashion_pass_2024",
        host="localhost",
        port="5432"
    )
    print("✅ Conexión exitosa a PostgreSQL!")
    
    cur = conn.cursor()
    cur.execute("SELECT version();")
    version = cur.fetchone()
    print(f"✅ Versión PostgreSQL: {version[0]}")
    
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")