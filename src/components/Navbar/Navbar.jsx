import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/Navbar.css";

// Navbar component, takes in logoSrc, profilePicSrc and onProfileClick function.
// Logo is wrapped in Link to navigate to home page.
// Profile picture is displayed with onProfileClick function -> right now it just alerts.

const Navbar = ({ logoSrc, profilePicSrc }) => {
  return (
    <div className="navbar">
      <Link to="/">
        {" "}
        {/* Wrap logo in Link */}
        <img
          src={logoSrc}
          alt="Logo"
          className="navbar-logo"
          style={{ cursor: "pointer" }}
        />
      </Link>
      <img
        src={profilePicSrc}
        alt="Profile"
        className="navbar-profile-pic"
        onClick={() => alert("Profile Clicked!")} // Placeholder for now
      />
    </div>
  );
};

export default Navbar;
