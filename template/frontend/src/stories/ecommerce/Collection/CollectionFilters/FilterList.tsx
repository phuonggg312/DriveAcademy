import React, { useEffect, useState } from "react";
import { useDebounce } from "@arctheme-hooks/useDebounce";

export const FilterList = ({
  filter,
  metaobjectFilter,
  activeFilters,
  handleFilterChange,
  showAllFilters = true,
  showCounts = false,
  useApplyFilters = false,
}) => {
  // Filter the values based on the conditions before rendering
  const filteredValues = filter.values?.filter((value) => {
    const buttonExists = metaobjectFilter.filter_buttons?.some(
      (button) => button.button_name === value.key,
    );
    return showAllFilters || buttonExists;
  });

  // If no valid values, return null (don't render anything)
  if (!filteredValues || filteredValues.length === 0) {
    return null;
  }

  const debouncedFilterChange = useDebounce(handleFilterChange, 300);

  return (
    <div
      className="pb-5 mb-5 border-b border-[#eceeef] pointer-events-auto"
      style={{ order: metaobjectFilter.sort_order }}
    >
      <div className="bfb">
        {metaobjectFilter ? metaobjectFilter.display_name : filter.display_name}
      </div>
      <div className="filters__list flex flex-col gap-1 mt-3">
        {filteredValues.map((value) => (
          <label
            className="flex items-center cursor-pointer py-2"
            key={value.key}
            onClick={
              useApplyFilters
                ? () => debouncedFilterChange(filter.key, value.key)
                : null
            }
            {...(!useApplyFilters && {
              "x-on:click": `filter('${filter.key}', '${value.key}')`,
            })}
          >
            <input
              type="checkbox"
              value={value.key}
              className={`form-checkbox cursor-pointer ${value.key}`}
              defaultChecked={activeFilters.includes(`${value.key}`)}
            />
            <span className="filters__list--label ml-2">{value.label}</span>
            {showCounts && <span className="ml-auto">{value.count}</span>}
          </label>
        ))}
      </div>
    </div>
  );
};
