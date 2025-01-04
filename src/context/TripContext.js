import React, { createContext, useState, useContext } from "react";

const TripContext = createContext();

export const TripProvider = ({ children }) => {
  const [tripData, setTripData] = useState({
    tripDetails: {}, // Stores trip details (e.g., name, date, budget)
    preferences: [], // Stores user preferences (e.g., activities, weather)
    swipeAnswers: [], // Stores user swipes with suggestion IDs
    perfectMatch: null, // Stores the final perfect match suggestion
  });

  const updateTripDetails = (details) => {
    setTripData((prev) => ({ ...prev, tripDetails: details }));
  };

  const updatePreferences = (prefs) => {
    setTripData((prev) => ({ ...prev, preferences: prefs }));
  };

  const updateSwipeAnswers = (answers) => {
    setTripData((prev) => ({ ...prev, swipeAnswers: answers }));
  };

  const savePerfectMatch = (match) => {
    setTripData((prev) => ({ ...prev, perfectMatch: match }));
  };

  return (
    <TripContext.Provider
      value={{
        tripData,
        updateTripDetails,
        updatePreferences,
        updateSwipeAnswers,
        savePerfectMatch,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => useContext(TripContext);