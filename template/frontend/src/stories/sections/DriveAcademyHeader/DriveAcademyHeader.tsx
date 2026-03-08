import React, { useState } from "react";

type NavLink = { title: string; url: string; children?: { title: string; url: string }[] };

export const DriveAcademyHeader = ({ settings }: { settings: any }) => {
    const { section = {}, links = [] } = settings;
    const { logo_text, logo_image_url, cta_text, cta_url = "#", sticky = true, show_cart = true, cart_count = 0 } = section ?? {};

    const [mobileOpen, setMobileOpen] = useState(false);
    const navLinks: NavLink[] = Array.isArray(links) ? links : [];

    return (
      <header
        className={`drive-academy-header w-full py-3 md:py-4 ${
          sticky ? 'sticky top-0 z-30' : ''
        } bg-black/80 backdrop-blur-sm text-white`}
      >
        <div className="flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 no-underline text-white shrink-0">
            {logo_image_url ? (
              <img src={logo_image_url} alt={logo_text || "Logo"} className="h-8 md:h-10 w-auto object-contain object-left" />
            ) : (
              <>
                <span className="w-10 h-10 rounded-full bg-[rgb(var(--color-button))] text-[rgb(var(--color-button-text))] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="text-lg md:text-xl font-bold">{logo_text}</span>
              </>
            )}
          </a>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Main">
            {navLinks.map((link, i) => {
              const isHome = link.title.toLowerCase() === "home";
              return (
                <a
                  key={i}
                  href={link.url}
                  className={`text-sm md:text-base font-medium no-underline transition-colors ${
                    isHome ? "text-[rgb(var(--color-button))]" : "text-white hover:text-[rgb(var(--color-button))]"
                  }`}
                >
                  {link.title}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {show_cart && (
              <a
                href="/cart"
                className="flex items-center justify-center w-10 h-10 text-white hover:text-[rgb(var(--color-button))] transition-colors relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-button))] focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
                aria-label="Cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cart_count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-[rgb(var(--color-button))] text-[rgb(var(--color-button-text))] text-xs font-bold flex items-center justify-center px-1">
                    {cart_count > 99 ? '99+' : cart_count}
                  </span>
                )}
              </a>
            )}
            <a
              href={cta_url || '#'}
              className="inline-flex items-center gap-2 bg-[rgb(var(--color-button))] text-[rgb(var(--color-button-text))] font-bold text-sm md:text-base px-4 py-2 md:px-5 md:py-2.5 rounded-full no-underline hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-button))] focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
            >
              <span>{cta_text}</span>
              <span className="w-8 h-8 rounded-full bg-[rgb(var(--color-button-text))] text-[rgb(var(--color-button))] flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>
            <button
              type="button"
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white hover:text-[#F0D32A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F0D32A] focus-visible:ring-offset-2 focus-visible:ring-offset-black/80"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-white/10 py-4 px-4">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  className="block py-2.5 px-3 text-white hover:text-[rgb(var(--color-button))] no-underline font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.title}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>
    );
};
