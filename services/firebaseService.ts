
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updatePassword,
  updateProfile,
  updateEmail
} from 'firebase/auth';
import { db, auth, isFirebaseReady } from '../firebaseConfig';
import { Appointment, ContactMessage } from '../types';

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

// --- LOCAL FALLBACK DATA ---
// Veritabanı bağlantısı olmadığında veya hata durumunda kullanılacak boş listeler.
// Gerçek bağlantı kurulduğunda bu listeler yerine veritabanı verileri kullanılır.
let localAppointments: Appointment[] = [];
let localContacts: ContactMessage[] = [];

let mockUser: User | null = null;
let appointmentListeners: ((apps: Appointment[]) => void)[] = [];
let contactListeners: ((msgs: ContactMessage[]) => void)[] = [];
let authListeners: ((user: User | null) => void)[] = [];

// Listener Yönetimi
const addListener = (listeners: any[], callback: any) => {
  if (!listeners.includes(callback)) {
    listeners.push(callback);
  }
};

const notifyAppointmentListeners = () => appointmentListeners.forEach(l => l([...localAppointments]));
const notifyContactListeners = () => contactListeners.forEach(l => l([...localContacts]));
const notifyAuthListeners = () => authListeners.forEach(l => l(mockUser));

// --- APPOINTMENTS ---

export const subscribeToAppointments = (callback: (appointments: Appointment[]) => void) => {
  if (isFirebaseReady && db) {
    try {
      // Oluşturulma tarihine göre tersten sırala (En yeni en üstte)
      const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      
      return onSnapshot(q, (snapshot) => {
        const appointments = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Appointment[];
        callback(appointments);
      }, (error) => {
        console.warn("Firestore Appointment Read Error:", error.message);
        // Hata durumunda (örn: veritabanı yoksa) boş/lokal listeyi döndür
        if (error.code === 'permission-denied' || error.code === 'not-found') {
             console.info("ℹ️ Lütfen Firebase Console'da Firestore Database'i oluşturduğunuzdan emin olun.");
        }
        callback([...localAppointments]);
        addListener(appointmentListeners, callback);
      });
    } catch (e) {
      console.error("Firestore init error:", e);
      addListener(appointmentListeners, callback);
      callback([...localAppointments]);
      return () => { appointmentListeners = appointmentListeners.filter(l => l !== callback); };
    }
  } else {
    // Firebase hazır değilse lokal modu kullan
    addListener(appointmentListeners, callback);
    callback([...localAppointments]);
    return () => {
      appointmentListeners = appointmentListeners.filter(l => l !== callback);
    };
  }
};

export const addAppointmentToFirebase = async (appointmentData: Omit<Appointment, 'id' | 'status'>) => {
  const newAppBase = {
    ...appointmentData,
    status: 'pending' as const,
    createdAt: serverTimestamp() // Sunucu zamanını kullan
  };

  try {
    if (isFirebaseReady && db) {
      await addDoc(collection(db, 'appointments'), newAppBase);
      return;
    }
  } catch (error) {
    console.error("Firebase'e kayıt eklenemedi:", error);
    throw error;
  }

  // Fallback (Sadece Firebase çalışmıyorsa)
  const newApp: Appointment = {
    ...newAppBase,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  localAppointments = [newApp, ...localAppointments];
  notifyAppointmentListeners();
};

export const updateAppointmentStatusInFirebase = async (id: string, status: 'confirmed' | 'cancelled') => {
  try {
    if (isFirebaseReady && db) {
      const docRef = doc(db, 'appointments', id);
      await updateDoc(docRef, { status });
      return;
    }
  } catch (error) {
    console.error("Firebase güncelleme hatası:", error);
  }

  // Fallback
  localAppointments = localAppointments.map(app => 
    app.id === id ? { ...app, status } : app
  );
  notifyAppointmentListeners();
};

export const deleteAppointmentFromFirebase = async (id: string) => {
  try {
    if (isFirebaseReady && db) {
      await deleteDoc(doc(db, 'appointments', id));
      return;
    }
  } catch (error) {
    console.error("Firebase silme hatası:", error);
  }

  // Fallback
  localAppointments = localAppointments.filter(app => app.id !== id);
  notifyAppointmentListeners();
};


// --- CONTACT MESSAGES ---

export const subscribeToContacts = (callback: (messages: ContactMessage[]) => void) => {
  if (isFirebaseReady && db) {
    try {
      const q = query(collection(db, 'contacts'), orderBy('date', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ContactMessage[];
        callback(messages);
      }, (error) => {
        console.warn("Firestore Contacts Read Error:", error.message);
        callback([...localContacts]);
        addListener(contactListeners, callback);
      });
    } catch (e) {
        addListener(contactListeners, callback);
        callback([...localContacts]);
        return () => { contactListeners = contactListeners.filter(l => l !== callback); };
    }
  } else {
    addListener(contactListeners, callback);
    callback([...localContacts]);
    return () => {
      contactListeners = contactListeners.filter(l => l !== callback);
    };
  }
};

export const addContactMessage = async (data: { name: string; email: string; message: string }) => {
  const messageData = {
    ...data,
    date: new Date().toISOString().split('T')[0],
    createdAt: serverTimestamp()
  };

  try {
    if (isFirebaseReady && db) {
      await addDoc(collection(db, 'contacts'), messageData);
      return;
    }
  } catch (error) {
    console.error("Firebase mesaj gönderme hatası:", error);
    throw error;
  }

  // Fallback
  const newMessage: ContactMessage = {
    id: Date.now().toString(),
    ...data,
    date: messageData.date
  };
  localContacts = [newMessage, ...localContacts];
  notifyContactListeners();
};

export const getCustomers = async () => {
  if (!isFirebaseReady || !db) return [];

  try {
    // Fetch both collections to aggregate unique customers
    const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
    const contactsSnapshot = await getDocs(collection(db, 'contacts'));

    const appointments = appointmentsSnapshot.docs.map(doc => doc.data() as Appointment);
    const contacts = contactsSnapshot.docs.map(doc => doc.data() as ContactMessage);

    const customerMap = new Map<string, any>();

    // Process appointments
    appointments.forEach(app => {
      const key = app.email || app.phone || app.parent;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: key,
          name: app.parent,
          email: app.email,
          phone: app.phone,
          type: 'Randevu',
          lastDate: app.date
        });
      }
    });

    // Process contacts
    contacts.forEach(contact => {
      const key = contact.email || contact.name;
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: key,
          name: contact.name,
          email: contact.email,
          phone: '',
          type: 'İletişim',
          lastDate: contact.date
        });
      }
    });

    return Array.from(customerMap.values());
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};


