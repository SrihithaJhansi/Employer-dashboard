import tornado.ioloop
import tornado.web
from handlers.employee_handler import EmployeeHandler, EmployeeDetailHandler
from handlers.auth_handler import LoginHandler
from handlers.profile_handler import ProfileHandler

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Employer Dashboard API is running!")

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/api/login", LoginHandler),
        (r"/api/employees", EmployeeHandler),
        (r"/api/employees/([0-9]+)", EmployeeDetailHandler),
        (r"/api/profile/([0-9]+)", ProfileHandler),
    ])

if __name__ == "__main__":
    # Initialize database tables once
    from db import db
    db.initialize_database()
    
    app = make_app()
    port = 8000
    app.listen(port)
    print(f"Server running on http://localhost:{port}")
    tornado.ioloop.IOLoop.current().start()