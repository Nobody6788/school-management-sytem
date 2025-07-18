








export const stats = {
  activeStudents: 1250,
  totalTeachers: 75,
  classesToday: 112,
};

export const notices = [
  { id: 'N01', title: 'Annual Sports Day Postponed', content: 'The Annual Sports Day scheduled for October 15th has been postponed due to bad weather. A new date will be announced soon.', date: '2024-10-10', author: 'Admin', target: 'All Users' },
  { id: 'N02', title: 'Science Fair Registration Open', content: 'Registrations for the Annual Science Fair are now open. Last date to register is November 1st.', date: '2024-10-05', author: 'Principal', target: 'Group: Science Club' },
  { id: 'N03', title: 'Parent-Teacher Conference', content: 'The quarterly Parent-Teacher Conference for Grade 10 will be held on November 20th. Please book your slots.', date: '2024-10-01', author: 'Admin', target: 'Class: Grade 10' },
  { id: 'N04', title: 'Winter Break Schedule', content: 'Winter break will commence from December 22nd, 2024.', date: '2024-09-28', author: 'Principal', target: 'All Users' },
];

export const students = [
    { id: 'S001', name: 'Olivia Martin', grade: 'Grade 10', email: 'olivia.martin@example.com', section: 'Section A', dob: '2008-05-12', parentName: 'David Martin', phone: '555-1111', address: '123 Student Ave', profilePicture: 'https://placehold.co/100x100.png' },
    { id: 'S002', name: 'Jackson Lee', grade: 'Grade 9', email: 'jackson.lee@example.com', section: 'Section B', dob: '2009-02-28', parentName: 'Robert Lee', phone: '555-2222', address: '456 Student Blvd', profilePicture: 'https://placehold.co/100x100.png' },
    { id: 'S003', name: 'Isabella Nguyen', grade: 'Grade 11', email: 'isabella.nguyen@example.com', section: 'Section A', dob: '2007-09-15', parentName: 'Maria Nguyen', phone: '555-3333', address: '789 Student Ct', profilePicture: 'https://placehold.co/100x100.png' },
    { id: 'S004', name: 'William Kim', grade: 'Grade 12', email: 'william.kim@example.com', section: 'Section A', dob: '2006-11-23', parentName: 'James Kim', phone: '555-4444', address: '101 Student Way', profilePicture: 'https://placehold.co/100x100.png' },
    { id: 'S005', name: 'Sophia Rodriguez', grade: 'Grade 10', email: 'sophia.rodriguez@example.com', section: 'Section B', dob: '2008-07-30', parentName: 'Linda Rodriguez', phone: '555-5555', address: '212 Student Rd', profilePicture: 'https://placehold.co/100x100.png' },
];

export const teachers = [
    { id: 'T01', name: 'Mr. Benjamin Carter', specialization: 'Mathematics', email: 'ben.carter@example.com', phone: '555-1111', address: '123 Math Lane', profilePicture: 'https://placehold.co/100x100.png', salary: 50000 },
    { id: 'T02', name: 'Ms. Ava Davis', specialization: 'Physics, Chemistry', email: 'ava.davis@example.com', phone: '555-2222', address: '456 Physics Ave', profilePicture: 'https://placehold.co/100x100.png', salary: 52000 },
    { id: 'T03', name: 'Dr. Emily White', specialization: 'Chemistry', email: 'emily.white@example.com', phone: '555-3333', address: '789 Chemistry Blvd', profilePicture: 'https://placehold.co/100x100.png', salary: 55000 },
    { id: 'T04', name: 'Mr. Lucas Brown', specialization: 'History', email: 'lucas.brown@example.com', phone: '555-4444', address: '101 History Ct', profilePicture: 'https://placehold.co/100x100.png', salary: 48000 },
    { id: 'T05', name: 'Ms. Chloe Garcia', specialization: 'English Literature', email: 'chloe.garcia@example.com', phone: '555-5555', address: '212 Literature Rd', profilePicture: 'https://placehold.co/100x100.png', salary: 49000 },
];

