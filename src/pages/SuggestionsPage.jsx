import React, { useState } from "react";
import { useTripContext } from "../context/TripContext";
import { fetchPerfectMatch } from "../api/tripApi";
import Navbar from "../components/Navbar/Navbar";
import Card from "../components/TinderCard/Card";
import "../assets/styles/SuggestionsPage.css";
import { useNavigate } from "react-router-dom";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

const dummySuggestions = [
  {
    id: 1,
    name: "Barcelona, Spain",
    image: "https://via.placeholder.com/300x600",
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

const SuggestionsPage = () => {
  const { updateSwipeAnswers, savePerfectMatch } = useTripContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeAnswers, setSwipeAnswers] = useState([]);
  const navigate = useNavigate();

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

  const generatePerfectMatch = async () => {
    const simulatedFriendData = generateSimulatedFriendData();
    const requestData = {
      userSwipes: swipeAnswers,
      simulatedFriends: simulatedFriendData,
    };

    try {
      const perfectMatch = await fetchPerfectMatch(requestData);
      savePerfectMatch(perfectMatch); // Save to context
      console.log("API Perfect Match:", perfectMatch);
    } catch (error) {
      console.error("API fetch failed. Falling back to dummy data:", error);
      const fallbackPerfectMatch = dummySuggestions[0]; // Use the first dummy suggestion
      savePerfectMatch(fallbackPerfectMatch);
      console.log("Fallback Perfect Match:", fallbackPerfectMatch);
    }

    navigate("/processing");
  };

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
