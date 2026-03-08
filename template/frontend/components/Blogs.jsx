import { lazyComponents } from "@src/utils/LazyComponent";

BlogArticlesListComponent.displayName = 'theme__blog-articles-list';
export function BlogArticlesListComponent({ ...props }) {
    const BlogArticlesList = lazyComponents['BlogArticlesList'];
    const { articles } = props.settings;

    return (
        <BlogArticlesList initialArticles={articles} settings={props.settings} />
    );
}

FeaturedBlogComponent.displayName = 'theme__blog-featured_blog';
export function FeaturedBlogComponent({ ...props }) {
    const FeaturedBlog = lazyComponents['FeaturedBlog'];
    return (
        <FeaturedBlog article={props.settings.article} settings={props.settings.section} />
    );
}

BlogArticleTileComponent.displayName = 'theme__blog-tile';
export function BlogArticleTileComponent({ ...props }) {
    const BlogArticleTile = lazyComponents['BlogArticleTile'];
    return (
        <BlogArticleTile article={props.settings.article} />
    );
}

SocialShareComponent.displayName = '';
export function SocialShareComponent({ ...props }) {
    const SocialShare = lazyComponents['SocialShare'];
    return (
        <SocialShare props={props.settings} />
    );
}

BlogFiltersComponent.displayName = 'theme__blog-filters';
export function BlogFiltersComponent({ ...props }) {
    const BlogFilters = lazyComponents['BlogFilters'];
    return (
        <BlogFilters settings={props.settings} />
    );
}
