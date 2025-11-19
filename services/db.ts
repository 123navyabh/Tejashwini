import { Note, Mark, Assignment, FacultyMember, LabResource, Achievement, ContactMessage, User, UserRole, AttendanceRecord } from '../types';

/**
 * This service simulates a Python/Node.js backend with a Database.
 * It uses localStorage to persist data across sessions for a realistic experience.
 */

const STORAGE_KEYS = {
  NOTES: 'portalpro_notes',
  MARKS: 'portalpro_marks',
  ASSIGNMENTS: 'portalpro_assignments',
  FACULTY: 'portalpro_faculty',
  LABS: 'portalpro_labs',
  ACHIEVEMENTS: 'portalpro_achievements',
  MESSAGES: 'portalpro_messages',
  USERS: 'portalpro_users',
  CURRENT_USER: 'portalpro_current_user',
  ATTENDANCE: 'portalpro_attendance'
};

// Seed Data
const initialFaculty: FacultyMember[] = [
  { id: '1', name: 'Dr. Sarah Connor', department: 'Computer Science', email: 's.connor@portal.edu', phone: '+1 555-0101', subjectSpecialty: 'AI & Robotics', avatar: 'https://picsum.photos/id/1/200' },
  { id: '2', name: 'Prof. Alan Grant', department: 'Paleontology', email: 'a.grant@portal.edu', phone: '+1 555-0102', subjectSpecialty: 'Field Research', avatar: 'https://picsum.photos/id/2/200' },
  { id: '3', name: 'Dr. Emmett Brown', department: 'Physics', email: 'doc@portal.edu', phone: '+1 555-0103', subjectSpecialty: 'Temporal Mechanics', avatar: 'https://picsum.photos/id/3/200' },
];

const initialAchievements: Achievement[] = [
  { id: '1', title: 'Dean\'s List', description: 'Maintained a GPA above 3.8 for the semester.', date: '2023-12-15', badgeIcon: 'award' },
  { id: '2', title: 'Hackathon Winner', description: 'First place in the annual CodeFest.', date: '2024-03-10', badgeIcon: 'code' },
];

// Helpers
const getParsed = <T>(key: string, defaultVal: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultVal;
};

