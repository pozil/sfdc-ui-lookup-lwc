import { LightningElement, track, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';

/** SampleLookupController.search() Apex method */
import apexSearch from '@salesforce/apex/SampleLookupController.search';
import genericSelector from '@salesforce/apex/SampleLookupController.genericSelector';

export default class SampleLookupContainer extends LightningElement {
    // Use alerts instead of toast to notify user
    @api notifyViaAlerts = false;

    @track isMultiEntry = false;
    initialIsSent = false;
    @track errors = [];

    @api selectorMethod = 'genericSelector';
    @api assignmentVariableName;
    @api queryCondition;
    @api selectedRecordId;
    @api label;
    @api iconName;
    @api objectApiName;
    @api titleFieldApiName = 'Name';
    @api additionalField;

    // Each imported selector method should be declared in context
    context = {
        'genericSelector': genericSelector,
        'apexSearch': apexSearch
        //new selectors which can be used by providing selectorMethod property
    };
    initialLookup = [];

    @wire(getRecord, {
        recordId: '$selectedRecordId',
        fields: '$calculatedApiNames'
    }) wiredInitialRecord({ error, data }) {
        if (data && !this.initialIsSent) {
            const initialLookup = [
                {
                    id: this.selectedRecordId,
                    sObjectType: this.objectApiName,
                    icon: this.iconName ? this.iconName : 'standard:' + this.objectApiName.toLowerCase(),
                    title: data.fields[this.titleFieldApiName].value,
                }
            ];
            this.template.querySelector("c-lookup").initSelection(initialLookup);
            this.initialIsSent = true;
        }
    };

    get calculatedApiNames() {
        if (this.objectApiName && this.titleFieldApiName) {
            return [{ fieldApiName: this.titleFieldApiName, objectApiName: this.objectApiName }];
        }
        return undefined;
    }

    handleLookupTypeChange(event) {
        this.errors = [];
        this.isMultiEntry = event.target.checked;
    }

    handleSearch(event) {
        const params = this.populateExtraProperties(event);
        this.context[this.selectorMethod](params)
            .then((results) => {
                this.template.querySelector('c-lookup').setSearchResults(results);
            })
            .catch((error) => {
                this.notifyUser('Lookup Error', 'An error occured while searching with the lookup field.', 'error');
                // eslint-disable-next-line no-console
                console.error('Lookup error', JSON.stringify(error));
                this.errors = [error];
            });
    }

    populateExtraProperties(event) {
        event.detail.queryCondition = this.queryCondition ? this.queryCondition : null;
        event.detail.configuration = JSON.stringify({
            sObjectType: this.objectApiName ? this.objectApiName : null,
            icon: this.iconName ? this.iconName : null,
            title: this.titleFieldApiName ? this.titleFieldApiName : null,
            subtitle: this.additionalField ? this.additionalField : null
        });
        return event.detail;
    }

    handleSelectionChange() {
        this.errors = [];
        this.selectedRecordId = event.target.getSelection() &&
            event.target.getSelection()[0] &&
            event.target.getSelection()[0].id ?
            event.target.getSelection()[0].id : this.selectedRecordId;
        const selectedLookup = new CustomEvent("lookuprecordselected", {
            detail: {
                variableName: this.assignmentVariableName,
                value: event.target.getSelection() &&
                    event.target.getSelection()[0] &&
                    event.target.getSelection()[0].id ?
                    event.target.getSelection()[0].id : null
            }
        });
        this.dispatchEvent(selectedLookup);
    }

    handleSubmit() {
        this.checkForErrors();
        if (this.errors.length === 0) {
            this.notifyUser('Success', 'The form was submitted.', 'success');
        }
    }

    checkForErrors() {
        const selection = this.template.querySelector('c-lookup').getSelection();
        if (selection.length === 0) {
            this.errors = [
                { message: 'You must make a selection before submitting!' },
                { message: 'Please make a selection and try again.' }
            ];
        } else {
            this.errors = [];
        }
    }

    notifyUser(title, message, variant) {
        if (this.notifyViaAlerts) {
            // Notify via alert
            // eslint-disable-next-line no-alert
            alert(`${title}\n${message}`);
        } else {
            // Notify via toast
            const toastEvent = new ShowToastEvent({ title, message, variant });
            this.dispatchEvent(toastEvent);
        }
    }
}
