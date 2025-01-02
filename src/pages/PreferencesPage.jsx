import React, { useState } from "react";
import Slider from "react-slick";
import Navbar from "../components/Navbar/Navbar";
import Tile from "../components/Tile/Tile";
import "../assets/styles/Preferences.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";
import PreferenceCultural from "../assets/images/PreferenceCultural.png";
import PreferenceAdventure from "../assets/images/PreferenceAdventure.png";
import PreferenceLeisure from "../assets/images/PreferenceLeisure.png";
import PreferenceSports from "../assets/images/PreferenceSports.png";
import PreferenceNature from "../assets/images/PreferenceNature.png";
import WeatherCold from "../assets/images/WeatherCold.jpg";
import WeatherWarm from "../assets/images/WeatherWarm.jpg";
import WeatherMixed from "../assets/images/WeatherMixed.jpg";
import LocationUrban from "../assets/images/Urban.jpg";
import LocationBeach from "../assets/images/LocationBeach.jpg";
import LocationLeisure from "../assets/images/LocationLeisure.jpg";
import AccommodationHotel from "../assets/images/AccommodationHotel.jpg";
import AccommodationResort from "../assets/images/AccommodationResort.jpg";
import AccommodationAirBnB from "../assets/images/AccommodationAirBnB.jpg";
import AccommodationCamping from "../assets/images/AccommodationCamping.jpg";
;

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
              imageSrc={PreferenceCultural}
              onToggle={handleTileToggle}
            />
            <Tile
              label="Adventure"
              imageSrc={PreferenceAdventure}
              onToggle={handleTileToggle}
            />
            <Tile
              label="Leisure"
              imageSrc={PreferenceLeisure}
              onToggle={handleTileToggle}
            />
            <Tile
              label="Sports"
              imageSrc={PreferenceSports}
              onToggle={handleTileToggle}
            />
            <Tile
              label="Nature"
              imageSrc={PreferenceNature}
              onToggle={handleTileToggle}
            />
          </Slider>

          <h2>Weather</h2>
          <Slider {...sliderSettings}>
            <Tile
              label="Cold"
              imageSrc={WeatherCold}
              onToggle={handleTileToggle}
            />
            <Tile
              label="Warm"
              imageSrc={WeatherWarm}
              onToggle={handleTileToggle}
            />
            <Tile
              label="Mixed"
              imageSrc={WeatherMixed}
              onToggle={handleTileToggle}
            />
          </Slider>

          <h2>Location</h2>
          <Slider {...sliderSettings}>
            <Tile
              label="Urban"
              imageSrc={LocationUrban}
              onToggle={handleTileToggle}
            />
            <Tile
              label="Beach"
              imageSrc={LocationBeach}
              onToggle={handleTileToggle}
            />
            <Tile
              label="Leisure"
              imageSrc={LocationLeisure}
              onToggle={handleTileToggle}
            />
          </Slider>

             <h2>Accommodation</h2>
          <Slider {...sliderSettings}>
            <Tile
              label="Hotel"
              imageSrc={AccommodationHotel}
              onToggle={handleTileToggle}
            />
            <Tile
              label="Resort"
              imageSrc={AccommodationResort}
              onToggle={handleTileToggle}
            />
            <Tile
              label="AirBnB"
              imageSrc={AccommodationAirBnB}
              onToggle={handleTileToggle}
            />
            <Tile
              label="Camping"
              imageSrc={AccommodationCamping}
              onToggle={handleTileToggle}
            />
          </Slider>
          </div>
        </div>

         {/* Added fixed button container */}
      <div className="fixed-button-container">
        <button
          className="button button-primary"
          onClick={handleSavePreferences}
        >
          Save preferences
        </button>
      </div>
    </div>
  );
};

export default PreferencesPage;
