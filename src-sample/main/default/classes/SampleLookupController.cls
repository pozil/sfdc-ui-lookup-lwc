public with sharing class SampleLookupController {
    private final static Integer MAX_RESULTS = 5;

    @AuraEnabled(cacheable=true)
    public static List<LookupSearchResult> search(
        String searchTerm,
        List<String> selectedIds,
        String queryCondition,
        String configuration
    ) {
        // Prepare query paramters
        searchTerm += '*';
        List<LookupSearchResult> results = new List<LookupSearchResult>();
        LookupSearchResult config = (LookupSearchResult) JSON.deserialize(configuration, LookupSearchResult.class);
        String query =
            'FIND \'' +
            String.escapeSingleQuotes(searchTerm) +
            '\' IN NAME FIELDS RETURNING ' +
            config.getSObjectType() +
            ' (Id, ' +
            config.getTitle() +
            (String.isNotBlank(config.getSubtitle()) ? ', ' + config.getSubtitle() : '') +
            ' WHERE ID NOT IN :selectedIds ' +
            (String.isNotBlank(queryCondition) ? ' AND ' + queryCondition : '') +
            ') LIMIT :MAX_RESULTS';
        for (SObject record : search.query(query)[0]) {
            results.add(
                new LookupSearchResult(
                    (ID) record.get('Id'),
                    config.getSObjectType(),
                    String.isNotBlank(config.getIcon())
                        ? config.getIcon()
                        : 'standard:' + config.getSObjectType().toLowerCase(),
                    (String) record.get(config.getTitle()),
                    String.isNotBlank(config.getSubtitle()) ? String.valueOf(record.get(config.getSubtitle())) : null
                )
            );
        }

        // Optionnaly sort all results on title
        results.sort();

        return results;
    }
}
