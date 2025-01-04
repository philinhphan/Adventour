import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import SwipeButton from "../Button/SwipeButton";
import dislikeIcon from "../../assets/icons/dislike.svg";
import superlikeIcon from "../../assets/icons/superlike.svg";
import indifferentIcon from "../../assets/icons/indifferent.svg";
import likeIcon from "../../assets/icons/like.svg";
import "../../assets/styles/Card.css";

const Card = ({ suggestion, onSwipe }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSwipe = (direction) => {
    setSwipeDirection(direction); // Set the swipe direction
    console.log(`Place: ${suggestion.name}, Decision: ${direction}`);
    onSwipe(direction, suggestion);

    // Remove the swipe direction class after the animation completes
    setTimeout(() => {
      setSwipeDirection(null);
    }, 500); // Match the animation duration
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    onSwipedUp: () => handleSwipe("up"),
    onSwipedDown: () => handleSwipe("down"),
  });

  return (
    <div className="card-container">
      <div
        className={`card ${isFlipped ? "flipped" : ""} ${
          swipeDirection ? `swipe-${swipeDirection}` : ""
        }`}
        onClick={handleFlip}
        {...swipeHandlers}
      >
        {!isFlipped ? (
          <div className="card-front">
            <div className="card-overlay">
              <h3 className="card-name">{suggestion.name}</h3>
              <p className="card-tags">{suggestion.tags.join(", ")}</p>
            </div>
            <img
              src={suggestion.image}
              alt={suggestion.name}
              className="card-image"
            />
          </div>
        ) : (
          <div className="card-back">
            <h3>{suggestion.name}</h3>
            <p>{suggestion.description}</p>
          </div>
        )}
      </div>
      <div className="swipe-buttons">
        <SwipeButton
          icon={dislikeIcon}
          onClick={() => handleSwipe("left")}
          styleType="dislike"
        />
        <SwipeButton
          icon={superlikeIcon}
          onClick={() => handleSwipe("up")}
          styleType="superlike"
        />
        <SwipeButton
          icon={indifferentIcon}
          onClick={() => handleSwipe("down")}
          styleType="indifferent"
        />
        <SwipeButton
          icon={likeIcon}
          onClick={() => handleSwipe("right")}
          styleType="like"
        />
      </div>
    </div>
  );
};

export default Card;
