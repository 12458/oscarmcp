/**
 * Arguments for course data tool
 */
export interface CourseArgs {
    term: string; // Term code in YYYYMM format (MM: 02=Spring, 08=Fall)
    crn: string;  // Course Reference Number
}

/**
 * Georgia Tech OSCAR API response structure
 */
export interface OscarResponse {
    // The API returns course data - structure may vary
    [key: string]: unknown;
}