import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/styles/Navbar.css";
import { logout } from "../../firebase/firebaseAuth";

// Navbar component, takes in logoSrc, profilePicSrc and onProfileClick function.
// Logo is wrapped in Link to navigate to home page.
// Profile picture is displayed with onProfileClick function -> right now it just alerts.

const Navbar = ({ logoSrc, profilePicSrc, background = "transparent" }) => {
  const [showLogout, setShowLogout] = useState(false); // Zustand für das Logout-Menü
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout(); // Firebase-Logout
      setShowLogout(false); // Logout-Menü verbergen
      navigate("/login"); // Zur Login-Seite navigieren
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (!showLogout) return; // Nur ausführen, wenn showLogout true ist

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowLogout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogout]);

  return (
    <div className={`navbar ${background === "white" ? "whiteNav" : ""}`}>
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
      <div className="navbar-profile" ref={profileRef}>
        <img
          src={profilePicSrc}
          alt="Profile"
          className="navbar-profile-pic"
          onClick={() => setShowLogout((prev) => !prev)} // Logout-Menü anzeigen/verbergen
        />
        {showLogout && (
          <button
            className="logout-button"
            onClick={handleLogout} // Logout-Logik
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
