import React from "react";
import "../../assets/styles/InputField.css";

const InputField = ({
  label,
  type,
  name,
  value,
  placeholder,
  onChange,
  disabled = false,
}) => {
  return (
    <label className="input-label">
      {label}
      <input
        className="text-input"
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        inputMode={type === "number" ? "numeric" : "text"} // Apply numeric keyboard only for numbers
        onInput={(e) => {
          if (type === "number") {
            e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Only restrict numbers for budget fields
          }
        }}
      />
    </label>
  );
};

export default InputField;
