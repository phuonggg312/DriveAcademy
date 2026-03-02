import React, { useSyncExternalStore } from 'react';
import { navigation } from '../js/alpine/stores/navigation';
import useMobileBreakpoint from "@src/hooks/useMobileBreakpoint";
import { mobileBreakpoint } from "../entrypoints/theme";
import { lazyComponents } from "@src/utils/LazyComponent";

PromobarComponent.displayName = "theme__navigation-promobar";
export function PromobarComponent({ ...props }) {
    const PromotionBar = lazyComponents['PromotionBar'];
    return (
        <PromotionBar settings={props.settings} />
    );
}

HeaderComponent.displayName = "theme__navigation-header";
export function HeaderComponent({ ...props }) {
    const Header = lazyComponents['Header'];
    props.settings.breakpoint = mobileBreakpoint;
    return (
        <Header
            settings={props.settings}
            links={props.settings.links}
            item_count={props.settings.cart.item_count}
            type={props.settings.section.layout}
            show_search_bar={props.settings.section.show_search_bar}
        />
    );
}

FooterComponent.displayName = "theme__navigation-footer";
export function FooterComponent({ ...props }) {
    const Footer = lazyComponents['Footer'];
    props.settings.section.mobile_breakpoint = mobileBreakpoint;

    return (
        <Footer
            sublevel={{ locationsMeta: props.settings.additional, contactsMeta: props.settings.additional_extra }}
            globals={props.settings.globals}
            settings={props.settings.section}
            links={props.settings.blocks}
            shop={props.settings.shop}
            type={props.settings.section.layout}
        />
    );
}

MegamenuComponent.displayName = "theme__navigation-megamenu";
export function MegamenuComponent({ ...props }) {
    const Megamenu = lazyComponents['Megamenu'];
    const isMobile = useMobileBreakpoint(mobileBreakpoint);
    const id = 'header-' + props.settings.section.attach_to.replace(' ', '-').toLowerCase();

    const menuItems = {
        id: id,
        label: props.settings.section.title,
        subMenuItems: props.settings.links,
        blocks: props.settings.blocks
    };

    function useMenuId() {
        // return 'header-sneakers';
        return useSyncExternalStore(navigation.store().subscribe, navigation.store().getMenuId);
    }

    return (
        <>
            {isMobile ? (
                <div className="bg-inherit">
                    <Megamenu settings={props.settings} translations={props.settings.translations} menuItems={menuItems} id={id} state={useMenuId()} />
                </div>
            ) : (
                <div className="bg-inherit" onMouseLeave={() => navigation.store().setMenuId(null)}>
                    <Megamenu settings={props.settings} translations={props.settings.translations} menuItems={menuItems} id={id} state={useMenuId()} />
                </div>
            )}
        </>
    );
}