export const parents = [
    { id: 'P01', name: 'David Martin', email: 'david.martin@example.com', phone: '555-0101', studentId: 'S001', address: '123 Parent Ave', profilePicture: 'https://placehold.co/100x100.png' },
    { id: 'P02', name: 'Robert Lee', email: 'robert.lee@example.com', phone: '555-0102', studentId: 'S002', address: '456 Parent Blvd', profilePicture: 'https://placehold.co/100x100.png' },
    { id: 'P03', name: 'Maria Nguyen', email: 'maria.nguyen@example.com', phone: '555-0103', studentId: 'S003', address: '789 Parent Ct', profilePicture: 'https://placehold.co/100x100.png' },
    { id: 'P04', name: 'James Kim', email: 'james.kim@example.com', phone: '555-0104', studentId: 'S004', address: '101 Parent Way', profilePicture: 'https://placehold.co/100x100.png' },
    { id: 'P05', name: 'Linda Rodriguez', email: 'linda.rodriguez@example.com', phone: '555-0105', studentId: 'S005', address: '212 Parent Rd', profilePicture: 'https://placehold.co/100x100.png' },
];

export const schedule = {
    'Grade 9': [
        { time: '08:00 - 09:00', monday: 'Math', tuesday: 'Science', wednesday: 'Math', thursday: 'Science', friday: 'English' },
        { time: '09:00 - 10:00', monday: 'English', tuesday: 'History', wednesday: 'English', thursday: 'History', friday: 'Physical Ed.' },
        { time: '10:00 - 11:00', monday: 'Science', tuesday: 'Math', wednesday: 'Art', thursday: 'Math', friday: 'Science' },
        { time: '11:00 - 12:00', monday: 'History', tuesday: 'English', wednesday: 'History', thursday: 'English', friday: 'Music' },
    ],
    'Grade 10': [
        { time: '08:00 - 09:00', monday: 'Physics', tuesday: 'Chemistry', wednesday: 'Physics', thursday: 'Chemistry', friday: 'Biology' },
        { time: '09:00 - 10:00', monday: 'Algebra II', tuesday: 'World History', wednesday: 'Algebra II', thursday: 'World History', friday: 'Geography' },
        { time: '10:00 - 11:00', monday: 'Chemistry', tuesday: 'Algebra II', wednesday: 'Computer Sci.', thursday: 'Algebra II', friday: 'Physics' },
        { time: '11:00 - 12:00', monday: 'World History', tuesday: 'Physics', wednesday: 'World History', thursday: 'English Lit.', friday: 'Study Hall' },
    ],
    'Grade 11': [
        { time: '08:00 - 09:00', monday: 'Calculus', tuesday: 'US History', wednesday: 'Calculus', thursday: 'US History', friday: 'Physics' },
        { time: '09:00 - 10:00', monday: 'English Lit.', tuesday: 'Physics', wednesday: 'English Lit.', thursday: 'Physics', friday: 'Chemistry' },
        { time: '10:00 - 11:00', monday: 'US History', tuesday: 'Calculus', wednesday: 'Spanish III', thursday: 'Calculus', friday: 'US History' },
        { time: '11:00 - 12:00', monday: 'Chemistry', tuesday: 'English Lit.', wednesday: 'Chemistry', thursday: 'English Lit.', friday: 'Art History' },
    ],
    'Grade 12': [
        { time: '08:00 - 09:00', monday: 'Gov & Econ', tuesday: 'Statistics', wednesday: 'Gov & Econ', thursday: 'Statistics', friday: 'Creative Writing' },
        { time: '09:00 - 10:00', monday: 'Statistics', tuesday: 'British Lit.', wednesday: 'Statistics', thursday: 'British Lit.', friday: 'Gov & Econ' },
        { time: '10:00 - 11:00', monday: 'AP Biology', tuesday: 'Gov & Econ', wednesday: 'AP Biology', thursday: 'Gov & Econ', friday: 'Elective' },
        { time: '11:00 - 12:00', monday: 'British Lit.', tuesday: 'AP Biology', wednesday: 'British Lit.', thursday: 'AP Biology', friday: 'Yearbook' },
    ]
};

