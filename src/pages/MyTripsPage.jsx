import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "../assets/styles/MyTripsPage.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

// My Trips page component
const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  // Fetch trips from API or local storage
  // TODO @PhiLinh - Replace with API or local storage retrieval
  useEffect(() => {
    // TODO: Replace with API or local storage retrieval
    setTrips([
      /*Example:{ id: 1, name: "Barcelona Adventure", date: "2025-01-05" }*/
    ]);
  }, []);

  // Handle trip click event to navigate to trip detail page
  // TODO @Smilla - Implement navigation to trip detail page and the trip detail page component
  const handleTripClick = (tripId) => {
    navigate(`/trip-detail/${tripId}`);
  };

  return (
    <div className="my-trips-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} />
      <div className="trips-container">
        <h1>My Trips</h1>
        {trips.length > 0 ? (
          <ul className="trip-list">
            {trips.map((trip) => (
              <li key={trip.id} onClick={() => handleTripClick(trip.id)}>
                <h3>{trip.name}</h3>
                <p>{trip.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No trips planned yet. Start planning your next adventure!</p>
        )}
      </div>
    </div>
  );
};

export default MyTripsPage;
