import React, { useState } from "react";
import "../../assets/styles/Tile.css";
import { Img } from "react-image";
import { OrbitProgress } from "react-loading-indicators";

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
      <Img
        src={imageSrc}
        decode={false}
        alt={label}
        className="tile-image"
        loader={
          <div
            style={{
              width: "100px",
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <OrbitProgress color="#000000" size="medium" text="" textColor="" />
          </div>
        }
        unloader={<div>Image not found</div>}
      />
      <p className="tile-label">{label}</p>
    </div>
  );
};

export default Tile;
