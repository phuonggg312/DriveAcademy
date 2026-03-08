import React from "react";
import { SERVICE_ICONS, SERVICE_ICON_BOX_CLASS } from "../icons";

function parseBullets(bullets: string | undefined): string[] {
    if (typeof bullets !== "string") return [];
    return bullets.split(/\n/).map((s) => s.trim()).filter(Boolean);
}

export const OurServices = ({ settings }: { settings: any }) => {
    const { section = {}, blocks = [] } = settings;
    const { tagline, heading, footer_text, footer_link_text, footer_link_url } = section ?? {};
    const services = blocks.filter((b: any) => b.type === "service");

    return (
        <section className="our-services relative overflow-hidden text-inherit">
            <div className="container mx-auto px-4 md:px-6 relative z-[1]">
                <div className="mb-10 md:mb-12 text-center md:text-left">
                    <div>
                        {tagline && (
                            <p className="inline-block text-sm opacity-80 rounded-full px-3 py-1 mb-3 bg-[rgb(var(--color-background-contrast))]">{tagline}</p>
                        )}
                        {heading && (
                            <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight max-w-2xl">{heading}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {services.map((block: any) => {
                        const s = block.settings || {};
                        const bullets = parseBullets(s.bullets);
                        return (
                            <div
                                key={block.id}
                                className="rounded-xl shadow-md p-6 md:p-8 flex flex-col transition-shadow duration-200 hover:shadow-lg hover:-translate-y-0.5 bg-[#f8f6f7]"
                            >
                                <div className={SERVICE_ICON_BOX_CLASS}>
                                    {s.icon_image_url ? (
                                        <img src={s.icon_image_url} alt="" className="w-6 h-6 object-contain" aria-hidden />
                                    ) : (
                                        SERVICE_ICONS[s.icon] || SERVICE_ICONS.steering
                                    )}
                                </div>
                                {s.title && <p className="text-lg md:text-xl font-bold mb-2">{s.title}</p>}
                                {s.description && (
                                    <p className="text-sm md:text-base opacity-90 leading-relaxed mb-4">{s.description}</p>
                                )}
                                {bullets.length > 0 && (
                                    <ul className="space-y-2 mb-6 flex-1">
                                        {bullets.map((line: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm opacity-90">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-button))] flex-shrink-0 mt-1.5" aria-hidden />
                                                <span>{line}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {(s.link_text || s.link_url) && (
                                    <a
                                        href={s.link_url || "#"}
                                        className="inline-flex items-center gap-2 font-medium text-sm md:text-base hover:opacity-80 transition-opacity no-underline mt-auto text-[rgb(var(--color-link))]"
                                    >
                                        <span>{s.link_text || "View Service"}</span>
                                        <span aria-hidden>→</span>
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
