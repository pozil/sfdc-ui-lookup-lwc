import { createElement } from 'lwc';
import Lookup from 'c/lookup';

/**
 * Helper function to wait until the microtask queue is empty
 */
export const flushPromises = () => {
    // eslint-disable-next-line no-undef
    return new Promise((resolve) => setImmediate(resolve));
};

/**
 * Creates the lookup element with the provided properties and attaches it to the document body
 * @param {object} props
 * @returns the lookup element
 */
export const createLookupElement = (props = {}) => {
    const lookupEl = createElement('c-lookup', {
        is: Lookup
    });
    Object.assign(lookupEl, props);
    document.body.appendChild(lookupEl);
    return lookupEl;
};

export const SAMPLE_SEARCH_ITEMS = [
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
