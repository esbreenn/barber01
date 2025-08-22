// Simple local authentication service
let currentUser = null;

const VALID_EMAIL = 'admin@example.com';
const VALID_PASSWORD = 'password123';

export function login(email, password) {
  return new Promise((resolve, reject) => {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      currentUser = { email };
      resolve(currentUser);
    } else {
      reject(new Error('Credenciales inválidas'));
    }
  });
}

export function logout() {
  return new Promise((resolve) => {
    currentUser = null;
    resolve();
  });
}

export function onAuthStateChanged(callback) {
  callback(currentUser);
  return () => {};
}

export function getCurrentUser() {
  return currentUser;
}
