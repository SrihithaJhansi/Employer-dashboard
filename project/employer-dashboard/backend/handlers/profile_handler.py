import tornado.web
import json
from models.employee_model import Employee

class ProfileHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        # Allow both common frontend development ports
        allowed_origins = ["http://localhost:3000", "http://localhost:5173"]
        origin = self.request.headers.get('Origin')
        if origin in allowed_origins:
            self.set_header("Access-Control-Allow-Origin", origin)
        self.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.set_header("Access-Control-Allow-Credentials", "true")
    
    def options(self, employee_id=None):
        self.set_status(204)
        self.finish()
    
    def get(self, employee_id):
        try:
            print(f"Fetching profile for employee ID: {employee_id}")
            employee = Employee.get_by_id(int(employee_id))
            
            if employee:
                print(f"Found employee: {employee.name}")
                # Convert Employee object to dictionary for JSON serialization
                employee_dict = {
                    'id': employee.id,
                    'name': employee.name,
                    'email': employee.email,
                    'position': employee.position,
                    'department': employee.department,
                    'salary': float(employee.salary) if employee.salary is not None else 0.0,
                    'hire_date': employee.hire_date.strftime('%Y-%m-%d') if hasattr(employee.hire_date, 'strftime') else str(employee.hire_date),
                }
                
                # Handle optional fields
                if employee.created_at:
                    employee_dict['created_at'] = employee.created_at.strftime('%Y-%m-%d %H:%M:%S') if hasattr(employee.created_at, 'strftime') else str(employee.created_at)
                if employee.updated_at:
                    employee_dict['updated_at'] = employee.updated_at.strftime('%Y-%m-%d %H:%M:%S') if hasattr(employee.updated_at, 'strftime') else str(employee.updated_at)
                
                self.set_header("Content-Type", "application/json")
                self.write(json.dumps(employee_dict))
            else:
                print(f"Employee with ID {employee_id} not found in database")
                self.set_status(404)
                self.set_header("Content-Type", "application/json")
                self.write({"error": "Employee not found"})
        except ValueError:
            self.set_status(400)
            self.set_header("Content-Type", "application/json")
            self.write({"error": "Invalid employee ID"})
        except Exception as e:
            print(f"Error in profile handler: {str(e)}")
            self.set_status(500)
            self.set_header("Content-Type", "application/json")
            self.write({"error": f"Internal server error: {str(e)}"})
    
    def put(self, employee_id):
        try:
            data = json.loads(self.request.body)
            
            # Only allow updating name and email for employees
            allowed_fields = ['name', 'email']
            update_data = {k: v for k, v in data.items() if k in allowed_fields}
            
            if not update_data:
                self.set_status(400)
                self.set_header("Content-Type", "application/json")
                self.write({"error": "No valid fields to update"})
                return
            
            if Employee.update_profile(int(employee_id), update_data):
                self.set_header("Content-Type", "application/json")
                self.write({"message": "Profile updated successfully"})
            else:
                self.set_status(404)
                self.set_header("Content-Type", "application/json")
                self.write({"error": "Employee not found"})
                
        except json.JSONDecodeError:
            self.set_status(400)
            self.set_header("Content-Type", "application/json")
            self.write({"error": "Invalid JSON data"})
        except ValueError:
            self.set_status(400)
            self.set_header("Content-Type", "application/json")
            self.write({"error": "Invalid employee ID"})
        except Exception as e:
            self.set_status(500)
            self.set_header("Content-Type", "application/json")
            self.write({"error": f"Internal server error: {str(e)}"})