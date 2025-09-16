import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    InitializedNotificationSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { OscarClient } from './client.js';
import {
    courseToolDefinition,
    handleCourseTool,
} from './tools/index.js';

export function createStandaloneServer(): Server {
    const serverInstance = new Server(
        {
            name: "gatech/oscar",
            version: "0.2.0",
        },
        {
            capabilities: {
                tools: {},
            },
        }
    );

    const oscarClient = new OscarClient();

    serverInstance.setNotificationHandler(InitializedNotificationSchema, async () => {
        console.log('Oscar MCP client initialized');
    });

    serverInstance.setRequestHandler(ListToolsRequestSchema, async () => ({
        tools: [courseToolDefinition],
    }));

    serverInstance.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        
        switch (name) {
            case "oscar_get_course_data":
                return await handleCourseTool(oscarClient, args);
            default:
                return {
                    content: [{ type: "text", text: `Unknown tool: ${name}` }],
                    isError: true,
                };
        }
    });

    return serverInstance;
}

export class OscarServer {
    constructor() {}

    getServer(): Server {
        return createStandaloneServer();
    }
}