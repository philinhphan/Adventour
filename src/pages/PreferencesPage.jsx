import React, { useState } from "react";
import Slider from "react-slick";
import Navbar from "../components/Navbar/Navbar";
import Button from "../components/Button/Button";
import Tile from "../components/Tile/Tile";
import "../assets/styles/Preferences.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

// Preferences page component
const PreferencesPage = () => {
  const [preferences, setPreferences] = useState([]);

  // Handle tile toggle event to update preferences state based on user selection
  const handleTileToggle = (label, isSelected) => {
    setPreferences(
      (prev) =>
        isSelected
          ? [...prev, label] // Add to preferences
          : prev.filter((pref) => pref !== label) // Remove from preferences
    );
  };

  // Handle save preferences button click
  // TODO: @PhiLinh Do we need to save the preferences to a database before handing to AI API?
  // TODO: Alert is placeholder, replace with actual API call!
  const handleSavePreferences = () => {
    console.log("Saved Preferences:", preferences);
    alert("Preferences saved!");
  };

  // Slider settings for tile carousel display on preferences page (responsive)
  const sliderSettings = {
    dots: true,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 2,
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

        {/* TODO Design: Add all the options you want to display here with picture(png) and label. 
You can add as many categories and tiles as you want */}
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
