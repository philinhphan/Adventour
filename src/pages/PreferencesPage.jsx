import React, { useState } from "react";
import Slider from "react-slick";
import Tile from "../components/Tile/Tile";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Preferences.css";
import Navbar from "../components/Navbar/Navbar";
import { useTripContext } from "../context/TripContext";
import { fetchSwipeSuggestions } from "../api/tripApi";
import { savePreferences } from "../firebase/firebaseStore";

// Image imports
import logo from "../assets/images/AdventourLogo.svg";
// import profil from "../assets/images/LisaProfil.jpg";
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

const PreferencesPage = ({ currentTripId, userId }) => {
  const [preferences, setPreferences] = useState([]);
  const navigate = useNavigate();
  const { tripData, updatePreferences, updateSuggestions } = useTripContext();

  const handleTileToggle = (label, isSelected) => {
    setPreferences((prev) =>
      isSelected ? [...prev, label] : prev.filter((pref) => pref !== label)
    );
  };

  /**
   * Helper to get the best matching image from Pexels for the given query.
   * Returns a fallback placeholder if no match is found or if an error occurs.
   */
  // Possible TODO: update query: 'travel' or other keywords can yield more relevant travel images
  const fetchPexelsImage = async (query) => {
    try {
      const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=1`; // We only want the top match
      const response = await fetch(url, {
        headers: {
          Authorization: process.env.REACT_APP_PEXELS_API_KEY, // stored in .env
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from Pexels");
      }

      const data = await response.json();
      // Return the 'large' image if we have results, else fallback to placeholder
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.large2x || data.photos[0].src.large;
      }
      return "https://via.placeholder.com/300x600"; // fallback TODO: update placeholder image with good one
    } catch (error) {
      console.error("Pexels API error:", error);
      return "https://via.placeholder.com/300x600"; // fallback TODO: update placeholder image with good one
    }
  };

  const handleSavePreferences = async () => {
    navigate("/flight-popup");
    try {
      await savePreferences(currentTripId, userId, preferences);
      updatePreferences(preferences);

      let success = false;
      let suggestionsWithExtras = [];

      while (!success) {
        try {
          const rawSuggestions = await fetchSwipeSuggestions(
            tripData.tripDetails,
            preferences
          );

          suggestionsWithExtras = await Promise.all(
            rawSuggestions.map(async (s, idx) => {
              const imageUrl = await fetchPexelsImage(s.name + "landscape tourism");
              return {
                id: idx + 1,
                name: s.name,
                image: imageUrl,
                tags: s.tags,
                shortDescription: s.shortDescription,
                description: s.description,
              };
            })
          );

          success = true;
        } catch (error) {
          console.error("Error fetching suggestions, retrying...", error);
        }
      }

      updateSuggestions(suggestionsWithExtras);
      navigate("/suggestions");
    } catch (error) {
      alert("Error saving preferences.");
      console.error("Error saving preferences:", error);
    }
  };

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
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="preferences-page">
      <Navbar logoSrc={logo} profilePicSrc={profilePic} background="white" />
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
