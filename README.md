# Student Management System (SMS)

A comprehensive, modern Student Management System built with React, Node.js, and PostgreSQL. This system provides a complete solution for educational institutions to manage students, teachers, classes, attendance, grades, and much more.

## 🚀 Features

### 📋 Core Functionality
- **User Management**: Role-based access for admins, teachers, students, and parents
- **Student Profiles**: Comprehensive student information with academic history and health records
- **Enrollment System**: Online forms and admission tracking
- **Attendance Tracking**: Real-time attendance with absence alerts
- **Grade Management**: Digital gradebook with automatic calculations
- **Class Scheduling**: Timetable management and course registration
- **Fee Management**: Online payments, invoicing, and overdue reminders
- **Communication**: Messaging system with email/SMS notifications

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Role-based Dashboards**: Customized interfaces for different user types
- **Modern UI**: Clean, intuitive design with accessibility features
- **Multilingual Support**: Ready for internationalization
- **Dark/Light Mode**: User preference themes

### 🔒 Security & Compliance
- **Data Privacy**: GDPR and FERPA compliant
- **Role-based Access Control**: Secure permissions system
- **Audit Logs**: Complete activity tracking
- **Secure Authentication**: JWT-based authentication with password hashing
- **Rate Limiting**: Protection against abuse

### 📊 Analytics & Reporting
- **Custom Reports**: Generate reports for grades, attendance, and performance
- **Analytics Dashboard**: Visual charts and statistics
- **Performance Tracking**: Monitor student progress over time
- **Export Capabilities**: PDF and Excel export options

### 🔧 Additional Features
- **Learning Management Integration**: Compatible with LMS platforms
- **Behavior Tracking**: Discipline and incident management
- **Library Management**: Book tracking and assignments
- **Transport Management**: Bus routes and student assignments
- **Health Records**: Medical information and emergency contacts
- **Real-time Notifications**: Live updates via WebSocket
- **Mobile PWA**: Progressive Web App for mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Redux Toolkit**: State management with RTK Query for API calls
- **React Router 6**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization and charts
- **React Hook Form**: Form management with validation
- **Framer Motion**: Smooth animations and transitions
- **Socket.io Client**: Real-time communication

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **PostgreSQL**: Relational database
- **Sequelize ORM**: Database object-relational mapping
- **JWT**: JSON Web Token authentication
- **Socket.io**: Real-time communication
- **Nodemailer**: Email service integration
- **Bcrypt**: Password hashing
- **Express Validator**: Input validation and sanitization

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **Supertest**: API testing
- **Nodemon**: Development server auto-restart
- **Concurrently**: Run multiple npm scripts

## 📁 Project Structure

```
student-management-system/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS and styling
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Database and app configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   └── package.json
├── docs/                 # Documentation
├── .gitignore
├── README.md
└── package.json          # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0.0 or higher)
- PostgreSQL (v12.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/danielobanda/student-management-system.git
   cd student-management-system
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb sms_database
   
   # Or using PostgreSQL shell
   psql -U postgres
   CREATE DATABASE sms_database;
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the server directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DB_NAME=sms_database
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Frontend URL
   CLIENT_URL=http://localhost:3000
   ```

5. **Database Migration**
   ```bash
   cd server
   npm run migrate
   ```

6. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

### Running the Application

1. **Development Mode**
   ```bash
   # From root directory - runs both client and server
   npm run dev
   
   # Or run separately:
   # Terminal 1 - Server
   cd server && npm run server
   
   # Terminal 2 - Client
   cd client && npm start
   ```

2. **Production Build**
   ```bash
   # Build client for production
   cd client && npm run build
   
   # Start production server
   cd ../server && npm start
   ```

### Default Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

### Demo Credentials

The system includes demo accounts for testing:

- **Admin**: admin@sms.com / password123
- **Teacher**: teacher@sms.com / password123
- **Student**: student@sms.com / password123

## 📊 Database Schema

The system uses the following main entities:

- **Users**: Base user information for all roles
- **Students**: Extended student-specific information
- **Classes**: Academic classes and sections
- **Subjects**: Course subjects and curricula
- **Attendance**: Daily attendance tracking
- **Grades**: Assessment results and grades
- **Enrollments**: Student-class relationships

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Password reset request
- `GET /api/auth/profile` - Get user profile

### Students
- `GET /api/students` - List students
- `POST /api/students` - Create student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Classes, Subjects, Attendance, Grades
- Similar CRUD operations for each entity

## 🧪 Testing

```bash
# Run backend tests
cd server && npm test

# Run frontend tests
cd client && npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Using Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up --build
```

### Manual Deployment

1. **Build the client**
   ```bash
   cd client && npm run build
   ```

2. **Configure production environment variables**

3. **Start the server**
   ```bash
   cd server && npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Daniel Obanda**
- Email: obandahdanielle@gmail.com
- GitHub: [@danielobanda](https://github.com/danielobanda)

## 🙏 Acknowledgments

- React and Node.js communities for excellent documentation
- Tailwind CSS for the utility-first CSS framework
- All contributors and testers who helped improve this system

## 📞 Support

If you have any questions or need help with setup, please:

1. Check the [Issues](https://github.com/danielobanda/student-management-system/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer directly

---

**Built with ❤️ for educational institutions worldwide**
