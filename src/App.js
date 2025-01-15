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
import ProtectedRoute from "./components/routes/ProtectedRoute";

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
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage
                  backgroundImage={backgroundImage}
                  userName={user?.email || "User"}
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
                <PlanningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preferences"
            element={
              <ProtectedRoute>
                <PreferencesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suggestions"
            element={
              <ProtectedRoute>
                <SuggestionsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/processing"
            element={
              <ProtectedRoute>
                <ProcessingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-trips"
            element={
              <ProtectedRoute>
                <MyTripsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/end"
            element={
              <ProtectedRoute>
                <EndScreenPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/processingstart"
            element={
              <ProtectedRoute>
                <ProcessingPageStart />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
