@isTest(isParallel=true)
public class SampleLookupControllerTest {
    @isTest
    static void search_should_return_Account_and_Opportunity() {
        List<Id> fixedResults = new Id[2];
        Account account = createAccount('Account');
        fixedResults.add(account.Id);
        Opportunity oppty = createOpportunity('Oppty');
        fixedResults.add(oppty.Id);
        Test.setFixedSearchResults(fixedResults);
        List<String> selectedIds = new List<String>();

        List<LookupSearchResult> results = SampleLookupController.search('Acc', selectedIds);

        System.assertEquals(2, results.size());
        System.assertEquals(account.Id, results.get(0).getId());
        System.assertEquals(oppty.Id, results.get(1).getId());
    }

    @isTest
    static void search_should_not_return_selected_item() {
        List<Id> fixedResults = new Id[2];
        Account account1 = createAccount('Account1');
        fixedResults.add(account1.Id);
        Account account2 = createAccount('Account2');
        fixedResults.add(account2.Id);
        Test.setFixedSearchResults(fixedResults);
        List<String> selectedIds = new List<String>();
        selectedIds.add(account2.Id);

        List<LookupSearchResult> results = SampleLookupController.search('Acc', selectedIds);

        System.assertEquals(1, results.size());
        System.assertEquals(account1.Id, results.get(0).getId());
    }

    private static Account createAccount(String name) {
        Account account = new Account(Name = name);
        insert account;
        return account;
    }

    private static Opportunity createOpportunity(String name) {
        Opportunity oppty = new Opportunity(Name = name, StageName = 'open', CloseDate = Date.today());
        insert oppty;
        return oppty;
    }
}
