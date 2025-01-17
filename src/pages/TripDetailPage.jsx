import React from "react";
import Slider from "react-slick"; // For swipe functionality
import Navbar from "../components/Navbar/Navbar";
import "../assets/styles/TripDetailPage.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";
import nine from "../assets/images/Nine.jpg";
import ljota from "../assets/images/La-Llotja-1.webp";
import tribitz from "../assets/images/the-main-dining-area.jpg";

const TripDetailPage = ({ tripData }) => {
  const placeholderTrip = {
    name: "Barcelona, Spain",
    tags: ["sightseeing", "shopping", "beach", "nightlife", "water sport"],
    description:
      "Get ready to fall in love with Barcelona—a city that blends vibrant culture, stunning architecture, and Mediterranean charm. This trip will take you through the iconic Sagrada Familia, the whimsical wonders of Park Güell, and the winding streets of the Gothic Quarter. You’ll sip sangria by the beach, devour mouthwatering tapas, and soak up breathtaking views from Montjuïc Hill.",
    recommendations: {
      restaurants: [
        { name: "Nine", image: nine },
        { name: "La Lotja", image: ljota },
        { name: "El Tributz", image: tribitz },
      ],
      accommodations: [
        { name: "Mandarin Oriental", image: "path/to/accommodation1.jpg" },
        { name: "W Hotel", image: "path/to/accommodation2.jpg" },
        { name: "Hyatt Regency", image: "path/to/accommodation3.jpg" },
      ],
    },
    userPreferences: [
      { userName: "John", preferenceMatch: 100 },
      { userName: "Lisa", preferenceMatch: 97 },
      { userName: "Emma", preferenceMatch: 93 },
    ],
  };

  const trip = tripData || placeholderTrip;

  // Slider settings (same as PreferencesPage.jsx)
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
    <div className="trip-detail-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} />

      {/* Sticky header section */}
      <div className="sticky-header">
        <h1>{trip.name}</h1>
        <div className="trip-tags">
          {trip.tags.map((tag, index) => (
            <span key={index} className="trip-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="trip-detail-container">
        {/* Description */}
        <p className="trip-description">{trip.description}</p>

        {/* Recommendations */}
        <h2>Recommendations</h2>
        <div className="recommendations-section">
          {/* Restaurants */}
          <div className="recommendation-category">
            <h3>Restaurants</h3>
            <Slider {...sliderSettings}>
              {trip.recommendations.restaurants.map((restaurant, index) => (
                <div key={index} className="recommendation-tile">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="recommendation-image"
                  />
                  <p>{restaurant.name}</p>
                </div>
              ))}
            </Slider>
          </div>

          {/* Accommodations */}
          <div className="recommendation-category">
            <h3>Accommodations</h3>
            <Slider {...sliderSettings}>
              {trip.recommendations.accommodations.map((accommodation, index) => (
                <div key={index} className="recommendation-tile">
                  <img
                    src={accommodation.image}
                    alt={accommodation.name}
                    className="recommendation-image"
                  />
                  <p>{accommodation.name}</p>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* Balanced Preferences */}
        <h2>Balanced Preferences</h2>
        <div className="balanced-preferences">
          {trip.userPreferences.map((user, index) => (
            <div key={index} className="preference-item">
              <img
                src={`path/to/${user.userName.toLowerCase()}Profile.jpg`}
                alt={user.userName}
                className="profile-picture"
              />
              <div className="preference-bar-container">
                <div
                  className="preference-bar-fill"
                  style={{ width: `${user.preferenceMatch}%` }}
                ></div>
              </div>
              <p className="preference-percentage">{user.preferenceMatch}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;
