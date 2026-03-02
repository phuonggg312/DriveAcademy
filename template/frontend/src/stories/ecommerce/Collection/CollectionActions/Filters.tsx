import React, { useEffect, useState } from "react";
import {Button} from "@arctheme-components/elements/Button/Button";

export const Filters = ({ store, settings, toggleSidebar }) => {
    const filterIcon = "sliders-horizontal-thin";

    return (
        <>
            {!settings.section.disable_filtering && <div className="filters filters gap-x-[8px] shrink-0">
                <i className={`icon ${filterIcon}`}></i>
                <Button
                    label={`Show Filters`}
                    style={"tertiary"}
                    onClick={toggleSidebar}
                    icon={filterIcon}
                    className={`toolbar-items__filterbutton border-none font-normal`}
                />
            </div>}
        </>
    )
};

export default Filters;
