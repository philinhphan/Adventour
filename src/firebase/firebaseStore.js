import { db } from "./firebase"; // Firestore instance
import {
  collection,
  addDoc,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

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

/**
 * Add a new trip to the Firestore `trips` collection and include the creator ID.
 * @param {object} tripData - The trip data to store.
 * @param {string} creatorId - The user ID of the trip creator.
 * @returns {Promise<string>} - Resolves with the trip document ID.
 */
export const addTrip = async (tripData, creatorId) => {
  try {
    const tripRef = await addDoc(collection(db, "trips"), {
      ...tripData,
      creatorId, // Save the user ID as the creator of the trip
      createdAt: serverTimestamp(), // Optionally, add a timestamp
    });
    console.log(`Trip created with ID: ${tripRef.id} by user: ${creatorId}`);
    return tripRef.id;
  } catch (error) {
    console.error("Error adding trip:", error);
    throw error;
  }
};

/**
 * Add a trip reference to the user's `trips` array in the `users` collection.
 * @param {string} userId - The user's document ID.
 * @param {string} tripId - The trip ID to add.
 * @returns {Promise<void>} - Resolves when the update is complete.
 */
export const linkTripToUser = async (userId, tripId) => {
  try {
    const userRef = doc(db, "users", userId);
    const tripRef = doc(db, "trips", tripId); // Create a reference to the trip document
    await updateDoc(userRef, {
      trips: arrayUnion(tripRef), // Add the trip reference
    });
    console.log(`Trip ${tripId} linked to user ${userId} as a reference.`);
  } catch (error) {
    console.error("Error linking trip to user:", error);
    throw error;
  }
};

/**
 * Save user preferences under the current trip in Firestore with subcategories.
 * @param {string} tripId - The ID of the current trip.
 * @param {string} creatorId - The ID of the user saving the preferences.
 * @param {object} preferences - The structured preferences by category.
 * @returns {Promise<void>} - Resolves when the preferences are saved.
 */
export const savePreferences = async (tripId, creatorId, preferences) => {
  try {
    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, {
      preferences: arrayUnion({
        creatorId,
        preferences,
      }),
    });
    console.log(`Preferences saved for trip ${tripId} by user ${creatorId}.`);
  } catch (error) {
    console.error("Error saving preferences:", error);
    throw error;
  }
};

/**
 * Save suggestions and swipe answers under the current trip in Firestore.
 * @param {string} tripId - The ID of the current trip.
 * @param {string} creatorId - The ID of the user saving the suggestions and answers.
 * @param {Array} swipeAnswers - The array of user responses to the suggestions.
 * @returns {Promise<void>} - Resolves when the data is saved.
 */
export const saveSuggestionsAndAnswers = async (
  tripId,
  creatorId,
  swipeAnswers
) => {
  try {
    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, {
      suggestions: arrayUnion({
        creatorId,
        answers: swipeAnswers,
      }),
    });
    console.log(
      `Suggestions and answers saved for trip ${tripId} by user ${creatorId}.`
    );
  } catch (error) {
    console.error("Error saving suggestions and answers:", error);
    throw error;
  }
};

/**
 * Retrieve all trips referenced in the current user's document,
 * sorted in descending order by the `createdAt` timestamp.
 * @param {string} userId - The ID of the user document in Firestore.
 * @returns {Promise<Array>} - Resolves with an array of trip documents sorted by `createdAt`.
 */
export const getUserTrips = async (userId) => {
  try {
    // Reference to the user's document
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error(`User document with ID ${userId} does not exist.`);
    }

    // Get the `trips` array from the user's document
    const userData = userDoc.data();
    const tripRefs = userData.trips || [];

    // Fetch each trip document referenced in the `trips` array
    const trips = [];
    for (const tripRef of tripRefs) {
      const tripDoc = await getDoc(tripRef);
      if (tripDoc.exists()) {
        trips.push({ id: tripDoc.id, ...tripDoc.data() });
      } else {
        console.warn(
          `Trip document referenced does not exist: ${tripRef.path}`
        );
      }
    }

    // Sort trips by `createdAt` in descending order
    trips.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
      return dateB - dateA; // Descending order
    });

    return trips;
  } catch (error) {
    console.error("Error retrieving user trips:", error);
    throw error;
  }
};

