# CampusFlow - School Management System

## Overview

CampusFlow is a comprehensive web-based school management system designed to streamline administrative tasks, enhance communication between stakeholders, and provide insightful analytics for educational institutions. Built with modern web technologies, it offers an intuitive interface for managing all aspects of school operations.

## Features

### Dashboard
- Real-time overview of key metrics (students, teachers, staff counts)
- Financial charts showing income and expenses
- Interactive to-do list management
- Notice board for important announcements
- Calendar integration with academic events and schedules

### User Management
- **Students**: Registration, profile management, academic history tracking
- **Teachers**: Profile management, specialization tracking, schedule management
- **Parents**: Profile management, student association, communication channels
- **Staff**: Administrative personnel management, role assignment

### Academic Management
- Class and section organization
- Subject management with syllabus tracking
- Comprehensive exam management system
- Grading system with customizable grade scales
- Results processing and publishing

### Attendance System
- Daily student attendance tracking
- Staff attendance management
- Exam attendance recording
- Attendance reports and analytics

### Finance Management
- Accounting module for fee collection and expense tracking
- Payroll system for staff salary management
- Financial reporting with visual analytics

### Communication
- Internal messaging system
- Notice board for announcements
- Parent-teacher communication channels

### Role-Based Access
- Admin dashboard with complete system control
- Teacher dashboard focused on academic management
- Student dashboard for personal academic tracking
- Parent dashboard for monitoring their children's progress

### Additional Modules
- Library management
- Transportation management
- Dormitory management
- Reports generation
- Calendar and scheduling

## Technical Stack

- **Frontend Framework**: Next.js 15.x
- **Programming Language**: TypeScript
- **UI Library**: React 18.x
- **Styling**: Tailwind CSS
- **Component Library**: Custom components built on Radix UI
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **AI Integration**: GenKit AI
- **Authentication**: Firebase

## Project Structure

```
school-management-sytem/
├── src/
│   ├── app/                  # Main application pages
│   │   ├── admin/            # Admin dashboard and features
│   │   ├── teacher-dashboard/# Teacher specific features
│   │   ├── student-dashboard/# Student specific features
│   │   ├── parent-dashboard/ # Parent specific features
│   │   └── ...               # Other route-based features
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # Basic UI components (buttons, cards, etc.)
│   │   └── layout/           # Layout components (header, sidebar)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and data
│   └── ai/                   # AI integration
├── docs/                     # Documentation
├── public/                   # Static assets
└── package.json              # Dependencies and scripts
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nobody6788/school-management-sytem.git
   cd school-management-sytem
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage Guidelines

### For Administrators
- Access the admin dashboard to manage all aspects of the system
- Create and manage user accounts for teachers, students, and parents
- Configure academic settings like classes, subjects, and grading scales
- Generate reports for various metrics

### For Teachers
- Take attendance and record grades
- Communicate with students and parents
- Access and update class schedules
- Upload course materials

### For Students
- View class schedules and assignments
- Check grades and attendance records
- Access learning materials
- Communicate with teachers

### For Parents
- Monitor their children's academic progress
- View attendance records
- Communicate with teachers
- Receive notifications about important events

## Design Guidelines

CampusFlow follows these design principles:
- **Color Scheme**: 
  - Primary: Calming blue (#5DADE2)
  - Secondary: Light gray (#ECF0F1)
  - Accent: Deep sky blue (#099dee)
- **Typography**: 'Inter' (sans-serif) for clear readability
- **UI Philosophy**: Clean, intuitive layout with clear hierarchy
- **Interactions**: Subtle transitions and animations for enhanced user experience

## Contributing

We welcome contributions to improve CampusFlow! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Link: [https://github.com/Nobody6788/school-management-sytem](https://github.com/Nobody6788/school-management-sytem) 