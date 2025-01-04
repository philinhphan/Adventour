import React, { useState } from "react";
import Card from "../components/TinderCard/Card";
import "../assets/styles/SuggestionsPage.css";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

const dummySuggestions = [
  {
    id: 1,
    name: "Barcelona, Spain",
    image: "https://via.placeholder.com/300x600",
    tags: ["sightseeing", "shopping", "beach"],
    description:
      "Where culture meets coastline. Explore Gaudí’s wonders and enjoy vibrant nightlife.",
  },
  {
    id: 2,
    name: "Miami, USA",
    image: "https://via.placeholder.com/300x600",
    tags: ["surfing", "shopping", "yachting"],
    description:
      "Sun, salsa, and style. Dive into the glamour and experience Florida’s tropical vibes.",
  },
  {
    id: 3,
    name: "Kyoto, Japan",
    image: "https://via.placeholder.com/300x600",
    tags: ["temples", "nature", "tradition"],
    description:
      "A serene blend of ancient traditions and breathtaking landscapes.",
  },
];

const SuggestionsPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const handleSwipe = (direction, suggestion) => {
    console.log(`Swiped ${direction} on ${suggestion.name}`);
    if (currentIndex < dummySuggestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/processing");
    }
  };

  return (
    <div className="suggestions-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} />
      <div className="suggestions-container">
        {currentIndex < dummySuggestions.length ? (
          <Card
            suggestion={dummySuggestions[currentIndex]}
            onSwipe={handleSwipe}
          />
        ) : null}
      </div>
    </div>
  );
};

export default SuggestionsPage;
