import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/FlightPopup.css";
import plane from "../assets/icons/planeIcon.svg";

const FlightPopup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Delay navigation until animation is complete
    const animationDuration = 5500; // Match this to the animation duration in CSS
    const timer = setTimeout(() => {
      navigate("/suggestions");
    }, animationDuration);

    return () => clearTimeout(timer); // Cleanup timeout on unmount
  }, [navigate]);

  return (
    <div className="processing-page">
      <div className="popup">
        <div className="processing-container">
          <div className="flight-popup-content">
            {/* Title and subtext */}
            <h2>Thank you for your preferences :)</h2>
            <p>
              It is just a quick moment before we whip up personalized
              suggestions to help you discover the perfect trip—easy, breezy,
              and fun!
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
      </div>
    </div>
  );
};

export default FlightPopup;
