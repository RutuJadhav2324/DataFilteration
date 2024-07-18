import { LightningElement, wire,track } from 'lwc';
import AccRec from '@salesforce/apex/AccountRecords.AccRec';
import getData from '@salesforce/apex/PicklistValues.getData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';


const columns=[
    {label:'Name',fieldName:'Name',Type:'Name'},
    {label:'Industry',fieldName:'Industry',Type:'Picklist'},
    {label:'Type',fieldName:'Type',Type:'Picklist'},
    {label:'Billing City',fieldName:'BillingCity',Type:'Picklist'},
    {label:'Rating',fieldName:'Rating',Type:'Picklist'},
    {label:'Created Date',fieldName:'CreatedDate__c',Type:'Date'},
    {label:'End Date',fieldName:'EndDate__c',Type:'Date'},
   ];

export default class AccountRec extends LightningElement {
   
    @track activeSection='';//dynamically set 
    @track accordionSections=[];
    //@track dataOptions=[];
   // @track jsonData=[];
    @track picklistValues=[];
    @track filteredData=[];
    @track selectedFilters;
    @track showModal=false;
    @track resultWired;
     
    @track searchText;
    @track filteredPicklistValues=[];
    @track selectedCount='';
    @track StartDate=[];
    @track EndDate=[];
    @track error;
    @track checked;
    @track activeSections=['section'];
    @track filterDataCopy=[];
    //activeSectionsMessage = '';
   
    
     @track data;
    @track originalData = [];//copy of data to get origanl data
    @track columns=columns;
    
   
//new
    @track industry = [];
    @track ratings = [];
    @track billingCitys = [];


    
    handleSectionToggle() {
        this.activeSections=['section'];//open all sections
     }
    
