import React from "react";
import "../../assets/styles/Button.css";

// Button component, takes in label, onClick function, styleType and icon.
// Default style type is primary.
// If icon is passed, it will be displayed before the label.

const Button = ({ label, onClick, styleType = "primary", icon = null }) => {
  return (
    <button className={`button button-${styleType}`} onClick={onClick}>
      {icon && <span className="button-icon">{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
