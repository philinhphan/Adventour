import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTripContext } from "../context/TripContext";
import Card from "../components/TinderCard/Card";
import "../assets/styles/SuggestionsPage.css";
import {
  saveSuggestionsAndAnswers,
  updateTripWithPerfectMatch,
  checkAllUsersCompleted,
  notifyUsersOfPerfectMatch,
} from "../firebase/firebaseStore";
import { fetchPerfectMatch } from "../api/tripApi";

const SuggestionsPage = ({ currentTripId, userId }) => {
  const { tripData, updateSwipeAnswers } = useTripContext();
  const navigate = useNavigate();

  const suggestions = tripData.suggestions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeAnswers, setSwipeAnswers] = useState([]);

  const handleSwipe = async (direction, suggestion) => {
    const newAnswer = {
      id: suggestion.id,
      name: suggestion.name,
      tags: suggestion.tags,
      shortDescription: suggestion.shortDescription,
      description: suggestion.description,
      swipe: direction,
    };

    const updatedSwipeAnswers = [...swipeAnswers, newAnswer];
    setSwipeAnswers(updatedSwipeAnswers);

    if (currentIndex < suggestions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      updateSwipeAnswers(updatedSwipeAnswers);
      generatePerfectMatch(updatedSwipeAnswers);
    }
  };

  const handleLastSwipe = (direction, suggestion) => {
    const newAnswer = {
      id: suggestion.id,
      name: suggestion.name,
      tags: suggestion.tags,
      description: suggestion.description,
      swipe: direction,
    };

    const updatedSwipeAnswers = [...swipeAnswers, newAnswer];
    updateSwipeAnswers(updatedSwipeAnswers);
    generatePerfectMatch(updatedSwipeAnswers);
  };

  const generatePerfectMatch = async (allSwipeAnswers) => {
    try {
      await saveSuggestionsAndAnswers(currentTripId, userId, allSwipeAnswers);

      const allUsersCompleted = await checkAllUsersCompleted(currentTripId);
      if (allUsersCompleted) {
        let success = false;
        while (!success) {
          try {
            const perfectMatch = await fetchPerfectMatch(currentTripId);
            await updateTripWithPerfectMatch(currentTripId, perfectMatch);
            await notifyUsersOfPerfectMatch(currentTripId);
            success = true;
          } catch (error) {
            console.error("Error fetching Perfect Match, retrying...", error);
          }
        }
      }

      navigate("/processing", {
        state: { bMatchGenerated: allUsersCompleted },
      });
    } catch (error) {
      console.error("Error saving swipe answers, retrying...", error);
      generatePerfectMatch(allSwipeAnswers);
    }
  };

  return (
    <div className="suggestions-page">
      <div className="suggestions-container">
        {suggestions.map((suggestion, index) => (
          <Card
            key={suggestion.id}
            suggestion={suggestion}
            onSwipe={handleSwipe}
            isLastCard={index === suggestions.length - 1}
            onLastSwipe={handleLastSwipe}
            isVisible={index === currentIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestionsPage;
