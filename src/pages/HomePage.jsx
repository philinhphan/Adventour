import React, { useEffect, useState } from "react";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import "../assets/styles/HomePage.css";
import { getUserNotifications } from "../firebase/firebaseStore";

const HomePage = ({ backgroundImage, userName, userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;
    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications(userId);
        setNotifications(data);
        console.log("Notifications", data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  const navigate = useNavigate();

  // Handle start planning button click
  const handleStartPlanning = () => {
    navigate("/planning");
  };

  // Handle view trips button click
  const handleViewTrips = () => {
    navigate("/my-trips");
  };

  return (
    <div
      className="home-page"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="home-page-content">
        <h1>
          Welcome to <span className="highlight">AdvenTour,</span> {userName}.
        </h1>
        <div className="options">
          {/* Planning Tile */}
          <div className="options-tile">
            <h2>Planning</h2>
            <p>Your next AdvenTour awaits, start planning today!</p>
            <Button
              label="Start"
              styleType="primary"
              onClick={handleStartPlanning}
            />
          </div>

          {/* My Trips Tile with Notification Badge */}
          <div className="options-tile trips-tile">
            {notifications.length > 0 && (
              <div className="notification-badge">NEW</div>
            )}
            <h2>My Trips</h2>
            <p>
              All your AdvenTours captured, explore your trips and relive the
              magic!
            </p>
            <Button
              label="View"
              styleType="primary"
              onClick={handleViewTrips}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
