import {debounce} from "alpinejs/src/utils/debounce";

class FacetFiltersForm extends HTMLElement {
    constructor() {
        super();
        this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

        this.debouncedOnSubmit = debounce((event) => {
            this.onSubmitHandler(event);
        }, 200);

        const facetForm = this.querySelector('form');
        facetForm.addEventListener('input', this.debouncedOnSubmit.bind(this));

        const facetWrapper = this.querySelector('#FacetsWrapperDesktop');
        // if (facetWrapper) facetWrapper.addEventListener('keyup', onKeyUpEscape);

        document.addEventListener('click', function(event) {
            // Get all open details elements
            const openDetailsElements = document.querySelectorAll('details[open]');

            // Loop through all open details elements
            openDetailsElements.forEach(function(details) {
                // Check if the click target is not within the current details element
                if (!details.contains(event.target)) {
                    // Close the details element by removing the open attribute
                    details.removeAttribute('open');
                }
            });
        });
    }

    static setListeners() {
        const onHistoryChange = (event) => {
            const searchParams = event.state ? event.state.searchParams : FacetFiltersForm.searchParamsInitial;
            if (searchParams === FacetFiltersForm.searchParamsPrev) return;
            FacetFiltersForm.renderPage(searchParams, null, false);
        };
        window.addEventListener('popstate', onHistoryChange);
    }

    static toggleActiveFacets(disable = true) {
        document.querySelectorAll('.js-facet-remove').forEach((element) => {
            element.classList.toggle('disabled', disable);
        });
    }

    static renderPage(searchParams, event, updateURLHash = true) {
        FacetFiltersForm.searchParamsPrev = searchParams;
        const sections = FacetFiltersForm.getSections();
        const countContainerDesktop = document.getElementById('ProductCountDesktop');
        const loadingSpinners = document.querySelectorAll(
            '.facets-container .loading__spinner, facet-filters-form .loading__spinner'
        );
        loadingSpinners.forEach((spinner) => spinner.classList.remove('hidden'));
        document.getElementById('product-grid').classList.add('loading');

        const details = document.querySelectorAll('details')
        details.forEach((detail) => {
            detail.removeAttribute("open");
        });

        sections.forEach((section) => {
            const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
            const filterDataUrl = (element) => element.url === url;

            FacetFiltersForm.filterData.some(filterDataUrl)
                ? FacetFiltersForm.renderSectionFromCache(filterDataUrl, event)
                : FacetFiltersForm.renderSectionFromFetch(url, event);
        });

        if (updateURLHash) FacetFiltersForm.updateURLHash(searchParams);
    }

    static renderSectionFromFetch(url, event) {
        fetch(url)
            .then((response) => response.text())
            .then((responseText) => {
                const html = responseText;
                FacetFiltersForm.filterData = [...FacetFiltersForm.filterData, { html, url }];
                FacetFiltersForm.renderFilters(html, event);
                FacetFiltersForm.renderProductGridContainer(html);
                FacetFiltersForm.renderProductCount(html);
                if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
            });
    }

    static renderSectionFromCache(filterDataUrl, event) {
        const html = FacetFiltersForm.filterData.find(filterDataUrl).html;
        FacetFiltersForm.renderFilters(html, event);
        FacetFiltersForm.renderProductGridContainer(html);
        FacetFiltersForm.renderProductCount(html);
        if (typeof initializeScrollAnimationTrigger === 'function') initializeScrollAnimationTrigger(html.innerHTML);
    }

    static renderProductGridContainer(html) {
        document.getElementById('ProductGridContainer').innerHTML = new DOMParser()
            .parseFromString(html, 'text/html')
            .getElementById('ProductGridContainer').innerHTML;

        document
            .getElementById('ProductGridContainer')
            .querySelectorAll('.scroll-trigger')
            .forEach((element) => {
                element.classList.add('scroll-trigger--cancel');
            });

        this.initObserverAnimation();
    }
    static initObserverAnimation(){
        var observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    var delay = entry.target.dataset.animationDelay || '0s';
                    entry.target.style.animationDelay = delay;
                    entry.target.classList.add('start-animation');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        // Target the elements to animate
        var elementsToAnimate = document.querySelectorAll('.animated-element');
        elementsToAnimate.forEach(function(element) {
            observer.observe(element);
        });
    }
    static renderProductCount(html) {
        const count = new DOMParser().parseFromString(html, 'text/html').getElementById('ProductCountDesktop').innerHTML;
        const containerDesktop = document.getElementById('ProductCountDesktop');

        if (containerDesktop) {
            containerDesktop.innerHTML = count
            containerDesktop.classList.remove('loading');
        }
        const loadingSpinners = document.querySelectorAll(
            '.facets-container .loading__spinner, facet-filters-form .loading__spinner'
        );
        loadingSpinners.forEach((spinner) => spinner.classList.add('hidden'));
    }

