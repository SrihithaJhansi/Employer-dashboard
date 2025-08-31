# Employer Dashboard

A full-stack web application for managing employee information with a React frontend and Python Tornado backend connected to MySQL database.

## Features

- **Employee Management**: Add, view, and delete employee records
- **Dashboard Overview**: Quick statistics and insights about your workforce
- **Department Organization**: Organize employees by departments
- **Salary Tracking**: Monitor individual and total payroll expenses
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Frontend
- React 18
- React Router for navigation
- Modern CSS with responsive design
- Vite for development server

### Backend
- Python with Tornado framework
- MySQL database with mysql-connector-python
- RESTful API with CORS support
- Proper error handling and validation

## Project Structure

```
employer-dashboard/
├── backend/
│   ├── app.py                    # Main Tornado application
│   ├── db.py                     # Database connection and setup
│   ├── handlers/
│   │   └── employee_handler.py   # API request handlers
│   ├── models/
│   │   └── employee_model.py     # Employee data model
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── package.json              # React dependencies
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   └── src/
│       ├── main.jsx             # React entry point
│       ├── App.jsx              # Main app component
│       ├── App.css              # Global styles
│       ├── components/
│       │   ├── Navbar.jsx       # Navigation component
│       │   ├── EmployeeList.jsx # Employee table display
│       │   └── EmployeeForm.jsx # Add employee form
│       └── pages/
│           ├── Home.jsx         # Dashboard homepage
│           ├── Employees.jsx    # Employee management page
│           └── About.jsx        # About/documentation page
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.7+
- Node.js 16+
- MySQL 8.0+

### Database Setup
1. Install MySQL and create a database named `employer_dashboard`
2. Update database credentials in `backend/db.py` or set environment variables:
   - `DB_HOST` (default: localhost)
   - `DB_NAME` (default: employer_dashboard)
   - `DB_USER` (default: root)
   - `DB_PASSWORD` (default: empty)
   - `DB_PORT` (default: 3306)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd employer-dashboard/backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   python app.py
   ```
   Server will run on `http://localhost:8000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd employer-dashboard/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Application will run on `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| POST | `/api/employees` | Create new employee |
| GET | `/api/employees/{id}` | Get employee by ID |
| DELETE | `/api/employees/{id}` | Delete employee by ID |

## Database Schema

### Employees Table
| Column | Type | Description |
|--------|------|-------------|
| id | INT AUTO_INCREMENT | Primary key |
| name | VARCHAR(100) | Employee full name |
| email | VARCHAR(100) | Email address (unique) |
| position | VARCHAR(100) | Job position |
| department | VARCHAR(100) | Department name |
| salary | DECIMAL(10,2) | Annual salary |
| hire_date | DATE | Date of hire |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

## Usage

1. **Dashboard**: View overall statistics about your workforce
2. **Employees Page**: Add new employees and manage existing ones
3. **About Page**: Learn about the application and its features

### Adding Employees
1. Go to the Employees page
2. Fill out the employee form with required information
3. Click "Add Employee" to save

### Managing Employees
- View all employees in the table on the Employees page
- Delete employees using the Delete button (with confirmation)
- View formatted salary and hire date information

## Development

### Frontend Development
The React application uses:
- Modern functional components with hooks
- React Router for client-side routing
- Responsive CSS Grid and Flexbox layouts
- Form validation and error handling

### Backend Development
The Python Tornado backend features:
- Async request handlers
- MySQL connection pooling
- CORS support for cross-origin requests
- Proper error handling and HTTP status codes
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.