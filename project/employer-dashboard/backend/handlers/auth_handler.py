import tornado.web
import json
from models.user_model import User

class LoginHandler(tornado.web.RequestHandler):
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
        # Handle preflight OPTIONS requests
        self.set_status(204)
        self.finish()
    
    def post(self):
        try:
            data = json.loads(self.request.body)
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                self.set_status(400)
                self.set_header("Content-Type", "application/json")
                self.write({"error": "Username and password are required"})
                return
            
            user = User.authenticate(username, password)
            
            if user:
                self.set_header("Content-Type", "application/json")
                self.write({
                    "success": True,
                    "user": user.to_dict(),
                    "message": "Login successful"
                })
            else:
                self.set_status(401)
                self.set_header("Content-Type", "application/json")
                self.write({"error": "Invalid username or password"})
                
        except json.JSONDecodeError:
            self.set_status(400)
            self.set_header("Content-Type", "application/json")
            self.write({"error": "Invalid JSON data"})
        except Exception as e:
            self.set_status(500)
            self.set_header("Content-Type", "application/json")
            self.write({"error": f"Internal server error: {str(e)}"})