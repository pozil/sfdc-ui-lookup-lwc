const { createLookupElement, flushPromises, SAMPLE_SEARCH_ITEMS } = require('./lookupTest.utils');

describe('c-lookup exposed functions', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('getSelection returns correct selection when initial selection is an array', () => {
        // Create lookup
        const lookupEl = createLookupElement({
            selection: SAMPLE_SEARCH_ITEMS
        });

        // Verify selection
        const selection = lookupEl.getSelection();
        expect(selection.length).toBe(2);
    });

    it('getSelection returns correct selection when initial selection is a single item', () => {
        // Create lookup
        const lookupEl = createLookupElement({
            selection: SAMPLE_SEARCH_ITEMS[0]
        });

        // Verify selection
        const selection = lookupEl.getSelection();
        expect(selection.length).toBe(1);
    });

    it('setSearchResults renders correct results', () => {
        // Create lookup
        const lookupEl = createLookupElement();
        lookupEl.setSearchResults(SAMPLE_SEARCH_ITEMS);

        // Query for rendered list items
        return flushPromises().then(() => {
            const listItemEls = lookupEl.shadowRoot.querySelectorAll('li');
            expect(listItemEls.length).toBe(SAMPLE_SEARCH_ITEMS.length);
            const resultItemEls = listItemEls[0].querySelectorAll('lightning-formatted-rich-text');
            expect(resultItemEls.length).toBe(2);
        });
    });
});
