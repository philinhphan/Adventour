import React, { useState } from "react";
import { useTripContext } from "../context/TripContext";
import { fetchPerfectMatch } from "../api/tripApi";
import Card from "../components/TinderCard/Card";
import "../assets/styles/SuggestionsPage.css";
import { useNavigate } from "react-router-dom";
import { saveSuggestionsAndAnswers } from "../firebase/firebaseStore";

/* import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg"; */
import Barcelona from "../assets/images/Barceloan Dummy.jpg";

//TODO Smilla: SwipeButton stay big after click right now + for the last suggestion you dont see the animation anymore as is immediately goes to the processing page

// const dummySuggestions = [
//   {
//     id: 1,
//     name: "Barcelona, Spain",
//     image: Barcelona,
//     tags: ["sightseeing", "shopping", "beach"],
//     description: "Where culture meets coastline. Explore Gaudí’s wonders.",
//   },
//   {
//     id: 2,
//     name: "Miami, USA",
//     image: "https://via.placeholder.com/300x600",
//     tags: ["surfing", "shopping", "yachting"],
//     description:
//       "Dive into the glamour and experience Florida’s tropical vibes.",
//   },
//   {
//     id: 3,
//     name: "Kyoto, Japan",
//     image: "https://via.placeholder.com/300x600",
//     tags: ["temples", "nature", "tradition"],
//     description:
//       "A serene blend of ancient traditions and breathtaking landscapes.",
//   },
// ];

// Suggestions page component with swipe cards for user preferences.
const SuggestionsPage = ({ currentTripId, userId }) => {
  const { tripData, updateSwipeAnswers, savePerfectMatch } = useTripContext();
  const navigate = useNavigate();

  const suggestions = tripData.suggestions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeAnswers, setSwipeAnswers] = useState([]);

  const handleSwipe = (direction, suggestion) => {
    console.log(`Swiped ${direction} on ${suggestion.name}`);
    const newAnswer = {
      id: suggestion.id,
      name: suggestion.name,
      tags: suggestion.tags,
      description: suggestion.description,
      swipe: direction,
    };

    setSwipeAnswers((prev) => [...prev, newAnswer]);

    if (currentIndex < suggestions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log("No more suggestions. Processing final match...");
      updateSwipeAnswers([...swipeAnswers, newAnswer]);
      generatePerfectMatch([...swipeAnswers, newAnswer]);
    }
  };

  const generatePerfectMatch = async (allSwipeAnswers) => {
    const simulatedFriendData = generateSimulatedFriendData();
    const requestData = {
      userSwipes: allSwipeAnswers,
      simulatedFriends: simulatedFriendData,
    };

    try {
      const perfectMatch = await fetchPerfectMatch(requestData);
      savePerfectMatch(perfectMatch);
      console.log("Perfect Match:", perfectMatch);

      // Save suggestions and answers to Firestore
      await saveSuggestionsAndAnswers(currentTripId, userId, allSwipeAnswers);
    } catch (error) {
      console.error("Perfect Match Error:", error);
      const fallbackPerfectMatch = suggestions[0] || null;
      savePerfectMatch(fallbackPerfectMatch);

      // Save fallback data to Firestore
      await saveSuggestionsAndAnswers(currentTripId, userId, allSwipeAnswers);
      console.log("Fallback suggestions and answers saved in Firestore.");
    }
    navigate("/processing");
  };

  const generateSimulatedFriendData = () => {
    const friend1 = suggestions.map((s) => ({
      id: s.id,
      name: s.name,
      tags: s.tags,
      description: s.description,
      swipe: Math.random() > 0.5 ? "like" : "dislike",
    }));
    const friend2 = suggestions.map((s) => ({
      id: s.id,
      name: s.name,
      tags: s.tags,
      description: s.description,
      swipe: Math.random() > 0.5 ? "like" : "dislike",
    }));
    return { friend1, friend2 };
  };

  return (
    <div className="suggestions-page">
      { /* <Navbar logoSrc={logo} profilePicSrc={profil} /> */ }
      <div className="suggestions-container">
        {currentIndex < suggestions.length ? (
          <Card suggestion={suggestions[currentIndex]} onSwipe={handleSwipe} />
        ) : (
          <h2>No more suggestions</h2>
        )}
      </div>
    </div>
  );
};

export default SuggestionsPage;
