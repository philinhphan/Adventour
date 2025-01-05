import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../assets/styles/Popup.css"; // General popup styles
import "../assets/styles/FlightPopup.css"; // Specific airplane popup styles
import plane from "../assets/icons/planeIcon.svg";

const FlightPopup = () => {
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    // Navigate after 5 seconds
    const timer = setTimeout(() => {
      navigate("/suggestions");
    }, 5000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="popup">
      <div className="flight-popup-content">
        {/* Title and subtext */}
        <h2>Thank you for your preferences :)</h2>
        <p>
          It is just a quick moment before we whip up personalized suggestions
          to help you discover the perfect trip—easy, breezy, and fun!
        </p>

        {/* Airplane animation */}
        <div className="animation-wrapper">
          <img src={plane} alt="Flying airplane" className="plane-icon" />
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default FlightPopup;
