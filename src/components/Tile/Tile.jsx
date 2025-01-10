import React, { useState } from "react";
import "../../assets/styles/Tile.css";

const Tile = ({ label, imageSrc, onToggle }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleToggle = () => {
    setIsSelected(!isSelected);
    onToggle(label, !isSelected);
  };

  return (
    <div
      className={`tile ${isSelected ? "selected" : ""}`}
      onClick={handleToggle}
    >
      <img 
        src={imageSrc} 
        alt={label} 
        className="tile-image" 
        loading="lazy" // Lazy Loading hinzugefügt
      />
      <p className="tile-label">{label}</p>
    </div>
  );
};

export default Tile;
