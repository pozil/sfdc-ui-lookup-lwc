/**
 * Class used to serialize a single Lookup search result item
 * The Lookup controller returns a List<LookupSearchResult> when sending search result back to Lightning
 */
public virtual class LookupSearchResult implements Comparable {
    protected String id;
    protected String sObjectType;
    protected String icon;
    protected String title;
    protected String subtitle;

    protected LookupSearchResult() {
    }

    /**
     * @param id the lookup entry identifier (generally a record ID)
     * @param sObjectType Optional - The sObject type of the selected record. This value is not used for lookup rendering. It's passed back to the selection handler in case you search on multiple object types.
     * @param icon Optional - A qualified SLDS icon name taken from https://www.lightningdesignsystem.com/icons. It defaults to standard:default.
     * @param title Required - The label of the lookup entry
     * @param subtitle Optional - A subtitle that is displayed under the lookup entry label
     */
    public LookupSearchResult(String id, String sObjectType, String icon, String title, String subtitle) {
        this.id = id;
        this.sObjectType = sObjectType;
        this.icon = icon;
        this.title = title;
        this.subtitle = subtitle;
    }

    @AuraEnabled
    public String getId() {
        return id;
    }

    @AuraEnabled
    public String getSObjectType() {
        return sObjectType;
    }

    @AuraEnabled
    public String getIcon() {
        return icon;
    }

    @AuraEnabled
    public String getTitle() {
        return title;
    }

    @AuraEnabled
    public String getSubtitle() {
        return subtitle;
    }

    /**
     * Allow to sort search results based on title
     */
    public Integer compareTo(Object compareTo) {
        LookupSearchResult other = (LookupSearchResult) compareTo;
        if (this.getTitle() == null) {
            return (other.getTitle() == null) ? 0 : 1;
        }
        if (other.getTitle() == null) {
            return -1;
        }
        return this.getTitle().compareTo(other.getTitle());
    }
}
