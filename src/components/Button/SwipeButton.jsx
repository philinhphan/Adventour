import React from "react";
import "../../assets/styles/SwipeButton.css";

// SwipeButton component, takes in icon, onClick function, and styleType.
// Default style type is "default".
// The icon is displayed inside the button.

const SwipeButton = ({ icon, onClick, styleType = "default" }) => {
  return (
    <button
      className={`swipe-button swipe-button-${styleType}`}
      onClick={onClick}
    >
      <img src={icon} alt="icon" className="swipe-button-icon" />
    </button>
  );
};

export default SwipeButton;
