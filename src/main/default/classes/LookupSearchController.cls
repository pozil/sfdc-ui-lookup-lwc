public with sharing class LookupSearchController {
    private class LookupSearchException extends Exception {
    }

    @AuraEnabled(cacheable=true)
    public static List<LookupSearchResult> search(
        String providerClass,
        String searchKey,
        List<String> selectedIds,
        String searchParams
    ) {
        if (providerClass == null || Type.forName(providerClass) == null) {
            throw new LookupSearchException('The provider class was not found');
        } else if (!LookupSearchProvider.class.isAssignableFrom(Type.forName(providerClass))) {
            throw new LookupSearchException('The provider class does not extends LookupSearchProvider');
        }
        return ((LookupSearchProvider) Type.forName(providerClass).newInstance())
            .search(searchKey, selectedIds, searchParams);
    }

    @AuraEnabled(cacheable=true)
    public static List<LookupSearchResult> getDefaultResults(String providerClass, String searchParams) {
        if (providerClass == null || Type.forName(providerClass) == null) {
            throw new LookupSearchException('The provider class was not found');
        } else if (!LookupSearchProvider.class.isAssignableFrom(Type.forName(providerClass))) {
            throw new LookupSearchException('The provider class does not extends LookupSearchProvider');
        }
        return ((LookupSearchProvider) Type.forName(providerClass).newInstance()).getDefaultResults(searchParams);
    }
}
