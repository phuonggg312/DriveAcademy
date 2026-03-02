import * as React from "react";
import useMobileBreakpoint from "@arctheme-hooks/useMobileBreakpoint";
import {ImageLayout} from "./Layouts/ImageLayout";
import {NoImageLayout} from "./Layouts/NoImageLayout";
import {CollectionListLayout} from "./Layouts/CollectionListLayout";

const layouts = {
    "image": ImageLayout,
    "no_image": NoImageLayout,
    "headercollections": CollectionListLayout,
};

export const CollectionHeader = ({ settings }) => {
    const { blocks, section } = settings;
    const isMobile = useMobileBreakpoint(section.mobile_breakpoint);
    let Layout = layouts[section.layout_type] || ImageLayout;

    let sortedBlocks = blocks;

    if (blocks) {
        if (isMobile) {
            // Sort blocks based on the sort_order setting
            sortedBlocks = [...blocks].sort(
                (a, b) => a.settings.sort_order_mobile - b.settings.sort_order_mobile,
            );
        }
    }

    if (isMobile) {
        Layout = layouts[section.layout_type_mobile] || ImageLayout;
    }
    return (
        <div className="relative w-full h-full justify-end items-end">
            <Layout blocks={sortedBlocks} props={settings} />
        </div>
    );
};

export default CollectionHeader;