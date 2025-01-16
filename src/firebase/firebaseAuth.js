import { auth } from "./firebase"; // Import Firebase Auth instance from firebase.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

/**
 * Signup function to create a new user with email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise} - Resolves with the user credential or rejects with an error.
 */
export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Signup Error:", error.message);
    throw error;
  }
};

/**
 * Login function to sign in an existing user with email and password.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise} - Resolves with the user credential or rejects with an error.
 */
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

/**
 * Logout function to sign out the currently logged-in user.
 * @returns {Promise} - Resolves when the user is signed out or rejects with an error.
 */
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Logout Error:", error.message);
    throw error;
  }
};

/**
 * Listener for authentication state changes.
 * @param {function} callback - Callback function to handle user state changes.
 *        Receives the user object if logged in, or null if logged out.
 */
export const onAuthStateChange = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
