import React, { useState, useEffect } from "react";
import useCustomerLogin from "@arctheme-hooks/useCustomerLogin";
import AccountForgotPassword from "@project-stories/ecommerce/Account/AccountForgotPassword";
import useCustomerAccessToken from "@arctheme-hooks/useCustomerAccessToken";
import {Paragraph} from "@arctheme-components/elements/Paragraph/Paragraph";

const AccountLoginForm = ({ settings }) => {
    const { loginCustomer, loading, loginError: error, loginSuccess: success } = useCustomerLogin();
    const { getAccessToken, loading: accessLoading, errorMessage: accessError, successMessage: accessSuccess } = useCustomerAccessToken();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const showCreateAccountButton = false;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data: any = await getAccessToken(email, password)

        if (data.success) {
            await loginCustomer(email, password);
        }
    };

    const toggleForgotPassword = (e) => {
        e.preventDefault();
        setShowForgotPassword(!showForgotPassword);
    }
    return (
        <>
            {!showForgotPassword &&
                <form
                    data-shopify-captcha="true"
                    id="loginForm"
                    onSubmit={handleSubmit}
                    className="account-page__form  flex flex-col w-full"
                >
                    {(success || accessSuccess) &&
                        <>
                            {(success || accessSuccess) &&
                                <p className={'success'}>{settings.section.success_message}</p>
                            }
                        </>
                    }
                    {(error || accessError) &&
                        <>
                            {(error || accessError) &&
                                <p className={'errors'}>
                                    <Paragraph maxChars={5000} text={accessError && accessError.includes("Unidentified")
                                        ? settings.section.incorrect_details_message
                                        : accessError} type={'errors'}/>

                                </p>
                            }
                        </>
                    }

                    <div className="flex flex-col w-full space-y-[40px] lg:space-y-[48px]">
                        <div className={`account-page__input-container  space-y-[16px]`}>
                            <div className={`account-page__input-container floating-input`}>
                                <input
                                    type="email"
                                    id="email"
                                    name={"email"}
                                    placeholder={" "}
                                    className="account-page__input form-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className={`account-page__input-container floating-input`}>

                                <input
                                    type="password"
                                    id="password"
                                    placeholder={" "}
                                    name={"password"}
                                    className="account-page__input form-field w-full p-2 tracking-[0.35rem]"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>

                        <div className={`account-page__actions-container space-y-[16px]`}>
                            <div className={'flex flex-col'}>
                                <button type="submit" className="account-page__submit-btn button button-primary w-full">
                                    {loading ? "Logging in..." : "Log In"}
                                </button>
                            </div>

                            {showCreateAccountButton && <div className={'flex flex-col submit'}>
                                <a href="/account/register" className="account-page__submit-btn button button-outline w-full">
                                    {"Create Account"}
                                </a>
                            </div>}

                            <div className="text-center font-light text-sm">
                                <p className="account-page__forgot-password forgot-password mb-4">
                                    <a href="#forgotpassword" onClick={toggleForgotPassword}>
                                        Forgot password?
                                    </a>
                                </p>

                                <div className="account-inquiry my-2 font-light">
                                    <span>Don't have an account? <a href="/account/register">Sign Up.</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            }
            {showForgotPassword && <AccountForgotPassword settings={settings} onCancel={toggleForgotPassword}/>}
        </>
    );
};

export default AccountLoginForm;
