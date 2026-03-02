import React, { useEffect, useState } from "react";

export const FilterColour = ({ filter, activeFilters }) => (
  <div className="pb-5 mb-5 border-b border-[#eceeef]">
    <div className="bc uppercase font-medium">{filter.label}</div>
    <div className="flex flex-wrap gap-x-3 gap-y-5 mt-4">
      {filter.values.map((value) => (
        <div
          className="filters__colour relative cursor-pointer flex flex-col items-center justify-center text-center max-w-[60px] h-full w-full"
          key={value.key}
          x-on:click={`filter('${filter.key}', '${value.key}');`}
        >
          <input
            type="checkbox"
            defaultValue={value.key}
            defaultChecked={activeFilters.includes(value.key)}
            className="absolute opacity-0 cursor-pointer"
          />
          <div className="filters__colour--wrapper border border-transparent p-1 ">
            <div
              className={`filters__colour--item filters__colour--${value.label.toLowerCase()} w-full h-full`}
            ></div>
          </div>
          <p className="b3">{value.label}</p>
        </div>
      ))}
    </div>
  </div>
);
