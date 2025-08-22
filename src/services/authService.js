import { signInWithEmailAndPassword, signOut, onAuthStateChanged as onAuthChanged } from 'firebase/auth';
import { auth } from './firebase';

// Sign in user with email and password
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password).then(cred => cred.user);
}

// Sign out current user
export function logout() {
  return signOut(auth);
}

// Listen to auth state changes
export function onAuthStateChanged(callback) {
  return onAuthChanged(auth, callback);
}

// Get current logged user
export function getCurrentUser() {
  return auth.currentUser;
}