    static renderFilters(html, event) {
        const parsedHTML = new DOMParser().parseFromString(html, 'text/html');
        const facetDetailsElementsFromFetch = parsedHTML.querySelectorAll(
            '#FacetFiltersForm .js-filter, #FacetFiltersPillsForm .js-filter'
        );
        const facetDetailsElementsFromDom = document.querySelectorAll(
            '#FacetFiltersForm .js-filter, #FacetFiltersPillsForm .js-filter'
        );

        // Remove facets that are no longer returned from the server
        Array.from(facetDetailsElementsFromDom).forEach((currentElement) => {
            if (!Array.from(facetDetailsElementsFromFetch).some(({ id }) => currentElement.id === id)) {
                currentElement.remove();
            }
        });

        const matchesId = (element) => {
            const jsFilter = event ? event.target.closest('.js-filter') : undefined;
            return jsFilter ? element.id === jsFilter.id : false;
        };
        const facetsToRender = Array.from(facetDetailsElementsFromFetch).filter((element) => !matchesId(element));
        const countsToRender = Array.from(facetDetailsElementsFromFetch).find(matchesId);

        facetsToRender.forEach((elementToRender, index) => {
            const currentElement = document.getElementById(elementToRender.id);
            // Element already rendered in the DOM so just update the innerHTML
            if (currentElement) {
                document.getElementById(elementToRender.id).innerHTML = elementToRender.innerHTML;
            } else {
                if (index > 0) {
                    const { className: previousElementClassName, id: previousElementId } = facetsToRender[index - 1];
                    // Same facet type (eg horizontal/vertical or drawer/mobile)
                    if (elementToRender.className === previousElementClassName) {
                        document.getElementById(previousElementId).after(elementToRender);
                        return;
                    }
                }

                if (elementToRender.parentElement) {
                    document.querySelector(`#${elementToRender.parentElement.id} .js-filter`).before(elementToRender);
                }
            }
        });

        FacetFiltersForm.renderActiveFacets(parsedHTML);
        FacetFiltersForm.renderAdditionalElements(parsedHTML);

        if (countsToRender) {
            const closestJSFilterID = event.target.closest('.js-filter').id;

            if (closestJSFilterID) {
                FacetFiltersForm.renderCounts(countsToRender, event.target.closest('.js-filter'));
                FacetFiltersForm.renderMobileCounts(countsToRender, document.getElementById(closestJSFilterID));

                const newFacetDetailsElement = document.getElementById(closestJSFilterID);
                const newElementSelector = newFacetDetailsElement.classList.contains('mobile-facets__details')
                    ? `.mobile-facets__close-button`
                    : `.facets__summary`;
                const newElementToActivate = newFacetDetailsElement.querySelector(newElementSelector);
                if (newElementToActivate) newElementToActivate.focus();
            }
        }
    }

    static renderActiveFacets(html) {
        const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];

        activeFacetElementSelectors.forEach((selector) => {
            const activeFacetsElement = html.querySelector(selector);
            if (!activeFacetsElement) return;
            document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
        });

