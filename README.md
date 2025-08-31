Employer Dashboard
A full-stack web application for managing employee records with role-based authentication, built with React frontend, Python Tornado backend, and MySQL database.

🚀 Features
Role-Based Access Control: Admin and Employee roles with different permissions

Employee Management: Add, view, search, and delete employees (Admin only)

Profile Management: Employees can edit their own profiles (name and email only)

Authentication: Secure login system with session management

Search Functionality: Real-time search across all employee fields

Responsive Design: Clean black and white theme that works on all devices

🛠️ Tech Stack
Frontend: React 18, React Router DOM

Backend: Python 3.8+, Tornado Web Server

Database: MySQL 8.0+

Authentication: Session-based with role permissions

Styling: Custom CSS (No external frameworks)

📋 Prerequisites
Before running this application, ensure you have installed:

System Requirements
Node.js (v14 or higher) 
Python (v3.8 or higher) 
MySQL Server (v8.0 or higher) 
Python Packages (Backend)
bash
pip install tornado==6.4.0
pip install mysql-connector-python==8.2.0
pip install python-dotenv==1.0.0  # For environment variables
Node.js Packages (Frontend)
bash
npm install react@18.2.0
npm install react-dom@18.2.0
npm install react-router-dom@6.8.0
npm install vite@4.1.0  # Development server and build tool
npm install @vitejs/plugin-react@3.1.0
📁 Project Structure
employer-dashboard/
├── backend/
│   ├── app.py                 # Tornado server entry point
│   ├── db.py                  # Database connection and initialization
│   ├── requirements.txt       # Python dependencies
│   ├── handlers/              # API request handlers
│   │   ├── employee_handler.py
│   │   ├── auth_handler.py
│   │   └── profile_handler.py
│   └── models/                # Data models and business logic
│       ├── employee_model.py
│       └── user_model.py
├── frontend/
│   ├── package.json           # Node.js dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── index.html             # Main HTML template
│   └── src/
│       ├── main.jsx           # React application entry point
│       ├── App.jsx            # Main application component
│       ├── App.css            # Global styles
│       ├── pages/             # Page components
│       │   ├── Login.jsx
│       │   ├── Home.jsx
│       │   ├── Employees.jsx
│       │   ├── AddEmployee.jsx
│       │   └── Profile.jsx
│       └── components/        # Reusable components
│           ├── Navbar.jsx
│           ├── EmployeeList.jsx
│           └── EmployeeForm.jsx
└── README.md
🚀 Installation & Setup
Clone the Repository

bash
git clone <repository-url>
cd employer-dashboard
Database Setup

Create MySQL Database

sql
CREATE DATABASE employer_dashboard;
Configure Database Connection

Update backend/db.py with your MySQL credentials:

python
# Default configuration (modify as needed)
self.host = os.getenv('DB_HOST', 'localhost')
self.database = os.getenv('DB_NAME', 'employer_dashboard')
self.user = os.getenv('DB_USER', 'root')
self.password = os.getenv('DB_PASSWORD', 'your_mysql_password')
self.port = os.getenv('DB_PORT', 3306)
Backend Setup

bash
cd backend
pip install -r requirements.txt
Start Backend Server

bash
python app.py
The backend will start on http://localhost:8000 and automatically:

Create necessary database tables

Insert default admin user

Set up API endpoints

Frontend Setup

bash
cd ../frontend
npm install
Start Development Server

bash
npm run dev
The frontend will start on http://localhost:3000

👥 Default Login Credentials
The application comes with a default admin user:

Username: admin

Password: admin123

Note: Change the default password after first login for security.

🔧 Environment Variables
Create a .env file in the backend directory for production:

env
DB_HOST=localhost
DB_NAME=employer_dashboard
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_PORT=3306
SECRET_KEY=your_secret_key_for_sessions
📊 API Endpoints
Method	Endpoint	Description	Access
GET	/api/employees	Get all employees	Admin: Full, Employee: Read-only
POST	/api/employees	Create new employee	Admin only
DELETE	/api/employees/:id	Delete employee	Admin only
GET	/api/profile/:id	Get employee profile	All authenticated users
PUT	/api/profile/:id	Update profile	Owner only (restricted fields)
POST	/api/login	User authentication	Public
🏗️ Build for Production
Build Frontend

bash
cd frontend
npm run build
Production Deployment

Build the frontend as shown above

Serve the frontend/dist folder using a web server (Nginx, Apache)

Run the backend as a service (using systemd, PM2, or similar)

Configure reverse proxy for API calls

🔒 Security Notes
Change default admin password after first login

Use HTTPS in production

Configure proper CORS settings for your domain

Use environment variables for sensitive data

Regularly update dependencies for security patches

🐛 Troubleshooting
Common Issues

MySQL Connection Error

Verify MySQL server is running

Check database credentials in db.py

Ensure MySQL user has proper permissions

Port Already in Use

Backend: Change port in app.py (default: 8000)

Frontend: Change port in vite.config.js (default: 3000)

CORS Errors

Update CORS origins in all handler files

Ensure frontend and backend URLs match

Module Not Found Errors

Verify all Python and Node.js dependencies are installed

Check import paths in all files

Logs

Backend logs are displayed in the console

Frontend errors can be viewed in browser developer tools
Git - Download here

Python Packages (Backend)
