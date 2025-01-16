import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { getUserTrips, queryUsersByTrip } from "../firebase/firebaseStore"; // Import helper functions
import "../assets/styles/MyTripsPage.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

const MyTripsPage = ({ userId, setCurrentTripId }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      if (!userId) {
        console.warn("No userId provided. Unable to fetch trips.");
        setLoading(false);
        return;
      }

      try {
        const userTrips = await getUserTrips(userId);

        // Fetch users for trips without `b_finalized: true`
        const enrichedTrips = await Promise.all(
          userTrips.map(async (trip) => {
            if (!trip.b_finalized) {
              const users = await queryUsersByTrip(trip.id);

              const userDetails = users.map((user) => {
                const hasPreferences = trip.preferences?.some(
                  (pref) => pref.creatorId === user.id
                );
                const hasSuggestions = trip.suggestions?.some(
                  (suggestion) => suggestion.creatorId === user.id
                );

                return {
                  id: user.id,
                  name: user.name,
                  hasPreferences,
                  hasSuggestions,
                };
              });

              return { ...trip, userDetails };
            }

            return trip;
          })
        );

        setTrips(enrichedTrips);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user trips:", error);
        setLoading(false);
      }
    };

    fetchTrips();
  }, [userId]);

  const handleTripClick = (trip) => {
    setCurrentTripId(trip.id);

    const currentUser = trip.userDetails?.find((user) => user.id === userId);

    if (currentUser) {
      if (!currentUser.hasPreferences) {
        navigate("/preferences");
      } else if (!currentUser.hasSuggestions) {
        navigate("/suggestions");
      } else {
        navigate(`/trip-detail/${trip.id}`);
      }
    } else {
      console.warn("User not associated with this trip.");
    }
  };

  return (
    <div className="my-trips-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} />
      <div className="trips-container">
        <h1>My Trips</h1>
        {loading ? (
          <p>Loading your trips...</p>
        ) : trips.length > 0 ? (
          <ul className="trip-list">
            {trips.map((trip) => (
              <li key={trip.id} onClick={() => handleTripClick(trip)}>
                <h3>{trip.name}</h3>
                <p>
                  Start:{" "}
                  {trip.details?.start_date
                    ? new Date(
                        trip.details.start_date.toDate()
                      ).toLocaleDateString()
                    : "No start date"}
                </p>
                <p>
                  End:{" "}
                  {trip.details?.end_date
                    ? new Date(
                        trip.details.end_date.toDate()
                      ).toLocaleDateString()
                    : "No end date"}
                </p>

                {trip.userDetails && (
                  <div className="trip-users">
                    <h4>Users:</h4>
                    <ul>
                      {trip.userDetails.map((user) => (
                        <li
                          key={user.id}
                          className={
                            user.hasPreferences && user.hasSuggestions
                              ? ""
                              : "grayed-out"
                          }
                        >
                          {user.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-trips-message">
            No trips planned yet. Start planning your next adventure!
          </p>
        )}
      </div>
    </div>
  );
};

export default MyTripsPage;
