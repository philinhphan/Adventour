import { React, useState } from "react";
import { useTripContext } from "../context/TripContext";
import { fetchPerfectMatch } from "../api/tripApi";
import Card from "../components/TinderCard/Card";
import "../assets/styles/SuggestionsPage.css";
import { useNavigate } from "react-router-dom";
import {
  saveSuggestionsAndAnswers,
  updateTripWithPerfectMatch,
  checkAllUsersCompleted,
  notifyUsersOfPerfectMatch,
} from "../firebase/firebaseStore";

const SuggestionsPage = ({ currentTripId, userId }) => {
  const { tripData, updateSwipeAnswers } = useTripContext();
  const navigate = useNavigate();

  const suggestions = tripData.suggestions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeAnswers, setSwipeAnswers] = useState([]);

  const handleSwipe = async (direction, suggestion) => {
    console.log(`Swiped ${direction} on ${suggestion.name}`);
    const newAnswer = {
      id: suggestion.id,
      name: suggestion.name,
      tags: suggestion.tags,
      shortDescription: suggestion.shortDescription,
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

  const handleLastSwipe = (direction, suggestion) => {
    console.log(`Last swipe ${direction} on ${suggestion.name}`);
    const newAnswer = {
      id: suggestion.id,
      name: suggestion.name,
      tags: suggestion.tags,
      description: suggestion.description,
      swipe: direction,
    };

    updateSwipeAnswers([...swipeAnswers, newAnswer]);
    generatePerfectMatch([...swipeAnswers, newAnswer]);
  };

  const generatePerfectMatch = async (allSwipeAnswers) => {
    let success = false;
    let perfectMatch = null;

    try {
      await saveSuggestionsAndAnswers(currentTripId, userId, allSwipeAnswers);
    } catch (error) {
      console.error("Error saving swipe answers, retrying...", error);

      let retrySuccess = false;
      while (!retrySuccess) {
        try {
          await saveSuggestionsAndAnswers(
            currentTripId,
            userId,
            allSwipeAnswers
          );
          retrySuccess = true;
        } catch (retryError) {
          console.error("Retrying saveSuggestionsAndAnswers...", retryError);
        }
      }
    }

    let allUsersCompleted = await checkAllUsersCompleted(currentTripId);
    if (allUsersCompleted) {
      while (!success) {
        try {
          perfectMatch = await fetchPerfectMatch(currentTripId);

          await updateTripWithPerfectMatch(currentTripId, perfectMatch);
          console.log("Perfect Match:", perfectMatch);

          success = true;
        } catch (error) {
          console.error("Error fetching Perfect Match, retrying...", error);
        }
      }
      success = false;
      while (!success) {
        try {
          await notifyUsersOfPerfectMatch(currentTripId);
          console.log("Notified all users of Perfect Match");
          success = true;
        } catch (error) {
          console.error(
            "Error notifying users of Perfect Match, retrying...",
            error
          );
        }
      }
    }

    navigate("/processing");
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
            isVisible={index === currentIndex} // Only show the topmost card
          />
        ))}
      </div>
    </div>
  );
};

export default SuggestionsPage;
