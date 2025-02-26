import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InviteFriendsPage from "./pages/InviteFriendsPage";
import PlanningPage from "./pages/PlanningPage";
import PreferencesPage from "./pages/PreferencesPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import ScrollToTop from "./components/Utils/ScrollToTop";

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
import profilePicDefault from "./assets/images/LisaProfil.jpg"; // Use a default profile image
import profilePic from "./assets/images/LisaProfil.jpg";
import FlightPopup from "./pages/FlightPopup";

// Main App component
// Manages the Firebase initialization and user authentication state
// Renders the Navbar and the main content area
// Routes are defined using the React Router
function App() {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("User"); // State for storing the user's name
  const [userId, setUserId] = useState(null); // State for storing the user's document ID
  const [profilePic, setProfilePic] = useState(profilePicDefault);
  const [currentTripId, setCurrentTripId] = useState(null); // State for storing the current trip ID

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
            setProfilePic(userData.profilePicture || profilePicDefault);
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
        <ScrollToTop />
        {/* Pass setProfilePic and userId to Navbar for profile picture upload functionality */}
        <Navbar
          logoSrc={logo}
          profilePicSrc={profilePic}
          setProfilePic={setProfilePic}
          userId={userId}
        />
        <div className="content">
          <Routes>
            <Route
              path="/login"
              element={<LoginPage profilePic={profilePic} />}
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage
                    backgroundImage={backgroundImage}
                    userName={userName} // Use userName state here
                    userId={userId} // Pass the user document ID
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invite"
              element={
                <ProtectedRoute>
                  <InviteFriendsPage profilePic={profilePic} />
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
                    profilePic={profilePic}
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
                    profilePic={profilePic}
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
                    profilePic={profilePic}
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

            <Route
              path="/trip-detail/:tripId"
              element={
                <ProtectedRoute>
                  <TripDetailPage userId={userId} profilePic={profilePic} />
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
