
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  getDocs
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { db, auth, isFirebaseReady } from '../firebaseConfig';
import { Appointment, ContactMessage } from '../types';

export interface User {
  uid: string;
  email: string | null;
}

// --- MOCK DATA (Fallback only) ---
let mockAppointments: Appointment[] = [
  { id: '1', parent: 'Ayşe Yılmaz', baby: 'Can (6 Ay)', service: 'Rahatla & Büyü Paketi', date: '2024-03-14', time: '10:30', status: 'pending', price: '₺2.800' },
  { id: '2', parent: 'Mehmet Demir', baby: 'Elif (4 Ay)', service: 'İlk Dokunuş', date: '2024-03-14', time: '12:00', status: 'confirmed', price: '₺750' },
];

let mockContacts: ContactMessage[] = [
  { id: '1', name: 'Zeynep Kaya', email: 'zeynep@example.com', message: 'Merhaba, ikiz bebekler için indiriminiz var mı?', date: '2024-03-10' }
];

let appointmentListeners: ((apps: Appointment[]) => void)[] = [];
let contactListeners: ((msgs: ContactMessage[]) => void)[] = [];
let mockUser: User | null = null;
let authListeners: ((user: User | null) => void)[] = [];

const notifyAppointmentListeners = () => appointmentListeners.forEach(l => l([...mockAppointments]));
const notifyContactListeners = () => contactListeners.forEach(l => l([...mockContacts]));
const notifyAuthListeners = () => authListeners.forEach(l => l(mockUser));


// --- APPOINTMENTS ---

export const subscribeToAppointments = (callback: (appointments: Appointment[]) => void) => {
  if (isFirebaseReady && db) {
    const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const appointments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Appointment[];
      callback(appointments);
    }, (err) => {
      console.error("Firestore Error:", err);
      callback([...mockAppointments]); // Fallback on permission error
    });
  } else {
    appointmentListeners.push(callback);
    callback([...mockAppointments]);
    return () => {
      appointmentListeners = appointmentListeners.filter(l => l !== callback);
    };
  }
};

export const addAppointmentToFirebase = async (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
  const newAppBase = {
    ...appointmentData,
    status: 'pending' as const,
    createdAt: new Date().toISOString()
  };

  if (isFirebaseReady && db) {
    await addDoc(collection(db, 'appointments'), newAppBase);
  } else {
    const newApp: Appointment = {
      ...newAppBase,
      id: Date.now().toString(),
    };
    mockAppointments = [newApp, ...mockAppointments];
    notifyAppointmentListeners();
  }
};

export const updateAppointmentStatusInFirebase = async (id: string, status: 'confirmed' | 'cancelled') => {
  if (isFirebaseReady && db) {
    const docRef = doc(db, 'appointments', id);
    await updateDoc(docRef, { status });
  } else {
    mockAppointments = mockAppointments.map(app => 
      app.id === id ? { ...app, status } : app
    );
    notifyAppointmentListeners();
  }
};

export const deleteAppointmentFromFirebase = async (id: string) => {
  if (isFirebaseReady && db) {
    await deleteDoc(doc(db, 'appointments', id));
  } else {
    mockAppointments = mockAppointments.filter(app => app.id !== id);
    notifyAppointmentListeners();
  }
};


// --- CONTACT MESSAGES ---

export const subscribeToContacts = (callback: (messages: ContactMessage[]) => void) => {
  if (isFirebaseReady && db) {
    const q = query(collection(db, 'contacts'), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMessage[];
      callback(messages);
    });
  } else {
    contactListeners.push(callback);
    callback([...mockContacts]);
    return () => {
      contactListeners = contactListeners.filter(l => l !== callback);
    };
  }
};

export const addContactMessage = async (data: { name: string; email: string; message: string }) => {
  const messageData = {
    ...data,
    date: new Date().toISOString().split('T')[0]
  };

  if (isFirebaseReady && db) {
    await addDoc(collection(db, 'contacts'), messageData);
  } else {
    const newMessage: ContactMessage = {
      id: Date.now().toString(),
      ...messageData
    };
    mockContacts = [newMessage, ...mockContacts];
    notifyContactListeners();
  }
};


// --- AUTHENTICATION ---

export const loginUser = async (email: string, pass: string) => {
  if (isFirebaseReady && auth) {
    await signInWithEmailAndPassword(auth, email, pass);
  } else {
    if (email === 'admin@egebabyspa.com' && pass === '123456') {
      mockUser = { email, uid: 'mock-admin-id' };
      notifyAuthListeners();
    } else {
      throw { code: 'auth/invalid-credential', message: 'Demo Modu: admin@egebabyspa.com / 123456' };
    }
  }
};

export const logoutUser = async () => {
  if (isFirebaseReady && auth) {
    await signOut(auth);
  } else {
    mockUser = null;
    notifyAuthListeners();
  }
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  if (isFirebaseReady && auth) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({ uid: user.uid, email: user.email });
      } else {
        callback(null);
      }
    });
  } else {
    authListeners.push(callback);
    callback(mockUser);
    return () => {
      authListeners = authListeners.filter(l => l !== callback);
    };
  }
};
