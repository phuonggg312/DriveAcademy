import React, { useSyncExternalStore } from "react";
import trackorder from "../js/alpine/components/ecommerce/trackorder";
import hasher from "../js/alpine/stores/hasher";
import { mobileBreakpoint } from "../entrypoints/theme";
import { lazyComponents } from "@src/utils/LazyComponent";

AccountPopupComponent.displayName = 'theme__header-account-popup';
export function AccountPopupComponent({ ...props }) {
    const AccountPopup = lazyComponents['AccountPopup'];
    return (
        <AccountPopup settings={props} />
    );
}

MinicartComponent.displayName = 'theme__ecommerce-minicart';
export function MinicartComponent({ ...props }) {
    const Minicart = lazyComponents['Minicart'];
    return (
        <Minicart
            cartData={props.settings.cart}
            item_count={props.settings.cart.item_count}
            settings={props.settings.section_settings}
        />
    );
}

ReviewsListComponent.displayName = 'theme__ecommerce-reviews-list';
export function ReviewsListComponent({ ...props }) {
    const ReviewList = lazyComponents['ReviewList'];
    return (
        <ReviewList
            reviews={[]}
            settings={props.settings.section}
        />
    );
}

TrackYourOrder.displayName = 'theme__ecommerce-track-your-order';
export function TrackYourOrder({ ...props }) {
    const EcommTrackOrder = lazyComponents['EcommTrackOrder'];

    async function orderCheck(id) {
        trackorder.component().order = id;
        await hasher.store().dispatchHash();
        await trackorder.component().getOrderTrackingInfo(id);
    }

    function useGetOrder() {
        return useSyncExternalStore(
            trackorder.component().subscribe,
            trackorder.component().getOrder,
        );
    }

    return (
        <EcommTrackOrder
            title={"Track Your Order"}
            description={"Please enter your order number below to find tracking information about your order."}
            buttonText={"Search"}
            clickEvent={orderCheck}
            orderData={useGetOrder()}
        />
    );
}

CollectionPageComponent.displayName = 'theme__collection-main';
export function CollectionPageComponent({ ...props }) {
    const Collection = lazyComponents['Collection'];
    props.settings.mobile_breakpoint = mobileBreakpoint;

    return (
        <Collection
            settings={props.settings}
            collectionProducts={props.settings.collection_products}
        />
    );
}

SearchResultsPageComponent.displayName = 'theme__search-main';
export function SearchResultsPageComponent({ ...props }) {
    const SearchResults = lazyComponents['SearchResults'];
    return <SearchResults settings={props.settings} />;
}

HeaderSearchComponent.displayName = 'theme__search-header-results';
export function HeaderSearchComponent({ ...props }) {
    const HeaderSearch = lazyComponents['HeaderSearch'];
    props.settings.mobile_breakpoint = mobileBreakpoint;
    return <HeaderSearch settings={props.settings} />;
}

CollectionSidebarComponent.displayName = 'theme__collection-sidebar';
export function CollectionSidebarComponent({ ...props }) {
    const CollectionSidebar = lazyComponents['CollectionSidebar'];
    return <CollectionSidebar settings={props.settings} />;
}

CollectionToolbarComponent.displayName = 'theme__collection-toolbar';
export function CollectionToolbarComponent({ ...props }) {
    const CollectionToolbar = lazyComponents['CollectionToolbar'];
    return <CollectionToolbar settings={props.settings} />;
}

CartItemsComponent.displayName = 'theme__cart-items';
export function CartItemsComponent({ ...props }) {
    const CartItems = lazyComponents['CartItems'];
    return <CartItems settings={props.settings} />;
}

CartSummaryComponent.displayName = 'theme__cart-summary';
export function CartSummaryComponent({ ...props }) {
    const CartSummary = lazyComponents['CartSummary'];
    return <CartSummary settings={props.settings} />;
}

AccountForgotPasswordComponent.displayName = 'theme__account-forgotpassword';
export function AccountForgotPasswordComponent({ ...props }) {
    const AccountForgotPassword = lazyComponents['AccountForgotPassword'];
    return <AccountForgotPassword settings={props.settings} />;
}

AccountLandingComponent.displayName = 'theme__account-landing';
export function AccountLandingComponent({ ...props }) {
    const AccountLanding = lazyComponents['AccountLanding'];
    return <AccountLanding settings={props.settings} />;
}

AccountInformationDetailsComponent.displayName = 'theme__account-information-details';
export function AccountInformationDetailsComponent({ ...props }) {
    const AccountInformationDetails = lazyComponents['AccountInformationDetails'];
    return <AccountInformationDetails settings={props.settings} />;
}
