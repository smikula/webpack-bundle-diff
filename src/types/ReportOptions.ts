export interface ReportOptions {
    /**
     * Optional array of chunk groups to report on.  If provided, only these chunk groups are
     * included in the report, and are reported in the order provided.
     */
    chunkGroups?: string[];

    /**
     * Optional transform to apply to module names before printing them in the report.
     */
    moduleNameTransform?: ModuleNameTransform;
}

export interface ModuleNameTransform {
    (name: string): string;
}
