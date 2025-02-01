import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTripById, clearUserNotification } from "../firebase/firebaseStore";
import Slider from "react-slick";
import "../assets/styles/TripDetailPage.css";

import Navbar from "../components/Navbar/Navbar";
import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

const TripDetailPage = ({ userId }) => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const tripDoc = await getTripById(tripId);

        if (tripDoc && tripDoc.perfectMatch) {
          setTrip(tripDoc.perfectMatch || null);
          await clearUserNotification(userId, tripId);
        } else {
          console.warn("Trip does not jet have a perfect match generated.");
        }
      } catch (error) {
        console.error("Error fetching trip data:", error);
      }
    };

    fetchTripData();
  }, [tripId]);

  if (!trip) {
    return <div>Loading...</div>;
  }

  const sliderSettings = {
    dots: true,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 600, settings: { slidesToShow: 2 } },
      { breakpoint: 300, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="trip-detail-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} background="white" />
      <div
        className="sticky-header"
        style={{ backgroundImage: `url(${trip.backgroundImage})` }}
      >
        <div className="overlay"></div>
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
        <p className="trip-description">{trip.description}</p>

        <h2>Recommendations</h2>
        <div className="recommendations-section">
          <div className="recommendation-category">
            <h3>Restaurants</h3>
            <Slider {...sliderSettings}>
              {trip.recommendations.restaurants.map((restaurant, index) => (
                <div key={index} className="recommendation-tile">
                  <p>{restaurant.name}</p>
                </div>
              ))}
            </Slider>
          </div>

          <div className="recommendation-category">
            <h3>Accommodations</h3>
            <Slider {...sliderSettings}>
              {trip.recommendations.accommodations.map(
                (accommodation, index) => (
                  <div key={index} className="recommendation-tile">
                    <p>{accommodation.name}</p>
                  </div>
                )
              )}
            </Slider>
          </div>
        </div>

        <h2>Balanced Preferences</h2>
        <div className="balanced-preferences">
          {trip.userPreferences.map((user, index) => (
            <div key={index} className="preference-item">
              <img
                src={user.profilePicture}
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
