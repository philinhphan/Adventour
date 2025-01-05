import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import "../assets/styles/App.css";
import "../assets/styles/PlanningPage.css";
import { useTripContext } from "../context/TripContext";

import InputField from "../components/FormElements/InputField";
import Button from "../components/Button/Button";

import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

//TODO Design: Rework the styling for this page. There are some issues with the layout and spacing.

// Planning page component with form to specify trip details.
const PlanningPage = () => {
  const [tripDetails, setTripDetails] = useState({
    name: "",
    dateStart: "",
    dateEnd: "",
    budgetMin: "",
    budgetMax: "",
    dateFlexibility: "exact",
  });
  const navigate = useNavigate();

  const { updateTripDetails } = useTripContext();

  const saveTripDetails = () => {
    console.log("Trip Details Saved:", tripDetails);
    updateTripDetails(tripDetails); // Update context with trip details @PhiLinh
    navigate("/invite");
  };

  // Handle input change for form fields and update tripDetails state.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTripDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // Handle date flexibility change and update tripDetails state.
  const handleDateFlexibilityChange = (flexibility) => {
    setTripDetails((prevDetails) => ({
      ...prevDetails,
      dateFlexibility: flexibility,
      dateStart: flexibility === "flexible" ? "" : prevDetails.dateStart,
      dateEnd: flexibility === "flexible" ? "" : prevDetails.dateEnd,
    }));
  };

  return (
    <div className="planning-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} />
      <div className="planning-container">
        <h1 className="title">Please specify your trip details</h1>
        <div className="planning-section">
          <InputField
            label="Name of Trip"
            type="text"
            name="name"
            placeholder="Name"
            value={tripDetails.name}
            onChange={handleInputChange}
          />
          
          
          <div className="date-box"> {/* Separate box for details on date */}
            <label className="section-title">Trip Dates</label>
          <div className="date-section">
            <div className="date-inputs">
              <InputField
                label="Start Date"
                type="date"
                name="dateStart"
                value={tripDetails.dateStart}
                onChange={handleInputChange}
                disabled={tripDetails.dateFlexibility === "flexible"}
              />
              <InputField
                label="End Date"
                type="date"
                name="dateEnd"
                value={tripDetails.dateEnd}
                onChange={handleInputChange}
                disabled={tripDetails.dateFlexibility === "flexible"}
              />
            </div>
            <div className="date-flexibility">
              <Button
                label="exact date"
                styleType={
                  tripDetails.dateFlexibility === "exact"
                    ? "primary"
                    : "secondary"
                }
                onClick={() => handleDateFlexibilityChange("exact")}
              />
              <Button
                label="+/- 1 day"
                styleType={
                  tripDetails.dateFlexibility === "+/-1"
                    ? "primary"
                    : "secondary"
                }
                onClick={() => handleDateFlexibilityChange("+/-1")}
              />
              <Button
                label="flexible"
                styleType={
                  tripDetails.dateFlexibility === "flexible"
                    ? "primary"
                    : "secondary"
                }
                onClick={() => handleDateFlexibilityChange("flexible")}
              />
            </div>
          </div>
          </div>
        
          <div className="budget-box"> {/* Separate box for details on budget */}
            <label className="section-title">My Budget</label>
          <div className="budget-section">
            <InputField
              label="Minimum Budget (€)"
              type="number"
              name="budgetMin"
              placeholder="Minimum (€)"
              value={tripDetails.budgetMin}
              onChange={handleInputChange}
            />
            <InputField
              label="Maximum Budget (€)"
              type="number"
              name="budgetMax"
              placeholder="Maximum (€)"
              value={tripDetails.budgetMax}
              onChange={handleInputChange}
            />
          </div>
        </div>
        </div>
        <Button
          label="Save details"
          styleType="black"
          onClick={saveTripDetails}
        />
      </div>
    </div>
  );
};

export default PlanningPage;
