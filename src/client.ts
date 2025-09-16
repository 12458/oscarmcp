import { OscarResponse } from './types.js';

export class OscarClient {
    private baseUrl: string = 'https://gt-catalog-parser.12458.workers.dev';

    constructor() {}

    /**
     * Performs Georgia Tech OSCAR API request
     */
    async performRequest(params: { term: string; crn: string }): Promise<string> {
        const url = `${this.baseUrl}/?term_in=${encodeURIComponent(params.term)}&crn_in=${encodeURIComponent(params.crn)}`;
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            let errorText: string;
            try {
                errorText = await response.text();
            } catch {
                errorText = "Unable to parse error response";
            }
            throw new Error(
                `Oscar API error: ${response.status} ${response.statusText}\n${errorText}`
            );
        }

        const data: OscarResponse = await response.json();
        return this.formatResponse(data);
    }

    private formatResponse(data: OscarResponse): string {
        // Format response according to service requirements
        return JSON.stringify(data, null, 2);
    }
}