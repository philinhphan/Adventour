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
            {trips.map((trip) => (
              <li key={trip.id} className="trip-box">
                <div className="trip-details">
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteTrip(trip.id)}
                  >
                    ⛌
                  </button>
                  <img src={barcelona} alt={barcelona} />
                  {/* <img src={trip.details.image} alt={trip.name} /> */}
                  <h3>{trip.name}</h3>
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
                        {trip.userDetails.map((user) =>
                          userId === user.id ? (
                            <li
                              onClick={() => handleTripClick(trip)}
                              key={user.id}
                              className={
                                user.hasPreferences && user.hasSuggestions
                                  ? ""
                                  : "grayed-out"
                              }
                            >
                              {user.name}
                            </li>
                          ) : (
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
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="trip-actions">

                  {/* {trip.allUsersCompleted && (
                    <button
                      className="button-generate-match"
                      onClick={() => handleGeneratePerfectMatch(trip.id)}
                    >
                      Generate Perfect Match
                    </button>
                  )} */}
                </div>
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
