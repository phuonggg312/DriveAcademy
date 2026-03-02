
import helpers from "../../../../helpers";

export const pagination = {
    name: 'pagination',
    component() {
        return {
            current_page: 0,
            items_total: 0,
            per_page: 0,
            pages: 0,
            pageOffset: 1,
            showViewMore: false,
            currentItemsViewed: 0,
            object_name: '',
            isInit: false,
            collectionCurrentlyViewed: null,
            init(items_total, per_page, useViewMore = false, object_name = 'products', currentResultsCount = null) {

                console.log('Pagination', `${object_name} - Per Page: ${per_page} - Total: ${items_total}`);
                const paginationContainer = this.$refs.paginationContainer;

                if (items_total && per_page) {
                    this.items_total = items_total;
                    this.object_name = object_name;
                    this.per_page = per_page;
                    this.pages = Math.ceil(items_total / per_page);
                    this.showViewMore = useViewMore;
                    this.currentItemsViewed = currentResultsCount ?? this.per_page;
                    this.current_page = 0;

                    if (this.current_page + this.pageOffset === this.pages) {
                        this.currentItemsViewed = this.items_total;
                    }

                    this.$nextTick(() => {
                        if (this.showViewMore) {
                            this.renderViewMoreButton();
                        } else {
                            this.renderPagination();
                        }

                        paginationContainer.classList.remove('hidden');
                    });
                    // window.addEventListener('currently-viewed', this.handleCurrentlyViewed.bind(this));
                    window.addEventListener('current-products-updated', this.handleCurrentlyViewed.bind(this));
                    window.dispatchEvent(new CustomEvent('pagination-have-loaded'));

                } else if (!items_total) {
                    paginationContainer.classList.add('hidden');
                }

            },
            handleCurrentlyViewed(event) {
                this.collectionCurrentlyViewed = event.detail.totalViewed;
                this.renderViewMoreButton();
            },
            renderPagination() {
                const paginationContainer = this.$refs.paginationContainer;
                paginationContainer.innerHTML = ''; // Clear existing pagination

                // Create and append the "Previous" button
                const prevButton = document.createElement('button');
                prevButton.innerText = '← Previous';
                prevButton.disabled = this.current_page === 1;
                prevButton.className = 'px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50';
                prevButton.onclick = () => this.prevPage();
                paginationContainer.appendChild(prevButton);

                // Create and append page numbers
                for (let p = 1; p <= this.pages; p++) {
                    const pageButton = document.createElement('button');
                    pageButton.innerText = p.toString();
                    pageButton.className = `mx-1 px-3 py-1 rounded hover:bg-gray-200 ${this.current_page === p ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`;
                    pageButton.onclick = () => this.gotoPage(p);
                    paginationContainer.appendChild(pageButton);
                }

                // Create and append the "Next" button
                const nextButton = document.createElement('button');
                nextButton.innerText = 'Next →';
                nextButton.disabled = this.current_page === this.pages;
                nextButton.className = 'px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50';
                nextButton.onclick = () => this.nextPage();
                paginationContainer.appendChild(nextButton);
            },
            renderViewMoreButton() {
                const paginationContainer = this.$refs.paginationContainer;
                paginationContainer.innerHTML = ''; // Clear existing controls
                paginationContainer.className = 'view-more';

                const viewedCount = this.collectionCurrentlyViewed ? this.collectionCurrentlyViewed : this.currentItemsViewed;
                const renderLoadMore = this.collectionCurrentlyViewed
                    ? this.collectionCurrentlyViewed < this.items_total
                    : (this.current_page + this.pageOffset) < this.pages;

                if (renderLoadMore) {
                    const viewMoreButton = document.createElement('button');
                    viewMoreButton.innerText = `Load More (${viewedCount}/${this.items_total})`;
                    viewMoreButton.className = 'view-more__button button-secondary w-auto';
                    viewMoreButton.onclick = helpers.debounce(() => this.nextPage(), 300);
                    paginationContainer.appendChild(viewMoreButton);
                }
            },
            prevPage() {
                if ((this.current_page + this.pageOffset) > 1) {
                    this.gotoPage(this.current_page - this.pageOffset);
                }
            },
            nextPage() {
                const goToNextPage = this.collectionCurrentlyViewed
                    ? this.collectionCurrentlyViewed < this.items_total
                    : (this.current_page + this.pageOffset) < this.pages

                if (goToNextPage) {
                    this.current_page = this.current_page + this.pageOffset;

                    if (this.showViewMore) {
                        const productsShown = this.collectionCurrentlyViewed
                            ? this.collectionCurrentlyViewed
                            : (this.current_page + this.pageOffset) * this.per_page;

                        if (productsShown <= this.items_total) {
                            this.currentItemsViewed = productsShown;
                        } else {
                            this.currentItemsViewed = this.items_total;
                        }

                        window.dispatchEvent(new CustomEvent('nextpage', {
                            detail: {
                                type: 'pagination',
                                page: this.current_page
                            }
                        }));

                        this.renderViewMoreButton();
                    } else {
                        this.renderPagination();
                    }
                }
            },
            gotoPage(page) {
                this.current_page = page;
                this.renderPagination();
            },
        }
    }
}

export default pagination;
