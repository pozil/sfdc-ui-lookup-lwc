public with sharing class SampleLookupController {
    private final static Integer MAX_RESULTS = 5;

    @AuraEnabled(Cacheable=true)
    public static List<LookupSearchResult> search(String searchTerm, List<String> selectedIds) {
        // Prepare query paramters
        searchTerm += '*';

        // Execute search query
        List<List<SObject>> searchResults = [
            FIND :searchTerm
            IN ALL FIELDS
            RETURNING
                Account(Id, Name, BillingCity WHERE id NOT IN :selectedIds),
                Opportunity(Id, Name, StageName WHERE id NOT IN :selectedIds)
            LIMIT :MAX_RESULTS
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

    @AuraEnabled(Cacheable=true)
    public static List<LookupSearchResult> genericSelector(
        String searchTerm,
        List<String> selectedIds,
        String queryCondition,
        String configuration
    ) { 
        LookupSearchResult config = (LookupSearchResult) JSON.deserialize(configuration, LookupSearchResult.class);
        List<LookupSearchResult> results = new List<LookupSearchResult>();
        String query = 'SELECT Id, ' + config.getTitle() +
            (String.isNotBlank(config.getSubtitle()) ? ', ' + config.getSubtitle() : '') +
            ' FROM ' + config.getSObjectType() + ' WHERE ' +
            (String.isNotBlank(searchTerm) ? '(' + config.getTitle() + ' LIKE \'%' + String.escapeSingleQuotes(searchTerm) + '%\'' +
                (String.isNotBlank(searchTerm) && String.isNotBlank(config.getSubtitle()) ? ' OR ' +
                config.getSubtitle() + ' LIKE \'%' + String.escapeSingleQuotes(searchTerm) + '%\'' : '')  +
                ') AND' : '') +
            ' Id NOT IN :selectedIds' +
            (String.isNotBlank(queryCondition) ? ' AND ' + queryCondition : '') +
            ' LIMIT ' + MAX_RESULTS;
        for (SObject record : Database.query(query)) {
            results.add(
                new LookupSearchResult(
                    (ID) record.get('Id'),
                    config.getSObjectType(),
                    String.isNotBlank(config.getIcon()) ?
                        config.getIcon() : 'standard:' + config.getSObjectType().toLowerCase(),
                    (String) record.get(config.getTitle()),
                    String.isNotBlank(config.getSubtitle()) ? (String) record.get(config.getSubtitle()) : null
                )
            );
        }
        return results;
    }
}
