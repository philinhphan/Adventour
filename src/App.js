import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InviteFriendsPage from "./pages/InviteFriendsPage";
import PlanningPage from "./pages/PlanningPage";
import PreferencesPage from "./pages/PreferencesPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import FinalSuggestionsPage from "./pages/FinalSuggestionsPage";
import EndScreenPage from "./pages/EndScreenPage";

import backgroundImage from "./assets/images/background_homepage.jpg";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage backgroundImage={backgroundImage} userName="Lisa" />
            }
          />
          <Route path="/invite" element={<InviteFriendsPage />} />
          <Route path="/planning" element={<PlanningPage />} />
          <Route path="/preferences" element={<PreferencesPage />} />
          <Route path="/suggestions" element={<SuggestionsPage />} />
          <Route path="/final-suggestions" element={<FinalSuggestionsPage />} />
          <Route path="/end" element={<EndScreenPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
