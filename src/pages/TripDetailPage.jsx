import React from "react";
import Navbar from "../components/Navbar/Navbar";
import "../assets/styles/TripDetailPage.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

const TripDetailPage = ({ tripData }) => {
  // Placeholder trip data until integrated with API
  const placeholderTrip = {
    name: "Barcelona, Spain",
    tags: ["sightseeing", "shopping", "beach", "nightlife", "water sport"],
    description:
      "Get ready to fall in love with Barcelona—a city that blends vibrant culture, stunning architecture, and Mediterranean charm. This trip will take you through the iconic Sagrada Familia, the whimsical wonders of Park Güell, and the winding streets of the Gothic Quarter. You’ll sip sangria by the beach, devour mouthwatering tapas, and soak up breathtaking views from Montjuïc Hill.",
    recommendations: {
      restaurants: [
        { name: "Nine", image: "path/to/restaurant1.jpg" },
        { name: "La Lotja", image: "path/to/restaurant2.jpg" },
        { name: "El Tributz", image: "path/to/restaurant3.jpg" },
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

  return (
    <div className="trip-detail-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} />

      <div className="trip-detail-container">
        <div className="trip-header">
          <h1>{trip.name}</h1>
          <div className="trip-tags">
            {trip.tags.map((tag, index) => (
              <span key={index} className="trip-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <p className="trip-description">{trip.description}</p>

        <h2>Recommendations</h2>
        <div className="recommendations-section">
          <div className="recommendation-category">
            <h3>Restaurants</h3>
            <div className="recommendation-items">
              {trip.recommendations.restaurants.map((restaurant, index) => (
                <div key={index} className="recommendation-item">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="recommendation-image"
                  />
                  <p>{restaurant.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="recommendation-category">
            <h3>Accommodations</h3>
            <div className="recommendation-items">
              {trip.recommendations.accommodations.map(
                (accommodation, index) => (
                  <div key={index} className="recommendation-item">
                    <img
                      src={accommodation.image}
                      alt={accommodation.name}
                      className="recommendation-image"
                    />
                    <p>{accommodation.name}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <h2>Balanced Preferences</h2>
        <div className="balanced-preferences">
          {trip.userPreferences.map((user, index) => (
            <div key={index} className="preference-bar">
              <p>{user.userName}</p>
              <div className="preference-bar-container">
                <div
                  className="preference-bar-fill"
                  style={{ width: `${user.preferenceMatch}%` }}
                ></div>
              </div>
              <span>{user.preferenceMatch}%</span>
            </div>
          ))}
        </div>

        <div className="premium-section">
          <h3>Detailed Travel Plan</h3>
          <p>
            This feature provides a fully optimized travel plan tailored to your
            preferences.
          </p>
          <button className="premium-button">Update to Premium</button>
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;
