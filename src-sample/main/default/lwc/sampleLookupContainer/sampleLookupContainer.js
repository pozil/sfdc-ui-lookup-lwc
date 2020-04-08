import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

/** SampleLookupController.search() Apex method */
import apexSearch from '@salesforce/apex/SampleLookupController.search';

export default class SampleLookupContainer extends LightningElement {
    // Use alerts instead of toast to notify user
    @api notifyViaAlerts = false;

    objectApiName;
    iconName;
    titleFieldApiName = 'Name';
    subtitleFieldApiName;
    queryCondition;

    handleObjectApiNameChange(event) {
        this.objectApiName = event.target.value;
    }

    handleSubtitleFieldApiNameChange(event) {
        this.subtitleFieldApiName = event.target.value;
    }

    handleQueryConditionChange(event) {
        this.queryCondition = event.target.value;
    }

    isMultiEntry = false;
    initialSelection = [
        {
            id: 'na',
            sObjectType: 'na',
            icon: 'standard:lightning_component',
            title: 'Inital selection',
            subtitle: 'Not a valid record'
        }
    ];
    errors = [];

    handleLookupTypeChange(event) {
        this.initialSelection = [];
        this.errors = [];
        this.isMultiEntry = event.target.checked;
    }

    handleSearch(event) {
        const params = this.populateExtraProperties(event);
        apexSearch(params)
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

    handleSelectionChange() {
        this.errors = [];
    }

    populateExtraProperties(event) {
        event.detail.queryCondition = this.queryCondition ? this.queryCondition : null;
        event.detail.configuration = JSON.stringify({
            sObjectType: this.objectApiName ? this.objectApiName : null,
            icon: this.iconName ? this.iconName : null,
            title: this.titleFieldApiName ? this.titleFieldApiName : null,
            subtitle: this.subtitleFieldApiName ? this.subtitleFieldApiName : null
        });
        return event.detail;
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
