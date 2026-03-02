import React, { useEffect, useState } from "react";

export const Sort = ({ settings,selectedOption, setSelectedOption }) => {

    const options = [
        { value: "Featured", label: "Featured" },
        { value: "Popular", label: "Popular" },
        { value: "Newest", label: "Newest" },
        { value: "LowToHigh", label: "Price - Low to High" },
        { value: "HighToLow", label: "Price - High to Low" },
    ];

    const handleSelectChange = (event) => {
        const newValue = event.target.value;
        setSelectedOption(newValue);

        // Emit the event to sort products based on the selected sort option
        const sortEvent = new CustomEvent("sort-products", {
            detail: {
                sortOption: newValue,
            },
        });
        window.dispatchEvent(sortEvent);
    };


    return (
        <div className={`relative flex items-center justify-center w-full lg:w-auto`}>
            <div
                className={`button toolbar-items__filterbutton bg-white text-center border-0 border-none items-center flex`}
            >
                <select
                    value={selectedOption}
                    onChange={handleSelectChange}
                    className={`bg-none p-[0px]`}
                >
                    {options.map((option, index) => (
                        <option value={`${option.value}`} key={index}>
                            <span className="font-medium">Sort by:</span> {`${option.label}`}
                        </option>
                    ))}
                    ;
                </select>
                <i className="icon icon-caret-down-thin text-lg"></i>
            </div>
        </div>
    )
};

export default Sort;
