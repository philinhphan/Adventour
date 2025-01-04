import React from "react";
import "../../assets/styles/SwipeButton.css";

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
