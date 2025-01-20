import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import "../../assets/styles/Card.css";

// Importing button icons
import dislikeIcon from "../../assets/icons/dislike.svg";
import superlikeIcon from "../../assets/icons/superlike.svg";
import indifferentIcon from "../../assets/icons/indifferent.svg";
import likeIcon from "../../assets/icons/like.svg";

const Card = ({ suggestion, onSwipe, isLastCard, onLastSwipe }) => {
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(null);
  const [isHidden, setIsHidden] = useState(false); // State to hide the card
  const [isFlipped, setIsFlipped] = useState(false); // State to track flip

  const handleSwipe = (direction) => {
    if (!suggestion) {
      console.error("No suggestion provided!");
      return;
    }

    setSwipeDirection(direction);
    setButtonPressed(direction);

    // Trigger callback after animation with delay
    setTimeout(() => {
      if (isLastCard) {
        setIsHidden(true); // Hide the card immediately
        onLastSwipe(direction, suggestion); // Trigger last swipe callback
      } else {
        onSwipe(direction, suggestion);
      }
      setSwipeDirection(null); // Reset swipe direction after animation
      setButtonPressed(null); // Reset button state
    }, 1000); // Animation + delay (e.g., 1 second total)
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped); // Toggle the flip state
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("dislike"),
    onSwipedRight: () => handleSwipe("like"),
    onSwipedUp: () => handleSwipe("superlike"),
    onSwipedDown: () => handleSwipe("indifferent"),
  });

  if (isHidden || !suggestion) {
    return null; // Hide the card when `isHidden` is true
  }

  return (
    <div className="card-container">
      <div
        className={`card ${isFlipped ? "is-flipped" : ""} ${
          swipeDirection ? `swipe-${swipeDirection}` : ""
        }`}
        {...swipeHandlers}
      >
        {/* Front Side */}
        <div className="card-front" onClick={handleFlip}>
          <div className="card-image-container">
            <img
              src={suggestion.image}
              alt={suggestion.name}
              className="card-image"
            />
            <div className="card-gradient-overlay"></div>
            <div className="card-content">
              <h3 className="card-name">{suggestion.name}</h3>
              <div className="card-tags">
                {suggestion.tags.map((tag, index) => (
                  <span key={index} className="card-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="card-back" onClick={handleFlip}>
          <div className="card-image-container">
            <img
              src={suggestion.image}
              alt={suggestion.name}
              className="card-image"
            />
            <div className="card-back-content">
              <h3 className="card-back-title">{suggestion.name}</h3>
              <p className="card-back-text">{suggestion.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Buttons */}
      <div className="swipe-buttons">
        <button
          className={buttonPressed === "dislike" ? "button-pressed" : ""}
          onClick={() => handleSwipe("dislike")}
        >
          <img src={dislikeIcon} alt="Dislike" />
        </button>
        <button
          className={buttonPressed === "indifferent" ? "button-pressed" : ""}
          onClick={() => handleSwipe("indifferent")}
        >
          <img src={indifferentIcon} alt="Indifferent" />
        </button>
        <button
          className={buttonPressed === "superlike" ? "button-pressed" : ""}
          onClick={() => handleSwipe("superlike")}
        >
          <img src={superlikeIcon} alt="Superlike" />
        </button>
        <button
          className={buttonPressed === "like" ? "button-pressed" : ""}
          onClick={() => handleSwipe("like")}
        >
          <img src={likeIcon} alt="Like" />
        </button>
      </div>
    </div>
  );
};

export default Card;
