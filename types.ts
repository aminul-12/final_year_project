
export type Specialty = 
  | 'Cardiology' 
  | 'Neurology' 
  | 'Pediatrics' 
  | 'Gynecology' 
  | 'Orthopedics' 
  | 'Medicine' 
  | 'Dermatology' 
  | 'ENT';

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  hospitalId: string;
  hospitalName: string;
  image: string;
  rating: number;
  fee: number;
  availability: string[];
  bio: string;
  contact: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  location: string;
  image: string;
  services: string[];
  contact: string;
  rating: number;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Patient' | 'Doctor' | 'Admin';
}

export type Language = 'en' | 'bn';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'doctor';
  text: string;
  timestamp: Date;
}
