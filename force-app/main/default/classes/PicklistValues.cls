public with sharing class PicklistValues {

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getData() {
        Map<String, Object> result = new Map<String, Object>();
        result.put('industry', PicklistIndustry());
        result.put('ratings', PicklistRating());
        result.put('billingCitys',PicklistBillingCity());
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
    public static list<String> PicklistBillingCity(){
        set<string> pickListkValuesList = new set<string>();
        for(Account acc:[select BillingCity from Account]){
            pickListkValuesList.add(acc.BillingCity);
        }
     List<String> billingCityValues = new List<String>(pickListkValuesList);
     return billingCityValues;
    
    }
       
    


    public class PicklistValueWrapper {
        @AuraEnabled
        public String label { get; set; }
        @AuraEnabled
        public String value { get; set; }
        // Add any other fields as needed
    }

}




   