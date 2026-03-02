import React, { useEffect, useState } from "react";
import { FilterPrice } from "./CollectionFilters/FilterPrice";
import { FilterList } from "./CollectionFilters/FilterList";
import { FilterButton } from "./CollectionFilters/FilterButton";
import { FilterColour } from "./CollectionFilters/FilterColour";
import { FilterSize } from "./CollectionFilters/FilterSize";

export const CollectionSidebar = ({
  isVisible,
  filters,
  metaobject_filters,
  toggleSidebar,
}) => {
  const useApplyFilters = true;
  const showCounts = false;
  const [activeFilters, setActiveFilters] = useState([]);
  const [applyFilters, setApplyFilters] = useState([]);

  useEffect(() => {
    const handleActiveFilters = (event) => {
      if (event.detail.activeFilters) {
        const values = Object.values(event.detail.activeFilters).flat();
        setActiveFilters(values);
      }
    };

    window.addEventListener("active-filters", handleActiveFilters);

    // Cleanup the event listeners on component unmount
    return () => {
      window.removeEventListener("active-filters", handleActiveFilters);
    };
  }, []);

  const handleFilterChange = (filterKey, valueKey) => {
    // Update applyFilters with key:value
    setApplyFilters((prevApplyFilters) => {
      const filterString = `${filterKey}:${valueKey}`;
      if (prevApplyFilters.includes(filterString)) {
        // Remove the key:value pair from applyFilters
        return prevApplyFilters.filter((filter) => filter !== filterString);
      } else {
        // Add the key:value pair to applyFilters
        return [...prevApplyFilters, filterString];
      }
    });

    // Update activeFilters with just value
    setActiveFilters((prevActiveFilters) => {
      if (prevActiveFilters.includes(valueKey)) {
        // Remove the value from activeFilters
        return prevActiveFilters.filter((filter) => filter !== valueKey);
      } else {
        // Add the value to activeFilters
        return [...prevActiveFilters, valueKey];
      }
    });

    console.log("Filters changed", applyFilters);
  };

  const applyAllFilters = () => {
    console.log("Before", applyFilters);

    const filtersToApply = applyFilters.reduce((acc, filter) => {
      const [key, value] = filter.split(":");

      // If the key already exists, push the new value to the array
      if (acc[key]) {
        acc[key].push(value);
      } else {
        // Otherwise, create a new array with the value
        acc[key] = [value];
      }

      return acc;
    }, {});

    // Fire custom event with the selected filters
    window.dispatchEvent(
      new CustomEvent("apply-filters", {
        detail: { filters: filtersToApply },
      }),
    );
  };

  const renderFilterValues = (filter, metaobjectFilters) => {
    const metaobjectFilter = metaobjectFilters.find(
      (value) => value.filter_name?.toLowerCase() === filter.key?.toLowerCase(),
    );
    if (
      filter.key === "named_tags.swatch" ||
      filter.key === "named_tags.fabrtype"
    ) {
      return metaobjectFilter ? (
        <FilterButton
          filter={filter}
          metaobjectFilter={metaobjectFilter}
          activeFilters={activeFilters}
        />
      ) : (
        <FilterColour filter={filter} activeFilters={activeFilters} />
      );
    } else if (filter.key === "Price") {
      return (
        <FilterPrice filter={filter} metaobjectFilter={metaobjectFilter} />
      );
    } else if (filter.key === "options.size") {
      return metaobjectFilter ? (
        <FilterSize
          filter={filter}
          metaobjectFilter={metaobjectFilter}
          activeFilters={activeFilters}
        />
      ) : (
        <FilterSize
          filter={filter}
          metaobjectFilter={{ sort_order: 0, display_name: filter.label }}
          activeFilters={activeFilters}
        />
      );
    } else {
      let showAllFilters = true;
      if (filter.display_name == "Room") {
        showAllFilters = false;
      }
      return metaobjectFilter ? (
        <FilterList
          filter={filter}
          metaobjectFilter={metaobjectFilter}
          showAllFilters={showAllFilters}
          handleFilterChange={handleFilterChange}
          activeFilters={activeFilters}
          useApplyFilters={useApplyFilters}
        />
      ) : (
        <FilterList
          filter={filter}
          metaobjectFilter={{ sort_order: 0, display_name: filter.label }}
          handleFilterChange={handleFilterChange}
          activeFilters={activeFilters}
          useApplyFilters={useApplyFilters}
        />
      );
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black z-50 opacity-40 ${isVisible ? "" : "hidden"}`}
        onClick={toggleSidebar}
      ></div>
      <div
        className={`collection-sidebar fixed top-0 left-0 overflow-y-auto w-full px-[16px] py-[24px] lg:w-[348px] h-full bg-white shadow-lg transition-transform z-50 transform ${isVisible ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="collection-sidebar__top flex justify-between space-x-[8px] items-center">
          <h2 className="flex sh2">Filters</h2>
          <i
            className="flex icon icon-x-thin cursor-pointer"
            onClick={toggleSidebar}
          ></i>
        </div>

        <div className={"facets flex flex-col pt-[40px]"}>
          {filters.map((filter, index) => (
            <React.Fragment key={index}>
              {renderFilterValues(filter, metaobject_filters)}
              {/* <hr className={'my-[18px]'} /> */}
            </React.Fragment>
          ))}
        </div>

        <div className="flex items-center justify-center text-center flex-col gap-y-[8px]">
          <a
            className="button-text underline w-full cursor-pointe mb-4"
            x-on:click={`clear`}
          >
            Clear All Filters
          </a>

          {useApplyFilters && (
            <button
              className="button button-primary w-full"
              onClick={applyAllFilters}
            >
              Apply Filters
            </button>
          )}
        </div>
      </div>
    </>
  );
};
