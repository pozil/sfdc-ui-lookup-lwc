public with sharing class SampleLookupController implements LookupSearchProvider {
    private final static Integer MAX_RESULTS = 5;

    public static List<LookupSearchResult> search(String searchTerm, List<String> selectedIds, String searchParams) {
        // Prepare query paramters
        searchTerm += '*';
        SearchParams params = (SearchParams) JSON.deserialize(searchParams, SearchParams.class);
        Integer maxResults = params.maxResults != null ? params.maxResults : MAX_RESULTS;

        // Execute search query
        List<List<SObject>> searchResults = [
            FIND :searchTerm
            IN ALL FIELDS
            RETURNING
                Account(Id, Name, BillingCity WHERE id NOT IN :selectedIds),
                Opportunity(Id, Name, StageName WHERE id NOT IN :selectedIds)
            LIMIT :maxResults
        ];

        // Prepare results
        List<LookupSearchResult> results = new List<LookupSearchResult>();

        // Extract Accounts & convert them into LookupSearchResult
        String accountIcon = 'standard:account';
        Account[] accounts = (List<Account>) searchResults[0];
        for (Account account : accounts) {
            results.add(
                new LookupSearchResult(
                    account.Id,
                    'Account',
                    accountIcon,
                    account.Name,
                    'Account • ' + account.BillingCity
                )
            );
        }

        // Extract Opportunities & convert them into LookupSearchResult
        String opptyIcon = 'standard:opportunity';
        Opportunity[] opptys = (List<Opportunity>) searchResults[1];
        for (Opportunity oppty : opptys) {
            results.add(
                new LookupSearchResult(
                    oppty.Id,
                    'Opportunity',
                    opptyIcon,
                    oppty.Name,
                    'Opportunity • ' + oppty.StageName
                )
            );
        }

        // Optionnaly sort all results on title
        results.sort();

        return results;
    }

    public static List<LookupSearchResult> getDefaultResults(String searchParams) {
        SearchParams params = (SearchParams) JSON.deserialize(searchParams, SearchParams.class);
        Integer maxResults = params.maxResults != null ? params.maxResults : MAX_RESULTS;

        List<LookupSearchResult> results = new List<LookupSearchResult>();
        // Get recently viewed records of type Account or Opportunity
        List<RecentlyViewed> recentRecords = [
            SELECT Id, Name, Type
            FROM RecentlyViewed
            WHERE Type = 'Account' OR Type = 'Opportunity'
            ORDER BY LastViewedDate DESC
            LIMIT :maxResults
        ];
        // Convert recent records into LookupSearchResult
        for (RecentlyViewed recentRecord : recentRecords) {
            if (recentRecord.Type == 'Account') {
                results.add(
                    new LookupSearchResult(
                        recentRecord.Id,
                        'Account',
                        'standard:account',
                        recentRecord.Name,
                        'Account • ' + recentRecord.Name
                    )
                );
            } else {
                results.add(
                    new LookupSearchResult(
                        recentRecord.Id,
                        'Opportunity',
                        'standard:opportunity',
                        recentRecord.Name,
                        'Opportunity • ' + recentRecord.Name
                    )
                );
            }
        }
        return results;
    }

    private class SearchParams {
        Integer maxResults;
    }
}
