import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import "../assets/styles/InviteFriends.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

const InviteFriendsPage = () => {
  const shareLink = "https://adventour-app.com/share";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };

  const navigate = useNavigate();
  const handleContinue = () => {
    navigate("/preferences"); // Example: Navigate to the next page
  };

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
            {/* TODO: Add Icons */}
            <img src="../assets/icons/airdrop.png" alt="AirDrop" />
            <img src="../assets/icons/whatsapp.png" alt="WhatsApp" />
            <img src="../assets/icons/instagram.png" alt="Instagram" />
            <img src="../assets/icons/mail.png" alt="Mail" />
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
