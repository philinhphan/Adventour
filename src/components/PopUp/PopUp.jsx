import React from "react";
import "../../assets/styles/Popup.css";

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
