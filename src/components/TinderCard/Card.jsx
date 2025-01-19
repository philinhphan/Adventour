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
  const [buttonPressed, setButtonPressed] = useState(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSwipe = (direction) => {
    if (!suggestion) {
      console.error("No suggestion provided!");
      return;
    }

    setSwipeDirection(direction);

    setButtonPressed(direction);
    setTimeout(() => setButtonPressed(null), 200);

    setTimeout(() => {
      onSwipe(direction, suggestion);
      setSwipeDirection(null);
    }, 500);
  };

  const handleButtonClick = (direction) => {
    setButtonPressed(direction);
    setTimeout(() => setButtonPressed(null), 200);
    handleSwipe(direction);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("dislike"),
    onSwipedRight: () => handleSwipe("like"),
    onSwipedUp: () => handleSwipe("superlike"),
    onSwipedDown: () => handleSwipe("indifferent"),
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
            {/* Image */}
            <img
              src={suggestion.image}
              alt={suggestion.name}
              className="card-image"
            />

            {/* Gradient Overlay */}
            <div className="card-gradient-overlay"></div>

            {/* Front Content */}
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
              <p className="card-back-text">{suggestion.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Buttons */}
      <div className="swipe-buttons">
        <button
          className={buttonPressed === "dislike" ? "button-pressed" : ""}
          onClick={() => handleButtonClick("dislike")}
        >
          <img src={dislikeIcon} alt="Dislike" />
        </button>
        <button
          className={buttonPressed === "indifferent" ? "button-pressed" : ""}
          onClick={() => handleButtonClick("indifferent")}
        >
          <img src={indifferentIcon} alt="Indifferent" />
        </button>
        <button
          className={buttonPressed === "superlike" ? "button-pressed" : ""}
          onClick={() => handleButtonClick("superlike")}
        >
          <img src={superlikeIcon} alt="Superlike" />
        </button>
        <button
          className={buttonPressed === "like" ? "button-pressed" : ""}
          onClick={() => handleButtonClick("like")}
        >
          <img src={likeIcon} alt="Like" />
        </button>
      </div>
    </div>
  );
};

export default Card;
