import React, { useState, useEffect } from "react";
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
  const [isHidden, setIsHidden] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // Ensure new cards start unflipped
  useEffect(() => {
    setTimeout(() => setIsFlipped(false), 10); // Ensure state updates after render
  }, [suggestion]);

  const handleSwipe = (direction) => {
    if (!suggestion) {
      console.error("No suggestion provided!");
      return;
    }

    setSwipeDirection(direction);
    setButtonPressed(direction);

    setTimeout(() => {
      if (isLastCard) {
        setIsHidden(true);
        onLastSwipe(direction, suggestion);
      } else {
        setIsFlipped(false); // Reset flip AFTER swipe animation
        onSwipe(direction, suggestion);
      }

      setSwipeDirection(null);
      setButtonPressed(null);
    }, 1000);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev); // Toggle flip state
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("dislike"),
    onSwipedRight: () => handleSwipe("like"),
    onSwipedUp: () => handleSwipe("superlike"),
    onSwipedDown: () => handleSwipe("indifferent"),
  });

  if (isHidden || !suggestion) {
    return null;
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
              {suggestion.shortDescription && (
                <p className="card-shortDescription">
                  {suggestion.shortDescription}
                </p>
              )}
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
