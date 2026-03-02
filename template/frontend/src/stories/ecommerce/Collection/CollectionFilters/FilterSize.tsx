import React, { useEffect, useState } from "react";

export const FilterSize = ({ filter, metaobjectFilter, activeFilters }) => {
  const displayLimit = metaobjectFilter.display_limit
    ? metaobjectFilter.display_limit
    : filter.values.length;
  const [visibleCount, setVisibleCount] = useState(displayLimit);
  const [showMore, setShowMore] = useState(true);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + displayLimit);
    setShowMore(false);
  };

  const handleShowLess = () => {
    setVisibleCount(displayLimit);
    setShowMore(true);
  };

  const visibleFilters = filter.values.slice(0, visibleCount);
  const hasMore = visibleCount < filter.values.length;

  return (
    <div
      className="flex flex-col pb-5 mb-5 border-b border-[#eceeef]"
      style={{ order: metaobjectFilter.sort_order }}
    >
      <div className="bc uppercase font-medium">
        {metaobjectFilter.display_name}
      </div>
      <div className="grid grid-cols-4 mt-4 gap-x-4 gap-y-4">
        {visibleFilters.map((value) => (
          <div
            className="filters__size relative cursor-pointer w-full"
            key={value.key}
            x-on:click={`filter('${filter.key}', '${value.key}')`}
          >
            <input
              type="checkbox"
              defaultValue={value.key}
              defaultChecked={activeFilters.includes(value.key)}
              className={`absolute opacity-0 ${value.key}`}
            />
            <button className="filters__size--button px-0 capitalize w-full h-10 flex items-center justify-center bg-[#ECEBEB] border">
              {value.label}
            </button>
          </div>
        ))}
      </div>
      {hasMore ? (
        <button className="filters__show-hide mt-4" onClick={handleShowMore}>
          {`Show All ${metaobjectFilter.display_name}s (${filter.values.length})`}
        </button>
      ) : !showMore ? (
        <button className="filters__show-hide mt-4" onClick={handleShowLess}>
          {`Show Less`}
        </button>
      ) : null}
    </div>
  );
};
