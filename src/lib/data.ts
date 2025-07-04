export const stats = {
  activeStudents: 1250,
  totalTeachers: 75,
  classesToday: 112,
  attendanceRate: '92.5%',
};

export const events = [
  { id: 1, name: 'Annual Sports Day', date: '2024-10-15', type: 'Sports' },
  { id: 2, name: 'Science Fair', date: '2024-11-05', type: 'Academic' },
  { id: 3, name: 'Parent-Teacher Conference', date: '2024-11-20', type: 'General' },
  { id: 4, name: 'Winter Break Begins', date: '2024-12-22', type: 'Holiday' },
];

export const students = [
    { id: 'S001', name: 'Olivia Martin', grade: 10, email: 'olivia.martin@example.com' },
    { id: 'S002', name: 'Jackson Lee', grade: 9, email: 'jackson.lee@example.com' },
    { id: 'S003', name: 'Isabella Nguyen', grade: 11, email: 'isabella.nguyen@example.com' },
    { id: 'S004', name: 'William Kim', grade: 12, email: 'william.kim@example.com' },
    { id: 'S005', name: 'Sophia Rodriguez', grade: 10, email: 'sophia.rodriguez@example.com' },
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
    ]
};

export const academic = {
  classes: [
    { id: 'C01', name: 'Grade 9' },
    { id: 'C02', name: 'Grade 10' },
    { id: 'C03', name: 'Grade 11' },
    { id: 'C04', name: 'Grade 12' },
  ],
  sections: [
    { id: 'S01', name: 'Section A', className: 'Grade 9' },
    { id: 'S02', name: 'Section B', className: 'Grade 9' },
    { id: 'S03', name: 'Section A', className: 'Grade 10' },
  ],
  groups: [
    { id: 'G01', name: 'Science Club' },
    { id: 'G02', name: 'Debate Team' },
    { id: 'G03', name: 'Basketball Team' },
  ],
};