export const academic = {
  classes: [
    { id: 'C01', name: 'Grade 9', capacity: 40 },
    { id: 'C02', name: 'Grade 10', capacity: 40 },
    { id: 'C03', name: 'Grade 11', capacity: 35 },
    { id: 'C04', name: 'Grade 12', capacity: 35 },
  ],
  sections: [
    { id: 'S01', name: 'Section A', className: 'Grade 9', capacity: 40 },
    { id: 'S02', name: 'Section B', className: 'Grade 9', capacity: 40 },
    { id: 'S03', name: 'Section A', className: 'Grade 10', capacity: 40 },
    { id: 'S04', name: 'Section B', className: 'Grade 10', capacity: 40 },
    { id: 'S05', name: 'Section A', className: 'Grade 11', capacity: 35 },
    { id: 'S06', name: 'Section A', className: 'Grade 12', capacity: 35 },
  ],
  groups: [
    { id: 'G01', name: 'Science Club' },
    { id: 'G02', name: 'Debate Team' },
    { id: 'G03', name: 'Basketball Team' },
  ],
  subjects: [
    { id: 'SUB01', name: 'Mathematics', className: 'Grade 9' },
    { id: 'SUB02', name: 'Science', className: 'Grade 9' },
    { id: 'SUB03', name: 'English', className: 'Grade 9' },
    { id: 'SUB04', name: 'Physics', className: 'Grade 10' },
    { id: 'SUB05', name: 'World History', className: 'Grade 10' },
    { id: 'SUB06', name: 'Calculus', className: 'Grade 11' },
    { id: 'SUB07', name: 'Gov & Econ', className: 'Grade 12' },
    { id: 'SUB08', name: 'Chemistry', className: 'Grade 10' },
  ],
  syllabus: [
    { id: 'SYL01', subjectId: 'SUB01', title: 'Chapter 1: Algebra Basics', content: 'Introduction to variables, equations, and basic operations.', status: 'Completed' as const },
    { id: 'SYL02', subjectId: 'SUB01', title: 'Chapter 2: Geometry Fundamentals', content: 'Points, lines, angles, and basic shapes.', status: 'In Progress' as const },
    { id: 'SYL03', subjectId: 'SUB04', title: 'Unit 1: Kinematics', content: 'Study of motion, velocity, and acceleration.', status: 'Pending' as const },
  ],
  grades: [
    { id: 'GR01', gradeName: 'A+', gradePoint: '5.0', percentageFrom: 80, percentageTo: 100 },
    { id: 'GR02', gradeName: 'A', gradePoint: '4.0', percentageFrom: 70, percentageTo: 79 },
    { id: 'GR03', gradeName: 'A-', gradePoint: '3.5', percentageFrom: 60, percentageTo: 69 },
    { id: 'GR04', gradeName: 'B', gradePoint: '3.0', percentageFrom: 50, percentageTo: 59 },
    { id: 'GR05', gradeName: 'C', gradePoint: '2.0', percentageFrom: 40, percentageTo: 49 },
    { id: 'GR06', gradeName: 'D', gradePoint: '1.0', percentageFrom: 33, percentageTo: 39 },
    { id: 'GR07', gradeName: 'F', gradePoint: '0.0', percentageFrom: 0, percentageTo: 32 },
  ],
  exams: [
    { id: 'EXM01', name: 'Mid-Term Examination' },
    { id: 'EXM02', name: 'Final Examination' },
  ],
  examRoutines: [
    { id: 'ER01', examId: 'EXM01', classId: 'C01', subjectId: 'SUB01', date: '2024-12-01', startTime: '09:00', endTime: '12:00', room: '201' },
    { id: 'ER02', examId: 'EXM01', classId: 'C01', subjectId: 'SUB02', date: '2024-12-02', startTime: '09:00', endTime: '12:00', room: '201' },
    { id: 'ER03', examId: 'EXM01', classId: 'C02', subjectId: 'SUB04', date: '2024-12-01', startTime: '09:00', endTime: '12:00', room: '202' },
    { id: 'ER04', examId: 'EXM02', classId: 'C03', subjectId: 'SUB06', date: '2025-05-20', startTime: '09:00', endTime: '12:00', room: '301' },
  ],
  examAttendances: [
    { id: 'EA01', examId: 'EXM01', classId: 'C01', subjectId: 'SUB01', totalStudents: 40, present: 38, absent: 2 },
    { id: 'EA02', examId: 'EXM01', classId: 'C01', subjectId: 'SUB02', totalStudents: 40, present: 39, absent: 1 },
    { id: 'EA03', examId: 'EXM01', classId: 'C02', subjectId: 'SUB04', totalStudents: 40, present: 35, absent: 5 },
    { id: 'EA04', examId: 'EXM02', classId: 'C03', subjectId: 'SUB06', totalStudents: 35, present: 34, absent: 1 },
  ],
  results: [
    { id: 'RES01', studentId: 'S001', examId: 'EXM01', classId: 'C02', subjectId: 'SUB04', marks: 85, status: 'Pending', submittedBy: 'T02' },
    { id: 'RES02', studentId: 'S005', examId: 'EXM01', classId: 'C02', subjectId: 'SUB04', marks: 92, status: 'Pending', submittedBy: 'T02' },
    { id: 'RES03', studentId: 'S002', examId: 'EXM01', classId: 'C01', subjectId: 'SUB01', marks: 78, status: 'Approved', submittedBy: 'T01' },
    { id: 'RES04', studentId: 'S003', examId: 'EXM02', classId: 'C03', subjectId: 'SUB06', marks: 88, status: 'Published', submittedBy: 'T01' },
    { id: 'RES05', studentId: 'S001', examId: 'EXM01', classId: 'C02', subjectId: 'SUB05', marks: 76, status: 'Published', submittedBy: 'T04' },
    { id: 'RES06', studentId: 'S004', examId: 'EXM02', classId: 'C04', subjectId: 'SUB07', marks: 65, status: 'Pending', submittedBy: 'T05' },
  ],
};

