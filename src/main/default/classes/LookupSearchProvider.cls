public interface LookupSearchProvider {
    List<LookupSearchResult> search(String searchParams);
    List<LookupSearchResult> getDefaultResults(String searchParams);
}
