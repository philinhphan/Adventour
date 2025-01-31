import { React, useEffect, useState } from "react";
import { useTripContext } from "../context/TripContext";
import Slider from "react-slick"; // For swipe functionality
import "../assets/styles/TripDetailPage.css";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";
import nine from "../assets/images/Nine.jpg";
import ljota from "../assets/images/La-Llotja-1.webp";
import tribitz from "../assets/images/the-main-dining-area.jpg";
import barcelonaBackground from "../assets/images/barcelona.jpg"; // Background image
import hyatt from "../assets/images/hyatt.webp";
import mandarin from "../assets/images/Mandarin.jpg";
import W from "../assets/images/w-barcelona.jpg";

const TripDetailPage = () => {
  const { tripData } = useTripContext();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    setTrip(tripData.perfectMatch);
  }, [tripData]);

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


//       {/* Fixed Icons (Logo and Profile Picture) */}
//       {/* <img src={logo} alt="Logo" className="fixed-logo" />
//       <img src={profil} alt="Profile" className="fixed-profile-icon" /> */}


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
              {trip.recommendations.accommodations.map((accommodation, index) => (
                <div key={index} className="recommendation-tile">
                  <p>{accommodation.name}</p>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <h2>Balanced Preferences</h2>
        <div className="balanced-preferences">
          {trip.userPreferences.map((user, index) => (
            <div key={index} className="preference-item">
{/* //               <img
//                 src={`path/to/${user.userName.toLowerCase()}Profile.jpg`}
//                 alt={user.userName}
//                 className="profile-picture"
//               /> */}
              <p>{user.userName}</p>
              <div className="preference-bar-container">
                <div className="preference-bar-fill" style={{ width: `${user.preferenceMatch}%` }}></div>
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

// const TripDetailPage = ({ tripData }) => {
//   const placeholderTrip = {
//     name: "Barcelona, Spain",
//     tags: ["sightseeing", "shopping", "beach", "nightlife", "water sport"],
//     description:
//       "Get ready to fall in love with Barcelona—a city that blends vibrant culture, stunning architecture, and Mediterranean charm. This trip will take you through the iconic Sagrada Familia, the whimsical wonders of Park Güell, and the winding streets of the Gothic Quarter. You’ll sip sangria by the beach, devour mouthwatering tapas, and soak up breathtaking views from Montjuïc Hill.",
//     backgroundImage: barcelonaBackground, // Background image for the city section
//     recommendations: {
//       restaurants: [
//         { name: "Nine", image: nine },
//         { name: "La Lotja", image: ljota },
//         { name: "El Tributz", image: tribitz },
//       ],
//       accommodations: [
//         { name: "Mandarin Oriental", image: mandarin },
//         { name: "W Hotel", image: W },
//         { name: "Hyatt Regency", image: hyatt },
//       ],
//     },
//     userPreferences: [
//       { userName: "John", preferenceMatch: 100 },
//       { userName: "Lisa", preferenceMatch: 97 },
//       { userName: "Emma", preferenceMatch: 93 },
//     ],
//   };

//   const trip = tripData || placeholderTrip;

//   const sliderSettings = {
//     dots: true,
//     infinite: false,
//     arrows: false,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     responsive: [
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//       {
//         breakpoint: 300,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="trip-detail-page">
//       {/* Hero Section with Background */}
//       <div
//         className="sticky-header"
//         style={{
//           backgroundImage: `url(${trip.backgroundImage})`,
//         }}
//       >
//         <div className="overlay"></div> {/* Dark overlay for readability */}
//         <h1>{trip.name}</h1>
//         <div className="trip-tags">
//           {trip.tags.map((tag, index) => (
//             <span key={index} className="trip-tag">
//               {tag}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Fixed Icons (Logo and Profile Picture) */}
//       {/* <img src={logo} alt="Logo" className="fixed-logo" />
//       <img src={profil} alt="Profile" className="fixed-profile-icon" /> */}

//       <div className="trip-detail-container">
//         {/* Description */}
//         <p className="trip-description">{trip.description}</p>

//         {/* Recommendations */}
//         <h2>Recommendations</h2>
//         <div className="recommendations-section">
//           {/* Restaurants */}
//           <div className="recommendation-category">
//             <h3>Restaurants</h3>
//             <Slider {...sliderSettings}>
//               {trip.recommendations.restaurants.map((restaurant, index) => (
//                 <div key={index} className="recommendation-tile">
//                   <img
//                     src={restaurant.image}
//                     alt={restaurant.name}
//                     className="recommendation-image"
//                   />
//                   <p>{restaurant.name}</p>
//                 </div>
//               ))}
//             </Slider>
//           </div>

//           {/* Accommodations */}
//           <div className="recommendation-category">
//             <h3>Accommodations</h3>
//             <Slider {...sliderSettings}>
//               {trip.recommendations.accommodations.map(
//                 (accommodation, index) => (
//                   <div key={index} className="recommendation-tile">
//                     <img
//                       src={accommodation.image}
//                       alt={accommodation.name}
//                       className="recommendation-image"
//                     />
//                     <p>{accommodation.name}</p>
//                   </div>
//                 )
//               )}
//             </Slider>
//           </div>
//         </div>

//         {/* Balanced Preferences */}
//         <h2>Balanced Preferences</h2>
//         <div className="balanced-preferences">
//           {trip.userPreferences.map((user, index) => (
//             <div key={index} className="preference-item">
//               <img
//                 src={`path/to/${user.userName.toLowerCase()}Profile.jpg`}
//                 alt={user.userName}
//                 className="profile-picture"
//               />
//               <div className="preference-bar-container">
//                 <div
//                   className="preference-bar-fill"
//                   style={{ width: `${user.preferenceMatch}%` }}
//                 ></div>
//               </div>
//               <p className="preference-percentage">{user.preferenceMatch}%</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


