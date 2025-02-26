import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Popup from "../components/PopUp/PopUp";
import "../assets/styles/ProcessingPage.css";
import plane from "../assets/icons/Notifcation.svg";

// This Page is displayed when the user submits their preferences
// It shows a loading animation and a progress bar
// It is used to simulate the process of fetching and processing data
const ProcessingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bMatchGenerated = location.state?.bMatchGenerated || false;

  const handleOutsideClick = (e) => {
    if (e.target.className === "processing-container") {
      navigate("/");
    }
  };

  return (
    <div className="processing-page">
      <div className="processing-container" onClick={handleOutsideClick}>
        <div className="popup-wrapper">
          <Popup
            icon={plane}
            message="Thank you for your feedback."
            subMessage={
              bMatchGenerated
                ? "All preferences are set! Your perfect trip match has been generated. Check out your My Trips page to see the final match!"
                : "Your friends received a notification and were reminded to share their preferences for the upcoming trip. Come back later :)"
            }
            buttonText={
              bMatchGenerated ? "Go to My Trips" : "Go Back to Homepage"
            }
            onButtonClick={() => navigate(bMatchGenerated ? "/my-trips" : "/")}
          />
        </div>
      </div>
    </div>
  );
};

export default ProcessingPage;
