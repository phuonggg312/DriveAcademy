import React, { useState } from "react";

type FaqItem = {
  title: string;
  content: string;
  image?: string;
  filter_tag?: string;
};

type Props = {
  settings?: Record<string, unknown>;
  blocks?: unknown[];
  props?: { faqs?: FaqItem[]; section?: Record<string, unknown> };
};

export function FAQ({ settings, props: fullProps }: Props) {
  const faqs: FaqItem[] = fullProps?.faqs ?? [];
  const section = fullProps?.section ?? settings ?? {};
  const title = (section.title as string) || "";
  const [openId, setOpenId] = useState<number | null>(null);

  if (!faqs.length) {
    return (
      <div className="section-faq-accordion text-inherit py-6">
        <p className="text-sm opacity-80">No FAQs yet. Add a metaobject (Global) or metafield (Page/Article/Product).</p>
      </div>
    );
  }

  return (
    <div className="section-faq-accordion text-inherit bg-[rgb(var(--color-background))] py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        {title && (
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">
            {title}
          </h2>
        )}
        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openId === index;
            return (
              <div
                key={index}
                className="rounded-xl overflow-hidden shadow-sm border border-[#F0D32A]/30 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : index)}
                  className={`w-full flex items-center justify-between gap-4 text-left py-4 px-4 md:px-5 font-bold text-sm md:text-base transition-colors ${
                    isOpen
                      ? "bg-[#FEF3C7] text-gray-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200/80"
                  }`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="flex-1 pr-2">{faq.title}</span>
                  <span
                    className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isOpen
                        ? "border border-gray-600 bg-transparent text-gray-700"
                        : "border border-gray-400 bg-white text-gray-600"
                    }`}
                    aria-hidden
                  >
                    {isOpen ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className="overflow-hidden transition-all duration-200"
                  style={{
                    maxHeight: isOpen ? "2000px" : "0",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="bg-white px-4 md:px-5 py-4 md:py-5 border-t border-gray-200">
                    {faq.image && (
                      <img
                        src={faq.image}
                        alt=""
                        className="rounded-lg mb-3 max-h-48 object-cover w-full"
                      />
                    )}
                    <div
                      className="faq-answer text-sm md:text-base text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: faq.content.replace(/\n/g, "<br />") }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
