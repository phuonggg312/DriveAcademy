import shopify from "../../../shopify";

export const blog = {
    name: 'blog',
    component() {
        return {
            selectedTags: [],
            init() {
                window.addEventListener('blog-filters-updated', this.handleFiltersApplied.bind(this));
            },
            async handleFiltersApplied(event) {
                this.selectedTags = event.detail.selectedTags;
                console.log('Filters applied:', this.selectedTags);
                console.log('Filtering articles based on:', this.selectedTags);
                const tagFilters = this.selectedTags.map(tag => `category:${tag}`);
                const articles = await shopify.getShopifyArticleList(tagFilters);
                this.dispatchArticlesCompleteEvent(articles);
            },
            dispatchArticlesCompleteEvent(articles) {
                const event = new CustomEvent('blog-articles-complete', {
                    detail: { articles }
                });
                window.dispatchEvent(event);
            }
        }
    }
}

export default blog;
