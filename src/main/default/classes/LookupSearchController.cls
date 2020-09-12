public with sharing class LookupSearchController {
    private class LookupSearchException extends Exception {
    }

    @AuraEnabled(cacheable=true)
    public static List<LookupSearchResult> search(String selectorClass, String searchParams) {
        if (Type.forName(selectorClass) == null) {
            throw new LookupSearchException('The provider class was not found');
        } else if (!LookupSearchProvider.class.isAssignableFrom(Type.forName(selectorClass))) {
            throw new LookupSearchException('The provider class does not extends LookupSearchProvider');
        }
        return ((LookupSearchProvider) Type.forName(selectorClass).newInstance()).search(searchParams);
    }

    @AuraEnabled(cacheable=true)
    public static List<LookupSearchResult> getDefaultResults(String selectorClass, String searchParams) {
        if (Type.forName(selectorClass) == null) {
            throw new LookupSearchException('The provider class was not found');
        } else if (!LookupSearchProvider.class.isAssignableFrom(Type.forName(selectorClass))) {
            throw new LookupSearchException('The provider class does not extends LookupSearchProvider');
        }
        return ((LookupSearchProvider) Type.forName(selectorClass).newInstance()).getDefaultResults(searchParams);
    }
}
