from datetime import datetime
import mysql.connector
from mysql.connector import Error
from db import db

class User:
    def __init__(self, username=None, password=None, role='employee', employee_id=None, id=None):
        self.id = id
        self.username = username
        self.password = password
        self.role = role
        self.employee_id = employee_id
        self.created_at = None
        self.updated_at = None
    
    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'role': self.role,
            'employee_id': self.employee_id,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S') if self.updated_at else None
        }
    
    @staticmethod
    def authenticate(username, password):
        """Authenticate user with username and password"""
        connection = db.get_connection()
        if not connection:
            return None
        
        cursor = None
        try:
            cursor = connection.cursor(dictionary=True)  # FIXED: Use dictionary cursor
            query = "SELECT * FROM users WHERE username = %s AND password = %s"
            cursor.execute(query, (username, password))
            row = cursor.fetchone()
            
            if row:
                user = User()
                user.id = row['id']
                user.username = row['username']
                user.password = row['password']
                user.role = row['role']
                user.employee_id = row['employee_id']  # This was the problem!
                user.created_at = row['created_at']
                user.updated_at = row['updated_at']
                return user
            return None
            
        except Error as e:
            print(f"Error authenticating user: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
    
    @staticmethod
    def create_employee_user(username, password, employee_id):
        """Create a user account for an employee"""
        connection = db.get_connection()
        if not connection:
            return False
        
        cursor = None
        try:
            cursor = connection.cursor()
            
            # Check if username already exists
            cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
            if cursor.fetchone():
                raise Exception("Username already exists")
            
            # Insert new user
            insert_query = """
            INSERT INTO users (username, password, role, employee_id)
            VALUES (%s, %s, 'employee', %s)
            """
            
            cursor.execute(insert_query, (username, password, employee_id))
            
            if not connection.autocommit:
                connection.commit()
            
            return True
            
        except Error as e:
            print(f"Error creating user: {e}")
            if connection and not connection.autocommit:
                connection.rollback()
            return False
        finally:
            if cursor:
                cursor.close()