import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Button from "../components/Button/Button";
import { useNavigate } from "react-router-dom";
import "../assets/styles/HomePage.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

// Home page component, takes in backgroundImage and userName.
const HomePage = ({ backgroundImage, userName }) => {
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
        backgroundImage: `url(${backgroundImage})`, // Set background image
      }}
    >
      {/* Navbar component */}
      <Navbar logoSrc={logo} profilePicSrc={profil} />
      <div className="home-page-content">
        <h1>
          Welcome to <span className="highlight">AdvenTour,</span> {userName}.
        </h1>
        <div className="tiles">
          <div className="tile">
            <h2>Planning</h2>
            <p>Your next AdvenTour awaits, start planning today!</p>
            {/* Button component */}
            <Button
              label="Start"
              styleType="primary"
              onClick={handleStartPlanning}
            />
          </div>
          <div className="tile">
            <h2>My Trips</h2>
            <p>
              All your AdvenTours captured, explore your trips and relive the
              magic!
            </p>
            {/* Button component */}
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
