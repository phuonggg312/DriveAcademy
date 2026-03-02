import React, { useState, useEffect } from "react";
import useCustomerRecover from '@arctheme-hooks/useCustomerRecover';

export const AccountForgotPassword = ({
    settings,
                                   contentWidth = 800,
                                   headingFontClass = '',
                                   onCancel,
                                   showTitle = false,
                               }) => {
    const {
        email,
        setEmail,
        loading,
        errorMessage,
        successMessage,
        recoverCustomer,
    } = useCustomerRecover();

    const showLabel = true;
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await recoverCustomer(email);
    };

    return (
        <div className="account-reset-password">
            <div
                className={`account-reset-password-inner shell flex flex-col mx-auto w-full lg:max-w-[${contentWidth}px]`}
            >
                {showTitle && (
                    <h2 className={`account__reset--title mx-auto mb-4 ${headingFontClass}`}>
                        Recover Password
                    </h2>
                )}

                <div className="form-container">
                    {errorMessage && <div className="errors">{errorMessage}</div>}
                    {successMessage && <div className="success">{settings.section.password_reset_success_message}</div> }
                    <form onSubmit={handleSubmit}>
                        <div className="email mb-4 floating-input">

                                <input
                                    className="w-full p-2 form-field"
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            {showLabel && <label htmlFor="email">Email</label>}
                        </div>

                        <div className="submit mb-4 flex flex-col">
                            <button
                                className="button button-primary w-full"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Submit'}
                            </button>
                        </div>
                    </form>


                    <button
                        className="button button-text w-full min-h-0 h-auto p-0 capitalize hover:underline"
                        x-on:click={`showPasswordReset = false`}
                        onClick={onCancel}
                    >
                        Cancel Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountForgotPassword;
