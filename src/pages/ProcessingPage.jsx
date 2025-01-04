import React from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../components/PopUp/PopUp";
import Navbar from "../components/Navbar/Navbar";
import "../assets/styles/ProcessingPage.css";
import plane from "../assets/icons/planeIcon.svg";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

//TODO Design: Rework the styling for this page. There are some issues with the layout and spacing. Also it looks really empty
// Processing page component
const ProcessingPage = () => {
  const navigate = useNavigate();

  // Handle outside click to navigate back to home page
  const handleOutsideClick = (e) => {
    if (e.target.className === "processing-container") {
      navigate("/");
    }
  };

  return (
    <div className="processing-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} />
      <div className="processing-container" onClick={handleOutsideClick}>
        <div className="popup-wrapper">
          <Popup
            message="Thank you for your feedback."
            subMessage="Your friends received a notification and were reminded to share their preferences for the upcoming trip. Come back later :)"
            icon={plane}
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;
