import React from "react";
import useMobileBreakpoint from "@arctheme-hooks/useMobileBreakpoint";
import {Paragraph} from "@arctheme-components/elements/Paragraph/Paragraph";
import {Headings} from "@arctheme-components/elements/Headings/Headings";

export const NoImageLayout = ({ props }) => {
    const { section, description } = props;
    const isMobile = useMobileBreakpoint(section.mobile_breakpoint);

    return (
        <div
            className={`collection-header-without-image flex flex-col text-center h-full 
            justify-${section.content_vertical_position_mobile} 
            lg:justify-${section.content_vertical_position_desktop} 
            pt-[${section.padding_top_mobile}px] 
            lg:pt-[${section.padding_top_desktop}px] 
            pb-[${section.padding_bottom_mobile}px] 
            lg:pb-[${section.padding_bottom_desktop}px] 
            px-[${section.padding_left_right_mobile}px] 
            lg:px-[${section.padding_left_right_desktop}px]`}>
            {isMobile &&
                <Headings
                    text={section.title}
                    classes={`collection-header-without-image__title 
                    ${section.heading_type_mobile} mb-[${section.title_margin_bottom_mobile}px] 
                    lg:mb-[${section.title_margin_bottom_desktop}px]`}
                />
            }
            {!isMobile &&
                <Headings
                    text={section.title}
                    classes={`collection-header-without-image__title 
                    ${section.heading_type_desktop} 
                    mb-[${section.title_margin_bottom_mobile}px] 
                    lg:mb-[${section.title_margin_bottom_desktop}px]`}
                />
            }
            {section.show_description &&
                <Paragraph
                    text={description}
                    type={`${section.body_type} self-center w-full 
                    lg:max-w-[${section.content_width}]`}
                />
            }
        </div>
    );
};
