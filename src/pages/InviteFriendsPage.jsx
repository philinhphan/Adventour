import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import "../assets/styles/InviteFriends.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

import share from "../assets/icons/Share.svg";
import whatsapp from "../assets/icons/whatsapp.svg";
import Instagram from "../assets/icons/Instagram.svg";
import More from "../assets/icons/More.svg";
import Mail from "../assets/icons/Mail.svg";

//TODO Design: Rework the styling for this page. There are some issues with the layout and spacing. Also it looks really empty

// Invite friends page component
const InviteFriendsPage = () => {
  const shareLink = "https://adventour-app.com/share";

  // Handle copy link button click
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };

  // Use navigate hook to navigate to preferences page
  const navigate = useNavigate();
  const handleContinue = () => {
    navigate("/preferences");
  };

  //TODO: Do we need the continue Button?

  return (
    <div className="invite-friends-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} />
      <div className="invite-container">
        <h1>Do you want to invite friends?</h1>
        <img alt="Share" src={share} className="share-icon"/>
        <h3>Your AdvenTour awaits!</h3>
        <p>Invite your friends and plan <br /> the perfect trip together!</p>
        <div className="share-section">
          <div className="share-input">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="link-field"
            />
            <Button
              label="Copy Link"
              styleType="secondary"
              onClick={handleCopyLink}
            />
          </div>

          <div className="share-icons">
            <img alt="More" src={More} />
            <img alt="WhatsApp" src={whatsapp} />
            <img alt="Instagram" src={Instagram} />
            <img alt="Mail" src={Mail} />
          </div>
        </div>
        <div className="action-buttons">
          <Button label="Invite Friends later" styleType="secondary" />
          <Button
            label="Continue"
            styleType="primary"
            onClick={handleContinue}
          />
        </div>
      </div>
    </div>
  );
};

export default InviteFriendsPage;
