import React, { useState } from "react";
import Slider from "react-slick";
import Navbar from "../components/Navbar/Navbar";
import Button from "../components/Button/Button";
import Tile from "../components/Tile/Tile";
import "../assets/styles/Preferences.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

const PreferencesPage = () => {
  const [preferences, setPreferences] = useState([]);

  const handleTileToggle = (label, isSelected) => {
    setPreferences(
      (prev) =>
        isSelected
          ? [...prev, label] // Add to preferences
          : prev.filter((pref) => pref !== label) // Remove from preferences
    );
  };

  const handleSavePreferences = () => {
    console.log("Saved Preferences:", preferences);
    alert("Preferences saved!");
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3, // Display three tiles at once
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // Adjust for smaller screens
        },
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 2, // Adjust for very small screens
        },
      },
    ],
  };

  return (
    <div className="preferences-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} />
      <div className="preferences-container">
        <h1>Select general preferences</h1>
        <p className="hint">
          You can select multiple options or leave everything blank if you have
          no specific preferences.
        </p>

        <div className="preferences-section">
          <h2>Activities</h2>
          <Slider {...sliderSettings}>
            <Tile
              label="Cultural"
              imageSrc="../assets/images/cultural.jpg"
              onToggle={handleTileToggle}
            />
            <Tile
              label="Adventure"
              imageSrc="../assets/images/adventure.jpg"
              onToggle={handleTileToggle}
            />
            <Tile
              label="Leisure"
              imageSrc="../assets/images/leisure.jpg"
              onToggle={handleTileToggle}
            />
            <Tile
              label="Sports"
              imageSrc="../assets/images/sports.jpg"
              onToggle={handleTileToggle}
            />
            <Tile
              label="Nature"
              imageSrc="../assets/images/nature.jpg"
              onToggle={handleTileToggle}
            />
          </Slider>

          <h2>Weather</h2>
          <Slider {...sliderSettings}>
            <Tile
              label="Cold"
              imageSrc="../assets/images/cold.jpg"
              onToggle={handleTileToggle}
            />
            <Tile
              label="Warm"
              imageSrc="../assets/images/warm.jpg"
              onToggle={handleTileToggle}
            />
            <Tile
              label="Mixed"
              imageSrc="../assets/images/mixed.jpg"
              onToggle={handleTileToggle}
            />
          </Slider>

          <h2>Location</h2>
          <Slider {...sliderSettings}>
            <Tile
              label="Urban"
              imageSrc="../assets/images/urban.jpg"
              onToggle={handleTileToggle}
            />
            <Tile
              label="Beach"
              imageSrc="../assets/images/beach.jpg"
              onToggle={handleTileToggle}
            />
            <Tile
              label="Leisure"
              imageSrc="../assets/images/leisure-location.jpg"
              onToggle={handleTileToggle}
            />
          </Slider>
        </div>

        <Button
          label="Save preferences"
          styleType="primary"
          onClick={handleSavePreferences}
        />
      </div>
    </div>
  );
};

export default PreferencesPage;