    @wire(AccRec)
    accRecords({error,data}) {
        this.resultWired=data;
        if (data) {
            this.data = data;
            this.originalData = data;
           // this.filteredData = [...this.data]; 
            this.error = undefined;
            console.log('the data is accountRec'+data);
            //console.log('data',this.data);
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    //for picklist 
   
    @wire(getData)
    
    wiredData({ error, data }) {
        if (data) {
            console.log('Received data:', data);

            // accordion sections based on data received
            this.accordionSections = [
                {
                    section: 'Date Range',
                    searchable: false,
                    picklistValues: [
                        {
                            id: 'startDate',
                            label: 'Start Date',
                            type: 'date',
                            visible: true,
                            checked: null
                        },
                        {
                            id: 'endDate',
                            label: 'End Date',
                            type: 'date',
                            visible: true,
                            checked: null
                        }
                    ]
                },
                {
                    section: 'Billing City',
                    searchable: true,
                    selectedCount: 0,
                    picklistValues: data.billingCitys.map(item => ({
                        type: 'checkbox',
                        visible: true,
                        label: item,
                        checked: false
                    }))
                },
                {
                    section: 'Industry',
                    searchable: true,
                    selectedCount: 0,
                    picklistValues: data.industry.map(item => ({
                        type: 'checkbox',
                        visible: true,
                        label: item,
                        checked: false
                    }))
                },
                {
                    section: 'Rating',
                    searchable: false,
                    selectedCount: 0,
                    picklistValues: data.ratings.map(item => ({
                        type: 'checkbox',
                        visible: true,
                        label: item,
                        checked: false
                    }))
                }
                
            ];

            console.log('Accordion Sections:', this.accordionSections);
        } else if (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    handleClick(){
        this.showModal= true;
        console.log('button is clicked');
        
    }
    handlePicklistSelection(event) {
        //picklist selection change here
        const selectedSection = event.target.dataset.section;
        const selectedLabel = event.target.label;
         const isChecked = event.target.checked;
         const checkboxValue = event.target.label;
        
         console.log('selectedSection :-',selectedSection);
        console.log('selectedlabel :-',selectedLabel);
        console.log('selectedisChecked :-',isChecked);

        const sectionToUpdate = this.accordionSections.find(section => section.section === selectedSection);
         if (sectionToUpdate) {
        // Update the specific picklistValue
        const picklistValueToUpdate = sectionToUpdate.picklistValues.find(picklistValue => picklistValue.label === selectedLabel);

        if (picklistValueToUpdate) {
            picklistValueToUpdate.checked = isChecked;

            // Update selected count for the section
            if (isChecked) {
                sectionToUpdate.selectedCount++;
            } else {
                sectionToUpdate.selectedCount--;
            }
            

            if (picklistValueToUpdate.type === 'date') {
                const { name, value } = event.target;
                if (name === 'startDate') {
                    this.StartDate = value;
                } else if (name === 'endDate') {
                    this.EndDate = value;
                }
                this.validateDates();
            }
        }
        this.accordionSections = this.accordionSections.map(section => {
            if (section.label === checkboxValue) {
                section.isCheckedNew = event.target.checked;
            }
            return section;
        });
    

        
     }
      // Date 
    //     const { name, value } = event.target;
    // if (name === 'StartDate') {
    //     this.StartDate = value;
    // } else if (name === 'EndDate') {
    //     this.EndDate = value;
    // }
     
    
    // this.validateDates();
 }
    //date sec
    // get StartDate() {
    //     return this.StartDate ? this.StartDate.toISOString().slice(0, 10) : null;
    // }

    // get EndDate() {
    //     return this.EndDate ? this.EndDate.toISOString().slice(0, 10) : null;
    // }

    // validateDates() {
    //     if (this.StartDate && this.EndDate) {
    //         const startDate = new Date(this.StartDate);
    //         const endDate = new Date(this.EndDate);

    //         // Check if End Date is not less than Start Date
    //         if (endDate < startDate) {
    //             // Show error message or handle UI feedback
    //             this.showToastMessage('End Date cannot be earlier than Start Date', 'error');
    //         } else {
    //             // Clear any previous error messages
    //             this.clearToastMessages();
    //         }
    //     }
    // }
    // clearDateRange() {
    //     this.StartDate = null;
    //     this.EndDate = null;
    // }

    hideModalBox(){
        
        this.showModal=false;
         console.log('modal is closed');
    }

    handleSearchByText(event) {
        try {
            const searchText = event.target.value.trim().toLowerCase();
            const sectionName = event.target.dataset.section; 
           
            console.log("Search text:", searchText);
            console.log("Section:", sectionName);
    
           //checking section match with section name
            const sectionToUpdate = this.accordionSections.find(section => section.section === sectionName);
           
            if (sectionToUpdate) {
                 sectionToUpdate.searchText = searchText;// Update the search text
                 sectionToUpdate.picklistValues.forEach(picklistValue => {
                    picklistValue.visible = picklistValue.label.toLowerCase().includes(searchText);
                }); // Update picklistValues within the found section
             }
            
    
        } catch (error) {
            console.error("An error occurred while handling search:", error);
        }
    }
    
     handleClearAll() {
        try {
            // Reset all picklistValues and search text
            
            
            this.data=[...this.originalData];//clear all filters to get orignal data
            console.log('clear all clicked');
            
            this.accordionSections.forEach(section => {
                this.selectedFilters = {};
                section.searchText=false;//search text false
                 if (section.section !== 'Date Range') {
                    section.selectedCount = 0; // Reset selected count
                }
                section.picklistValues.forEach(picklistValue => {
                    picklistValue.checked = false;
                    picklistValue.visible = true; // Reset visibility 
                    picklistValue.error = null; // Reset any errors
                 });
            });

            
         } catch(error) {
            console.error('Error clearing selections:', error);
        }
       
    }
    handleApplyValues() {
        this.filteredData = [];
        
    
        //Store selected filters in this.selectedFilters object
        this.selectedFilters = {};
        this.accordionSections.forEach(section => {
            this.selectedFilters[section.section] = section.picklistValues
                .filter(pv => pv.checked)
                .map(pv => pv.label);
            });
    
        // Filter data based on selected filters
        if (this.selectedFilters['Industry'].length || this.selectedFilters['Billing City'].length || this.selectedFilters['Rating'].length) {
            
            this.filteredData = this.originalData.filter(record => {
                 return (!this.selectedFilters['Industry'].length || this.selectedFilters['Industry'].includes(record.Industry)) &&
                    (!this.selectedFilters['Billing City'].length || this.selectedFilters['Billing City'].includes(record.BillingCity)) &&
                    (!this.selectedFilters['Rating'].length || this.selectedFilters['Rating'].includes(record.Rating));
                   
                   
            });
        }
   
            
            console.log('Filtered Data:',  JSON.stringify(this.filteredData));
        
        this.data = [...this.filteredData];// Update this.data with filteredData 
        console.log('Updated Data:',  JSON.stringify(Array.from(this.data)));

        
        if (this.filteredData.length === 0) {
            this.showToastMessage('No Records Found', 'Error'); // Show toast message if no records found
        }
        console.log('apply button click');
        // Close the modal
        this.hideModalBox();
      
       //refreshApex(this.resultWired);
      // console.log('resultWired',JSON.stringify(this.resultWired));
       
 
    }
    
    
    
     showToastMessage(message, variant) {
        const evt = new ShowToastEvent({
            title: variant === 'error' ? 'Error' : 'Warning',
            message: message,
            variant: variant
        });
        this.dispatchEvent(evt);
    }
    
    
}
