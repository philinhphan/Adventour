import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserTrips,
  queryUsersByTrip,
  deleteTrip,
  clearUserNotification,
} from "../firebase/firebaseStore";
import "../assets/styles/MyTripsPage.css";
import barcelona from "../assets/images/default.jpg";
import Navbar from "../components/Navbar/Navbar";
import logo from "../assets/images/AdventourLogo.svg";
// import profil from "../assets/images/LisaProfil.jpg";

// This page displays an overview of the user's trips
// It shows the trips the user is part of, their status, and allows the user to navigate to the trip details
// The user can also delete trips they are part of
// Props:
// - userId: ID of the user
// - setCurrentTripId: Function to set the current trip ID
// - profilePic: Profile picture of the user
const MyTripsPage = ({ userId, setCurrentTripId, profilePic }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch user trips and associated data
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

  // Function to handle click on a trip
  // It sets the current trip ID and navigates to the trip details page
  const handleTripClick = (trip) => {
    const currentUser = trip.userDetails?.find((user) => user.id === userId);
    setCurrentTripId(trip.id);

    if (
      currentUser?.hasPreferences &&
      currentUser?.hasSuggestions &&
      !trip.allUsersCompleted
    ) {
      alert("Your friends are not ready yet. Come back later!");
      return;
    }

    if (trip.perfectMatch) {
      navigate(`/trip-detail/${trip.id}`);
      return;
    }

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

  const handleDeleteTrip = async (trip) => {
    try {
      await deleteTrip(trip.id);
      trip.userDetails.forEach(async (user) => {
        await clearUserNotification(user.id, trip.id);
      });
      setTrips((prevTrips) => prevTrips.filter((trp) => trp.id !== trip.id));
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  return (
    <div className="my-trips-page">
      <Navbar logoSrc={logo} profilePicSrc={profilePic} background="white" />
      <div className="trip-header">
        <h1>Overview of my Trips.</h1>
        <p>
          Let’s relive the unique magic of your adventures. Whether it’s
          exploring new destinations or revisiting old favorites.
        </p>
      </div>

      <div className="trips-container">
        {loading ? (
          <p>Loading your trips...</p>
        ) : trips.length > 0 ? (
          <>
            <h3 className="trip-section-title">My Matches</h3>
            <ul className="trip-list">
              {trips
                .filter((trip) => trip.perfectMatch)
                .map((trip) => (
                  <li
                    key={trip.id}
                    className={`trip-box ${
                      trip.perfectMatch ? "trip-ready" : ""
                    }`}
                    style={
                      trip.perfectMatch
                        ? {
                            backgroundImage: `url(${
                              trip.perfectMatch.backgroundImage || barcelona
                            })`,
                          }
                        : {}
                    }
                    onClick={() => handleTripClick(trip)}
                  >
                    <div className="trip-details">
                      <button
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTrip(trip);
                        }}
                      >
                        ⛌
                      </button>
                      <h2>{trip.perfectMatch?.name || trip.name}</h2>
                      <h4>{trip.name}</h4>
                      <p>
                        {trip.details?.start_date
                          ? new Date(
                              trip.details.start_date.toDate()
                            ).toLocaleDateString() + " -"
                          : null}
                        {trip.details?.end_date
                          ? new Date(
                              trip.details.end_date.toDate()
                            ).toLocaleDateString()
                          : "Date is not set for this trip"}
                      </p>
                      <div className="trip-users">
                        <h4>Participants</h4>
                        <ul>
                          {trip.userDetails?.map((user) => (
                            <li key={user.id} className="participant">
                              {user.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>

            <h3 className="trip-section-title">AdvenTours in Progress</h3>
            <ul className="trip-list">
              {trips
                .filter((trip) => {
                  const currentUser = trip.userDetails?.find(
                    (user) => user.id === userId
                  );
                  return (
                    !trip.perfectMatch &&
                    !trip.allUsersCompleted &&
                    currentUser?.hasPreferences &&
                    currentUser?.hasSuggestions
                  );
                })
                .map((trip) => (
                  <li
                    key={trip.id}
                    className="trip-box trip-pending"
                    onClick={() => handleTripClick(trip)}
                  >
                    <div className="trip-details">
                      <button
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTrip(trip);
                        }}
                      >
                        ⛌
                      </button>
                      <img src={barcelona} alt="Trip Destination" />
                      <h3>{trip.name}</h3>
                      <p>
                        {trip.details?.start_date
                          ? new Date(
                              trip.details.start_date.toDate()
                            ).toLocaleDateString() + " - "
                          : null}
                        {trip.details?.end_date
                          ? new Date(
                              trip.details.end_date.toDate()
                            ).toLocaleDateString()
                          : "Date is not set for this trip"}
                      </p>
                      <div className="trip-users">
                        <h4>Participants</h4>
                        <ul>
                          {trip.userDetails?.map((user) => (
                            <li key={user.id} className="participant">
                              {user.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>

            <h3 className="trip-section-title">Pending Your Input</h3>
            <ul className="trip-list">
              {trips
                .filter((trip) => {
                  const currentUser = trip.userDetails?.find(
                    (user) => user.id === userId
                  );
                  return (
                    !trip.perfectMatch &&
                    currentUser &&
                    (!currentUser.hasPreferences || !currentUser.hasSuggestions)
                  );
                })
                .map((trip) => (
                  <li
                    key={trip.id}
                    className="trip-box trip-user-pending"
                    onClick={() => handleTripClick(trip)}
                  >
                    <div className="trip-details">
                      <button
                        className="delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTrip(trip);
                        }}
                      >
                        ⛌
                      </button>
                      <img src={barcelona} alt="Trip Destination" />
                      <h3>{trip.name}</h3>
                      <p>
                        {trip.details?.start_date
                          ? new Date(
                              trip.details.start_date.toDate()
                            ).toLocaleDateString() + " - "
                          : null}
                        {trip.details?.end_date
                          ? new Date(
                              trip.details.end_date.toDate()
                            ).toLocaleDateString()
                          : "Date is not set for this trip"}
                      </p>
                      <div className="trip-users">
                        <h4>Participants</h4>
                        <ul>
                          {trip.userDetails?.map((user) => (
                            <li key={user.id} className="participant">
                              {user.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </>
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