const setStringified = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const db = {
  // Notes
  getNotes: (): Note[] => getParsed(STORAGE_KEYS.NOTES, []),
  addNote: (note: Note) => {
    const notes = getParsed<Note[]>(STORAGE_KEYS.NOTES, []);
    setStringified(STORAGE_KEYS.NOTES, [note, ...notes]);
  },

  // Marks
  getMarks: (): Mark[] => getParsed(STORAGE_KEYS.MARKS, [
    { id: '1', subject: 'Mathematics', examName: 'Midterm', score: 85, total: 100, date: '2024-02-15' },
    { id: '2', subject: 'Physics', examName: 'Midterm', score: 78, total: 100, date: '2024-02-20' },
    { id: '3', subject: 'Computer Science', examName: 'Midterm', score: 92, total: 100, date: '2024-02-22' },
  ]),
  addMark: (mark: Mark) => {
    const marks = getParsed<Mark[]>(STORAGE_KEYS.MARKS, []);
    setStringified(STORAGE_KEYS.MARKS, [mark, ...marks]);
  },

  // Assignments
  getAssignments: (): Assignment[] => getParsed(STORAGE_KEYS.ASSIGNMENTS, [
    { id: '1', title: 'React Project', subject: 'Web Dev', dueDate: '2024-05-20', status: 'PENDING', description: 'Build a portfolio site.' },
    { id: '2', title: 'Calculus Problem Set', subject: 'Mathematics', dueDate: '2024-05-15', status: 'SUBMITTED', description: 'Chapter 5 exercises.' },
  ]),
  addAssignment: (assign: Assignment) => {
    const list = getParsed<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, []);
    setStringified(STORAGE_KEYS.ASSIGNMENTS, [assign, ...list]);
  },
  updateAssignmentStatus: (id: string, status: Assignment['status']) => {
    const list = getParsed<Assignment[]>(STORAGE_KEYS.ASSIGNMENTS, []);
    const updated = list.map(a => a.id === id ? { ...a, status } : a);
    setStringified(STORAGE_KEYS.ASSIGNMENTS, updated);
  },

  // Faculty
  getFaculty: (): FacultyMember[] => getParsed(STORAGE_KEYS.FACULTY, initialFaculty),
  addFaculty: (faculty: FacultyMember) => {
    const list = getParsed<FacultyMember[]>(STORAGE_KEYS.FACULTY, initialFaculty);
    setStringified(STORAGE_KEYS.FACULTY, [faculty, ...list]);
  },

  // Labs
  getLabs: (): LabResource[] => getParsed(STORAGE_KEYS.LABS, [
    { id: '1', title: 'Physics Lab 101', labCode: 'PHY-L1', schedule: 'Mon 10:00 AM', resources: ['LabManual.pdf', 'SafetyGuide.pdf'] },
    { id: '2', title: 'Chemistry Lab 202', labCode: 'CHM-L2', schedule: 'Wed 2:00 PM', resources: ['ChemicalList.xlsx'] },
  ]),
  addLab: (lab: LabResource) => {
    const list = getParsed<LabResource[]>(STORAGE_KEYS.LABS, []);
    setStringified(STORAGE_KEYS.LABS, [lab, ...list]);
  },

  // Achievements
  getAchievements: (): Achievement[] => getParsed(STORAGE_KEYS.ACHIEVEMENTS, initialAchievements),
  addAchievement: (ach: Achievement) => {
    const list = getParsed<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, initialAchievements);
    setStringified(STORAGE_KEYS.ACHIEVEMENTS, [ach, ...list]);
  },

  // Contact
  sendContactMessage: (msg: ContactMessage) => {
    const msgs = getParsed<ContactMessage[]>(STORAGE_KEYS.MESSAGES, []);
    setStringified(STORAGE_KEYS.MESSAGES, [msg, ...msgs]);
    return new Promise(resolve => setTimeout(resolve, 800));
  },

  // Attendance
  getAttendance: (): AttendanceRecord[] => getParsed(STORAGE_KEYS.ATTENDANCE, [
    { id: '1', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], subject: 'Mathematics', status: 'Present' },
    { id: '2', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], subject: 'Physics', status: 'Present' },
    { id: '3', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], subject: 'Computer Science', status: 'Absent' },
    { id: '4', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], subject: 'Mathematics', status: 'Present' },
    { id: '5', date: new Date(Date.now() - 259200000).toISOString().split('T')[0], subject: 'Physics', status: 'Present' },
  ]),
  addAttendance: (record: AttendanceRecord) => {
    const list = getParsed<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
    setStringified(STORAGE_KEYS.ATTENDANCE, [record, ...list]);
  },
  deleteAttendance: (id: string) => {
    const list = getParsed<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, []);
    const updated = list.filter(r => r.id !== id);
    setStringified(STORAGE_KEYS.ATTENDANCE, updated);
  },

  // Auth & Users
  getUsers: (): User[] => getParsed(STORAGE_KEYS.USERS, []),
  
  register: async (name: string, identifier: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate server delay
    
    const users = getParsed<User[]>(STORAGE_KEYS.USERS, []);
    if (users.find(u => u.email === identifier || u.phone === identifier)) {
      throw new Error("User already exists");
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email: identifier,
      phone: identifier.includes('@') ? undefined : identifier, // Simple logic
      role: UserRole.STUDENT,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4f46e5&color=fff`,
      password // In a real app, this would be hashed!
    };

    setStringified(STORAGE_KEYS.USERS, [...users, newUser]);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    return newUser;
  },

  login: async (identifier: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = getParsed<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find(u => (u.email === identifier || u.phone === identifier) && u.password === password);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
  
  getCurrentUser: (): User | null => getParsed(STORAGE_KEYS.CURRENT_USER, null)
};