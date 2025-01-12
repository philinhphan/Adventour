import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InviteFriendsPage from "./pages/InviteFriendsPage";
import PlanningPage from "./pages/PlanningPage";
import PreferencesPage from "./pages/PreferencesPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import EndScreenPage from "./pages/EndScreenPage";
import ProcessingPage from "./pages/ProcessingPage";
import MyTripsPage from "./pages/MyTripsPage";
import ProcessingPageStart from "./pages/ProcessingPage Start";
import LoginPage from "./pages/LoginPage";
import { auth, db, storage } from "./firebase/firebase";
import backgroundImage from "./assets/images/background_homepage.jpg";

function App() {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [user, setUser] = useState(null);

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
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
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
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <HomePage
                  backgroundImage={backgroundImage}
                  userName={user.email}
                />
              ) : (
                <LoginPage />
              )
            }
          />
          <Route path="/invite" element={<InviteFriendsPage />} />
          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/suggestions" element={<SuggestionsPage />} />
          <Route path="/processing" element={<ProcessingPage />} />
          <Route path="/my-trips" element={<MyTripsPage />} />
          <Route path="/end" element={<EndScreenPage />} />
          <Route path="/processingstart" element={<ProcessingPageStart />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
