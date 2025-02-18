import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/styles/Navbar.css";
import { logout } from "../../firebase/firebaseAuth";

// Navbar component, takes in logoSrc, profilePicSrc and onProfileClick function.
// Logo is wrapped in Link to navigate to home page.
// Profile picture is displayed with onProfileClick function -> right now it just alerts.

import { storage, db } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";

const Navbar = ({
  logoSrc,
  profilePicSrc,
  background = "transparent",
  setProfilePic, 
  userId,        
}) => {
  const [showLogout, setShowLogout] = useState(false); // Zustand für das Logout-Menü
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout(); // Firebase-Logout
      setShowLogout(false); // Logout-Menü verbergen
      navigate("/login"); // Zur Login-Seite navigieren
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!userId) { 
      console.error("User ID is not defined; cannot upload profile picture.");
      return;
    }
    try {
      // Create a storage reference for the profile picture
      const storageRef = ref(storage, `profilePictures/${userId}/${file.name}`);
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);
      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);
      // Update Firestore user document with the new profile picture URL
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { profilePicture: downloadURL });
      // Update the profile picture state (so the Navbar and other components reflect the change)
      setProfilePic(downloadURL);
      // Optionally close the dropdown
      setShowLogout(false);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
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
        {/* Hidden file input for profile picture upload */}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {showLogout && (
          // <-- UPDATED: Dropdown now includes two options
          <div className="navbar-dropdown">
            <button
              className="dropdown-button"
              onClick={() => {
                // Trigger the file input dialog for uploading a new profile picture
                fileInputRef.current.click();
              }}
            >
              Change Profile Picture
            </button>
            <button className="dropdown-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
