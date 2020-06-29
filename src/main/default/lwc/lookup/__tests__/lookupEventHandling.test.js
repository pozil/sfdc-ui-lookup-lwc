import { createElement } from 'lwc';
import Lookup from 'c/lookup';

const SAMPLE_SEARCH = 'sample';
const SAMPLE_SEARCH_ITEMS = [
    {
        id: 'id1',
        icon: 'standard:default',
        title: 'Sample item 1',
        subtitle: 'sub1'
    },
    {
        id: 'id2',
        icon: 'standard:default',
        title: 'Sample item 2',
        subtitle: 'sub2'
    }
];
const ARROW_DOWN = 40;
const ENTER = 13;

// Helper function to wait until the microtask queue is empty.
function flushPromises() {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setImmediate(resolve));
}

describe('c-lookup event handling', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('can clear selection when single entry', () => {
        // Create element
        const element = createElement('c-lookup', {
            is: Lookup
        });
        element.isMultiEntry = false;
        element.selection = [SAMPLE_SEARCH_ITEMS[0]];
        document.body.appendChild(element);

        // Clear selection
        const clearSelButton = element.shadowRoot.querySelector('button');
        clearSelButton.click();
        // Check selection
        expect(element.selection.length).toBe(0);
    });

    it('can clear selection when multi entry', () => {
        // Create element
        const element = createElement('c-lookup', {
            is: Lookup
        });
        element.isMultiEntry = true;
        element.selection = SAMPLE_SEARCH_ITEMS;
        document.body.appendChild(element);

        // Remove a selected item
        const selPills = element.shadowRoot.querySelectorAll('lightning-pill');
        selPills[0].dispatchEvent(new CustomEvent('remove'));
        // Check selection
        expect(element.selection.length).toBe(1);
    });

    it('can select item with mouse', () => {
        jest.useFakeTimers();

        // Create element with search handler
        const element = createElement('c-lookup', {
            is: Lookup
        });
        const searchFn = (event) => {
            event.target.setSearchResults(SAMPLE_SEARCH_ITEMS);
        };
        element.addEventListener('search', searchFn);
        document.body.appendChild(element);

        // Set search term and force input change
        const searchInput = element.shadowRoot.querySelector('input');
        searchInput.value = SAMPLE_SEARCH;
        searchInput.dispatchEvent(new CustomEvent('input'));

        // Disable search throttling
        jest.runAllTimers();

        return flushPromises().then(() => {
            // Simulate mouse selection
            const searchResultItem = element.shadowRoot.querySelector('span[role=option]');
            searchResultItem.click();

            // Check selection
            expect(element.selection.length).toBe(1);
            expect(element.selection[0].id).toBe(SAMPLE_SEARCH_ITEMS[0].id);
        });
    });

    it('can select item with keyboard', () => {
        jest.useFakeTimers();

        // Create element with search handler
        const element = createElement('c-lookup', {
            is: Lookup
        });
        const searchFn = (event) => {
            event.target.setSearchResults(SAMPLE_SEARCH_ITEMS);
        };
        element.addEventListener('search', searchFn);
        document.body.appendChild(element);

        // Set search term and force input change
        const searchInput = element.shadowRoot.querySelector('input');
        searchInput.focus();
        searchInput.value = SAMPLE_SEARCH;
        searchInput.dispatchEvent(new CustomEvent('input'));

        // Disable search throttling
        jest.runAllTimers();

        return flushPromises().then(() => {
            // Simulate keyboard navigation
            searchInput.dispatchEvent(new KeyboardEvent('keydown', { keyCode: ARROW_DOWN }));
            searchInput.dispatchEvent(new KeyboardEvent('keydown', { keyCode: ENTER }));

            // Check selection
            expect(element.selection.length).toBe(1);
            expect(element.selection[0].id).toBe(SAMPLE_SEARCH_ITEMS[0].id);
        });
    });
});