// --- AUTHENTICATION & SETTINGS ---

export const loginUser = async (email: string, pass: string) => {
  if (isFirebaseReady && auth) {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return;
    } catch (error: any) {
      console.error("Login Error:", error.code, error.message);
      
      // Auth sağlayıcısı etkin değilse (örn: Email/Password kapalıysa)
      if (error.code === 'auth/operation-not-allowed') {
         alert("Firebase Console'da Email/Password giriş yöntemi etkinleştirilmemiş.");
      }
      
      throw error;
    }
  } else {
    // Sadece demo amaçlı fallback (Firebase Auth çalışmıyorsa)
    if (email === 'admin@egebabyspa.com' && pass === '123456') {
      console.warn("⚠️ Demo modu ile giriş yapılıyor. Gerçek Auth kullanılmıyor.");
      mockUser = { email, uid: 'mock-admin-id', displayName: 'Demo Admin' };
      notifyAuthListeners();
    } else {
      throw { code: 'auth/invalid-credential', message: 'Demo Modu: admin@egebabyspa.com / 123456' };
    }
  }
};

export const logoutUser = async () => {
  try {
    if (isFirebaseReady && auth) {
      await signOut(auth);
    }
  } catch (e) {
    console.error("Logout error:", e);
  }
  mockUser = null;
  notifyAuthListeners();
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  let unsubscribe: () => void = () => {};

  if (isFirebaseReady && auth) {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({ 
          uid: user.uid, 
          email: user.email,
          displayName: user.displayName
        });
      } else {
        callback(mockUser);
      }
    });
  } else {
    addListener(authListeners, callback);
    callback(mockUser);
  }

  return () => {
    if (unsubscribe) unsubscribe();
    authListeners = authListeners.filter(l => l !== callback);
  };
};

export const updateAdminProfile = async (data: { displayName?: string, email?: string }) => {
  if (isFirebaseReady && auth && auth.currentUser) {
    if (data.email && data.email !== auth.currentUser.email) {
      await updateEmail(auth.currentUser, data.email);
    }
    if (data.displayName && data.displayName !== auth.currentUser.displayName) {
      await updateProfile(auth.currentUser, { displayName: data.displayName });
    }
  } else {
    // Demo mode
    if (mockUser) {
      if (data.email) mockUser.email = data.email;
      if (data.displayName) mockUser.displayName = data.displayName;
      notifyAuthListeners();
    }
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 800));
  }
};

export const updateAdminPassword = async (newPassword: string) => {
  if (isFirebaseReady && auth && auth.currentUser) {
    await updatePassword(auth.currentUser, newPassword);
  } else {
    // Demo mode simulation
    await new Promise(resolve => setTimeout(resolve, 800));
  }
};
