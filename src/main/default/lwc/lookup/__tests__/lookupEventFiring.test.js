const { createLookupElement, SAMPLE_SEARCH_ITEMS } = require('./lookupTest.utils');

const SAMPLE_SEARCH_TOO_SHORT = 'A ';
const SAMPLE_SEARCH_RAW = 'Sample search* ';
const SAMPLE_SEARCH_CLEAN = 'sample search';

describe('c-lookup event fires', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('search event fires', () => {
        jest.useFakeTimers();

        // Create lookup with mock search handler
        const lookupEl = createLookupElement({
            isMultiEntry: true,
            selection: SAMPLE_SEARCH_ITEMS
        });
        const mockSearchFn = jest.fn();
        lookupEl.addEventListener('search', mockSearchFn);

        // Set search term and force input change
        const searchInput = lookupEl.shadowRoot.querySelector('input');
        searchInput.value = SAMPLE_SEARCH_RAW;
        searchInput.dispatchEvent(new CustomEvent('input'));

        // Disable search throttling
        jest.runAllTimers();

        // Check fired search event
        expect(mockSearchFn).toHaveBeenCalledTimes(1);
        const searchEvent = mockSearchFn.mock.calls[0][0];
        expect(searchEvent.detail).toEqual({
            searchTerm: SAMPLE_SEARCH_CLEAN,
            rawSearchTerm: SAMPLE_SEARCH_RAW,
            selectedIds: ['id1', 'id2']
        });
    });

    it('search event does not fires when search term is too short', () => {
        jest.useFakeTimers();

        // Create lookup with mock search handler
        const lookupEl = createLookupElement();
        const mockSearchFn = jest.fn();
        lookupEl.addEventListener('search', mockSearchFn);

        // Set search term and force input change
        const searchInput = lookupEl.shadowRoot.querySelector('input');
        searchInput.value = SAMPLE_SEARCH_TOO_SHORT;
        searchInput.dispatchEvent(new CustomEvent('input'));

        // Disable search throttling
        jest.runAllTimers();

        // Check that search event wasn't fired
        expect(mockSearchFn).not.toBeCalled();
    });

    it('search event does not fires twice when search term matches clean search term', () => {
        jest.useFakeTimers();

        // Create lookup with mock search handler
        const lookupEl = createLookupElement();
        const mockSearchFn = jest.fn();
        lookupEl.addEventListener('search', mockSearchFn);

        // Set search term and force input change
        const searchInput = lookupEl.shadowRoot.querySelector('input');
        searchInput.value = SAMPLE_SEARCH_RAW;
        searchInput.dispatchEvent(new CustomEvent('input'));

        // Disable search throttling
        jest.runAllTimers();

        // Update search term
        searchInput.value = SAMPLE_SEARCH_CLEAN;
        searchInput.dispatchEvent(new CustomEvent('input'));

        // Disable search throttling
        jest.runAllTimers();

        // Check fired search event
        expect(mockSearchFn).toHaveBeenCalledTimes(1);
        const searchEvent = mockSearchFn.mock.calls[0][0];
        expect(searchEvent.detail).toEqual({
            searchTerm: SAMPLE_SEARCH_CLEAN,
            rawSearchTerm: SAMPLE_SEARCH_RAW,
            selectedIds: []
        });
    });
});
