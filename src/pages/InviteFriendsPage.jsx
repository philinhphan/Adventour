import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTripContext } from "../context/TripContext"; // Import TripContext
import Button from "../components/Button/Button";
import "../assets/styles/InviteFriends.css";

// Import icons
import whatsapp from "../assets/icons/whatsapp.svg";
import Instagram from "../assets/icons/Instagram.svg";
import More from "../assets/icons/More.svg";
import Mail from "../assets/icons/Mail.svg";
import Telegram from "../assets/icons/Telegram.svg";
import LinkedIn from "../assets/icons/LinkedIn.svg";
import Snapchat from "../assets/icons/Snapchat.svg";
import TikTok from "../assets/icons/TikTok.svg";

const InviteFriendsPage = () => {
  const { tripData } = useTripContext(); // Access trip data from context
  const shareLink = "https://adventour-app.com/share";

  // Generate trip details for the custom message
  const tripName = tripData.tripDetails.name || "our amazing trip";
  const dateStart = tripData.tripDetails.dateStart || "unspecified start date";
  const dateEnd = tripData.tripDetails.dateEnd || "unspecified end date";
  const dateFlexibility =
    tripData.tripDetails.dateFlexibility === "flexible"
      ? "The trip date is flexible,"
      : `from ${dateStart} to ${dateEnd}`;
  const budget =
    tripData.tripDetails.budgetMin && tripData.tripDetails.budgetMax
      ? `with a budget range of €${tripData.tripDetails.budgetMin} - €${tripData.tripDetails.budgetMax}`
      : tripData.tripDetails.budgetMin
      ? `with a minimum budget of €${tripData.tripDetails.budgetMin}`
      : tripData.tripDetails.budgetMax
      ? `with a maximum budget of €${tripData.tripDetails.budgetMax}`
      : "with no specific budget inputted";

  const defaultMessage = `Hey my lovely friends! 💕\nLet's plan our amazing trip "${tripName}" ${dateFlexibility} ${budget}.\nCan’t wait to create unforgettable memories together! ✈️✨\nLet’s make this adventure one for the books! 🌍💖 Who’s in? 😍\nFollow the link to join:`;

  const [customMessage, setCustomMessage] = useState(defaultMessage);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Update the custom message whenever trip data changes
    setCustomMessage(defaultMessage);
  }, [defaultMessage]);

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

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(`${customMessage} ${shareLink}`);
    alert("Message copied to clipboard!"); // Alert user after copying
  };

  return (
    <div className="invite-friends-page">
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
              onClick={handleCopyMessage}
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
            <img
              alt="More"
              src={More}
              className="share-icon"
              onClick={() => setShowPopup(true)}
              style={{ cursor: "pointer" }}
            />
          </div>

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
