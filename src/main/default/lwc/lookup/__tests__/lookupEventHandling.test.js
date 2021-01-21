const { createLookupElement, inputSearchTerm, flushPromises, SAMPLE_SEARCH_ITEMS } = require('./lookupTest.utils');
import { getNavigateCalledWith } from 'lightning/navigation';

const SAMPLE_SEARCH = 'sample';
const ARROW_DOWN = 40;
const ENTER = 13;

describe('c-lookup event handling', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('can clear selection when single entry', () => {
        // Create lookup
        const lookupEl = createLookupElement({
            isMultiEntry: false,
            selection: SAMPLE_SEARCH_ITEMS[0]
        });

        // Clear selection
        const clearSelButton = lookupEl.shadowRoot.querySelector('button');
        clearSelButton.click();
        // Check selection
        expect(lookupEl.selection.length).toBe(0);
    });

    it('can clear selection when multi entry', () => {
        // Create lookup
        const lookupEl = createLookupElement({
            isMultiEntry: true,
            selection: SAMPLE_SEARCH_ITEMS
        });

        // Remove a selected item
        const selPills = lookupEl.shadowRoot.querySelectorAll('lightning-pill');
        selPills[0].dispatchEvent(new CustomEvent('remove'));
        // Check selection
        expect(lookupEl.selection.length).toBe(SAMPLE_SEARCH_ITEMS.length - 1);
    });

    it("doesn't remove pill when multi entry and disabled", () => {
        // Create lookup
        const lookupEl = createLookupElement({
            isMultiEntry: true,
            disabled: true,
            selection: SAMPLE_SEARCH_ITEMS
        });

        // Remove a selected item
        const selPills = lookupEl.shadowRoot.querySelectorAll('lightning-pill');
        selPills[0].dispatchEvent(new CustomEvent('remove'));
        // Check selection
        expect(lookupEl.selection.length).toBe(SAMPLE_SEARCH_ITEMS.length);
    });

    it('can select item with mouse', async () => {
        jest.useFakeTimers();

        // Create lookup with search handler
        const lookupEl = createLookupElement();
        const searchFn = (event) => {
            event.target.setSearchResults(SAMPLE_SEARCH_ITEMS);
        };
        lookupEl.addEventListener('search', searchFn);

        // Simulate search term input
        inputSearchTerm(lookupEl, SAMPLE_SEARCH);
        await flushPromises();

        // Simulate mouse selection
        const searchResultItem = lookupEl.shadowRoot.querySelector('span[data-recordid]');
        searchResultItem.click();

        // Check selection
        expect(lookupEl.selection.length).toBe(1);
        expect(lookupEl.selection[0].id).toBe(SAMPLE_SEARCH_ITEMS[0].id);
    });

    it('can select item with keyboard', async () => {
        jest.useFakeTimers();

        // Create lookup with search handler
        const lookupEl = createLookupElement();
        const searchFn = (event) => {
            event.target.setSearchResults(SAMPLE_SEARCH_ITEMS);
        };
        lookupEl.addEventListener('search', searchFn);

        // Set search term and force input change
        const searchInput = lookupEl.shadowRoot.querySelector('input');
        searchInput.focus();
        searchInput.value = SAMPLE_SEARCH;
        searchInput.dispatchEvent(new CustomEvent('input'));

        // Disable search throttling
        jest.runAllTimers();
        await flushPromises();

        // Simulate keyboard navigation
        searchInput.dispatchEvent(new KeyboardEvent('keydown', { keyCode: ARROW_DOWN }));
        searchInput.dispatchEvent(new KeyboardEvent('keydown', { keyCode: ENTER }));

        // Check selection
        expect(lookupEl.selection.length).toBe(1);
        expect(lookupEl.selection[0].id).toBe(SAMPLE_SEARCH_ITEMS[0].id);
    });

    it('can create new record without pre-navigate callback', async () => {
        jest.useFakeTimers();

        // Create lookup with search handler and new record options
        const newRecordOptions = [{ value: 'Account', label: 'New Account' }];
        const lookupEl = createLookupElement({ newRecordOptions });
        const searchFn = (event) => {
            event.target.setSearchResults([]);
        };
        lookupEl.addEventListener('search', searchFn);

        // Simulate search term input
        inputSearchTerm(lookupEl, SAMPLE_SEARCH);
        await flushPromises();

        // Simulate mouse selection
        const newRecordEl = lookupEl.shadowRoot.querySelector('div[data-sobject]');
        expect(newRecordEl).not.toBeNull();
        newRecordEl.click();
        await flushPromises();

        // Verify that we navigate to the right page
        const { pageReference } = getNavigateCalledWith();
        expect(pageReference.type).toBe('standard__objectPage');
        expect(pageReference.attributes.objectApiName).toBe(newRecordOptions[0].value);
        expect(pageReference.attributes.actionName).toBe('new');
    });

    it('can create new record with pre-navigate callback', async () => {
        jest.useFakeTimers();

        // Create mock pre-navigate callback
        const preNavigateCallback = jest.fn(() => Promise.resolve());

        // Create lookup with search handler and new record options
        const newRecordOptions = [{ value: 'Account', label: 'New Account', preNavigateCallback }];
        const lookupEl = createLookupElement({ newRecordOptions });
        const searchFn = (event) => {
            event.target.setSearchResults([]);
        };
        lookupEl.addEventListener('search', searchFn);

        // Simulate search term input
        inputSearchTerm(lookupEl, SAMPLE_SEARCH);
        await flushPromises();

        // Simulate mouse selection
        const newRecordEl = lookupEl.shadowRoot.querySelector('div[data-sobject]');
        expect(newRecordEl).not.toBeNull();
        newRecordEl.click();

        // Verify that preNavigateCallback got called
        expect(preNavigateCallback).toHaveBeenCalled();
        const newRecordOption = preNavigateCallback.mock.calls[0][0];
        expect(newRecordOption.value).toBe(newRecordOptions[0].value);
        await flushPromises();

        // Verify that we navigate to the right page
        const { pageReference } = getNavigateCalledWith();
        expect(pageReference.type).toBe('standard__objectPage');
        expect(pageReference.attributes.objectApiName).toBe(newRecordOptions[0].value);
        expect(pageReference.attributes.actionName).toBe('new');
    });
});