        FacetFiltersForm.toggleActiveFacets(false);
    }

    static renderAdditionalElements(html) {
        const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count', '.sorting'];

        mobileElementSelectors.forEach((selector) => {
            if (!html.querySelector(selector)) return;
            document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
        });

    }

    static renderCounts(source, target) {
        const targetSummary = target.querySelector('.facets__summary');
        const sourceSummary = source.querySelector('.facets__summary');

        if (sourceSummary && targetSummary) {
            targetSummary.outerHTML = sourceSummary.outerHTML;
        }

        const targetHeaderElement = target.querySelector('.facets__header');
        const sourceHeaderElement = source.querySelector('.facets__header');

        if (sourceHeaderElement && targetHeaderElement) {
            targetHeaderElement.outerHTML = sourceHeaderElement.outerHTML;
        }

        const targetWrapElement = target.querySelector('.facets-wrap');
        const sourceWrapElement = source.querySelector('.facets-wrap');

        if (sourceWrapElement && targetWrapElement) {
            const isShowingMore = Boolean(target.querySelector('show-more-button .label-show-more.hidden'));
            if (isShowingMore) {
                sourceWrapElement
                    .querySelectorAll('.facets__item.hidden')
                    .forEach((hiddenItem) => hiddenItem.classList.replace('hidden', 'show-more-item'));
            }

            targetWrapElement.outerHTML = sourceWrapElement.outerHTML;
        }
    }

    static renderMobileCounts(source, target) {
        const targetFacetsList = target.querySelector('.mobile-facets__list');
        const sourceFacetsList = source.querySelector('.mobile-facets__list');

        if (sourceFacetsList && targetFacetsList) {
            targetFacetsList.outerHTML = sourceFacetsList.outerHTML;
        }
    }

    static updateURLHash(searchParams) {
        history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
    }

    static getSections() {
        return [
            {
                section: document.getElementById('product-grid').dataset.id,
            },
        ];
    }

    createSearchParams(form) {
        const formData = new FormData(form);
        return new URLSearchParams(formData).toString();
    }

    onSubmitForm(searchParams, event) {
        FacetFiltersForm.renderPage(searchParams, event);
    }

    onSubmitHandler(event) {
        event.preventDefault();
        const sortFilterForms = document.querySelectorAll('facet-filters-form form');
        if (event.srcElement.className == 'mobile-facets__checkbox') {
            const searchParams = this.createSearchParams(event.target.closest('form'));
            this.onSubmitForm(searchParams, event);
        } else {
            const forms = [];
            const isMobile = event.target.closest('form').id === 'FacetFiltersFormMobile';

            sortFilterForms.forEach((form) => {
                if (!isMobile) {
                    if (form.id === 'FacetSortForm' || form.id === 'FacetFiltersForm' || form.id === 'FacetSortDrawerForm') {
                        const noJsElements = document.querySelectorAll('.no-js-list');
                        noJsElements.forEach((el) => el.remove());
                        forms.push(this.createSearchParams(form));
                    }
                } else if (form.id === 'FacetFiltersFormMobile') {
                    forms.push(this.createSearchParams(form));
                }
            });
            this.onSubmitForm(forms.join('&'), event);
        }
    }

    onActiveFilterClick(event) {
        event.preventDefault();
        FacetFiltersForm.toggleActiveFacets();
        const url =
            event.currentTarget.href.indexOf('?') == -1
                ? ''
                : event.currentTarget.href.slice(event.currentTarget.href.indexOf('?') + 1);
        FacetFiltersForm.renderPage(url);
    }
}

FacetFiltersForm.filterData = [];
FacetFiltersForm.searchParamsInitial = window.location.search.slice(1);
FacetFiltersForm.searchParamsPrev = window.location.search.slice(1);
customElements.define('facet-filters-form', FacetFiltersForm);
FacetFiltersForm.setListeners();

class PriceRange extends HTMLElement {
    constructor() {
        super();
        this.querySelectorAll('input').forEach((element) =>
            element.addEventListener('change', this.onRangeChange.bind(this))
        );
        this.setMinAndMaxValues();
    }

    onRangeChange(event) {
        this.adjustToValidValues(event.currentTarget);
        this.setMinAndMaxValues();
    }

    setMinAndMaxValues() {
        const inputs = this.querySelectorAll('input');
        const minInput = inputs[0];
        const maxInput = inputs[1];
        if (maxInput.value) minInput.setAttribute('max', maxInput.value);
        if (minInput.value) maxInput.setAttribute('min', minInput.value);
        if (minInput.value === '') maxInput.setAttribute('min', 0);
        if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
    }

    adjustToValidValues(input) {
        const value = Number(input.value);
        const min = Number(input.getAttribute('min'));
        const max = Number(input.getAttribute('max'));

        if (value < min) input.value = min;
        if (value > max) input.value = max;
    }
}

customElements.define('price-range', PriceRange);

class FacetRemove extends HTMLElement {
    constructor() {
        super();
        const facetLink = this.querySelector('a');
        facetLink.setAttribute('role', 'button');
        facetLink.addEventListener('click', this.closeFilter.bind(this));
        facetLink.addEventListener('keyup', (event) => {
            event.preventDefault();
            if (event.code.toUpperCase() === 'SPACE') this.closeFilter(event);
        });
    }

    closeFilter(event) {
        event.preventDefault();
        const form = this.closest('facet-filters-form') || document.querySelector('facet-filters-form');
        form.onActiveFilterClick(event);
    }
}

customElements.define('facet-remove', FacetRemove);
