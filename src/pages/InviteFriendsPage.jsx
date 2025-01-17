import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button/Button";
import "../assets/styles/InviteFriends.css";

/* import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg"; */

import whatsapp from "../assets/icons/whatsapp.svg";
import Instagram from "../assets/icons/Instagram.svg";
import More from "../assets/icons/More.svg";
import Mail from "../assets/icons/Mail.svg";
import Telegram from "../assets/icons/Telegram.svg";
import LinkedIn from "../assets/icons/LinkedIn.svg";
import Snapchat from "../assets/icons/Snapchat.svg";
import TikTok from "../assets/icons/TikTok.svg";

// **TODO** In the future, we have to generate uuids for trips and append them to the url
// With this id other users can then access trip information from firebase and join the trip

const InviteFriendsPage = () => {
  const shareLink = "https://adventour-app.com/share";
  const [customMessage, setCustomMessage] = useState(
    `Hey my lovely girls! 💕\nIt’s time to start planning our amazing trip! ✈️✨\nCan’t wait to create unforgettable memories together!\nLet’s make this adventure one for the books! 🌍💖\nWho’s in? 😍\n\nTo join our trip, follow the link:`
  );
  const [showPopup, setShowPopup] = useState(false);

  const handleWhatsAppShare = () => {
    const whatsappURL = `whatsapp://send?text=${encodeURIComponent(
      `${customMessage} ${shareLink}`
    )}`;
    window.open(whatsappURL, "_blank");
  };

  const handleMailShare = () => {
    const mailURL = `mailto:?subject=${encodeURIComponent(
      "Join our Adventure Trip!"
    )}&body=${encodeURIComponent(`${customMessage}\n\n${shareLink}`)}`;
    window.open(mailURL, "_self");
  };

  const handleTelegramShare = () => {
    const telegramURL = `https://t.me/share/url?url=${encodeURIComponent(
      shareLink
    )}&text=${encodeURIComponent(customMessage)}`;
    window.open(telegramURL, "_blank");
  };

  const handleLinkedInShare = () => {
    const linkedInURL = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
      shareLink
    )}&title=${encodeURIComponent(
      "Join our Adventure Trip!"
    )}&summary=${encodeURIComponent(customMessage)}`;
    window.open(linkedInURL, "_blank");
  };

  const handleSnapchatShare = () => {
    alert(
      "Snapchat sharing is not directly supported via web. Share manually!"
    );
  };

  const handleTikTokShare = () => {
    alert("TikTok sharing is not directly supported via web. Share manually!");
  };

  const navigate = useNavigate();

  return (
    <div className="invite-friends-page">
      {/* <Navbar logoSrc={logo} profilePicSrc={profil} /> */}
      <div className="invite-container">
        <h1>Do you want to invite friends?</h1>
        <h3>Your AdvenTour awaits!</h3>
        <p>
          Invite your friends and plan <br /> the perfect trip together!
        </p>
        <div className="share-section">
          <div className="share-input">
            <div className="custom-message-field">
              <textarea
                className="message-input"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
              />
              <div className="non-editable-link">
                <a href={shareLink} target="_blank" rel="noopener noreferrer">
                  {shareLink}
                </a>
              </div>
            </div>

            <Button
              label="Copy Message"
              styleType="secondary"
              onClick={() =>
                navigator.clipboard.writeText(`${customMessage} ${shareLink}`)
              }
            />
          </div>

          <div className="share-icons">
            <img
              alt="WhatsApp"
              src={whatsapp}
              className="share-icon"
              onClick={handleWhatsAppShare}
              style={{ cursor: "pointer" }}
            />
            <img
              alt="Instagram"
              src={Instagram}
              className="share-icon"
              onClick={() =>
                alert(
                  "Instagram doesn't allow direct sharing via web. Copy the message and share manually!"
                )
              }
              style={{ cursor: "pointer" }}
            />
            <img
              alt="Mail"
              src={Mail}
              className="share-icon"
              onClick={handleMailShare}
              style={{ cursor: "pointer" }}
            />
            {/* More Options Icon */}
            <img
              alt="More"
              src={More}
              className="share-icon"
              onClick={() => setShowPopup(true)}
              style={{ cursor: "pointer" }}
            />
          </div>

          {/* Popup Modal */}
          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <button
                  className="popup-close"
                  onClick={() => setShowPopup(false)}
                >
                  &times;
                </button>
                <h2>Further Options to share your great adventure!</h2>
                <div className="popup-options">
                  <div className="option" onClick={handleTelegramShare}>
                    <img
                      src={Telegram}
                      alt="Telegram"
                      className="option-icon"
                    />
                    <span>Telegram</span>
                  </div>
                  <div className="option" onClick={handleLinkedInShare}>
                    <img
                      src={LinkedIn}
                      alt="LinkedIn"
                      className="option-icon"
                    />
                    <span>LinkedIn</span>
                  </div>
                  <div className="option" onClick={handleSnapchatShare}>
                    <img
                      src={Snapchat}
                      alt="Snapchat"
                      className="option-icon"
                    />
                    <span>Snapchat</span>
                  </div>
                  <div className="option" onClick={handleTikTokShare}>
                    <img src={TikTok} alt="TikTok" className="option-icon" />
                    <span>TikTok</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="action-buttons">
          <Button label="Invite Friends later" styleType="secondary" />
          <Button
            label="Continue"
            styleType="primary"
            onClick={() => navigate("/preferences")}
          />
        </div>
      </div>
    </div>
  );
};

export default InviteFriendsPage;
