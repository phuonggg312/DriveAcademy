import React from "react";
import { CARD_ICONS } from "../icons";

export const WhatWeDo = ({ settings }: { settings: any }) => {
    const {
        background_image_url,
        section = {},
        blocks = [],
    } = settings;

    const {
        tagline = "What We Do",
        heading = "Helping learners master real world driving skills",
        description = "We provide professional driving training designed to help learners become safe, confident, and responsible drivers. Our programs combine classroom knowledge with hands-on road practice.",
        contact_text = "Contact Us",
        contact_url = "#",
        video_url = "#",
        overlay_opacity = 60,
    } = section;

    const cards = blocks.filter((b: any) => b.type === 'card');
    const overlayBg = `rgba(0,0,0,${(overlay_opacity ?? 60) / 100})`;

    return (
        <section className="what-we-do relative w-full overflow-hidden min-h-[480px] md:min-h-[560px]">
            {background_image_url && (
                <>
                    <img
                        src={background_image_url}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 z-[1]" style={{ backgroundColor: overlayBg }} />
                </>
            )}

            <div className="what-we-do-content relative z-[2] container mx-auto max-w-6xl min-h-[480px] md:min-h-[560px] flex flex-col items-center justify-center text-center py-10 md:py-12">
                <div className="w-full flex flex-col items-center">
                    {tagline && (
                        <p className="flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-white/90 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F0D32A] flex-shrink-0" aria-hidden="true" />
                            {tagline}
                        </p>
                    )}
                    {heading && (
                        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight mb-4">
                            {heading}
                        </p>
                    )}
                    {description && (
                        <p className="text-xs md:text-sm lg:text-base text-white/90 max-w-xl leading-relaxed mb-8 md:mb-10 mx-auto">
                            {description}
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mx-auto">
                        {cards.map((block: any) => (
                            <div
                                key={block.id}
                                className="rounded-xl bg-white/10 backdrop-blur-sm p-4 md:p-5 border border-white/10 transition-colors duration-200 hover:bg-white/15 hover:border-white/20 text-left"
                            >
                                <div className="mb-3 md:mb-4">
                                    {block.settings?.icon_image_url ? (
                                    <img src={block.settings.icon_image_url} alt="" className="w-8 h-8 md:w-10 md:h-10 object-contain" aria-hidden />
                                ) : (
                                    CARD_ICONS[block.settings?.icon] || CARD_ICONS.steering
                                )}
                                </div>
                                {block.settings?.title && (
                                    <p className="text-sm md:text-base font-bold text-white mb-2">
                                        {block.settings.title}
                                    </p>
                                )}
                                {block.settings?.description && (
                                    <p className="text-xs md:text-sm text-white/80 leading-relaxed">
                                        {block.settings.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
