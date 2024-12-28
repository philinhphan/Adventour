import React from "react";
import "../../assets/styles/InputField.css";

// InputField component, takes in label, type, name, value, placeholder, onChange and disabled.
// Default type is text and disabled is false.

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
      />
    </label>
  );
};

export default InputField;
