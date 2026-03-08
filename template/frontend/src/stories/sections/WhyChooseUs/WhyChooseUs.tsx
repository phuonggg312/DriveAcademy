import React from "react";
import { BENEFIT_ICONS, STAT_ICONS, CIRCLE_ICON_BOX_CLASS } from "../icons";

export const WhyChooseUs = ({ settings }: { settings: any }) => {
    const { section = {}, blocks = [] } = settings;
    const { tagline, heading, description, image_url, overlay_heading, overlay_bullet_1, overlay_bullet_2 } = section ?? {};

    const benefits = blocks.filter((b: any) => b.type === 'benefit');
    const stats = blocks.filter((b: any) => b.type === 'stat');

    return (
      <section className="why-choose-us text-inherit">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              {tagline && (
                <p className="inline-block text-sm opacity-80 border rounded-full px-3 py-1.5 mb-4 border-[rgb(var(--color-shadow))]">
                  {tagline}
                </p>
              )}
              {heading && (
                <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight mb-4">
                  {heading}
                </p>
              )}
              {description && (
                <p className="opacity-90 leading-relaxed mb-8 max-w-xl">
                  {description}
                </p>
              )}
              <div className="space-y-6">
                {benefits.map((block: any) => {
                  const s = block.settings || {};
                  return (
                    <div key={block.id} className="flex gap-4">
                      <div className={CIRCLE_ICON_BOX_CLASS}>{BENEFIT_ICONS[s.icon] || BENEFIT_ICONS.target}</div>
                      <div>
                        {s.title && (
                          <p className="text-base md:text-lg font-bold mb-1">{s.title}</p>
                        )}
                        {s.description && (
                          <p className="text-sm md:text-base opacity-90 leading-relaxed">{s.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="relative rounded-xl overflow-hidden min-h-[320px] md:min-h-[400px] bg-[rgb(var(--color-background-contrast))]">
                {image_url && (
                  <img
                    src={image_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 md:right-auto md:max-w-[85%] bg-black/85 p-4 md:p-6 rounded-tr-xl text-white">
                  <div className="flex items-start gap-3">
                    <span className="w-10 h-10 rounded-lg bg-[#F0D32A] flex items-center justify-center flex-shrink-0 text-[#1a1a1a]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <div>
                      {overlay_heading && (
                        <p className="font-bold text-base md:text-lg mb-2 text-white">{overlay_heading}</p>
                      )}
                      <ul className="space-y-1.5 text-white">
                        {overlay_bullet_1 && (
                          <li className="flex items-center gap-2 text-sm md:text-base">
                            <span className="text-[#F0D32A] flex-shrink-0" aria-hidden>✓</span>
                            <span className="text-white">{overlay_bullet_1}</span>
                          </li>
                        )}
                        {overlay_bullet_2 && (
                          <li className="flex items-center gap-2 text-sm md:text-base">
                            <span className="text-[#F0D32A] flex-shrink-0" aria-hidden>✓</span>
                            <span className="text-white">{overlay_bullet_2}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((block: any) => {
                  const s = block.settings || {};
                  return (
                    <div
                      key={block.id}
                      className="rounded-xl p-4 md:p-5 transition-shadow duration-200 hover:shadow-md bg-[#f8f6f7]"
                    >
                      <div className={`${CIRCLE_ICON_BOX_CLASS} mb-3`}>
                        {s.icon_image_url ? (
                          <img src={s.icon_image_url} alt="" className="w-5 h-5 object-contain" aria-hidden />
                        ) : (
                          STAT_ICONS[s.icon] || STAT_ICONS.target
                        )}
                      </div>
                      {s.number && (
                        <p className="text-xl md:text-2xl font-bold mb-1">{s.number}</p>
                      )}
                      {s.description && (
                        <p className="text-sm opacity-90 leading-relaxed">{s.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};
