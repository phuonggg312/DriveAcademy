import React from "react";
import AccountRegisterForm from "./AccountRegisterForm";
import AccountLoginForm from "./AccountLoginForm";
import useMobileBreakpoint from "@arctheme-hooks/useMobileBreakpoint";

const AccountForm = ({ settings, isLogin, showBusinessFields, handleBusinessCheckbox }) => {
    const isMobile = useMobileBreakpoint(settings.mobile_breakpoint);
    const { section } = settings;

    return (
        <div>
            {/* Login Form */}
            <div>
                <h4 className={`account__signin--title text-center mx-auto mb-8 ${section.heading_font_class}`}>
                    {section.title}
                </h4>
                {isLogin && <AccountLoginForm settings={settings}/>}
            </div>
            {/* Register Form */}
            {!isLogin && (
                <div>
                    <AccountRegisterForm settings={settings}
                                         showBusinessFields={showBusinessFields}
                                         handleBusinessCheckbox={handleBusinessCheckbox}
                    />
                </div>
            )}
        </div>
    );
};

export default AccountForm;
