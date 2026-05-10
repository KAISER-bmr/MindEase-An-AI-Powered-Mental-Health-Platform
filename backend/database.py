import mysql.connector
from mysql.connector import pooling
from config import settings

# Create connection pool
db_config = {
    "host": settings.DB_HOST,
    "port": settings.DB_PORT,
    "database": settings.DB_NAME,
    "user": settings.DB_USER,
    "password": settings.DB_PASSWORD,
    "autocommit": False,
}

connection_pool = pooling.MySQLConnectionPool(
    pool_name="mindease_pool",
    pool_size=5,
    **db_config
)

def get_db():
    """Get a database connection from the pool."""
    conn = connection_pool.get_connection()
    try:
        yield conn
    finally:
        conn.close()

def execute_query(conn, query: str, params=None, fetch=False):
    """Execute a query and optionally fetch results."""
    cursor = conn.cursor(dictionary=True)
    cursor.execute(query, params or ())
    if fetch:
        result = cursor.fetchall()
        cursor.close()
        return result
    conn.commit()
    last_id = cursor.lastrowid
    cursor.close()
    return last_id
