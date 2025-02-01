import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/App.css";
import "../assets/styles/PlanningPage.css";
import Navbar from "../components/Navbar/Navbar";
import logo from "../assets/images/AdventourLogo.svg";
import profil from "../assets/images/LisaProfil.jpg";

import { useTripContext } from "../context/TripContext";
import { addTrip, linkTripToUser } from "../firebase/firebaseStore";

import InputField from "../components/FormElements/InputField";
import Button from "../components/Button/Button";
import budgetIcon from "../assets/icons/Budget.svg";
import dateIcon from "../assets/icons/Date.svg";

const PlanningPage = ({ userId, setCurrentTripId }) => {
  const [tripDetails, setTripDetails] = useState({
    name: "",
    dateStart: "",
    dateEnd: "",
    budgetMin: "",
    budgetMax: "",
    dateFlexibility: "exact",
  });
  const [isEdited, setIsEdited] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { updateTripDetails } = useTripContext();

  const validateInputs = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    // Validate trip name (mandatory, alphanumeric)
    if (!tripDetails.name.trim()) {
      newErrors.name = "Trip name is required.";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(tripDetails.name)) {
      newErrors.name = "Trip name can only contain letters and numbers.";
    }

    // Validate dates (mandatory unless flexible)
    if (tripDetails.dateFlexibility !== "flexible") {
      if (!tripDetails.dateStart) {
        newErrors.dateStart = "Start date is required.";
      } else if (tripDetails.dateStart < today) {
        newErrors.dateStart = "Start date cannot be in the past.";
      }

      if (!tripDetails.dateEnd) {
        newErrors.dateEnd = "End date is required.";
      } else if (tripDetails.dateEnd < today) {
        newErrors.dateEnd = "End date cannot be in the past.";
      } else if (
        tripDetails.dateStart &&
        tripDetails.dateEnd &&
        new Date(tripDetails.dateStart) > new Date(tripDetails.dateEnd)
      ) {
        newErrors.dateEnd = "End date must be after the start date.";
      }
    }

    // Validate budget (optional but must be numbers and min < max)
    if (tripDetails.budgetMin && isNaN(tripDetails.budgetMin)) {
      newErrors.budgetMin = "Minimum budget must be a number.";
    }
    if (tripDetails.budgetMax && isNaN(tripDetails.budgetMax)) {
      newErrors.budgetMax = "Maximum budget must be a number.";
    }
    if (
      tripDetails.budgetMin &&
      tripDetails.budgetMax &&
      parseFloat(tripDetails.budgetMin) > parseFloat(tripDetails.budgetMax)
    ) {
      newErrors.budgetMax =
        "Maximum budget must be greater than minimum budget.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const saveTripDetails = async () => {
    if (!validateInputs()) {
      return; // Prevent save if validation fails
    }

    try {
      const tripData = {
        name: tripDetails.name,
        details: {
          b_exact: tripDetails.dateFlexibility === "exact",
          b_flexible: tripDetails.dateFlexibility === "flexible",
          b_plusminus: tripDetails.dateFlexibility === "+/-1",
          start_date: tripDetails.dateStart
            ? new Date(tripDetails.dateStart)
            : null,
          end_date: tripDetails.dateEnd ? new Date(tripDetails.dateEnd) : null,
          min_budget: parseFloat(tripDetails.budgetMin || 0),
          max_budget: parseFloat(tripDetails.budgetMax || 0),
        },
      };

      if (userId) {
        const tripId = await addTrip(tripData, userId);
        await linkTripToUser("franzi", tripId);
        await linkTripToUser("smilla", tripId);
        await linkTripToUser("jannik", tripId);
        await linkTripToUser("phi-linh", tripId);

        setCurrentTripId(tripId);
        updateTripDetails(tripDetails);
        setIsEdited(false); // Reset unsaved changes
        navigate("/invite");
      } else {
        throw new Error("User ID is not available.");
      }
    } catch (error) {
      console.error("Error saving trip details:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const today = new Date().toISOString().split("T")[0];

    setTripDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value, // Always update state for all fields
    }));

    setIsEdited(true);

    // Only validate date fields
    if (name === "dateStart" || name === "dateEnd") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value < today ? "Date cannot be in the past." : "", // Show error only for past dates
      }));
    }
  };

  const handleDateFlexibilityChange = (flexibility) => {
    setTripDetails((prevDetails) => ({
      ...prevDetails,
      dateFlexibility: flexibility,
      dateStart: flexibility === "flexible" ? "" : prevDetails.dateStart,
      dateEnd: flexibility === "flexible" ? "" : prevDetails.dateEnd,
    }));
    setIsEdited(true);
  };

  return (
    <div className="planning-page">
      <Navbar logoSrc={logo} profilePicSrc={profil} background="white" />
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
          {errors.name && <p className="error-message">{errors.name}</p>}
          <div className="date-box">
            <label className="section-title">When do you plan to travel?</label>
            <img alt="dateIcon" src={dateIcon} className="date-icon" />
            <div className="date-section">
              <div className="date-inputs">
                <InputField
                  label="Start Date"
                  type="date"
                  name="dateStart"
                  value={tripDetails.dateStart}
                  onChange={handleInputChange}
                  disabled={tripDetails.dateFlexibility === "flexible"}
                  min={new Date().toISOString().split("T")[0]} // Prevent past dates
                />

                <InputField
                  label="End Date"
                  type="date"
                  name="dateEnd"
                  value={tripDetails.dateEnd}
                  onChange={handleInputChange}
                  disabled={tripDetails.dateFlexibility === "flexible"}
                  min={
                    tripDetails.dateStart ||
                    new Date().toISOString().split("T")[0]
                  } // Ensure end date is after start date
                />
              </div>
              {errors.dateStart && (
                <p className="error-message">{errors.dateStart}</p>
              )}
              {errors.dateEnd && (
                <p className="error-message">{errors.dateEnd}</p>
              )}
              <div className="date-flexibility">
                <Button
                  label="Exact dates"
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
                  label="Flexible"
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
          <div className="budget-box">
            <label className="section-title">What is your budget?</label>
            <img alt="budgetIcon" src={budgetIcon} className="budget-icon" />
            <div className="budget-section">
              <InputField
                label="Minimum Budget"
                type="number"
                name="budgetMin"
                placeholder="€"
                value={tripDetails.budgetMin}
                onChange={handleInputChange}
              />

              <InputField
                label="Maximum Budget"
                type="number"
                name="budgetMax"
                placeholder="€€€"
                value={tripDetails.budgetMax}
                onChange={handleInputChange}
              />
            </div>
            {errors.budgetMin && (
              <p className="error-message">{errors.budgetMin}</p>
            )}
            {errors.budgetMax && (
              <p className="error-message">{errors.budgetMax}</p>
            )}
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
