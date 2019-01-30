@isTest
public class SampleLookupControllerTest {
    static testMethod void search_should_return_Account() {
        Id [] fixedResults = new Id[1];
        Account account = createTestAccount('Account');
        fixedResults.add(account.Id);
        Test.setFixedSearchResults(fixedResults);
        List<String> selectedIds = new List<String>();

        List<LookupSearchResult> results = SampleLookupController.search('Acc', selectedIds);

        System.assertEquals(1, results.size());
        System.assertEquals(account.Id, results.get(0).getId());
    }

    static testMethod void search_should_not_return_selected_item() {
        Id [] fixedResults = new Id[1];
        Account account1 = createTestAccount('Account1');
        fixedResults.add(account1.Id);
        Account account2 = createTestAccount('Account2');
        fixedResults.add(account2.Id);
        Test.setFixedSearchResults(fixedResults);
        List<String> selectedIds = new List<String>();
        selectedIds.add(account2.Id);

        List<LookupSearchResult> results = SampleLookupController.search('Acc', selectedIds);

        System.assertEquals(1, results.size());
        System.assertEquals(account1.Id, results.get(0).getId());
    }

    private static Account createTestAccount(String name) {
        Account account = new Account(Name = name);
        insert account;
        return account;
    }
}
