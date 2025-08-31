from datetime import datetime
from db import db
import mysql.connector
from mysql.connector import Error

class Employee:
    def __init__(self, name=None, email=None, position=None, department=None, salary=None, hire_date=None, id=None,
                 created_at=None, updated_at=None):
        self.id = id
        self.name = name
        self.email = email
        self.position = position
        self.department = department
        self.salary = salary
        self.hire_date = hire_date
        self.created_at = created_at
        self.updated_at = updated_at
    
    def to_dict(self):
        """Convert employee object to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'position': self.position,
            'department': self.department,
            'salary': float(self.salary) if self.salary else None,
            'hire_date': self.hire_date.strftime('%Y-%m-%d') if isinstance(self.hire_date, datetime) else self.hire_date,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None,
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S') if self.updated_at else None
        }
    
    def save(self, connection=None):
        if not connection:
            connection = db.get_connection()
        if not connection:
            raise Exception("No database connection available")
        
        cursor = None
        try:
            cursor = connection.cursor()

            if not all([self.name, self.email, self.position, self.department, self.salary, self.hire_date]):
                raise ValueError("All fields are required")
            
            if self.id:  # update
                update_query = """
                    UPDATE employees
                    SET name=%s, email=%s, position=%s, department=%s, salary=%s, hire_date=%s
                    WHERE id=%s
                """
                cursor.execute(update_query, (self.name, self.email, self.position,
                                              self.department, self.salary, self.hire_date, self.id))
            else:  # insert new
                insert_query = """
                    INSERT INTO employees (name, email, position, department, salary, hire_date)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_query, (self.name, self.email, self.position,
                                              self.department, self.salary, self.hire_date))
                self.id = cursor.lastrowid

            connection.commit()
            return True

        except mysql.connector.IntegrityError:
            if connection:
                connection.rollback()
            raise Exception(f"Email already exists: {self.email}")
        except mysql.connector.Error as e:
            if connection:
                connection.rollback()
            raise Exception(f"MySQL error: {str(e)}")
        finally:
            if cursor:
                cursor.close()
    
    @staticmethod
    def get_by_id(employee_id):
        connection = db.get_connection()
        if not connection:
            return None
        
        cursor = None
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM employees WHERE id = %s", (employee_id,))
            row = cursor.fetchone()
            
            if row:
                # Create Employee object with explicit field mapping
                employee = Employee(
                    id=row['id'],
                    name=row['name'],
                    email=row['email'],
                    position=row['position'],
                    department=row['department'],
                    salary=row['salary'],
                    hire_date=row['hire_date'],
                    created_at=row['created_at'],
                    updated_at=row['updated_at']
                )
                return employee
            return None
        except Error as e:
            print(f"Error fetching employee: {e}")
            return None
        finally:
            if cursor:
                cursor.close()
    
    @staticmethod
    def update_profile(employee_id, update_data):
        connection = db.get_connection()
        if not connection:
            return False
        
        cursor = None
        try:
            cursor = connection.cursor()
            set_clauses = []
            values = []
            
            for field, value in update_data.items():
                set_clauses.append(f"{field} = %s")
                values.append(value)
            
            if not set_clauses:
                return False
            
            values.append(employee_id)
            update_query = f"UPDATE employees SET {', '.join(set_clauses)} WHERE id = %s"
            cursor.execute(update_query, values)
            connection.commit()
            return cursor.rowcount > 0
        except Error as e:
            print(f"Error updating employee profile: {e}")
            connection.rollback()
            return False
        finally:
            if cursor:
                cursor.close()
    
    @staticmethod
    def get_all(connection=None):
        if not connection:
            connection = db.get_connection()
        if not connection:
            return []
        
        cursor = None
        try:
            cursor = connection.cursor(dictionary=True)
            cursor.execute("SELECT * FROM employees ORDER BY created_at DESC")
            rows = cursor.fetchall()
            
            # Convert each row to a dictionary with proper data types
            employees = []
            for row in rows:
                employee_dict = {
                    'id': row['id'],
                    'name': row['name'],
                    'email': row['email'],
                    'position': row['position'],
                    'department': row['department'],
                    'salary': float(row['salary']) if row['salary'] is not None else 0.0,
                    'hire_date': row['hire_date'].strftime('%Y-%m-%d') if isinstance(row['hire_date'], datetime) else str(row['hire_date']),
                    'created_at': row['created_at'].strftime('%Y-%m-%d %H:%M:%S') if row['created_at'] else None,
                    'updated_at': row['updated_at'].strftime('%Y-%m-%d %H:%M:%S') if row['updated_at'] else None
                }
                employees.append(employee_dict)
            
            return employees
        except Error as e:
            print(f"Error fetching employees: {e}")
            return []
        finally:
            if cursor:
                cursor.close()
    
    @staticmethod
    def delete_by_id(connection, employee_id):
        if not connection:
            return False
        
        cursor = None
        try:
            cursor = connection.cursor()
            cursor.execute("DELETE FROM employees WHERE id = %s", (employee_id,))
            connection.commit()
            return cursor.rowcount > 0
        except Error as e:
            print(f"Error deleting employee: {e}")
            connection.rollback()
            return False
        finally:
            if cursor:
                cursor.close()