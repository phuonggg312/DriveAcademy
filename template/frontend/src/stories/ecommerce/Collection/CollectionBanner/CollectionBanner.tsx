import * as React from "react";
import {Image} from "@arctheme-components/elements/Image/Image";
import {Paragraph} from "@arctheme-components/elements/Paragraph/Paragraph";

export const CollectionBanner = ({ settings }) => {
    return (
        <>
            <div className={`collection-category-banner ${settings.section_settings.container_type }`}>
                <div className={`collection-category-banner__blocks gap-x-[${settings.section_settings.gap_mobile }px] lg:gap-x-[${settings.section_settings.gap_desktop}px] px-[${settings.section_settings.padding_left_right_mobile}px]`}>
                    {settings.category_blocks.map((block, index) => (
                        <a
                            key={block.key || index}
                            href={`${settings.routes.root_url}${block.url}`}
                            className="category-block"
                        >
                            <div className={`category-block__image-wrapper min-w-[${settings.section_settings.image_min_width}px] max-w-[${settings.section_settings.image_max_width}px]`}>
                                <Image
                                    imageUrl={block.image}
                                    isLazy={true}
                                    classes={'category-image h-auto w-full'} 
                                />
                                <div className="category-image__overlay"></div>
                            </div>
                            <div className={`category-block__title py-[${settings.section_settings.text_padding_top_bottom_mobile}px] lg:py-[${settings.section_settings.text_padding_top_bottom_desktop}px]`}>
                                <Paragraph text={block.title} type={settings.section_settings.text_type} />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
};
