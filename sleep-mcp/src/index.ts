#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { SleepService } from "./services/sleep.js";

const service = new SleepService();
const server = new Server(
  {
    name: "sleep-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Handler that lists available tools.
 * Exposes a single "sleep" tool that waits for a specified duration.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "sleep",
        description: "Wait for a specified duration",
        inputSchema: {
          type: "object",
          properties: {
            milliseconds: {
              type: "number",
              description: "Duration to wait in milliseconds",
              minimum: 0
            }
          },
          required: ["milliseconds"]
        }
      }
    ]
  };
});

/**
 * Handler for the sleep tool.
 * Waits for the specified duration and returns a success message.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "sleep") {
    throw new McpError(ErrorCode.MethodNotFound, "Unknown tool");
  }

  try {
    const ms = Number(request.params.arguments?.milliseconds);
    await service.sleep(ms);

    return {
      content: [{
        type: "text",
        text: `Waited for ${ms} milliseconds`
      }]
    };
  } catch (error) {
    throw new McpError(
      ErrorCode.InvalidParams,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
});

/**
 * Start the server using stdio transport.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Sleep MCP server running on stdio');
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
