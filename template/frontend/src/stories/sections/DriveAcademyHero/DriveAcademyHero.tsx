import React from "react";

export const DriveAcademyHero = ({ settings }: any) => {
    const {
        background_image_url,
        mobile_background_image_url,
        section = {},
    } = settings;

    const {
        tagline = '',
        heading = '',
        description = '',
        primary_button_text = '',
        primary_button_url = '#',
        secondary_button_text = '',
        secondary_button_url = '#',
        overlay_opacity = 50,
        min_height_desktop = 600,
        min_height_mobile = 460,
        content_alignment = 'center',
        padding_top_mobile = 16,
        padding_bottom_mobile = 0,
        padding_left_right_mobile = 16,
        padding_top_desktop = 24,
        padding_bottom_desktop = 24,
        padding_left_right_desktop = 0,
    } = section;
    const sectionId = (settings as any).section_id ?? '';

    const overlayBg = `rgba(0,0,0,${overlay_opacity / 100})`;

    const alignClass: Record<string, string> = {
        left: 'items-start text-left',
        center: 'items-center text-center',
        right: 'items-end text-right',
    };
    const contentAlign = alignClass[content_alignment] ?? 'items-center text-center';
    const btnAlign = content_alignment === 'left' ? 'justify-start' : content_alignment === 'right' ? 'justify-end' : 'justify-center';

    return (
        <div
            className="drive-academy-hero relative w-full overflow-hidden"
            style={{ minHeight: `${min_height_mobile}px` }}
        >
            {background_image_url && (
                <img
                    src={background_image_url}
                    alt=""
                    aria-hidden="true"
                    className={`absolute inset-0 w-full h-full object-cover${mobile_background_image_url ? ' hidden md:block' : ''}`}
                />
            )}
            {mobile_background_image_url && (
                <img
                    src={mobile_background_image_url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover md:hidden"
                />
            )}

            <div
                className="absolute inset-0 z-[1]"
                style={{ backgroundColor: overlayBg }}
            />

            <div
                className="relative z-[2] flex items-center justify-center w-full h-full"
                style={{ minHeight: `${min_height_desktop}px` }}
            >
                <div
                    className={`drive-academy-hero-content flex flex-col gap-3 md:gap-5 text-white w-full max-w-4xl mx-auto ${contentAlign}`}
                    style={!sectionId ? {
                        paddingTop: padding_top_mobile,
                        paddingBottom: padding_bottom_mobile,
                        paddingLeft: padding_left_right_mobile,
                        paddingRight: padding_left_right_mobile,
                    } : undefined}
                >

                    {tagline && (
                        <span className="bg-gray-800/50 rounded-full px-2 py-1">
                        <p className="flex items-center gap-2 text-xs md:text-sm font-medium tracking-wide">
                            {tagline}
                        </p>
                        </span>

                    )}

                    {heading && (
                        <p className="capitalize text-2xl md:text-5xl lg:text-6xl font-bold leading-tight">
                            {heading}
                        </p>
                    )}

                    {description && (
                        <p className="text-xs md:text-sm lg:text-base max-w-xl opacity-90 leading-relaxed">
                            {description}
                        </p>
                    )}

                    {(primary_button_text || secondary_button_text) && (
                        <div className={`flex flex-wrap gap-4 mt-2 ${btnAlign}`}>
                            {primary_button_text && (
                                <a
                                    href={primary_button_url || '#'}
                                    className="inline-flex items-center gap-2 md:gap-3 pl-4 pr-1.5 py-1.5 md:pl-6 md:pr-2 md:py-2 bg-[rgb(var(--color-button))] text-[rgb(var(--color-button-text))] font-bold rounded-full hover:opacity-90 transition-opacity no-underline text-sm md:text-base"
                                >
                                    <span>{primary_button_text}</span>
                                    <span className="flex items-center justify-center w-7 h-7 md:w-9 md:h-9 bg-[rgb(var(--color-button-text))] text-[rgb(var(--color-button))] rounded-full text-sm md:text-base leading-none flex-shrink-0">
                                        →
                                    </span>
                                </a>
                            )}

                            {secondary_button_text && (
                                <a
                                    href={secondary_button_url || '#'}
                                    className="inline-flex items-center gap-2 md:gap-3 text-white font-semibold hover:opacity-75 transition-opacity no-underline text-sm md:text-base"
                                >
                                    <span className="flex items-center justify-center w-9 h-9 md:w-12 md:h-12 bg-white/20 border-2 border-white rounded-full flex-shrink-0 backdrop-blur-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 translate-x-0.5">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </span>
                                    <span>{secondary_button_text}</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
