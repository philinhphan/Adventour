import { React } from "react";

import Navbar from "../components/Navbar/Navbar";
import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

import "../assets/styles/FlightPopup.css";
import plane from "../assets/icons/planeIcon.svg";

const FlightPopup = () => {
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
