public interface LookupSearchProvider {
    List<LookupSearchResult> search(String searchKey, List<String> selectedIds, String searchParams);
    List<LookupSearchResult> getDefaultResults(String searchParams);
}
