import * as React from "react";
import useMobileBreakpoint from "@arctheme-hooks/useMobileBreakpoint";
import Default from "@project-stories/ecommerce/Account/Layouts/Default";
import TwoColumn from "@project-stories/ecommerce/Account/Layouts/TwoColumn";

const layouts = {
    "default": Default,
    "twocolumn": TwoColumn,
};
export const AccountLanding = ({ settings }) => {

    const isLogin = false;
    const isMobile = useMobileBreakpoint(settings.mobile_breakpoint);
    const { section } = settings;
    let Layout = layouts[section.layout_type] || Default;

    if (isMobile) {
        Layout = layouts[section.layout_type_mobile] || Default;
    }

    return (
        <div
            className={`${section.reveal_animation_class} relative`}
            style={{
                paddingTop: `${section.padding_top}px`,
                paddingBottom: `${section.padding_bottom}px`,
            }}>
            <div className="relative w-full h-full justify-end items-end">
                <Layout
                    settings={settings}
                />
            </div>
        </div>
    );
}

export default AccountLanding;
