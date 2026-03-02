import React, { useEffect, useState } from "react";
import "./FilterPrice.scss";

const DualRangeSlider = ({ min, max, step, onChange }) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(value);
    onChange([value, maxValue]);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(value);
    onChange([minValue, value]);
  };

  return (
    <div className="dual-range-slider">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minValue}
        onChange={handleMinChange}
        className="dual-range-slider__thumb dual-range-slider__thumb--min"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxValue}
        onChange={handleMaxChange}
        className="dual-range-slider__thumb dual-range-slider__thumb--max"
      />
      <div className="dual-range-slider__track">
        <div
          className="dual-range-slider__range"
          style={{
            left: `${((minValue - min) / (max - min)) * 100}%`,
            right: `${100 - ((maxValue - min) / (max - min)) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export const FilterPrice = ({ filter, metaobjectFilter }) => {
  const handleRangeChange = (values) => {
    console.log("Selected range:", values);
  };

  return (
    <div
      className="pb-5 mb-5 border-b border-[#eceeef] pointer-events-auto"
      style={{ order: metaobjectFilter?.sort_order }}
    >
      <div className="bfb">
        {metaobjectFilter ? metaobjectFilter?.display_name : filter.display_name}
      </div>
      <div className="filters__list flex flex-col space-y-2 mt-4">
        <DualRangeSlider
          min={0}
          max={100}
          step={1}
          onChange={handleRangeChange}
        />
      </div>
    </div>
  );
};
