import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InviteFriendsPage from "./pages/InviteFriendsPage";
import PlanningPage from "./pages/PlanningPage";
import PreferencesPage from "./pages/PreferencesPage";
import SuggestionsPage from "./pages/SuggestionsPage";

import ProcessingPage from "./pages/ProcessingPage";
import MyTripsPage from "./pages/MyTripsPage";
import LoginPage from "./pages/LoginPage";
import TripDetailPage from "./pages/TripDetailPage";
import { auth, db, storage } from "./firebase/firebase";
import backgroundImage from "./assets/images/background_homepage.jpg";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { queryDocuments } from "./firebase/firebaseStore"; // Import query functionality
import Navbar from "./components/Navbar/Navbar";
import logo from "./assets/images/AdventourLogo.svg";
import profilePic from "./assets/images/LisaProfil.jpg";
import FlightPopup from "./pages/FlightPopup";

function App() {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("User"); // State for storing the user's name
  const [userId, setUserId] = useState(null); // State for storing the user's document ID
  const [currentTripId, setCurrentTripId] = useState(null); // State for storing the current trip ID
  /* const [profilePic, setProfilePic] = useState("/assets/images/defaultProfile.jpg"); // Standard-Profilbild */

  /* DOESNT WORK AT THE MOMENT! const getProfilePicture = (userName) => {
    const profilePictures = {
      Franzi: "/assets/images/Profil2.jpg", // Beispiel für User 2
      Smilla: "/assets/images/LisaProfil.jpg", // Beispiel für User 3
      default: "/assets/images/emptyProfile.jpg", // Standardbild
    };
    return profilePictures[userName] || profilePictures.default; // Rückgabebild
  } */

  // Firebase Initialization Check
  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test Authentication
        if (!auth) throw new Error("Firebase Auth not initialized");

        // Test Firestore
        if (!db) throw new Error("Firebase Firestore not initialized");

        // Test Storage
        if (!storage) throw new Error("Firebase Storage not initialized");

        console.log("Firebase successfully initialized");
        setFirebaseReady(true);
      } catch (error) {
        console.error("Firebase initialization error:", error.message);
        setFirebaseReady(false);
      }
    };

    testFirebase();

    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);

      if (user) {
        try {
          // Query the users collection for the document with the user's email
          const results = await queryDocuments("users", [
            ["email", "==", user.email],
          ]);

          if (results.length > 0) {
            const userData = results[0];
            setUserName(userData.name || "User"); // Update userName with the name field
            setUserId(userData.id); // Store the user document ID
            /* setProfilePic(getProfilePicture(userData.name)); // Dynamisches Profilbild setzen */
          } else {
            console.warn("No user document found for the email", user.email);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!firebaseReady) {
    // Loading screen while Firebase is being tested
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>Loading Firebase...</h1>
      </div>
    );
  }

  return (
    <div>
      <Router>
        <Navbar logoSrc={logo} profilePicSrc={profilePic} />
        <div className="content">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage
                    backgroundImage={backgroundImage}
                    userName={userName} // Use userName state here
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invite"
              element={
                <ProtectedRoute>
                  <InviteFriendsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/planning"
              element={
                <ProtectedRoute>
                  <PlanningPage
                    setCurrentTripId={setCurrentTripId} // Pass state setter for currentTripId
                    userId={userId} // Pass the user document ID
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preferences"
              element={
                <ProtectedRoute>
                  <PreferencesPage
                    currentTripId={currentTripId}
                    userId={userId}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suggestions"
              element={
                <ProtectedRoute>
                  <SuggestionsPage
                    currentTripId={currentTripId}
                    userId={userId}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/processing"
              element={
                <ProtectedRoute>
                  <ProcessingPage
                    currentTripId={currentTripId}
                    userId={userId}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-trips"
              element={
                <ProtectedRoute>
                  <MyTripsPage
                    userId={userId}
                    setCurrentTripId={setCurrentTripId}
                  />
                </ProtectedRoute>
              }
            />

            <Route
              path="/flight-popup"
              element={
                <ProtectedRoute>
                  <FlightPopup currentTripId={currentTripId} />
                </ProtectedRoute>
              }
            />
            {/* TODO PhiLinh: Change TripID once the API creates the trip */}
            <Route
              path="/trip-detail/:tripId"
              element={
                <ProtectedRoute>
                  <TripDetailPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
