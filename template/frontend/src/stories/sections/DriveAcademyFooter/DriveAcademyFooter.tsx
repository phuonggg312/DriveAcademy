import React, { useState } from "react";

const socialIconClass = "w-10 h-10 rounded-full bg-[rgb(var(--color-background-contrast))] flex items-center justify-center text-inherit hover:opacity-90 transition-opacity flex-shrink-0";

export const DriveAcademyFooter = ({ settings }: { settings: any }) => {
    const { section = {}, quick_links = [], courses = [] } = settings;
    const { logo_text, description, facebook_url, twitter_url, instagram_url, linkedin_url, quick_links_title, courses_title, newsletter_heading, newsletter_description, newsletter_placeholder, copyright } = section ?? {};

    const [email, setEmail] = useState('');

    const handleNewsletterSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      (e.target as HTMLFormElement).submit();
    };

    return (
      <footer className="drive-academy-footer text-inherit relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px),
              linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-[1] container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-10 rounded-full bg-[rgb(var(--color-button))] text-[rgb(var(--color-button-text))] flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                <span className="text-xl md:text-2xl font-bold">{logo_text}</span>
              </div>
              {description && (
                <p className="text-sm opacity-90 leading-relaxed mb-6 max-w-sm">{description}</p>
              )}
              <p className="text-sm font-bold mb-3">Follow Us On Social:</p>
              <div className="flex gap-3">
                {facebook_url && (
                  <a href={facebook_url} className={socialIconClass} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                )}
                {twitter_url && (
                  <a href={twitter_url} className={socialIconClass} aria-label="X (Twitter)" target="_blank" rel="noopener noreferrer">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                )}
                {instagram_url && (
                  <a href={instagram_url} className={socialIconClass} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.919 0 3.274-.011 3.654-.069 4.919-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.85-.07-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.644-.07-4.919 0-3.274.012-3.654.07-4.919.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                )}
                {linkedin_url && (
                  <a href={linkedin_url} className={socialIconClass} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                )}
              </div>
            </div>

            <div>
              {quick_links_title && (
                <p className="text-base font-bold mb-4">{quick_links_title}</p>
              )}
              <ul className="space-y-2">
                {Array.isArray(quick_links) && quick_links.map((link: { title: string; url: string }, i: number) => (
                  <li key={i}>
                    <a href={link.url || '#'} className="flex items-center gap-2 text-sm opacity-90 hover:opacity-100 text-[rgb(var(--color-link))] transition-colors no-underline">
                      <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-button))] flex-shrink-0" aria-hidden />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {courses_title && (
                <p className="text-base font-bold mb-4">{courses_title}</p>
              )}
              <ul className="space-y-2">
                {Array.isArray(courses) && courses.map((link: { title: string; url: string }, i: number) => (
                  <li key={i}>
                    <a href={link.url || '#'} className="flex items-center gap-2 text-sm opacity-90 hover:opacity-100 text-[rgb(var(--color-link))] transition-colors no-underline">
                      <span className="w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-button))] flex-shrink-0" aria-hidden />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {newsletter_heading && (
                <p className="text-base font-bold mb-4">{newsletter_heading}</p>
              )}
              {newsletter_description && (
                <p className="text-sm opacity-90 leading-relaxed mb-4">{newsletter_description}</p>
              )}
              <form
                action="/contact#contact_form"
                method="post"
                onSubmit={handleNewsletterSubmit}
                className="flex gap-2 items-end"
              >
                <input type="hidden" name="utf8" value="✓" />
                <div className="flex-1 min-w-0 border-b border-[rgb(var(--color-shadow))] focus-within:border-[rgb(var(--color-button))] transition-colors">
                  <input
                    type="email"
                    name="contact[email]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={newsletter_placeholder}
                    className="w-full bg-transparent text-inherit placeholder:opacity-60 text-sm py-2 outline-none border-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-12 h-12 rounded-full bg-[rgb(var(--color-button))] text-[rgb(var(--color-button-text))] flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-button))] focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-background))]"
                  aria-label="Subscribe"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="relative z-[1] border-t border-[rgb(var(--color-shadow))] opacity-80">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <p className="text-center text-sm opacity-80">{copyright}</p>
          </div>
        </div>
    </footer>
  );
};