export const questionBank = [
  {
    id: 'QB1',
    subjectId: 'SUB04',
    questionText: 'What is the unit of force?',
    options: ['Joule', 'Watt', 'Newton', 'Pascal'],
    correctAnswer: 'Newton'
  },
  {
    id: 'QB2',
    subjectId: 'SUB04',
    questionText: 'What principle states that for every action, there is an equal and opposite reaction?',
    options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Conservation of Energy"],
    correctAnswer: "Newton's Third Law"
  },
  {
    id: 'QB3',
    subjectId: 'SUB01',
    questionText: 'What is the value of Pi to two decimal places?',
    options: ['3.14', '3.15', '3.16', '3.13'],
    correctAnswer: '3.14'
  }
];

export const onlineExams = [
    {
        id: 'OE01',
        title: 'Physics Mid-Term Practice',
        classId: 'C02',
        subjectId: 'SUB04',
        questionIds: ['QB1', 'QB2']
    }
];

export const examSubmissions = [
  { 
    submissionId: 'SUBM01', 
    studentId: 'S001', 
    examId: 'OE01', 
    answers: { 'QB1': 'Newton', 'QB2': "Newton's Second Law" }, 
    score: 1, 
    totalQuestions: 2,
    submittedAt: '2024-10-23T10:00:00Z' 
  }
];

export const attendanceData = {
  dailyPercentage: 92.5,
  yearlyPercentage: 94.1,
  byGrade: [
    { grade: 'Grade 9', percentage: 95.2 },
    { grade: 'Grade 10', percentage: 91.8 },
    { grade: 'Grade 11', percentage: 93.1 },
    { grade: 'Grade 12', percentage: 89.9 },
  ],
  trend: [
    { date: 'Mon', attendance: 93 },
    { date: 'Tue', attendance: 94 },
    { date: 'Wed', attendance: 92 },
    { date: 'Thu', attendance: 91 },
    { date: 'Fri', attendance: 92.5 },
  ],
};