export const deleteTrip = async (tripId) => {
  try {
    const tripRef = doc(db, "trips", tripId);

    // Query all users who have this trip in their `trips` array
    const usersQuery = query(
      collection(db, "users"),
      where("trips", "array-contains", tripRef)
    );
    const usersSnapshot = await getDocs(usersQuery);

    for (const userDoc of usersSnapshot.docs) {
      const userRef = doc(db, "users", userDoc.id);
      await updateDoc(userRef, {
        trips: usersSnapshot.docs[0]
          .data()
          .trips.filter((ref) => ref.id !== tripId),
      });
    }

    // Finally, delete the trip document
    await deleteDoc(tripRef);

    console.log(`Successfully deleted trip: ${tripId}`);
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
};

/**
 * Query users who have a specific trip reference in their `trips` array.
 * @param {string} tripId - The ID of the trip to find users for.
 * @returns {Promise<object[]>} - Resolves with an array of user documents.
 */
export const queryUsersByTrip = async (tripId) => {
  try {
    const tripRef = doc(db, "trips", tripId); // Create a reference to the trip document
    const q = query(
      collection(db, "users"),
      where("trips", "array-contains", tripRef) // Match users with this trip reference
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error querying users by trip:", error);
    throw error;
  }
};

/**
 * Save the perfect match data under the current trip in Firestore.
 * @param {string} tripId - The ID of the current trip.
 * @param {Object} perfectMatch - The object containing perfect match data.
 * @returns {Promise<void>} - Resolves when the data is saved.
 */
export const updateTripWithPerfectMatch = async (tripId, perfectMatch) => {
  try {
    const tripRef = doc(db, "trips", tripId);

    await updateDoc(tripRef, {
      perfectMatch: perfectMatch,
    });

    console.log(`Perfect match saved for trip ${tripId}.`);
  } catch (error) {
    console.error("Error saving perfect match:", error);
    throw error;
  }
};

/**
 * Check if all users affiliated with a trip have set their preferences and suggestions.
 * @param {string} tripId - The ID of the trip.
 * @returns {Promise<boolean>} - Resolves with `true` if all users have set preferences and suggestions, otherwise `false`.
 */
export const checkAllUsersCompleted = async (tripId) => {
  try {
    // Fetch the trip document
    const tripRef = doc(db, "trips", tripId);
    const tripSnap = await getDoc(tripRef);

    if (!tripSnap.exists()) {
      throw new Error(`Trip with ID ${tripId} does not exist.`);
    }

    const tripData = tripSnap.data();

    // Fetch users affiliated with the trip using the provided function
    const users = await queryUsersByTrip(tripId);

    if (!users.length) {
      console.warn(`No users found for trip ID ${tripId}.`);
      return false; // No users = can't be completed
    }

    // Check if each user has both preferences & suggestions
    const allUsersCompleted = users.every((user) => {
      const hasPreferences = tripData.preferences?.some((pref) => pref.creatorId === user.id);
      const hasSuggestions = tripData.suggestions?.some((suggestion) => suggestion.creatorId === user.id);
      return hasPreferences && hasSuggestions;
    });

    return allUsersCompleted;
  } catch (error) {
    console.error("Error checking user completion status:", error);
    throw error;
  }
};

/**
 * Get a Trip by its id from Firestore.
 * @param {string} tripId - The ID of the trip.
 * @returns {Promise<object>} - Resolves with the trip data.
 */
export const getTripById = async (tripId) => {
  try {
    const tripRef = doc(db, "trips", tripId);
    const tripDoc = await getDoc(tripRef);

    if (!tripDoc.exists()) {
      throw new Error(`Trip with ID ${tripId} does not exist.`);
    }

    return { id: tripDoc.id, ...tripDoc.data() };
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    throw error;
  }
};
