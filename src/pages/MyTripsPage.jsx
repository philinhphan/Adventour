import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "../assets/styles/MyTripsPage.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

const MyTripsPage = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with API or local storage retrieval
    setTrips([
      /*Example:{ id: 1, name: "Barcelona Adventure", date: "2025-01-05" }*/
    ]);
  }, []);

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
