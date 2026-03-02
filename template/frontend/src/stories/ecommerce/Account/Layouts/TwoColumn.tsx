import * as React from "react";
import { useState } from "react";
import AccountForm from "../AccountForm";

export const TwoColumn = ({ settings }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showBusinessFields, setShowBusinessFields] = useState(false);

    const toggleForm = (isLoginState) => {
        setIsLogin(isLoginState);
    };

    const handleBusinessCheckbox = (isChecked) => {
        setShowBusinessFields(isChecked);
    };

    return (
        <div className="account-page min-h-screen flex flex-col items-center justify-center">
            <div className="account-page__container w-full space-y-8">
                <div className="account-page__wrapper flex flex-col md:flex-row w-full gap-8 justify-center">
                    {/* Left Side (Form Section) */}
                    <div className="account-page__form-container w-full lg:basis-[480px] p-8 space-y-[24px]">
                        <h2>Log In</h2>
                        <AccountForm
                            settings={settings}
                            isLogin={true}
                            showBusinessFields={showBusinessFields}
                            handleBusinessCheckbox={handleBusinessCheckbox}
                        />
                    </div>

                    {/* Right Side (Info Section) */}
                    <div className="account-page__form-container w-full lg:basis-[480px] p-8 space-y-[24px]">
                        <h2>Register</h2>
                        <AccountForm
                            settings={settings}
                            isLogin={false}
                            showBusinessFields={showBusinessFields}
                            handleBusinessCheckbox={handleBusinessCheckbox}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoColumn;
