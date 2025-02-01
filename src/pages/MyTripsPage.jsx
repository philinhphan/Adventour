import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserTrips,
  queryUsersByTrip,
  deleteTrip,
} from "../firebase/firebaseStore";
import { fetchPerfectMatch } from "../api/tripApi";
import { useTripContext } from "../context/TripContext";
import "../assets/styles/MyTripsPage.css";
import barcelona from "../assets/images/barcelona.jpg";
import Navbar from "../components/Navbar/Navbar";
import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

const MyTripsPage = ({ userId, setCurrentTripId }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { savePerfectMatch } = useTripContext();

  useEffect(() => {
    const fetchTrips = async () => {
      if (!userId) {
        console.warn("No userId provided. Unable to fetch trips.");
        setLoading(false);
        return;
      }

      try {
        const userTrips = await getUserTrips(userId);

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

              const allUsersCompleted = userDetails.every(
                (user) => user.hasPreferences && user.hasSuggestions
              );

              return { ...trip, userDetails, allUsersCompleted };
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
    // Check if the current user has completed their preferences and swipes
    const currentUser = trip.userDetails?.find((user) => user.id === userId);

    // If the user has completed their preferences and swipes but the trip is not finalized, show an alert
    if (
      currentUser?.hasPreferences &&
      currentUser?.hasSuggestions &&
      !trip.allUsersCompleted
    ) {
      alert("Your friends are not ready yet. Come back later!");
      return;
    }

    // If the perfect match is generated, navigate to the trip detail page
    if (trip.perfectMatch) {
      setCurrentTripId(trip.id);
      navigate(`/trip-detail/${trip.id}`);
      return;
    }

    // Standard navigation logic for users who haven't completed their inputs yet
    if (currentUser) {
      if (!currentUser.hasPreferences) {
        navigate("/preferences");
      } else if (!currentUser.hasSuggestions) {
        navigate("/suggestions");
      }
    } else {
      console.warn("User not associated with this trip.");
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await deleteTrip(tripId);
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  return (
    <div className="my-trips-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} background="white" />
      <div className="trip-header">
        <h1>Overview of my Trips.</h1> {/* NEU */}
        <p>
          Let’s relive the unique magic of your adventures. Whether it’s
          exploring new destinations or revisiting old favorites.
        </p>{" "}
        {/* NEU */}
      </div>

      <div className="trips-container">
        <h3>My Trips</h3>
        {loading ? (
          <p>Loading your trips...</p>
        ) : trips.length > 0 ? (
          <ul className="trip-list">
            {trips.map((trip) => {
              const isMatchReady = !!trip.perfectMatch;

              return (
                <li
                  key={trip.id}
                  className={`trip-box ${
                    isMatchReady ? "trip-ready" : "trip-pending"
                  }`}
                  onClick={() => handleTripClick(trip)}
                >
                  <div className="trip-details">
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTrip(trip.id);
                      }}
                    >
                      ⛌
                    </button>
                    <img
                      src={
                        trip.perfectMatch
                          ? trip.perfectMatch.backgroundImage
                          : barcelona
                      }
                      alt="Trip Destination"
                    />
                    <div className="trip-title-section">
                      {isMatchReady ? (
                        <>
                          <h2 className="trip-destination">
                            {trip.perfectMatch.name}
                          </h2>
                          <p className="trip-original-name">{trip.name}</p>
                        </>
                      ) : (
                        <h3>{trip.name}</h3>
                      )}
                    </div>
                    <p>
                      Starts on{" "}
                      {trip.details?.start_date
                        ? new Date(
                            trip.details.start_date.toDate()
                          ).toLocaleDateString()
                        : "No start date"}
                    </p>
                    <p>
                      Until{" "}
                      {trip.details?.end_date
                        ? new Date(
                            trip.details.end_date.toDate()
                          ).toLocaleDateString()
                        : "No end date"}
                    </p>
                    {trip.userDetails && (
                      <div className="trip-users">
                        <h4>Participants</h4>
                        <ul>
                          {trip.userDetails.map((user) => {
                            let userClass = "";
                            if (user.hasPreferences && user.hasSuggestions) {
                              userClass = "user-complete"; // Green border
                            } else if (user.id === userId) {
                              userClass = "user-incomplete-pulsing"; // Pulsing animation for logged-in user
                            } else {
                              userClass = "user-incomplete"; // Red border for incomplete users
                            }

                            return (
                              <li
                                key={user.id}
                                className={`participant ${userClass}`}
                              >
                                {user.name}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
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
