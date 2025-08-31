import tornado.web
import json
from models.employee_model import Employee
from models.user_model import User
from datetime import datetime

class EmployeeHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
    # Allow both common frontend development ports
        allowed_origins = ["http://localhost:3000", "http://localhost:5173"]
        origin = self.request.headers.get('Origin')
        if origin in allowed_origins:
            self.set_header("Access-Control-Allow-Origin", origin)
        self.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.set_header("Access-Control-Allow-Credentials", "true")
        
    def options(self):
        # Handle preflight requests
        self.set_status(204)
        self.finish()
    
    def get(self):
        try:
            employees = Employee.get_all()
            self.set_header("Content-Type", "application/json")
            self.write(json.dumps(employees, default=str))
        except Exception as e:
            self.set_status(500)
            self.write({"error": f"Internal server error: {str(e)}"})
    
    def post(self):
        try:
            print("Received POST request to create employee")
            print(f"Request body: {self.request.body}")
            
            data = json.loads(self.request.body)
            print(f"Parsed data: {data}")
            
            # Validate required fields
            required_fields = ['name', 'email', 'position', 'department', 'salary', 'hire_date']
            for field in required_fields:
                if field not in data:
                    self.set_status(400)
                    self.set_header("Content-Type", "application/json")
                    self.write({"error": f"Missing required field: {field}"})
                    return
            
            # Additional validation
            if not data['name'].strip():
                self.set_status(400)
                self.set_header("Content-Type", "application/json")
                self.write({"error": "Name cannot be empty"})
                return
                
            if not data['email'].strip():
                self.set_status(400)
                self.set_header("Content-Type", "application/json")
                self.write({"error": "Email cannot be empty"})
                return
            
            # Create employee instance
            employee = Employee(
                name=data['name'],
                email=data['email'],
                position=data['position'],
                department=data['department'],
                salary=float(data['salary']),
                hire_date=data['hire_date']
            )
            
            print(f"Created employee object: {employee.__dict__}")
            
            if employee.save():
                print("Employee saved successfully")
                
                # Create user account if username and password provided
                if 'username' in data and 'password' in data:
                    if User.create_employee_user(data['username'], data['password'], employee.id):
                        print(f"User account created for employee {employee.id}")
                    else:
                        print(f"Failed to create user account for employee {employee.id}")
                
                self.set_status(201)
                self.set_header("Content-Type", "application/json")
                self.write({"message": "Employee created successfully", "id": employee.id})
            else:
                print("Failed to save employee")
                self.set_status(500)
                self.set_header("Content-Type", "application/json")
                self.write({"error": "Failed to create employee"})
                
        except json.JSONDecodeError:
            print("JSON decode error")
            self.set_status(400)
            self.set_header("Content-Type", "application/json")
            self.write({"error": "Invalid JSON data"})
        except ValueError as e:
            print(f"Value error: {e}")
            self.set_status(400)
            self.set_header("Content-Type", "application/json")
            self.write({"error": f"Invalid data: {str(e)}"})
        except Exception as e:
            print(f"Unexpected error: {e}")
            self.set_status(500)
            self.set_header("Content-Type", "application/json")
            self.write({"error": f"Internal server error: {str(e)}"})

class EmployeeDetailHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")
        self.set_header("Access-Control-Allow-Methods", "GET, DELETE, OPTIONS")
    
    def options(self, employee_id):
        # Handle preflight requests
        self.set_status(204)
        self.finish()
    
    def get(self, employee_id):
        try:
            employee = Employee.get_by_id(int(employee_id))
            if employee:
                self.set_header("Content-Type", "application/json")
                self.write(json.dumps(employee, default=str))
            else:
                self.set_status(404)
                self.write({"error": "Employee not found"})
        except ValueError:
            self.set_status(400)
            self.write({"error": "Invalid employee ID"})
        except Exception as e:
            self.set_status(500)
            self.write({"error": f"Internal server error: {str(e)}"})
    
    def delete(self, employee_id):
        try:
            if Employee.delete(int(employee_id)):
                self.set_header("Content-Type", "application/json")
                self.write({"message": "Employee deleted successfully"})
            else:
                self.set_status(404)
                self.write({"error": "Employee not found"})
        except ValueError:
            self.set_status(400)
            self.write({"error": "Invalid employee ID"})
        except Exception as e:
            self.set_status(500)
            self.write({"error": f"Internal server error: {str(e)}"})