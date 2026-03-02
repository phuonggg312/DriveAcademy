import React, { useState, useEffect } from "react";
import useCreateCustomer from "@arctheme-hooks/useCreateCustomer";
import useCustomerLogin from "@arctheme-hooks/useCustomerLogin";
import {InputField} from "@project-stories/ecommerce/Account/AccountFields";

const AccountRegisterForm = ({ settings, showBusinessFields, handleBusinessCheckbox }) => {
    const { createCustomer, loading, error, customerId, success } = useCreateCustomer();
    const [dependenciesState, setDependenciesState]: any = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { loginCustomer, loading: loginLoading, error: loginError, success: loginSuccess } = useCustomerLogin();

    // Handle input change and update global dependency state
    const handleInputChange = (e) => {
        const { name, value, type: inputType, checked } = e.target;

        // For checkboxes, use the checked value, otherwise use the input value
        const newValue = inputType === "checkbox" ? checked : value;

        // Update the global dependency state
        updateDependencyState(name, newValue);
    };

    // Function to update the global dependencies state
    const updateDependencyState = (name, value) => {
        setDependenciesState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleClick = async (event) => {
        event.preventDefault();
        // Since this is newsletter, set optIn fields automatically
        setDependenciesState((prevState) => ({
            ...prevState,
            ['optInSMS']: true,
            ['optInEmail']: true,
        }));
        setIsSubmitting(true);
        const createResponse  = await createCustomer(dependenciesState);

        if (createResponse) {
            const email = dependenciesState.email;
            const password = dependenciesState.password;

            // Log the customer in after successful creation
            await loginCustomer(email, password);
        }

        setIsSubmitting(false);
    };


    return (
        <form id="registerForm" className="account-page__form space-y-6">
            <div className="account-page__input-group flex space-x-4">
                <InputField label="First Name" id="first_name" type="text" placeholder={`First Name`} required handleInputChange={handleInputChange}/>
                <InputField label="Last Name" id="last_name" type="text" placeholder={`Last Name`} required  handleInputChange={handleInputChange}/>
            </div>
            <InputField label="Email" id="email" type="email" required placeholder={`Email`} handleInputChange={handleInputChange}/>
            <InputField label="Confirm Email" id="confirmEmail" type="email" placeholder={`Confirm Email`} required  handleInputChange={handleInputChange} />
            <InputField label="Phone Number" id="phone" type="tel" placeholder={`Phone`} handleInputChange={handleInputChange}/>

            {/* Birthday Fields */}
            <BirthdayField />

            {/* Password Fields */}
            <InputField label="Password" id="password" type="password" placeholder={`Password`} required  handleInputChange={handleInputChange}/>
            <InputField label="Confirm Password" id="password_confirmation" placeholder={`Confirm Password`} type="password" required  handleInputChange={handleInputChange}/>

            {success && (
                <div
                    className="success-message my-[16px] py-[16px] bg-[#36573B] px-4"
                    role="alert"
                >
                    <p className="bc">Thank you for registering!</p>
                    <p className="b3">
                        You have been successfully registered. Redirecting
                    </p>
                </div>
            )}

            {error && (
                <div className="error-message my-[16px] py-[16px] bg-red-500 px-4" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <div className={'flex flex-col'}>
                <div onClick={handleClick} className="account-page__submit-btn button button-primary w-full">
                    {isSubmitting || loading || loginLoading ? "Submitting..." : "Create Account"}
                </div>
            </div>

            <p className="account-page__login-link text-center">
                    Already have an account? <a x-on:click="$event.preventDefault(), handleFormToggle(true), isLogin = true"
                    className="account-page__login-btn underline cursor-pointer">Log In
                </a>
            </p>
        </form>
    );
};


const BirthdayField = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (v, i) => currentYear - i);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="account-page__input-group flex flex-col">
            <label htmlFor="birthdayDay" className="account-page__label">Birthday</label>
            <div className="account-page__input-container default-input flex space-x-4">
                <select id="birthdayDay" name="birthdayDay" className="account-page__input form-field">
                    <option value="DD">DD</option>
                    {[...Array(31).keys()].map(day => (
                        <option key={day + 1} value={day + 1}>{String(day + 1).padStart(2, '0')}</option>
                    ))}
                </select>

                <select id="birthdayMonth" name="birthdayMonth" className="account-page__input form-field">
                    <option value="MM">MM</option>
                    {months.map((month, idx) => (
                        <option key={idx} value={String(idx + 1).padStart(2, '0')}>{month}</option>
                    ))}
                </select>

                <select id="birthdayYear" name="birthdayYear" className="account-page__input form-field">
                    <option value="YYYY">YYYY</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};


export default AccountRegisterForm;
