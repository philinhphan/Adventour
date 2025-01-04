import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import "../assets/styles/InviteFriends.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

import whatsapp from "../assets/images/whatsapp.svg";
import Instagram from "../assets/images/Instagram.svg";
import Airdrop from "../assets/images/Airdrop.svg";
import Mail from "../assets/images/Mail.svg";

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
        <p>Your AdvenTour Awaits!</p>
        <p>Invite your friends and plan the perfect trip together!</p>

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
            {/* TODO DESIGN: Add Icons */}
            <img alt="AirDrop" src={Airdrop}/>
            <img alt="WhatsApp" src={whatsapp}/>
            <img alt="Instagram" src={Instagram}/>
            <img alt="Mail" src={Mail}/>
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
