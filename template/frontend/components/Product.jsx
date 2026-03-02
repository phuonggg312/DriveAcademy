import React, { useSyncExternalStore } from "react";
import { hasher } from "../js/alpine/stores/hasher";
import { mobileBreakpoint } from "../entrypoints/theme";
import useMobileBreakpoint from "@src/hooks/useMobileBreakpoint";
import { findinstore } from "../js/alpine/components/ecommerce/findinstore";
import { lazyComponents } from "@src/utils/LazyComponent";
import {FindInStore} from "@arctheme-components/ecommerce/FindInStore/FindInstore";

ProductTileComponent.displayName = "theme__product-tile";
export function ProductTileComponent({ settings }) {
  const ProductTile = lazyComponents['ProductTile'];
  const { product, selected_or_first_available_variant, add_to_cart_url, star_ratings_app, translations } = settings;

  return (
      <ProductTile
          product={product}
          swatches={[]}
          currentVariant={selected_or_first_available_variant}
          addToCartUrl={add_to_cart_url}
          starRatingsApp={star_ratings_app}
          translations={translations}
      />
  );
}

ProductStockStatusComponent.displayName = "theme__elements-product-status";
export function ProductStockStatusComponent({ ...props }) {
  const StatusIndicator = lazyComponents['StatusIndicator'];
  return (
      <StatusIndicator
          message={"In Stock"}
          status={"success"}
          show_indicator={props.settings.show_indicator}
      />
  );
}

ProductSwatchesComponent.displayName = "theme__product-swatches";
export function ProductSwatchesComponent({ ...props }) {
  const ProductSwatches = lazyComponents['ProductSwatches'];
  const { swatches, current_colour: currentColor, current_swatch: currentSwatch } = props.settings;

  return (
      <div className={"product__swatches-component"}>
        <ProductSwatches
            swatches={swatches}
            currentColor={currentColor}
            currentSwatch={currentSwatch}
        />
      </div>
  );
}

ProductDescriptionComponent.displayName = "theme__ecommerce-product-description";
export function ProductDescriptionComponent({ ...props }) {
  const ProductDescription = lazyComponents['ProductDescription'];
  return (
      <div className={"product__description-component mt-6 lg:mt-8"}>
        <ProductDescription settings={props.settings} />
      </div>
  );
}

ProductQuickAddComponent.displayName = "theme__product-quickadd";
export function ProductQuickAddComponent({ ...props }) {
  const QuickAdd = lazyComponents['QuickAdd'];
  return (
      <div className={"product__quickadd-component"}>
        <QuickAdd settings={props.settings} />
      </div>
  );
}

ProductSellingPlansComponent.displayName = "theme__ecommerce-product-sellingplans";
export function ProductSellingPlansComponent({ ...props }) {
  const ProductSellingGroups = lazyComponents['ProductSellingGroups'];
  const { product } = props.settings;

  return (
      <div className={"product__selling-group-component mt-8"}>
        <ProductSellingGroups product={product} />
      </div>
  );
}

ProductGalleryComponent.displayName = "theme__ecommerce-product-gallery";
export function ProductGalleryComponent({ ...props }) {
  const ProductGallery = lazyComponents['ProductGallery'];
  props.settings.section.mobile_breakpoint = mobileBreakpoint;
  const isMobile = useMobileBreakpoint(mobileBreakpoint);

  const productImages = props.settings.additional.map((image) => ({
    url: image.src,
    alt: image.alt,
  }));

  const videoUrl = props.settings.video_url
      ? `https://player.vimeo.com/video/${props.settings.video_url}?autoplay=1&quality=720p&loop=1&autopause=0&background=1`
      : null;

  return (
      <div className={"product-gallery"}>
        <ProductGallery
            images={productImages}
            videoUrl={videoUrl}
            settings={props.settings}
        />
      </div>
  );
}

ProductFindInStoreComponent.displayName = "theme__ecommerce-find-in-store";
export function ProductFindInStoreComponent({ ...props }) {
  const FindInStore = lazyComponents['FindInStore'];

  async function storeStockCheck() {
    findinstore.component().sku = props.settings.product_sku;
    await hasher.store().dispatchHash();
    await findinstore.component().getStockForProduct(props.settings.product_sku);
    await findinstore.component().getDeliveryMethodsShopify();
  }

  function useInventoryLevels() {
    return useSyncExternalStore(
        findinstore.component().subscribe,
        findinstore.component().getInventoryLevels,
    );
  }

  function useDeliveryMethods() {
    return useSyncExternalStore(
        findinstore.component().subscribe,
        findinstore.component().getDeliveryMethods,
    );
  }

  return (
      <FindInStore
          title={"Find in Store"}
          description={
            "Please enter your postcode to check the delivery and collection options. Make your selection as you proceed through the checkout."
          }
          buttonText={"Search"}
          clickEvent={storeStockCheck}
          inventoryLevels={useInventoryLevels()}
          deliveryMethods={useDeliveryMethods()}
      />
  );
}

ProductAccordionComponent.displayName = "theme__elements-accordion";
export function ProductAccordionComponent({ ...props }) {
  const ProductAccordion = lazyComponents['ProductAccordion'];
  const { block_settings } = props.settings;

  const items = Array.from({ length: 7 }, (_, i) => ({
    title: block_settings[`additional_info_${i + 1}`],
    content: block_settings[`additional_content_${i + 1}`],
    icon: block_settings[`additional_icon_${i + 1}`],
  }));

  return <ProductAccordion settings={props.settings} items={items} show_header={false} />;
}