export const library = {
  bookCategories: [
    { id: 'BC01', name: 'Science Fiction' },
    { id: 'BC02', name: 'History' },
    { id: 'BC03', name: 'Mathematics' },
    { id: 'BC04', name: 'Literature' },
    { id: 'BC05', name: 'Computer Science' },
  ],
  books: [
    { id: 'B001', title: 'Dune', author: 'Frank Herbert', categoryId: 'BC01', quantity: 5 },
    { id: 'B002', title: 'A Brief History of Time', author: 'Stephen Hawking', categoryId: 'BC02', quantity: 3 },
    { id: 'B003', title: 'Calculus: A Modern Approach', author: 'Karl Menger', categoryId: 'BC03', quantity: 10 },
    { id: 'B004', title: 'To Kill a Mockingbird', author: 'Harper Lee', categoryId: 'BC04', quantity: 7 },
    { id: 'B005', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', categoryId: 'BC05', quantity: 8 },
    { id: 'B006', title: 'Foundation', author: 'Isaac Asimov', categoryId: 'BC01', quantity: 4 },
  ],
};

export const transport = {
  vehicles: [
    { id: 'V01', vehicleNumber: 'BUS-001', model: 'Tata Starbus', year: '2022', capacity: 40, driverName: 'John Doe', driverContact: '555-1234' },
    { id: 'V02', vehicleNumber: 'BUS-002', model: 'Ashok Leyland', year: '2021', capacity: 40, driverName: 'Peter Jones', driverContact: '555-5678' },
  ],
  routes: [
    { id: 'R01', name: 'Downtown Route', stops: 'Central Park, City Library, Main Street, School', vehicleId: 'V01' },
    { id: 'R02', name: 'Uptown Route', stops: 'North Suburbs, Green Valley, West End, School', vehicleId: 'V02' },
  ],
  members: [
    { id: 'TM01', memberId: 'S001', memberType: 'Student', routeId: 'R01' },
    { id: 'TM02', memberId: 'T01', memberType: 'Teacher', routeId: 'R02' },
    { id: 'TM03', memberId: 'S002', memberType: 'Student', routeId: 'R02' },
  ]
};

export const dormitories = {
  list: [
    { id: 'D01', name: 'Starlight Hall', type: 'Girls', description: 'A modern dormitory with great views.' },
    { id: 'D02', name: 'Phoenix House', type: 'Boys', description: 'A classic dormitory with a rich history.' },
  ],
  rooms: [
    { id: 'ROOM01', dormitoryId: 'D01', roomNumber: '101', costPerBed: 200 },
    { id: 'ROOM02', dormitoryId: 'D01', roomNumber: '102', costPerBed: 200 },
    { id: 'ROOM03', dormitoryId: 'D02', roomNumber: 'A1', costPerBed: 250 },
  ],
  beds: [
    { id: 'BED01', roomId: 'ROOM01', bedNumber: 'A', studentId: 'S001' },
    { id: 'BED02', roomId: 'ROOM01', bedNumber: 'B', studentId: 'S003' },
    { id: 'BED03', roomId: 'ROOM01', bedNumber: 'C', studentId: null },
    { id: 'BED04', roomId: 'ROOM02', bedNumber: 'A', studentId: null },
    { id: 'BED05', roomId: 'ROOM03', bedNumber: 'A', studentId: 'S002' },
    { id: 'BED06', roomId: 'ROOM03', bedNumber: 'B', studentId: null },
  ]
};

export const accounting: {
  accountTypes: { id: string; name: string }[];
  accountTitles: { id: string; name: string; typeId: string }[];
  invoices: { id: string; studentId: string; date: string; status: 'Paid' | 'Due' | 'Overdue'; items: { id: string; accountTitleId: string; amount: number; description: string }[] }[];
  expenses: { id: string; date: string; accountTitleId: string; amount: number; description: string }[];
} = {
  accountTypes: [
    { id: 'AT01', name: 'Income' },
    { id: 'AT02', name: 'Expense' },
    { id: 'AT03', name: 'Asset' },
    { id: 'AT04', name: 'Liability' },
  ],
  accountTitles: [
    { id: 'ATL01', name: 'Student Admission Fees', typeId: 'AT01' },
    { id: 'ATL02', name: 'Monthly Tuition Fees', typeId: 'AT01' },
    { id: 'ATL03', name: 'Teacher Salaries', typeId: 'AT02' },
    { id: 'ATL04', name: 'Utilities', typeId: 'AT02' },
    { id: 'ATL05', name: 'School Building', typeId: 'AT03' },
    { id: 'ATL06', name: 'Bank Loans', typeId: 'AT04' },
    { id: 'ATL07', name: 'Library Fines', typeId: 'AT01' },
    { id: 'ATL08', name: 'Transport Fees', typeId: 'AT01' },
  ],
  invoices: [
    { 
      id: 'INV001', 
      studentId: 'S001', 
      date: '2024-10-05', 
      status: 'Paid',
      items: [
        { id: 'ITEM001', accountTitleId: 'ATL02', amount: 500, description: 'Tuition Fee for October' },
        { id: 'ITEM002', accountTitleId: 'ATL08', amount: 50, description: 'Transport Fee for October' }
      ]
    },
    { 
      id: 'INV002', 
      studentId: 'S002', 
      date: '2024-10-05', 
      status: 'Paid',
      items: [
        { id: 'ITEM003', accountTitleId: 'ATL02', amount: 500, description: 'Tuition Fee for October' }
      ]
    },
    { 
      id: 'INV003', 
      studentId: 'S003', 
      date: '2024-09-01', 
      status: 'Paid',
      items: [
        { id: 'ITEM004', accountTitleId: 'ATL01', amount: 1000, description: 'Admission Fee' }
      ]
    },
     { 
      id: 'INV004', 
      studentId: 'S004', 
      date: '2024-10-01', 
      status: 'Due',
      items: [
        { id: 'ITEM005', accountTitleId: 'ATL02', amount: 600, description: 'Tuition Fee for October' }
      ]
    },
     { 
      id: 'INV005', 
      studentId: 'S005', 
      date: '2024-09-15', 
      status: 'Overdue',
      items: [
        { id: 'ITEM006', accountTitleId: 'ATL02', amount: 550, description: 'Tuition Fee for September' },
        { id: 'ITEM007', accountTitleId: 'ATL07', amount: 10, description: 'Late library book' }
      ]
    },
  ],
  expenses: [
    { id: 'EXP001', date: '2024-10-15', accountTitleId: 'ATL03', amount: 25000, description: 'Salaries for September' },
    { id: 'EXP002', date: '2024-10-10', accountTitleId: 'ATL04', amount: 1500, description: 'Electricity and Water bills' },
  ]
};

export const studentAttendances = [
    { id: 'ATT01', studentId: 'S001', date: '2024-10-21', status: 'Present', classId: 'C02', section: 'Section A' },
    { id: 'ATT02', studentId: 'S005', date: '2024-10-21', status: 'Absent', classId: 'C02', section: 'Section B' },
    { id: 'ATT03', studentId: 'S002', date: '2024-10-21', status: 'Late', classId: 'C01', section: 'Section B' },
    { id: 'ATT04', studentId: 'S001', date: '2024-10-22', status: 'Present', classId: 'C02', section: 'Section A' },
];

export const examStudentAttendances = [
  { id: 'ESA01', studentId: 'S001', examId: 'EXM01', subjectId: 'SUB04', status: 'Present' },
  { id: 'ESA02', studentId: 'S005', examId: 'EXM01', subjectId: 'SUB04', status: 'Present' },
  { id: 'ESA03', studentId: 'S001', examId: 'EXM01', subjectId: 'SUB05', status: 'Absent' },
];

export const staffAttendances = [
    { id: 'SATT01', teacherId: 'T01', date: '2024-10-21', status: 'Present' },
    { id: 'SATT02', teacherId: 'T02', date: '2024-10-21', status: 'Present' },
    { id: 'SATT03', teacherId: 'T03', date: '2024-10-21', status: 'Late' },
    { id: 'SATT04', teacherId: 'T04', date: '2024-10-21', status: 'Absent' },
    { id: 'SATT05', teacherId: 'T05', date: '2024-10-21', status: 'Present' },
    { id: 'SATT06', teacherId: 'T01', date: '2024-10-22', status: 'Present' },
];

export const adminProfile = {
  id: 'ADMIN01',
  name: 'Admin User',
  email: 'admin@campusflow.com',
  phone: '555-0199',
  address: '123 Admin Way, Tech City, 10101',
  profilePicture: 'https://placehold.co/100x100.png'
};

export const settings = {
  name: 'CampusFlow School',
  email: 'contact@campusflow.com',
  phone: '555-123-4567',
  address: '123 Education Lane, Knowledge City, 12345',
  logo: 'https://placehold.co/100x100.png',
  timezone: 'America/New_York',
};

export const academicEvents: { id: string; date: string; title: string; description: string; type: 'Holiday' | 'Exam' | 'Event' }[] = [
    { id: 'E01', date: '2024-10-31', title: 'Halloween Party', description: 'School-wide costume party in the auditorium.', type: 'Event' },
    { id: 'E02', date: '2024-11-28', title: 'Thanksgiving Break', description: 'School closed for Thanksgiving.', type: 'Holiday' },
    { id: 'E03', date: '2024-11-29', title: 'Thanksgiving Break', description: 'School closed for Thanksgiving.', type: 'Holiday' },
    { id: 'ER01', date: '2024-12-01', title: 'Mid-Term: Grade 9 Math', description: 'Mid-Term Exam for Grade 9 Mathematics in Room 201.', type: 'Exam' },
    { id: 'ER03', date: '2024-12-01', title: 'Mid-Term: Grade 10 Physics', description: 'Mid-Term Exam for Grade 10 Physics in Room 202.', type: 'Exam' },
    { id: 'ER02', date: '2024-12-02', title: 'Mid-Term: Grade 9 Science', description: 'Mid-Term Exam for Grade 9 Science in Room 201.', type: 'Exam' },
];

export const messages = [
  {
    id: 'MSG01',
    senderId: 'T02',
    senderType: 'Teacher',
    recipientId: 'P01',
    recipientType: 'Parent',
    subject: 'Update on Olivia\'s Progress',
    body: 'Dear Mr. Martin, I wanted to share a positive update on Olivia\'s recent performance in Physics. She\'s been doing great work. Best, Ms. Davis',
    date: '2024-10-20T10:00:00Z',
    read: true,
  },
  {
    id: 'MSG02',
    senderId: 'ADMIN01',
    senderType: 'Admin',
    recipientId: 'T02',
    recipientType: 'Teacher',
    subject: 'Staff Meeting Reminder',
    body: 'Just a reminder that there is a mandatory staff meeting this Friday at 3 PM in the conference room. Please be there on time.',
    date: '2024-10-18T15:30:00Z',
    read: false,
  },
  {
    id: 'MSG03',
    senderId: 'T02',
    senderType: 'Teacher',
    recipientId: 'S001',
    recipientType: 'Student',
    subject: 'Science Fair Project Idea',
    body: 'Hi Olivia, I had a great idea for your science fair project. Let\'s discuss it after class tomorrow. Ms. Davis',
    date: '2024-10-17T11:00:00Z',
    read: true,
  },
    {
    id: 'MSG04',
    senderId: 'T03',
    senderType: 'Teacher',
    recipientId: 'T02',
    recipientType: 'Teacher',
    subject: 'Lab Equipment',
    body: 'Hi Ava, do you know where the new beakers are? I can\'t seem to find them. Thanks, Emily',
    date: '2024-10-16T09:00:00Z',
    read: true,
  },
  {
    id: 'MSG05',
    senderId: 'P01',
    senderType: 'Parent',
    recipientId: 'T01',
    recipientType: 'Teacher',
    subject: 'Question about upcoming test',
    body: 'Hello Mr. Carter, I had a question about the format of the upcoming math test. Could you provide some details? Thank you, David Martin.',
    date: '2024-10-22T09:00:00Z',
    read: false,
  },
];

export const teacherPersonalEvents = [
  { id: 'TE01', date: '2024-10-28', title: 'Submit Physics Mid-Term Grades', description: 'Final deadline for submitting grades for the mid-term exams.' },
  { id: 'TE02', date: '2024-11-10', title: 'Prepare Lab for Chemistry Practical', description: 'Restock chemicals and prepare equipment for Grade 10 practicals.' },
];

export const studentPersonalEvents = [
  { id: 'SE01', date: '2024-11-15', title: 'Science Project Deadline', description: 'Submit the final draft of the physics project.' },
  { id: 'SE02', date: '2024-11-20', title: 'Basketball Tryouts', description: 'Tryouts for the school basketball team in the gym at 4 PM.' },
];

export const parentPersonalEvents = [
  { id: 'PE01', date: '2024-11-20', title: 'Attend Parent-Teacher Conference', description: 'Meeting with Grade 10 teachers.' },
  { id: 'PE02', date: '2024-12-10', title: 'Volunteer for Bake Sale', description: 'Help out at the annual school fundraiser.' },
];

export const payrolls = [
  { id: 'PAY01', teacherId: 'T01', month: 'September', year: 2024, baseSalary: 50000, bonus: 0, deductions: 5000, netSalary: 45000, status: 'Paid' as const },
  { id: 'PAY02', teacherId: 'T02', month: 'September', year: 2024, baseSalary: 52000, bonus: 200, deductions: 5200, netSalary: 47000, status: 'Paid' as const },
  { id: 'PAY03', teacherId: 'T01', month: 'October', year: 2024, baseSalary: 50000, bonus: 0, deductions: 5000, netSalary: 45000, status: 'Pending' as const },
];

export const promotions = [
  { id: 'PROM1', date: '2023-04-05', fromClass: 'Grade 8', fromSection: 'Section A', toClass: 'Grade 9', toSection: 'Section A', studentIds: ['S002'] }
];

export const leaveRequests = [
    { id: 'LR01', teacherId: 'T01', startDate: '2024-11-10', endDate: '2024-11-12', reason: 'Personal reasons.', status: 'Approved' as const },
    { id: 'LR02', teacherId: 'T04', startDate: '2024-11-15', endDate: '2024-11-15', reason: 'Medical appointment.', status: 'Pending' as const },
    { id: 'LR03', teacherId: 'T05', startDate: '2024-10-20', endDate: '2024-10-21', reason: 'Family emergency.', status: 'Rejected' as const },
];

export const courseMaterials = [
    { id: 'CM01', subjectId: 'SUB04', teacherId: 'T02', title: 'Chapter 1: Kinematics Notes', description: 'Notes covering the first chapter of Physics.', fileName: 'physics_ch1.pdf', fileSize: '1.2MB', uploadDate: '2024-09-05', fileUrl: '#' },
    { id: 'CM02', subjectId: 'SUB04', teacherId: 'T02', title: 'Practice Problems: Kinematics', description: 'A worksheet with practice problems.', fileName: 'kinematics_problems.pdf', fileSize: '450KB', uploadDate: '2024-09-10', fileUrl: '#' },
    { id: 'CM03', subjectId: 'SUB08', teacherId: 'T02', title: 'Lab Safety Guidelines', description: 'Important safety guidelines for the chemistry lab.', fileName: 'lab_safety.pdf', fileSize: '200KB', uploadDate: '2024-09-02', fileUrl: '#' },
];

export const lessonPlans = [
    { id: 'LP01', teacherId: 'T02', name: 'Introduction to Newtonian Physics', subjectId: 'SUB04', date: '2024-09-10', method: 'Lecture & Demo', periods: 2, note: 'Focus on the three laws of motion.', status: 'Completed' as const, file: 'newtonian_intro.pdf' },
    { id: 'LP02', teacherId: 'T02', name: 'Chemical Bonding', subjectId: 'SUB08', date: '2024-09-12', method: 'Group Activity', periods: 1, note: 'Students will build models of molecules.', status: 'Completed' as const, file: null },
    { id: 'LP03', teacherId: 'T02', name: 'Lab: Titration Basics', subjectId: 'SUB08', date: '2024-10-25', method: 'Practical Lab', periods: 2, note: 'Ensure all safety measures are in place.', status: 'Pending' as const, file: 'titration_lab_sheet.pdf' },
];

export const todoList = [
    { id: 'TODO01', task: 'Review budget proposals', completed: false },
    { id: 'TODO02', task: 'Finalize the agenda for the parent-teacher conference', completed: false },
    { id: 'TODO03', task: 'Approve leave request for Mr. Brown', completed: true },
];

export const personalEvents = [
  { id: 'E01', date: '2024-10-25', title: 'Review Q3 Budget', description: 'Finalize the budget report for the third quarter.' },
  { id: 'E02', date: '2024-11-05', title: 'Meeting with School Board', description: 'Discuss the new curriculum proposal.' },
  { id: 'E03', date: '2024-11-05', title: 'Prepare for Science Fair', description: 'Coordinate with science teachers for the upcoming fair.' },
];
