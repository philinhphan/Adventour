import { db } from "./firebase"; // Firestore instance
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

/**
 * Add a new document to a Firestore collection.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {object} data - The data to store in the document.
 * @returns {Promise<string>} - Resolves with the document ID.
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

/**
 * Set or overwrite a document in a Firestore collection.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} docId - The ID of the document to set.
 * @param {object} data - The data to store in the document.
 * @returns {Promise<void>} - Resolves when the document is set.
 */
export const setDocument = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), data);
  } catch (error) {
    console.error("Error setting document:", error);
    throw error;
  }
};

/**
 * Get a single document by its ID.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} docId - The ID of the document to retrieve.
 * @returns {Promise<object>} - Resolves with the document data.
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId));
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Document does not exist.");
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

/**
 * Get all documents in a Firestore collection.
 * @param {string} collectionName - The name of the Firestore collection.
 * @returns {Promise<object[]>} - Resolves with an array of document data.
 */
export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};

/**
 * Update an existing document by its ID.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} docId - The ID of the document to update.
 * @param {object} data - The updated data for the document.
 * @returns {Promise<void>} - Resolves when the document is updated.
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    await updateDoc(doc(db, collectionName, docId), data);
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

/**
 * Delete a document by its ID.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {string} docId - The ID of the document to delete.
 * @returns {Promise<void>} - Resolves when the document is deleted.
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

/**
 * Query documents in a Firestore collection with conditions.
 * @param {string} collectionName - The name of the Firestore collection.
 * @param {Array} conditions - An array of conditions (e.g., [["field", "==", "value"]]).
 * @returns {Promise<object[]>} - Resolves with an array of matching document data.
 */
export const queryDocuments = async (collectionName, conditions) => {
  try {
    const q = query(
      collection(db, collectionName),
      ...conditions.map(([field, operator, value]) =>
        where(field, operator, value)
      )
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error querying documents:", error);
    throw error;
  }
};
