import { Tool, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { OscarClient } from '../client.js';
import { CourseArgs } from '../types.js';

/**
 * Tool definition for course data fetching
 */
export const courseToolDefinition: Tool = {
    name: "oscar_get_course_data",
    description: "Scrape Georgia Tech OSCAR for course data using term code and CRN. Term format: YYYYMM where MM is 02 (Spring) or 08 (Fall).",
    inputSchema: {
        type: "object",
        properties: {
            term: {
                type: "string",
                description: "Term code in YYYYMM format (MM: 02=Spring, 08=Fall)"
            },
            crn: {
                type: "string",
                description: "Course Reference Number (CRN)"
            }
        },
        required: ["term", "crn"],
    },
};

/**
 * Type guard for course arguments
 */
function isCourseArgs(args: unknown): args is CourseArgs {
    return (
        typeof args === "object" &&
        args !== null &&
        "term" in args &&
        "crn" in args &&
        typeof (args as { term: unknown }).term === "string" &&
        typeof (args as { crn: unknown }).crn === "string"
    );
}

/**
 * Handles course tool calls
 */
export async function handleCourseTool(
    client: OscarClient, 
    args: unknown
): Promise<CallToolResult> {
    try {
        if (!args) {
            throw new Error("No arguments provided");
        }

        if (!isCourseArgs(args)) {
            throw new Error("Invalid arguments for oscar_get_course_data");
        }

        const result = await client.performRequest(args);
        
        return {
            content: [{ type: "text", text: result }],
            isError: false,
        };
    } catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Error: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
}