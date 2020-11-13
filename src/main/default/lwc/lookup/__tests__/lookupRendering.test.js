const { createLookupElement, SAMPLE_SEARCH_ITEMS } = require('./lookupTest.utils');

describe('c-lookup rendering', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('shows no results by default', () => {
        const lookupEl = createLookupElement();

        // Query for rendered list items
        const listItemEls = lookupEl.shadowRoot.querySelectorAll('li');
        expect(listItemEls.length).toBe(1);
        expect(listItemEls[0].textContent).toBe('No results.');
    });

    it('shows default search results by default', () => {
        const lookupEl = createLookupElement();
        lookupEl.setDefaultResults(SAMPLE_SEARCH_ITEMS);

        // Query for rendered list items
        return Promise.resolve().then(() => {
            const listItemEls = lookupEl.shadowRoot.querySelectorAll('span[role=option]');
            expect(listItemEls.length).toBe(SAMPLE_SEARCH_ITEMS.length);
            expect(listItemEls[0].dataset.recordid).toBe(SAMPLE_SEARCH_ITEMS[0].id);
        });
    });

    it('renders label', () => {
        const props = { label: 'Sample Lookup' };
        const lookupEl = createLookupElement(props);

        // Verify label
        const labelEl = lookupEl.shadowRoot.querySelector('label');
        expect(labelEl.textContent).toBe(props.label);
    });

    it('does not render label if omitted', () => {
        const lookupEl = createLookupElement({ label: '' });

        // Verify label doesn't exist
        const labelEl = lookupEl.shadowRoot.querySelector('label');
        expect(labelEl).toBe(null);
    });

    it('renders single entry (no selection)', () => {
        const lookupEl = createLookupElement({ isMultiEntry: false });

        // Verify selected icon
        const selIcon = lookupEl.shadowRoot.querySelector('lightning-icon');
        expect(selIcon.alternativeText).toBe('Selected item icon');
        // Verify clear selection button
        const clearSelButton = lookupEl.shadowRoot.querySelector('button');
        expect(clearSelButton.title).toBe('Remove selected option');
        // Verify result list is NOT rendered
        const selList = lookupEl.shadowRoot.querySelectorAll('ul.slds-listbox_inline');
        expect(selList.length).toBe(0);
    });

    it('renders multi entry (no selection)', () => {
        const lookupEl = createLookupElement({ isMultiEntry: true });

        // Verify selected icon is NOT rendered
        const selIcon = lookupEl.shadowRoot.querySelectorAll('lightning-icon');
        expect(selIcon.length).toBe(1);
        // Verify clear selection button is NOT rendered
        const clearSelButton = lookupEl.shadowRoot.querySelectorAll('button');
        expect(clearSelButton.length).toBe(0);
        // Verify result list is rendered
        const selList = lookupEl.shadowRoot.querySelectorAll('ul.slds-listbox_inline');
        expect(selList.length).toBe(1);
    });

    it('renders title on selection in single-select', () => {
        const lookupEl = createLookupElement({
            isMultiEntry: false,
            selection: SAMPLE_SEARCH_ITEMS[0]
        });

        const inputBox = lookupEl.shadowRoot.querySelector('input');
        expect(inputBox.title).toBe(SAMPLE_SEARCH_ITEMS[0].title);
    });

    it('renders title on selection in multi-select', () => {
        const lookupEl = createLookupElement({
            isMultiEntry: true,
            selection: SAMPLE_SEARCH_ITEMS
        });

        const inputBox = lookupEl.shadowRoot.querySelector('input');
        expect(inputBox.title).toBe('');

        // Verify that default selection is showing up
        const selPills = lookupEl.shadowRoot.querySelectorAll('lightning-pill');
        expect(selPills.length).toBe(2);
        expect(selPills[0].title).toBe(SAMPLE_SEARCH_ITEMS[0].title);
        expect(selPills[1].title).toBe(SAMPLE_SEARCH_ITEMS[1].title);
    });

    it('can be disabled', () => {
        const lookupEl = createLookupElement({
            disabled: true
        });

        // Verify that input is disabled
        const input = lookupEl.shadowRoot.querySelector('input');
        expect(input.disabled).toBe(true);
    });
    it('disables clear selection button when single entry and disabled', () => {
        // Create lookup
        const lookupEl = createLookupElement({
            disabled: true,
            selection: SAMPLE_SEARCH_ITEMS[0]
        });

        // Clear selection
        const clearSelButton = lookupEl.shadowRoot.querySelector('button');
        expect(clearSelButton.disabled).toBeTruthy();
    });

    it('renders errors', () => {
        const errors = [
            { id: 'e1', message: 'Sample error 1' },
            { id: 'e2', message: 'Sample error 2' }
        ];
        const lookupEl = createLookupElement({
            disabled: true,
            errors
        });

        // Verify errors
        const errorEls = lookupEl.shadowRoot.querySelectorAll('label.form-error');
        expect(errorEls.length).toBe(errors.length);
        expect(errorEls[0].textContent).toBe(errors[0].message);
        expect(errorEls[1].textContent).toBe(errors[1].message);
    });
});
