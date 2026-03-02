import React, { useEffect, useState } from "react";
import { ToggleSwitch } from "@arctheme-components/elements/ToggleSwitch/ToggleSwitch";

export const ModelView = ({ store }) => {
    const [modelView, setModelView] = useState(store?.isModelView);

    const handleToggleChange = (isChecked) => {
        window.dispatchEvent(
            new CustomEvent("modelview-toggle", {
                detail: { isModelView: isChecked },
            }),
        );
    };

    useEffect(() => {
        setModelView(store?.isModelView);
    }, []);

    const showModelView = false;

    return (
        <>
            {showModelView &&
                <div className="hidden lg:flex items-center">
                    <ToggleSwitch
                        label={"Model View"}
                        onChange={handleToggleChange}
                        initialChecked={modelView}
                    />
                </div>
            }
        </>
    )
};

export default ModelView;
