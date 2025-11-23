import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

// Sign up with email/password
export async function signUp(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Save user data
    localStorage.setItem('urbanoracle_user', JSON.stringify({
      name,
      email,
      uid: userCredential.user.uid
    }));
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign in with email/password
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    localStorage.setItem('urbanoracle_user', JSON.stringify({
      name: result.user.displayName,
      email: result.user.email,
      uid: result.user.uid
    }));
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign out
export async function logout() {
  try {
    await signOut(auth);
    localStorage.removeItem('urbanoracle_user');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Listen to auth state changes
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
