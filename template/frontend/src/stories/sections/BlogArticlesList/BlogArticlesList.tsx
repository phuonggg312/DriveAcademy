import React from "react";

type Article = {
  title: string;
  url: string;
  image: string | null;
  published_at: string;
  author: string;
  category: string;
};

type PaginationPart = { title: string; url: string | null; is_link: boolean };

type Props = {
  initialArticles: Article[];
  settings: {
    section?: {
      title?: string;
      columns_count?: number;
      show_image?: boolean;
      show_date?: boolean;
      show_author?: boolean;
      read_more_text?: string;
    };
    blog?: { title: string; handle: string };
    read_more_text?: string;
    pagination?: {
      previous_url: string | null;
      next_url: string | null;
      current_page: number;
      pages: number;
      parts: PaginationPart[];
    };
  };
};

export function BlogArticlesList({ initialArticles = [], settings }: Props) {
  const section = settings.section ?? {};
  const readMore = settings.read_more_text ?? section.read_more_text ?? "READ MORE";
  const columns = section.columns_count ?? 3;
  const showImage = section.show_image !== false;
  const showDate = section.show_date !== false;
  const showAuthor = section.show_author !== false;
  const pagination = settings.pagination;
  const sectionTitle = section.title;

  return (
    <div className="blog-articles-list text-inherit">
      {sectionTitle && (
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">
          {sectionTitle}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-12">
        {initialArticles.map((article: Article, index: number) => (
          <article
            key={article.url || index}
            className="flex flex-col rounded-b-xl overflow-hidden shadow-sm border border-[rgb(var(--color-shadow))] bg-[rgb(var(--color-background-contrast))]"
          >
            <div className="relative flex">
              {showDate && (
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-10 flex items-center justify-center z-10 py-2 bg-[rgb(var(--color-shadow))]">
                  <span
                    className="text-[10px] md:text-xs font-semibold text-[rgb(var(--color-button-text))] uppercase"
                    style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                  >
                    {article.published_at}
                  </span>
                </div>
              )}
              <div className="flex-1 min-h-[200px] md:min-h-[240px] overflow-hidden pl-8 md:pl-10 bg-[rgb(var(--color-background))]">
                {showImage && article.image ? (
                  <img
                    src={article.image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : showImage ? (
                  <div className="w-full h-full flex items-center justify-center opacity-50">
                    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
                    </svg>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="p-4 md:p-5 flex flex-col flex-1 rounded-b-xl border-t border-[rgb(var(--color-shadow))]">
              {article.category && (
                <p className="text-xs font-bold uppercase tracking-wider opacity-90 mb-2">
                  {article.category}
                </p>
              )}
              {showAuthor && article.author && (
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
                <span>{readMore}</span>
                <span aria-hidden>→</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <nav className="flex items-center justify-center gap-2 flex-wrap" aria-label="Pagination">
          {pagination.previous_url ? (
            <a
              href={pagination.previous_url}
              className="inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded border border-[rgb(var(--color-shadow))] text-inherit no-underline hover:opacity-80 transition-opacity"
              aria-label="Previous page"
            >
              &lt;
            </a>
          ) : (
            <span className="inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded border border-[rgb(var(--color-shadow))] opacity-50" aria-hidden>
              &lt;
            </span>
          )}
          <div className="flex items-center gap-1">
            {pagination.parts.map((part: PaginationPart, i: number) =>
              part.is_link && part.url ? (
                <a
                  key={i}
                  href={part.url}
                  className="inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded border border-[rgb(var(--color-shadow))] text-inherit no-underline hover:opacity-80 transition-opacity"
                >
                  {part.title}
                </a>
              ) : (
                <span
                  key={i}
                  className="inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded border-2 border-[rgb(var(--color-button))] font-semibold"
                  aria-current="page"
                >
                  {part.title}
                </span>
              )
            )}
          </div>
          {pagination.next_url ? (
            <a
              href={pagination.next_url}
              className="inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded border border-[rgb(var(--color-shadow))] text-inherit no-underline hover:opacity-80 transition-opacity"
              aria-label="Next page"
            >
              &gt;
            </a>
          ) : (
            <span className="inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded border border-[rgb(var(--color-shadow))] opacity-50" aria-hidden>
              &gt;
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
