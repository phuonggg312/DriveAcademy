import React, { useState, useEffect } from "react";
import AccountForm from "../AccountForm";
import useUrlContains from "@arctheme-hooks/useUrlContains";
import useCLSMinHeight from "@arctheme-hooks/useCLSMinHeight";

export const Default = ({ settings }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showBusinessFields, setShowBusinessFields] = useState(false);
    const isLoginPage = useUrlContains("account/login");
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    // const { ref, style } = useCLSMinHeight(705);


    useEffect(() => {
        if (typeof isLoginPage === 'boolean') {
            setIsLogin(isLoginPage);
            setIsLoading(false); // Set loading to false once the URL check is complete
        }
        // window.dispatchEvent(new CustomEvent('render-complete', {
        //     detail: {
        //         component: 'account-landing',
        //     },
        // }));
    }, [isLoginPage]);

    const handleBusinessCheckbox = (isChecked) => {
        setShowBusinessFields(isChecked);
    };

    if (isLoading && isLogin == null) {
        return null;
    }

    return (
        <div className="account-page flex flex-col items-center justify-center"
             // ref={ref} style={style}
        >
            <div className="account-page__container w-full space-y-8">
                <div className="account-page__wrapper flex flex-col md:flex-row w-full gap-8">
                    {/* Left Side (Form Section) */}
                    <div className="account-page__form-container w-full mx-auto space-y-[24px] justify-center items-center">
                        <AccountForm
                            settings={settings}
                            isLogin={isLogin}
                            showBusinessFields={showBusinessFields}
                            handleBusinessCheckbox={handleBusinessCheckbox}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Default;
