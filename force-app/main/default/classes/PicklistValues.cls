public with sharing class PicklistValues {

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getData() {
        Map<String, Object> result = new Map<String, Object>();
        result.put('industry', PicklistIndustry());
        result.put('ratings', PicklistRating());
        result.put('billingCitys',PicklistBillingCity());
        result.put('createdDate',getCreatedDates());
        result.put('endDate',getEndDates());

       return result;
    }

    @AuraEnabled(cacheable=true)
    public static list<String> PicklistIndustry(){
        set<string> pickListkValuesList = new set<string>();
        Schema.DescribeFieldResult fieldResult = Account.Industry.getDescribe();
        list<Schema.PicklistEntry> ple= fieldResult.getPicklistValues();
        for(Schema.PicklistEntry pickVal:ple){
            pickListkValuesList.add(pickVal.getLabel());
        }
        List<String> industryValues = new List<String>(pickListkValuesList);
         return industryValues;
    }

    @AuraEnabled(cacheable=true)
    public static list<String> PicklistRating(){
        set<string> pickListkValuesList = new set<string>();
        Schema.DescribeFieldResult fieldResult = Account.Rating.getDescribe();
        list<Schema.PicklistEntry> ple= fieldResult.getPicklistValues();
        for(Schema.PicklistEntry pickVal:ple){
            pickListkValuesList.add(pickVal.getLabel());
        }
        List<String> ratingValues = new List<String>(pickListkValuesList);
         return ratingValues;
    }


    @AuraEnabled(cacheable=true)
    public static List<String> PicklistBillingCity() {
        Set<String> billingCityValuesSet = new Set<String>();
        List<Account> accountsWithBillingCity = [SELECT BillingCity FROM Account WHERE BillingCity != null];
        for (Account acc : accountsWithBillingCity) {
            billingCityValuesSet.add(acc.BillingCity);
        }
          // Convert set to list to return as the result
        List<String> billingCityValues = new List<String>(billingCityValuesSet);
        return billingCityValues;
    }
    
    
    @AuraEnabled(cacheable=true)
    public static List<String> getCreatedDates() {
    Set<String> createdDateValues = new Set<String>();
    Schema.DescribeFieldResult createdDateFieldResult = Account.createdDate__c.getDescribe();

    if (createdDateFieldResult.getType() == Schema.DisplayType.DATE) {
        // Perform SOQL query to get distinct values
        List<AggregateResult> results = [SELECT CreatedDate__c FROM Account WHERE createdDate__c != null GROUP BY CreatedDate__c];
        for (AggregateResult ar : results) {
            createdDateValues.add(String.valueOf(ar.get('createdDate__c')));
        }
    }
    List<String> createdDates = new List<String>(createdDateValues);
    return createdDates;
   }
    
   @AuraEnabled(cacheable=true)
   public static List<String> getEndDates() {
    Set<String> endDateValues = new Set<String>();
    Schema.DescribeFieldResult endDateFieldResult = Account.endDate__c.getDescribe();
    
    // Get the picklist values (assuming it's a picklist field)
    if (endDateFieldResult.getType() == Schema.DisplayType.DATE) {
        List<AggregateResult> results = [SELECT EndDate__c FROM Account WHERE endDate__c != null GROUP BY EndDate__c];
        for (AggregateResult ar : results) {
            endDateValues.add(String.valueOf(ar.get('endDate__c')));
        }
    }
    
    // Convert set to list and return
    List<String> endDates = new List<String>(endDateValues);
    return endDates;
  }


    // public class PicklistValueWrapper {
    //     @AuraEnabled
    //     public String label { get; set; }
    //     @AuraEnabled
    //     public String value { get; set; }
       
    // }

}




   