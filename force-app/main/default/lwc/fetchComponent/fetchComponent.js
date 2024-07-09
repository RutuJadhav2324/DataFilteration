import { LightningElement ,wire , api} from 'lwc';
import getAllObject from'@salesforce/apex/ApexObj.getAllObject';
import getObjectRecords from '@salesforce/apex/ApexObj.getObjectRecords';




export default class FetchComponent extends LightningElement {

    //combobox variable
    value;
    options=[];
    //datTable variable
    data=[];
    @api columns=[
        {label:'Name',fieldName:'Name',Type:'Name'},
        {label:'ID',fieldName:'Id'},
     ];
    

    @wire(getAllObject)
    wiredObjNames({error,data}){

        if(data){
            this.options=data.map(objName =>{
                return{label : objName, value:objName};
            });
        
        }else if(error){
            console.error('Error fetching object names:',error);
        }
    }

    handleChange(event){
        this.value=event.detail.value;
        this.loadRecords();
    }
    @wire(getObjectRecords)
    loadRecords(result){
        if (result.data) {
            this.data = result.data;
            this.error = undefined;
            console.log('the data is'+JSON.stringify(result.data));
        } else if (result.error) {
            this.error = result.error;
            this.data = undefined;
        }
    }
}


// getObjectRecords({objectName:this.value})
//         .then(result=>{
//             this.data=result;
//         })
//         .catch(error=>{
//             console.error('Error getting records',error);
//         });