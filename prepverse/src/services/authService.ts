import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';
import { User } from '../types';
import { currentUserMock } from '../data/mockData';

const AUTH_STORAGE_KEY = 'prepverse_auth_user';

export const authService = {
  getCurrentUser(): User | null {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fallback
      }
    }
    return null;
  },

  loginDemoUser(): User {
    const demoUser = { ...currentUserMock };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    return demoUser;
  },

  async getUserFromFirestore(uid: string): Promise<User | null> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        return userSnap.data() as User;
      }
    } catch (err) {
      console.warn('Firestore fetch user error:', err);
    }
    return null;
  },

  async saveUserToFirestore(user: User): Promise<void> {
    try {
      const userDocRef = doc(db, 'users', user.id);
      await setDoc(userDocRef, user, { merge: true });
    } catch (err) {
      console.warn('Firestore save user error:', err);
    }
  },

  async loginWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      let existingUser = await this.getUserFromFirestore(fbUser.uid);
      if (!existingUser) {
        existingUser = {
          ...currentUserMock,
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'PrepVerse Developer',
          email: fbUser.email || 'user@prepverse.com',
          avatarUrl: fbUser.photoURL || undefined
        };
        await this.saveUserToFirestore(existingUser);
      }
      
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(existingUser));
      return existingUser;
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      throw error;
    }
  },

  async login(email: string, password?: string): Promise<User> {
    try {
      if (password && password.length >= 6) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = result.user;
        let existingUser = await this.getUserFromFirestore(fbUser.uid);
        if (!existingUser) {
          existingUser = {
            ...currentUserMock,
            id: fbUser.uid,
            name: fbUser.displayName || email.split('@')[0],
            email: email
          };
          await this.saveUserToFirestore(existingUser);
        }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(existingUser));
        return existingUser;
      }
    } catch (err) {
      console.warn('Firebase login failed, using local/demo mode:', err);
    }

    // Fallback demo login
    const user: User = {
      ...currentUserMock,
      email,
      name: email.split('@')[0] || 'Surya Rastogi'
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async signup(signupData: {
    name: string;
    email: string;
    college: string;
    branch: string;
    graduationYear: number;
    targetRole: string;
    preferredLanguage: string;
    password?: string;
  }): Promise<User> {
    let uid = `usr_${Date.now()}`;
    
    if (signupData.password && signupData.password.length >= 6) {
      try {
        const res = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
        uid = res.user.uid;
      } catch (err) {
        console.warn('Firebase signup failed, proceeding with account creation:', err);
      }
    }

    const newUser: User = {
      ...currentUserMock,
      id: uid,
      name: signupData.name,
      email: signupData.email,
      college: signupData.college,
      branch: signupData.branch,
      graduationYear: signupData.graduationYear,
      targetRole: signupData.targetRole,
      preferredLanguage: signupData.preferredLanguage
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    await this.saveUserToFirestore(newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const current = this.getCurrentUser() || currentUserMock;
    const updated = { ...current, ...updates };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    
    if (updated.id) {
      try {
        const userDocRef = doc(db, 'users', updated.id);
        await updateDoc(userDocRef, updates);
      } catch (err) {
        console.warn('Firestore update profile error:', err);
      }
    }
    return updated;
  },

  subscribeToAuthChanges(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        let firestoreUser = await this.getUserFromFirestore(fbUser.uid);
        if (!firestoreUser) {
          firestoreUser = {
            ...currentUserMock,
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'PrepVerse Student',
            email: fbUser.email || 'user@prepverse.com',
            avatarUrl: fbUser.photoURL || undefined
          };
          await this.saveUserToFirestore(firestoreUser);
        }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(firestoreUser));
        callback(firestoreUser);
      } else {
        const local = this.getCurrentUser();
        callback(local);
      }
    });
  }
};

