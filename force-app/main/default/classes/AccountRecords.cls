public with sharing class AccountRecords {
    @AuraEnabled(cacheable=true)
    public static list<Account> AccRec(){
        
        list<Account> acc=[select Name,Industry,Type,BillingCity,Rating,CreatedDate__C,EndDate__C  from Account];
        system.debug('Account Records are' + acc);
     	return acc;   
    }
  }
