export enum UserRole {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  password?: string; // Storing here for mock DB simplicity
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  content?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: string;
  dateAdded: string;
}

export interface Mark {
  id: string;
  subject: string;
  examName: string;
  score: number;
  total: number;
  date: string;
  reportCardFile?: string; // New file field
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED';
  description: string;
  submissionFile?: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  subjectSpecialty: string;
  avatar?: string; // New field for uploaded photo
}

export interface LabResource {
  id: string;
  title: string;
  labCode: string;
  schedule: string;
  resources: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  badgeIcon: string;
  certificateFile?: string; // New file field
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
  attachmentName?: string; // New file field
}

export interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  status: 'Present' | 'Absent' | 'Excused';
}