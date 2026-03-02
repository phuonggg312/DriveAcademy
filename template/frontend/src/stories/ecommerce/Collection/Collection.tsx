import * as React from "react";
import { useState, useEffect, useRef } from "react";
import useMobileBreakpoint from "@arctheme-hooks/useMobileBreakpoint";
import { ProductTile } from "@arctheme-components/ecommerce/Product/ProductTile";
import { PromotionTile } from "@arctheme-components/ecommerce/PromotionalTile/PromotionTile";
import { CollectionSidebar } from "@project-stories/ecommerce/Collection/CollectionSidebar";
import { CollectionToolbar } from "@project-stories/ecommerce/Collection/CollectionToolbar";
import { LoadingSpinner } from "@arctheme-components/elements/LoadingSpinner/LoadingSpinner";

import './Collection.scss';

export const Collection = ({ settings }) => {
  const [
    displayedProductsWithPromoBlocks,
    setDisplayedProductsWithPromoBlocks,
  ] = useState([]);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState([]);
  const isMobile = useMobileBreakpoint(settings.mobile_breakpoint);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const promoBlocks = useRef(settings.promotion_blocks);
  const paginationHaveLoaded = useRef(false);
  const isFiltering = useRef(false);

  const initialized = useRef(false);

  const toggleSidebar = () => {
    setSidebarVisible((prevState) => {
      const newState = !prevState;
      document.body.classList.toggle("no-scroll__filters", newState);
      return newState;
    });
  };

  const {
    columns_mobile,
    columns_desktop,
    column_gap_mobile,
    column_gap_desktop,
    row_gap_mobile,
    row_gap_desktop,
    id,
  } = settings.section;

  const handleProductsResults = (event) => {
    if (event.detail.type === "plp") {
      window.dispatchEvent(
        new CustomEvent("hide-spinner", {
          detail: {
            id: "spinner-collection",
          },
        }),
      );

      isFiltering.current = event.detail.isFiltering;

      if (isFiltering.current) {
        setProducts(event.detail.products);

        if (paginationHaveLoaded.current) {
          window.dispatchEvent(
            new CustomEvent("current-products-updated", {
              detail: {
                totalViewed: event.detail.products.length,
              },
            }),
          );
        } else {
          const intervalId = setInterval(() => {
            if (paginationHaveLoaded.current) {
              window.dispatchEvent(
                new CustomEvent("current-products-updated", {
                  detail: {
                    totalViewed: event.detail.products.length,
                  },
                }),
              );
              clearInterval(intervalId);
            }
          }, 100);
        }
      }

      const { products, page } = event.detail;

      if (!isFiltering.current) {
        isFiltering.current = false;
        const currentPage = page + 1;
        const supposedToBeCurrentlyDisplayed =
          currentPage * settings.products_per_page;

        // Update the state with the merged products
        const promoBlocksToBeInserted = getPromoBlocksToBeInserted(
          supposedToBeCurrentlyDisplayed,
        );

        const nextPageCount =
          supposedToBeCurrentlyDisplayed - promoBlocksToBeInserted.length;

        const productsToBeAdded = getProductsFromLoadedProducts(
          products,
          nextPageCount,
        );

        const updatedDisplayedProductsWithPromoBlocks = insertPromoBlocks(
          productsToBeAdded,
          promoBlocksToBeInserted,
        );
        setDisplayedProductsWithPromoBlocks(
          updatedDisplayedProductsWithPromoBlocks,
        );

        if (paginationHaveLoaded.current) {
          window.dispatchEvent(
            new CustomEvent("current-products-updated", {
              detail: {
                totalViewed: productsToBeAdded.length,
              },
            }),
          );
        } else {
          const intervalId = setInterval(() => {
            if (paginationHaveLoaded.current) {
              window.dispatchEvent(
                new CustomEvent("current-products-updated", {
                  detail: {
                    totalViewed: productsToBeAdded.length,
                  },
                }),
              );
              clearInterval(intervalId);
            }
          }, 100);
        }
      }
    }
  };

  function handlePaginationLoad() {
    paginationHaveLoaded.current = true;
  }

  const handleFiltersResults = (event) => {
    if (event.detail.type === "plp") {
      if (event.detail.filters) {
        setFilters(event.detail.filters);
      }
    }
  };

  const handleEscapeKey = (event) => {
    if (event.key === "Escape") {
      setSidebarVisible(false);
    }
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      window.dispatchEvent(new CustomEvent("collection-search-loaded"));

      window.addEventListener("pagination-have-loaded", handlePaginationLoad);
      window.addEventListener("product-list", handleProductsResults);
      window.addEventListener("filter-list", handleFiltersResults);
      window.addEventListener("keydown", handleEscapeKey);

      // Cleanup the event listeners on component unmount
      return () => {
        // window.removeEventListener(
        //   "pagination-have-loaded",
        //   handlePaginationLoad,
        // );
        // window.removeEventListener("product-list", handleProductsResults);
        // window.removeEventListener("filter-list", handleFiltersResults);
        // window.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, []);

  const getProductsFromLoadedProducts = (products, nextPageCount) => {
    return products.slice(0, nextPageCount);
  };

  const insertPromoBlocks = (productsToBeAdded, promoBlocksForNextPage) => {
    let productsCopy = productsToBeAdded.concat([]);
    promoBlocksForNextPage.forEach(({ position, block }) => {
      productsCopy.splice(position, 0, block);
    });

    return productsCopy;
  };

  const getPromoBlocksToBeInserted = (supposedToBeCurrentlyDisplayed) => {
    const blocksForNextPage: any = [];

    promoBlocks.current.forEach((block) => {
      block.position.sort((a, b) => a - b);
      block.position.forEach((position) => {
        if (position <= supposedToBeCurrentlyDisplayed) {
          blocksForNextPage.push({
            position: position - 1,
            block,
          });
        }
      });
    });

    return blocksForNextPage;
  };

  return (
    <div
      x-init={`initialise('${settings.collection.handle}', true, ${settings.collection_size}, ${settings.pagination_type})`}
    >
      <CollectionSidebar
        isVisible={isSidebarVisible}
        filters={settings.collection_filters}
        metaobject_filters={settings.filters}
        toggleSidebar={toggleSidebar}
      />
      <div className="collection__toolbar flex justify-between mb-6 lg:mb-12 items-center">
        <CollectionToolbar settings={settings} toggleSidebar={toggleSidebar} />
      </div>
      <div
        id="product-grid"
        className={`collection__product-grid relative grid grid-cols-${columns_mobile} lg:grid-cols-${columns_desktop} gap-x-[${column_gap_mobile}px] lg:gap-x-[${column_gap_desktop}px] gap-y-[${row_gap_mobile}px] lg:gap-y-[${row_gap_desktop}px] auto-cols-max`}
        data-id={id}
      >
        <LoadingSpinner id="spinner-collection" />

        {isFiltering.current ? (
          <>
            {products.map((block, index) => (
              <React.Fragment key={index}>
                <div className={"collection-tile"}>
                  <ProductTile settings={settings} product={block} siblings={null} isLazy={index > 4} />
                </div>
              </React.Fragment>
            ))}
          </>
        ) : (
          <>
            {displayedProductsWithPromoBlocks.map((block, index) => (
              <React.Fragment key={index}>
                {block.type === "promo" ? (
                  <PromotionTile settings={settings} promotion={block} />
                ) : (
                  <div className={"collection-tile"}>
                    <ProductTile settings={settings}  product={block} siblings={null} isLazy={index > 4} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Collection;
