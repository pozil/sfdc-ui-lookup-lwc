# Salesforce Lookup Component (Lightning Web Component version)

[![Github Workflow](https://github.com/pozil/sfdc-ui-lookup-lwc/workflows/CI/badge.svg?branch=master)](https://github.com/pozil/sfdc-ui-lookup-lwc/actions)

Aura version is available [here](https://github.com/pozil/sfdc-ui-lookup) (deprecated).

<p align="center">
    <img src="screenshots/lookup-animation.gif" alt="Lookup animation"/>
</p>

<img src="screenshots/dropdown-open.png" alt="Lookup with dropdown open" width="350" align="right"/>

## About

This is a generic &amp; customizable lookup component built using Salesforce [Lightning Web Components](https://developer.salesforce.com/docs/component-library/documentation/lwc) and [SLDS](https://www.lightningdesignsystem.com/) style.<br/>
It does not rely on third party libraries and you have full control over its datasource.

<b>Features</b>

The lookup component provides the following features:

-   customizable data source that can return mixed sObject types
-   single or multiple selection mode
-   client-side caching & request throttling
-   built-in server request rate limit mechanism
-   project is unit tested

<p align="center">
    <img src="screenshots/selection-types.png" alt="Multiple or single entry lookup"/>
</p>

## Installation

The default installation installs the lookup component and a sample application available under this URL (replace the domain):<br/>
`https://YOUR_DOMAIN.lightning.force.com/c/SampleLookupApp.app`

If you wish to install the project without the sample application, edit `sfdx-project.json` and remove the `src-sample` path.

Install the sample app by running this script:

**MacOS or Linux**

```
./install-dev.sh
```

**Windows**

```
install-dev.bat
```

## Documentation

Follow these steps in order to use the lookup component:

### 1) Write the search endpoint

Implement an Apex `@AuraEnabled(Cacheable=true)` method (`SampleLookupController.search` in our samples) that returns the search results as a `List<LookupSearchResult>`.
The method name can be different but it needs to match this signature:

```apex
@AuraEnabled(Cacheable=true)
public static List<LookupSearchResult> search(String searchTerm, List<String> selectedIds) {}
```

### 2) Import a reference to the search endpoint

Import a reference to the `search` Apex method in the lookup parent component's JS:

```js
import apexSearch from '@salesforce/apex/SampleLookupController.search';
```

### 3) Handle the search event and pass search results to the lookup

The lookup component exposes a `search` event that is fired when a search needs to be performed on the server-side.
The parent component that contains the lookup must handle the `search` event:

```xml
<c-lookup onsearch={handleSearch} label="Search" placeholder="Search Salesforce">
</c-lookup>
```

The `search` event handler calls the Apex `search` method and passes the results back to the lookup using the `setSearchResults` function:

```js
handleSearch(event) {
    const target = event.target;
    apexSearch(event.detail)
        .then(results => {
            target.setSearchResults(results);
        })
        .catch(error => {
            // TODO: handle error
        });
}
```

### 4) Optionally handle selection changes

The lookup component exposes a `selectionchange` event that is fired when the selection of the lookup changes.
The parent component that contains the lookup can handle the `selectionchange` event:

```xml
<c-lookup onsearch={handleSearch} onselectionchange={handleSelectionChange}
    label="Search" placeholder="Search Salesforce">
</c-lookup>
```

The `selectionchange` event handler can then get the current selection by calling the `getSelection` function:

```js
handleSelectionChange(event) {
    const selection = event.target.getSelection();
    // TODO: do something with the lookup selection
}
```

`getSelection` always return a list of selected items.
That list contains a maximum of one elements if the lookup is a single entry lookup.

### Reference

| Attribute           | Type    | Description                                                                                                                                                                      |
| ------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`             | String  | Optional lookup label. Label is hidden if attribute is omitted.                                                                                                                  |
| `selection`         | Array   | Lookup initial selection if any                                                                                                                                                  |
| `placeholder`       | String  | Lookup placeholder                                                                                                                                                               |
| `isMultiEntry`      | Boolean | Whether the lookup is single (default) or multi entry.                                                                                                                           |
| `errors`            | Array   | List of errors that are displayed under the lookup.                                                                                                                              |
| `scrollAfterNItems` | Number  | A null or integer value used to force overflow scroll on the result listbox after N number of items. Valid values are null, 5, 7, or 10. Use null to disable overflow scrolling. |
| `customKey`         | String  | Custom key that can be used to identify this lookup when placed in a collection of similar components.                                                                           |

| Function                    | Description                                                                                  |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `setSearchResults(results)` | Passes a search results array back to the lookup so that they are displayed in the dropdown. |
| `getSelection()`            | Gets the current lookup selection.                                                           |
| `getkey()`                  | Retrieves the value of the `customKey` attribute.                                            |

| Event             | Description                                                                                                                                        | Data                                         |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `search`          | Event fired when a search needs to be performed on the server-side.                                                                                | `{ searchTerm: String, selectedIds: Array }` |
| `selectionchange` | Event fired when the selection of the lookup changes. This event holds no data, use the `getSelection` function to retrieve the current selection. | none                                         |
