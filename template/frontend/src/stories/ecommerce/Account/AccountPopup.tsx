import * as React from "react";
import { useEffect } from "react";
import clsx from "clsx";
import AccountPopupLoggedIn from "./AccountPopupLoggedIn";
import AccountPopupLoggedOut from "./AccountPopupLoggedOut";

export function AccountPopup({ ...props }) {
    let isMouseOut = true;
    const { settings } = props;
    const accountPopup = React.useRef(null); // Reference to the popup container

    const isCustomerLoggedIn = settings.settings.is_customer_logged_in;

    const handleClickOutside = (event) => {
        const isClickInside = accountPopup.current && accountPopup.current.contains(event.target);

        if (!isClickInside) {
            // @ts-ignore
            const event = new CustomEvent('toggle-display-close', {
                detail: { message: 'header-account' }
            });

            window.dispatchEvent(event);
        }
    };


    function handleMouseLeave() {
        isMouseOut = true;

        if (settings.trigger !== 'hover') return;

        setTimeout(() => {
            if (isMouseOut) {
                const event = new CustomEvent('toggle-display-close', {
                    detail: { message: 'header-account' }
                });

                window.dispatchEvent(event);
            }
        }, 200)
    }

    function handleMouseEnter () {
        isMouseOut = false;
    }

    useEffect(() => {
        const eventName = 'toggle-display-trigger-leave';
        const handleToggleDisplay = (event) => {
            if (event.detail.message === 'header-account') {
                handleMouseLeave()
            }
        };

        window.addEventListener(eventName, handleToggleDisplay);
        document.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener(eventName, handleToggleDisplay);
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div
            className={clsx(['account-popup', settings.container_type])}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={() => handleMouseLeave()}
            ref={accountPopup}
        >
            {isCustomerLoggedIn
                ? <AccountPopupLoggedIn settings={settings} />
                : <AccountPopupLoggedOut settings={settings} />
            }
        </div>
    )
}
