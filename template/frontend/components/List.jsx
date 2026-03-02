import recentlyviewed from "../js/alpine/components/recentlyviewed";
import { useEffect, useState } from "react";
import shopify from "../js/shopify";
import { mobileBreakpoint } from "../entrypoints/theme";
import { lazyComponents } from "@src/utils/LazyComponent";

RecommendedProductList.displayName = 'theme__recommendedproducts';
export function RecommendedProductList({ ...props }) {
  const ListProducts = lazyComponents['ListProducts'];
  const [products, setProducts] = useState([]);
  const { product } = props.settings;

  props.settings.mobile_breakpoint = mobileBreakpoint;
  props.settings.section.mobile_breakpoint = mobileBreakpoint;

  useEffect(() => {
    async function fetchProductRecommendations(productId) {
      const recommendedProducts = await shopify.getRecommendedProducts(productId);
      setProducts(recommendedProducts);
    }

    if (product?.id) {
      fetchProductRecommendations(product.id);
    } else {
      console.log("No product ID found");
    }
  }, [product]);

  return <ListProducts products={products} settings={props.settings} />;
}

FeaturedProductsComponent.displayName = 'theme__blog-featured-products';
export function FeaturedProductsComponent({ ...props }) {
  const FeaturedProducts = lazyComponents['FeaturedProducts'];
  const [products, setProducts] = useState([]);
  const { product_handles } = props.settings;

  props.settings.mobile_breakpoint = mobileBreakpoint;

  useEffect(() => {
    if (product_handles && product_handles.length > 0) {
      // Extract product IDs from the handles
      const productIds = product_handles
          .map((handle) => {
            const match = handle.match(/Product\/(\d+)/);
            return match ? match[1] : null;
          })
          .filter((id) => id !== null);

      async function fetchProducts(productIds) {
        const products = await shopify.getShopifyProductList(productIds);
        setProducts(products);
      }

      fetchProducts(productIds);
    }
  }, [product_handles]);

  // Only render Featured Products if products are found
  if (products.length === 0) {
    return null;
  }

  return (
      <FeaturedProducts products={products} settings={props.settings.section} />
  );
}

ProductsListComponent.displayName = 'theme__list-products';
export function ProductsListComponent({ ...props }) {
  const ListProducts = lazyComponents['ListProducts'];
  const [products, setProducts] = useState([]);
  const { product_handles } = props.settings;
  props.settings.mobile_breakpoint = mobileBreakpoint;

  useEffect(() => {
    if (product_handles && product_handles.length > 0) {
      // Extract product IDs from the handles
      const productIds = product_handles
          .map((handle) => {
            if (handle != "" && handle != null) {
              // Check if the handle contains "Product/"
              if (handle.includes("Product/")) {
                const match = handle.match(/Product\/(\d+)/);
                return match ? match[1] : null;
              }
              return handle;
            }
          })
          .filter((id) => id !== null);

      async function fetchProducts(productIds) {
        const products = await shopify.getShopifyProductList(productIds);
        setProducts(products);
      }

      fetchProducts(productIds);
    }
  }, [product_handles]);

  return <ListProducts products={products} settings={props.settings} />;
}

RecentlyViewedProductsList.displayName = 'theme__list-recently-viewed-products';
export function RecentlyViewedProductsList({ ...props }) {
  const ListProducts = lazyComponents['ListProducts'];
  const products = recentlyviewed.component().get();
  props.settings.mobile_breakpoint = mobileBreakpoint;
  if (products.length <= 0) {
    return null;
  }

  return <ListProducts products={products} settings={props.settings} />;
}
