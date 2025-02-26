import React, { useState, useEffect, useRef } from "react";
import imageCompression from "browser-image-compression";

import { Link, useNavigate } from "react-router-dom";
import "../../assets/styles/Navbar.css";
import { logout } from "../../firebase/firebaseAuth";
import profilePicDefault from "../../assets/images/LisaProfil.jpg";

// Navbar component, takes in logoSrc, profilePicSrc and onProfileClick function.
// Logo is wrapped in Link to navigate to home page.
// Profile picture is displayed with onProfileClick function -> right now it just alerts.

import { db } from "../../firebase/firebase";
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
  const finalProfilePic = profilePicSrc || profilePicDefault;

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
      // Guard check to ensure userId is defined
      console.error("User ID is not defined; cannot upload profile picture.");
      return;
    }
    try {
      const options = {
        maxSizeMB: 0.5, // Maximum size in MB (adjust as needed)
        maxWidthOrHeight: 800, // Maximum width or height in pixels (adjust as needed)
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      if (!compressedFile) {
        console.log("File compression failed");
      }

      // Prepare form data for Cloudinary unsigned upload
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append(
        "upload_preset",
        process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET
      );

      // Cloudinary API endpoint URL using the cloud name from env variables
      const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Cloudinary upload failed");
      }
      const data = await response.json();
      const downloadURL = data.secure_url; // The URL of the uploaded image

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
          <div className="navbar-dropdown">
            <button
              className="logout-button"
              onClick={() => {
                // Trigger the file input dialog for uploading a new profile picture
                fileInputRef.current.click();
              }}
            >
              Change Profile Picture
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
