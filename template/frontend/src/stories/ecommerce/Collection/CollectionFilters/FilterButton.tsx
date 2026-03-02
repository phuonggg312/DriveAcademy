import React, { useEffect, useState } from "react";

export const FilterButton = ({ filter, metaobjectFilter, activeFilters }) => {
  const [visibleCount, setVisibleCount] = useState(
    metaobjectFilter.display_limit,
  );
  const [showMore, setShowMore] = useState(true);

  // Extract labels from filter.values
  const filterLabels = filter.values.map((value) => value.label.toLowerCase());

  // Filter metaobjectFilter.filter_buttons to include only buttons whose button_name matches the filter labels
  const matchedButtons = metaobjectFilter.filter_buttons.filter((button) =>
    filterLabels.includes(button.button_name.toLowerCase()),
  );

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + metaobjectFilter.display_limit);
    setShowMore(false);
  };

  const handleShowLess = () => {
    setVisibleCount(metaobjectFilter.display_limit);
    setShowMore(true);
  };

  const visibleButtons = matchedButtons.slice(0, visibleCount);
  const hasMore = visibleCount < matchedButtons.length;

  return (
    <div
      className="flex flex-col pb-5 mb-5 border-b border-[#eceeef]"
      style={{ order: metaobjectFilter.sort_order }}
    >
      <div className="bc uppercase font-medium">
        {metaobjectFilter.display_name}
      </div>
      <div className="grid grid-cols-4 gap-x-3 gap-y-5 mt-4 items-baseline">
        {visibleButtons.map((value) => (
          <div
            className="filters__button relative cursor-pointer flex flex-col items-center justify-center text-center max-w-[60px] w-full"
            key={value.button_name}
            x-on:click={`filter('${filter.key}', '${value.button_name}');`}
          >
            <input
              type="checkbox"
              defaultValue={value.button_name}
              defaultChecked={activeFilters.includes(value.button_name)}
              className={`absolute opacity-0 cursor-pointer ${value.button_name}`}
            />
            <div className="filters__button--wrapper border border-transparent p-1">
              {value.colour ? (
                <div
                  className="filters__button--item w-full h-full"
                  style={{ backgroundColor: value.colour }}
                ></div>
              ) : (
                <img
                  className="filters__button--item"
                  loading="lazy"
                  src={value.image}
                  alt={value.image.alt}
                  width="120"
                  height="auto"
                />
              )}
            </div>
            <p className="filters__button--label b3">{value.display_name}</p>
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
