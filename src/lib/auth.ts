import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { app } from "./firebase";

const auth = getAuth(app);

export async function loginWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user.email);
    return userCredential.user;
  } catch (error: any) {
    console.error("Login error:", error);
    
    if (error.code === 'auth/invalid-email') {
      throw new Error("Invalid email address");
    } else if (error.code === 'auth/user-disabled') {
      throw new Error("This account has been disabled");
    } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error("Invalid email or password");
    } else if (error.code === 'auth/invalid-credential') {
      throw new Error("Invalid credentials provided");
    } else {
      throw new Error("Login failed. Please try again.");
    }
  }
}

export function onUserChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function logout() {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Logout failed");
  }
}

export { auth };