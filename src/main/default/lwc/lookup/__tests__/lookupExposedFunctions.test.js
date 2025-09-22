import { createLookupElement, inputSearchTerm, flushPromises, SAMPLE_SEARCH_ITEMS } from './lookupTest.utils';

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

    it('setSearchResults renders correct results', async () => {
        // Create lookup
        const lookupEl = createLookupElement();
        lookupEl.setSearchResults(SAMPLE_SEARCH_ITEMS);
        await flushPromises();

        // Query for rendered list items
        const listItemEls = lookupEl.shadowRoot.querySelectorAll('li');
        expect(listItemEls.length).toBe(SAMPLE_SEARCH_ITEMS.length);
        const resultItemEls = listItemEls[0].querySelectorAll('lightning-formatted-rich-text');
        expect(resultItemEls.length).toBe(2);
    });

    it('setSearchResults supports special regex characters in search term', async () => {
        jest.useFakeTimers();

        // Create lookup with search handler
        const lookupEl = createLookupElement();
        const searchFn = (event) => {
            event.target.setSearchResults(SAMPLE_SEARCH_ITEMS);
        };
        lookupEl.addEventListener('search', searchFn);

        // Simulate search term input with regex characters
        await inputSearchTerm(lookupEl, '[ab');

        // Query for rendered list items
        const listItemEls = lookupEl.shadowRoot.querySelectorAll('li');
        expect(listItemEls.length).toBe(SAMPLE_SEARCH_ITEMS.length);
    });

    it('focuses', async () => {
        // Create lookup
        const lookupEl = createLookupElement();
        lookupEl.focus();

        // Verify focus
        expect(document.activeElement).toEqual(lookupEl);
    });

    it('blurs removes focus and closes dropdown', async () => {
        jest.useFakeTimers();

        // Create lookup with search handler
        const lookupEl = createLookupElement();
        const searchFn = (event) => {
            event.target.setSearchResults(SAMPLE_SEARCH_ITEMS);
        };
        lookupEl.addEventListener('search', searchFn);

        // Simulate search term input (forces focus on lookup and opens drowdown)
        await inputSearchTerm(lookupEl, 'sample');

        // Blur
        lookupEl.blur();
        await flushPromises();

        // Check that lookup no longer has focus and that dropdown is closed
        expect(document.activeElement).not.toBe(lookupEl);
        const dropdownEl = lookupEl.shadowRoot.querySelector('div[role="combobox"]');
        expect(dropdownEl.classList).not.toContain('slds-is-open');
    });

    it('reports valid by default', async () => {
        // Create lookup
        const lookupEl = createLookupElement();

        // Verify validity
        expect(lookupEl.validity).toEqual({ valid: true });
    });

    it('reports non valid when there are errors', async () => {
        // Create lookup
        const lookupEl = createLookupElement();
        lookupEl.errors = [{ id: 'e1', message: 'Some error' }];

        // Verify validity
        expect(lookupEl.validity).toEqual({ valid: false });
    });
});
