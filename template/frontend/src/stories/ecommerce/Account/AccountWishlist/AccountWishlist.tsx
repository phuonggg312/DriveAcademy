import React, { useEffect, useState, useMemo } from 'react';

// Comps
import AccountSectionLayout from '@project-stories/ecommerce/Account/AccountSectionLayout';
import Preloader from '@arctheme-components/blocks/Preloader/Preloader';
import {Paragraph} from '@arctheme-components/elements/Paragraph/Paragraph';
import {Link} from '@arctheme-components/elements/Link/Link';
import {ProductTile as ExtendedProductTile} from '@arctheme-components/ecommerce/Product/ProductTile';
import ReactPaginate from 'react-paginate';

// Utils
import shopifyHelpers from 'frontend/js/shopify';

// Hooks
import useMobileBreakpoint from '@arctheme-hooks/useMobileBreakpoint';

const AccountWishlist = ({ promoLabelConfig, paginateBy = 4, locales }) => {
  const [localLists, setLocalLists] = useState([]);

  useEffect(() => {
    // If needed, initialize or load localLists here
    const savedLists = JSON.parse(localStorage.getItem('localLists')) || [];
    setLocalLists(savedLists);
  }, []);

  // States
  const [products, setProducts] = useState(null);
  const [currentProducts, setCurrentProducts] = useState(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Hooks
  const isMobile = useMobileBreakpoint('767px');

  // Pagination
  const pageCount = useMemo(() => Math.ceil(products?.length / paginateBy), [products]);
  const handlePageChange = (newPage) => {
    setCurrentProducts((prev) => products.slice(paginateBy * newPage, paginateBy * newPage + paginateBy));
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Re-fetch products when there are updates in wishlist
  useEffect(() => {
    const fetchProducts = async () => {
      setProducts(null);
      setCurrentProducts(null);
      setCurrentPage(0);
      setIsLoadingProducts(true);

      const wishlist = localLists?.[0];

      if (!wishlist) {
        setIsLoadingProducts(false);
        return;
      }

      const graphQlProducts = await shopifyHelpers.getShopifyProductList(
        wishlist.products.map((product) => ({
          id: product
        }))
      );

      setProducts(graphQlProducts);
      setCurrentProducts(graphQlProducts.slice(0, paginateBy));
      setIsLoadingProducts(false);
    };

    fetchProducts();
  }, [localLists]);

  const renderProducts = (products) => {
    return products.map((product) => (
      <ExtendedProductTile
        key={product.id}
        product={product}
        type='horizontal-tablet'
        enableWishlist={true}
        promoLabelConfig={promoLabelConfig}
      />
    ));
  };

  return (
    <AccountSectionLayout
      classes={`md:px-6 md:pt-5 hide-scrollbar max-md:bg-transparent ${products && products.length ? 'md:max-h-[647px] md:min-h-[400px] md:h-[70vh] overflow-y-auto' : ''}`}
    >
      {isLoadingProducts ? (
        <div className='pb-4'>
          <Preloader loadingText='Loading wishlist...' />
        </div>
      ) : products && products.length ? (
        <div className='grid lg:grid-cols-2 gap-x-6 gap-y-4 pb-6'>
          {isMobile ? renderProducts(currentProducts) : renderProducts(products)}

          {isMobile && pageCount > 1 && (
            <div className='collection__pagination'>
              <ReactPaginate
                breakLabel='...'
                pageCount={pageCount}
                nextLabel=' '
                previousLabel=' '
                onPageChange={(e) => handlePageChange(e.selected)}
                marginPagesDisplayed={1}
                pageRangeDisplayed={1}
                disableInitialCallback={true}
                forcePage={currentPage}
              />
            </div>
          )}
        </div>
      ) : (
        <div className='text-center pb-4'>
          <Paragraph
            type='b2 text-center'
            text={locales.empty}
          />
          <Link
            link='/collections/all'
            classes='button btn-secondary mt-6'
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </AccountSectionLayout>
  );
};

export default AccountWishlist;
