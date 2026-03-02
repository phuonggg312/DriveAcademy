export const blogfilters = {
    name: 'blogfilters',
    component() {
        return {
            selectedTags: [],
            init() {
            },
            setTag(tag) {
                console.log('setTag', tag);
                if (this.selectedTags.includes(tag)) {
                    this.selectedTags = this.selectedTags.filter(t => t !== tag);
                } else {
                    this.selectedTags.push(tag);
                }
                console.log('setTag', this.selectedTags);
                this.dispatchFiltersUpdatedEvent();
            },
            isTagSelected(tag) {
                return this.selectedTags.length === 0 || this.selectedTags.includes(tag);
            },
            dispatchFiltersUpdatedEvent() {
                const event = new CustomEvent('blog-filters-updated', {
                    detail: { selectedTags: this.selectedTags }
                });
                window.dispatchEvent(event);
            },
        }
    }
}

export default blogfilters;
