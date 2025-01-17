import React, { useState } from "react";
import Slider from "react-slick";
import Navbar from "../components/Navbar/Navbar";
import Tile from "../components/Tile/Tile";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Preferences.css";

import { useTripContext } from "../context/TripContext";
import { fetchSwipeSuggestions } from "../api/tripApi";
import { savePreferences } from "../firebase/firebaseStore";

//TODO Design: Find better solution for image imports
/* import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg"; */
import PreferenceCultural from "../assets/images/PreferenceCultural.jpg";
import PreferenceAdventure from "../assets/images/PreferenceAdventure.jpg";
import PreferenceLeisure from "../assets/images/PreferenceLeisure.jpg";
import PreferenceSports from "../assets/images/PreferenceSports.jpg";
import PreferenceNature from "../assets/images/PreferenceNature.jpg";
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

// Preferences page component
const PreferencesPage = ({ currentTripId, userId }) => {
  const [preferences, setPreferences] = useState([]);
  const navigate = useNavigate();
  const { tripData, updatePreferences, updateSuggestions } = useTripContext();

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
  const handleSavePreferences = async () => {
    navigate("/processingstart");
    try {
      // Save preferences to Firestore
      await savePreferences(currentTripId, userId, preferences);

      // Navigate to the processing page
      navigate("/processingstart");
    } catch (error) {
      alert("Error saving preferences.");
      console.error("Error saving preferences:", error);
    }
    updatePreferences(preferences); // Update context with preferences
    try {
      // 1) Fetch suggestions from Perplexity
      const rawSuggestions = await fetchSwipeSuggestions(
        tripData.tripDetails,
        preferences
      );

      // 2) Transform them: add 'id' and 'image' for each
      const suggestionsWithExtras = rawSuggestions.map((s, idx) => ({
        id: idx + 1, // or use a unique ID approach if desired
        name: s.name,
        image: "https://via.placeholder.com/300x600", // fixed placeholder
        tags: s.tags,
        description: s.description,
      }));

      // 3) Store them in our global context
      updateSuggestions(suggestionsWithExtras);
      console.log("Suggestions stored:", suggestionsWithExtras);

      // 4) Navigate to the Suggestions Page
      navigate("/suggestions");
    } catch (error) {
      alert("Error fetching suggestions.");
      console.error("Error fetching suggestions:", error);
    }
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
      { /* <Navbar logoSrc={logo} profilePicSrc={profil} /> */ }
      <div className="preferences-container">
        <h1>Select general preferences</h1>
        <p className="hint">
          You can select multiple options or leave everything blank if you have
          no specific preferences.
        </p>

        {/* TODO Design: Add all the options you want to display here with picture(jpg) and label. You can add as many categories and tiles as you want */}
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
