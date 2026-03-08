import React from "react";

type Article = {
  title?: string;
  url?: string;
  handle?: string;
  image?: string | null;
  published_at?: string;
  author?: string;
  tags?: string[];
  blog?: { title?: string; handle?: string };
};

type Props = {
  article: Article;
  readMoreText?: string;
};

export function BlogArticleTile({ article, readMoreText = "READ MORE" }: Props) {
  const category = article.tags?.[0] ?? article.blog?.title ?? "NEWS";

  return (
    <article className="flex flex-col rounded-b-xl overflow-hidden shadow-sm border border-[rgb(var(--color-shadow))] bg-[rgb(var(--color-background-contrast))] text-inherit">
      <div className="relative flex">
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-10 flex items-center justify-center z-10 py-2 bg-[rgb(var(--color-shadow))]">
          <span
            className="text-[10px] md:text-xs font-semibold text-[rgb(var(--color-button-text))] uppercase"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            {article.published_at || "—"}
          </span>
        </div>
        <div className="flex-1 min-h-[200px] md:min-h-[240px] overflow-hidden pl-8 md:pl-10 bg-[rgb(var(--color-background))]">
          {article.image ? (
            <img
              src={article.image}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-50">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
              </svg>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 md:p-5 flex flex-col flex-1 rounded-b-xl border-t border-[rgb(var(--color-shadow))]">
        <p className="text-xs font-bold uppercase tracking-wider opacity-90 mb-2">
          {category}
        </p>
        {article.author && (
          <p className="flex items-center gap-1.5 text-sm opacity-90 mb-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>{article.author}</span>
          </p>
        )}
        {article.title && (
          <p className="text-base md:text-lg font-bold mb-3 leading-tight flex-1">
            {article.title}
          </p>
        )}
        <a
          href={article.url || "#"}
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider border-t border-[rgb(var(--color-shadow))] pt-3 mt-auto hover:opacity-80 transition-opacity no-underline text-[rgb(var(--color-link))]"
        >
          <span>{readMoreText}</span>
          <span aria-hidden>→</span>
        </a>
      </div>
    </article>
  );
}
