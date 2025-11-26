
import { Appointment, ContactMessage } from '../types';

// Define a local User interface since we cannot import from firebase/auth
export interface User {
  uid: string;
  email: string | null;
}

// --- MOCK DATA STORE ---
let mockAppointments: Appointment[] = [
  { id: '1', parent: 'Ayşe Yılmaz', baby: 'Can (6 Ay)', service: 'Rahatla & Büyü Paketi', date: '2024-03-14', time: '10:30', status: 'pending', price: '₺2.800', phone: '05555555555', email: 'ayse@test.com' },
  { id: '2', parent: 'Mehmet Demir', baby: 'Elif (4 Ay)', service: 'İlk Dokunuş', date: '2024-03-14', time: '12:00', status: 'confirmed', price: '₺750', phone: '05555555555', email: 'mehmet@test.com' },
];

let mockContacts: ContactMessage[] = [
  { id: '1', name: 'Zeynep Kaya', email: 'zeynep@example.com', message: 'Merhaba, ikiz bebekler için indiriminiz var mı?', date: '2024-03-10' }
];

let appointmentListeners: ((apps: Appointment[]) => void)[] = [];
let contactListeners: ((msgs: ContactMessage[]) => void)[] = [];
let mockUser: User | null = null;
let authListeners: ((user: User | null) => void)[] = [];

const notifyAppointmentListeners = () => {
  appointmentListeners.forEach(listener => listener([...mockAppointments]));
};

const notifyContactListeners = () => {
  contactListeners.forEach(listener => listener([...mockContacts]));
};

const notifyAuthListeners = () => {
  authListeners.forEach(listener => listener(mockUser));
};

// --- Appointments ---

export const subscribeToAppointments = (callback: (appointments: Appointment[]) => void) => {
  // Using Mock Data
  appointmentListeners.push(callback);
  callback([...mockAppointments]);
  return () => {
    appointmentListeners = appointmentListeners.filter(l => l !== callback);
  };
};

export const addAppointmentToFirebase = async (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
  const newApp: Appointment = {
    ...appointmentData,
    id: Date.now().toString(),
    status: 'pending',
    createdAt: new Date()
  };
  mockAppointments = [newApp, ...mockAppointments];
  notifyAppointmentListeners();
};

export const updateAppointmentStatusInFirebase = async (id: string, status: 'confirmed' | 'cancelled') => {
  mockAppointments = mockAppointments.map(app => 
    app.id === id ? { ...app, status } : app
  );
  notifyAppointmentListeners();
};

export const deleteAppointmentFromFirebase = async (id: string) => {
  mockAppointments = mockAppointments.filter(app => app.id !== id);
  notifyAppointmentListeners();
};

// --- Contact Messages ---

export const subscribeToContacts = (callback: (messages: ContactMessage[]) => void) => {
  contactListeners.push(callback);
  callback([...mockContacts]);
  return () => {
    contactListeners = contactListeners.filter(l => l !== callback);
  };
};

export const addContactMessage = async (data: { name: string; email: string; message: string }) => {
  const newMessage: ContactMessage = {
    id: Date.now().toString(),
    ...data,
    date: new Date().toISOString().split('T')[0]
  };
  mockContacts = [newMessage, ...mockContacts];
  notifyContactListeners();
  console.log("Mock Contact Message Saved:", newMessage);
};

// --- Authentication ---

export const loginUser = async (email: string, pass: string) => {
  // Mock Login Logic
  if (email === 'admin@egebabyspa.com' && pass === '123456') {
    mockUser = { email: email, uid: 'mock-admin-id' };
    notifyAuthListeners();
    return;
  } else {
    // Simulate Firebase Auth Error
    throw { code: 'auth/wrong-password', message: 'Demo Modu: E-posta: admin@egebabyspa.com, Şifre: 123456' };
  }
};

export const logoutUser = async () => {
  mockUser = null;
  notifyAuthListeners();
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  authListeners.push(callback);
  callback(mockUser);
  return () => {
    authListeners = authListeners.filter(l => l !== callback);
  };
};