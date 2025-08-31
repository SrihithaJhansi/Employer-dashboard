import mysql.connector
import os
from mysql.connector import Error

class Database:
    def __init__(self):
        self.host = os.getenv('DB_HOST', 'localhost')
        self.database = os.getenv('DB_NAME', 'employer_dashboard')
        self.user = os.getenv('DB_USER', 'root')
        self.password = os.getenv('DB_PASSWORD', 'yourpassword')
        self.port = os.getenv('DB_PORT', 3306)
        
    def get_connection(self):
        """Get database connection with proper configuration"""
        try:
            connection = mysql.connector.connect(
                host=self.host,
                database=self.database,
                user=self.user,
                password=self.password,
                port=self.port,
                autocommit=True,
                charset='utf8mb4',
                use_unicode=True
            )
            
            if connection.is_connected():
                print(f"Successfully connected to MySQL database: {self.database}")
                print(f"Server version: {connection.get_server_info()}")
                return connection
                
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            return None
    
    def initialize_database(self):
        """Initialize database tables (call this once at app startup)"""
        print("Initializing database tables...")
        connection = self.get_connection()
        if connection:
            self.create_tables(connection)
            connection.close()
            print("Database initialization completed")
        else:
            print("Failed to initialize database: No connection")
    
    def create_tables(self, connection):
        """Create employees and users tables if they don't exist"""
        try:
            cursor = connection.cursor()
            
            # Create employees table if it doesn't exist
            create_employees_table = """
            CREATE TABLE IF NOT EXISTS employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                position VARCHAR(100) NOT NULL,
                department VARCHAR(100) NOT NULL,
                salary DECIMAL(10,2) NOT NULL,
                hire_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            """
            
            cursor.execute(create_employees_table)
            print("Employees table checked/created successfully")
            
            # Create users table if it doesn't exist
            create_users_table = """
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'employee') DEFAULT 'employee',
                employee_id INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
            )
            """
            
            cursor.execute(create_users_table)
            print("Users table checked/created successfully")
            
            # Create default admin user if not exists
            cursor.execute("SELECT COUNT(*) FROM users WHERE username = 'admin'")
            admin_count = cursor.fetchone()[0]
            
            if admin_count == 0:
                cursor.execute("""
                    INSERT INTO users (username, password, role) 
                    VALUES ('admin', 'admin123', 'admin')
                """)
                print("Default admin user created (username: admin, password: admin123)")
            else:
                print("Admin user already exists")
            
            # Count current employees
            cursor.execute("SELECT COUNT(*) FROM employees")
            count = cursor.fetchone()[0]
            print(f"Total employees in database: {count}")
            
            cursor.close()
            
        except Error as e:
            print(f"Error checking/creating tables: {e}")

# Global database instance
db = Database()