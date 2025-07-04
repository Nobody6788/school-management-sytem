export const stats = {
  activeStudents: 1250,
  totalTeachers: 75,
  classesToday: 112,
};

export const events = [
  { id: 1, name: 'Annual Sports Day', date: '2024-10-15', type: 'Sports' },
  { id: 2, name: 'Science Fair', date: '2024-11-05', type: 'Academic' },
  { id: 3, name: 'Parent-Teacher Conference', date: '2024-11-20', type: 'General' },
  { id: 4, name: 'Winter Break Begins', date: '2024-12-22', type: 'Holiday' },
];

export const students = [
    { id: 'S001', name: 'Olivia Martin', grade: 'Grade 10', email: 'olivia.martin@example.com', section: 'Section A', dob: '2008-05-12', parentName: 'David Martin' },
    { id: 'S002', name: 'Jackson Lee', grade: 'Grade 9', email: 'jackson.lee@example.com', section: 'Section B', dob: '2009-02-28', parentName: 'Robert Lee' },
    { id: 'S003', name: 'Isabella Nguyen', grade: 'Grade 11', email: 'isabella.nguyen@example.com', section: 'Section A', dob: '2007-09-15', parentName: 'Maria Nguyen' },
    { id: 'S004', name: 'William Kim', grade: 'Grade 12', email: 'william.kim@example.com', section: 'Section A', dob: '2006-11-23', parentName: 'James Kim' },
    { id: 'S005', name: 'Sophia Rodriguez', grade: 'Grade 10', email: 'sophia.rodriguez@example.com', section: 'Section B', dob: '2008-07-30', parentName: 'Linda Rodriguez' },
];

export const teachers = [
    { id: 'T01', name: 'Mr. Benjamin Carter', specialization: 'Mathematics', email: 'ben.carter@example.com' },
    { id: 'T02', name: 'Ms. Ava Davis', specialization: 'Physics', email: 'ava.davis@example.com' },
    { id: 'T03', name: 'Dr. Emily White', specialization: 'Chemistry', email: 'emily.white@example.com' },
    { id: 'T04', name: 'Mr. Lucas Brown', specialization: 'History', email: 'lucas.brown@example.com' },
    { id: 'T05', name: 'Ms. Chloe Garcia', specialization: 'English Literature', email: 'chloe.garcia@example.com' },
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
};

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
