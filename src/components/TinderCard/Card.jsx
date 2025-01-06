import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import "../../assets/styles/Card.css";

// Importing button icons
import dislikeIcon from "../../assets/icons/dislike.svg";
import superlikeIcon from "../../assets/icons/superlike.svg";
import indifferentIcon from "../../assets/icons/indifferent.svg";
import likeIcon from "../../assets/icons/like.svg";

const Card = ({ suggestion, onSwipe }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [buttonPressed, setButtonPressed] = useState(null); // Track which button is pressed

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSwipe = (direction) => {
    if (!suggestion) {
      console.error("No suggestion provided!");
      return;
    }

    setSwipeDirection(direction);

    // Highlight the corresponding button briefly for swipe animation
    setButtonPressed(direction);
    setTimeout(() => setButtonPressed(null), 200);

    // Notify parent about the swipe direction and suggestion
    setTimeout(() => {
      onSwipe(direction, suggestion);
      setSwipeDirection(null); // Reset swipe direction
    }, 500); // Matches the swipe animation duration
  };

  const handleButtonClick = (direction) => {
    // Highlight the button briefly for click animation
    setButtonPressed(direction);
    setTimeout(() => setButtonPressed(null), 200);

    // Trigger swipe logic
    handleSwipe(direction);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    onSwipedUp: () => handleSwipe("up"),
    onSwipedDown: () => handleSwipe("down"),
  });

  if (!suggestion) {
    return <div>No suggestion available</div>;
  }

  return (
    <div className="card-container">
      <div
        className={`card ${swipeDirection ? `swipe-${swipeDirection}` : ""} ${
          isFlipped ? "is-flipped" : ""
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
              className="card-image card-image-darkened"
            />
            <div className="card-back-content">
              <h3 className="card-back-title">{suggestion.name}</h3>
              <p className="card-back-text">{suggestion.details}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Buttons */}
      <div className="swipe-buttons">
        <button
          className={buttonPressed === "left" ? "button-pressed" : ""}
          onClick={() => handleButtonClick("left")}
        >
          <img src={dislikeIcon} alt="Dislike" />
        </button>
        <button
          className={buttonPressed === "down" ? "button-pressed" : ""}
          onClick={() => handleButtonClick("down")}
        >
          <img src={indifferentIcon} alt="Indifferent" />
        </button>
        <button
          className={buttonPressed === "up" ? "button-pressed" : ""}
          onClick={() => handleButtonClick("up")}
        >
          <img src={superlikeIcon} alt="Superlike" />
        </button>
        <button
          className={buttonPressed === "right" ? "button-pressed" : ""}
          onClick={() => handleButtonClick("right")}
        >
          <img src={likeIcon} alt="Like" />
        </button>
      </div>
    </div>
  );
};

export default Card;
