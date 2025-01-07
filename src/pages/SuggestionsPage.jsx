import React, { useState } from "react";
import { useTripContext } from "../context/TripContext";
import { fetchPerfectMatch } from "../api/tripApi";
import Navbar from "../components/Navbar/Navbar";
import Card from "../components/TinderCard/Card";
import "../assets/styles/SuggestionsPage.css";
import { useNavigate } from "react-router-dom";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";
import Barcelona from "../assets/images/Barceloan Dummy.webp"

//TODO Smilla: SwipeButton stay big after click right now + for the last suggestion you dont see the animation anymore as is immediately goes to the processing page
// Dummy data for suggestions, replace with API call!
const dummySuggestions = [
  {
    id: 1,
    name: "Barcelona, Spain",
    image: Barcelona,
    tags: ["sightseeing", "shopping", "beach"],
    description: "Where culture meets coastline. Explore Gaudí’s wonders.",
  },
  {
    id: 2,
    name: "Miami, USA",
    image: "https://via.placeholder.com/300x600",
    tags: ["surfing", "shopping", "yachting"],
    description:
      "Dive into the glamour and experience Florida’s tropical vibes.",
  },
  {
    id: 3,
    name: "Kyoto, Japan",
    image: "https://via.placeholder.com/300x600",
    tags: ["temples", "nature", "tradition"],
    description:
      "A serene blend of ancient traditions and breathtaking landscapes.",
  },
];

// Suggestions page component with swipe cards for user preferences.
const SuggestionsPage = () => {
  const { updateSwipeAnswers, savePerfectMatch } = useTripContext(); // Context
  const [currentIndex, setCurrentIndex] = useState(0); // Index of current suggestion
  const [swipeAnswers, setSwipeAnswers] = useState([]); // User swipe answers
  const navigate = useNavigate();

  // Handle swipe event on card and update swipe answers
  // TODO add trip name to newAnswer?
  const handleSwipe = (direction, suggestion) => {
    console.log(`Swiped ${direction} on ${suggestion.name}`);
    const newAnswer = { id: suggestion.id, swipe: direction };
    setSwipeAnswers((prev) => [...prev, newAnswer]);

    if (currentIndex < dummySuggestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log("No more suggestions. Processing final match...");
      updateSwipeAnswers([...swipeAnswers, newAnswer]);
      generatePerfectMatch();
    }
  };

  // Generate perfect match based on user swipes and simulated friends
  // TODO PhiLinh: Replace with API call to fetch perfect match based on user swipes and preferences @PhiLinh
  const generatePerfectMatch = async () => {
    const simulatedFriendData = generateSimulatedFriendData();
    const requestData = {
      userSwipes: swipeAnswers,
      simulatedFriends: simulatedFriendData,
    };
    // TODO: fetchPerfectMatch function is not implemented yet in tripApi.js @PhiLinh
    try {
      const perfectMatch = await fetchPerfectMatch(requestData);
      savePerfectMatch(perfectMatch); // Save to context
      console.log("API Perfect Match:", perfectMatch);
    } catch (error) {
      // Fallback to dummy data if API fetch fails (for demo purposes)
      console.error("API fetch failed. Falling back to dummy data:", error);
      const fallbackPerfectMatch = dummySuggestions[0]; // Use the first dummy suggestion
      savePerfectMatch(fallbackPerfectMatch);
      console.log("Fallback Perfect Match:", fallbackPerfectMatch);
    }

    navigate("/processing");
  };

  // Generate simulated friend swipe data for testing
  // Maybe we can replace this with real user data later?
  // TODO add trip name to friend data?
  const generateSimulatedFriendData = () => {
    const friend1 = dummySuggestions.map((s) => ({
      id: s.id,
      swipe: Math.random() > 0.5 ? "right" : "left",
    }));
    const friend2 = dummySuggestions.map((s) => ({
      id: s.id,
      swipe: Math.random() > 0.5 ? "right" : "up",
    }));
    return { friend1, friend2 };
  };

  return (
    <div className="suggestions-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} />
      <div className="suggestions-container">
        {currentIndex < dummySuggestions.length ? (
          <Card
            suggestion={dummySuggestions[currentIndex]}
            onSwipe={handleSwipe}
          />
        ) : (
          <h2>No more suggestions</h2>
        )}
      </div>
    </div>
  );
};

export default SuggestionsPage;
