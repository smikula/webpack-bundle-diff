export interface DataOptions {
    /**
     * Optional filter to apply to chunk group assets.  If provided, each asset name is passed to
     * the filter and only those for which `true` is returned are counted towards the chunk group
     * size.
     */
    assetFilter?: AssetFilter;

    /**
     * Optional flag to validate the module graph.  If any errors are detected they are reported to
     * the error console and the API will fail.
     */
    validate?: boolean;

    /**
     * Optional specifier for the child stats to use, if the webpack build included multiple
     * configs.  This can be the stats name or an index into the children array.
     */
    childStats?: string | number;
}

export interface AssetFilter {
    (name: string): boolean;
}
