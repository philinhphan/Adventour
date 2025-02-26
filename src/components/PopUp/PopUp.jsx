import React from "react";
import "../../assets/styles/Popup.css";

// Popup component, displays a message, sub-message, icon, and an optional button.
// Props:
// - message: Main message to display
// - subMessage: Additional message to display
// - icon: Icon to display
// - buttonText: Text for the optional button
// - onButtonClick: Function to call when the button is clicked

const Popup = ({ message, subMessage, icon, buttonText, onButtonClick }) => {
  return (
    <div className="popup-content">
      <img src={icon} alt="icon" className="popup-icon" />
      <h2>{message}</h2>
      <p>{subMessage}</p>
      {buttonText && onButtonClick && (
        <button className="popup-button" onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Popup;
