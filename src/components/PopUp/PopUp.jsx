import React from "react";
import "../../assets/styles/Popup.css";

const Popup = ({ message, subMessage, icon }) => {
  return (
    <div className="popup-content">
      <img src={icon} alt="icon" className="popup-icon" />
      <h2>{message}</h2>
      <p>{subMessage}</p>
    </div>
  );
};

export default Popup;
