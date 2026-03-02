import React from "react";

const AccountTabs = ({ isLogin, toggleForm }) => {
    return (
        <div className="account-page__tabs flex justify-between items-center mb-6">
            <button
                onClick={() => toggleForm(false)}
                className={`account-page__tab border-b-2 pb-1 flex basis-[50%] items-center justify-center text-center ${
                    !isLogin ? "border-black" : ""
                }`}
            >
                Sign Up
            </button>
            <button
                onClick={() => toggleForm(true)}
                className={`account-page__tab border-b-2 pb-1 flex basis-[50%] items-center justify-center text-center ${
                    isLogin ? "border-black" : ""
                }`}
            >
                Login
            </button>
        </div>
    );
};

export default AccountTabs;
