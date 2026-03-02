import React from "react";
import useMobileBreakpoint from "@arctheme-hooks/useMobileBreakpoint";
import {Paragraph} from "@arctheme-components/elements/Paragraph/Paragraph";
import {Headings} from "@arctheme-components/elements/Headings/Headings";

export const ImageLayout = ({ props }) => {
    const { section, description, mobile_image } = props;
    const isMobile = useMobileBreakpoint(section.mobile_breakpoint);

    return (
        <div className="collection-header__with-image relative w-full h-full">
            {section.image &&
                // To be put into a separate component
                <picture>
                    <source
                        media="(max-width: 767px)"
                        srcSet={mobile_image}
                        data-alt={mobile_image.alt}
                        width={mobile_image.width}
                        height={mobile_image.height}
                    />
                    <source
                        media="(max-width: 1440px)"
                        srcSet={section.image}
                    />
                    <img
                        src={section.image}
                        className="w-full h-auto"
                        width={section.image.width}
                        height={section.image.height}
                        alt={section.image.alt}
                    />
                </picture>
            }
            <div
                className={`absolute top-0 left-0 w-full flex flex-col text-center h-full 
                justify-${section.content_vertical_position_mobile} 
                lg:justify-${section.content_vertical_position_desktop} 
                pt-[${section.padding_top_mobile}px] 
                lg:pt-[${section.padding_top_desktop}px] 
                pb-[${section.padding_bottom_mobile}px] 
                lg:pb-[${section.padding_bottom_desktop}px] 
                px-[${section.padding_left_right_mobile}px] 
                lg:px-[${section.padding_left_right_desktop}px]`}>
                <div
                    className={`mb-[${section.title_margin_bottom_mobile}px]
                     lg:mb-[${section.title_margin_bottom_desktop}px]`}>
                    {isMobile &&
                        <Headings
                            text={section.title}
                            classes={`collection-header__with-image__title 
                            ${section.heading_type_mobile}`}
                        />
                    }
                    {!isMobile &&
                        <Headings
                            text={section.title}
                            classes={`collection-header__with-image__title 
                            ${section.heading_type_desktop}`}
                        />
                    }
                </div>
                {section.show_description &&
                    <Paragraph
                        text={description}
                        type={`${section.body_type} self-center w-full 
                        lg:max-w-[${section.content_width}]`}
                    />
                }
            </div>
        </div>
    );
};
