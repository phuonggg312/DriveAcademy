import React from "react";
import "./AccountFields.scss";

export const InputField = ({ label, id, placeholder, type, required = false , handleInputChange}) => (
    <div className="account-page__input-container floating-input">
        {label && <label htmlFor={id} className="account-page__label">{label}</label>}
        <input type={type} id={id} name={id} className="account-page__input form-field w-full" placeholder={placeholder} required={required}
               onChange={handleInputChange}
        />
    </div>
);
