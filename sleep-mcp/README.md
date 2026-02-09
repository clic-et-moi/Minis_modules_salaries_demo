# Sleep MCP Server

<img src="assets/sleep-server.png" width="256" alt="Sleep MCP Logo" />

A Model Context Protocol (MCP) server that provides a simple sleep/wait tool. Useful for adding delays between operations, such as waiting between API calls or testing eventually consistent systems.

## Available Tools

- `sleep`: Wait for a specified duration in milliseconds

## Installation

```bash
git clone https://github.com/Garoth/sleep-mcp.git
npm install
```

## Configuration

Add to your Cline MCP settings file (ex. ~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json):

```json
{
  "mcpServers": {
    "sleep": {
      "command": "node",
      "args": ["/path/to/sleep-server/build/index.js"],
      "disabled": false,
      "autoApprove": [],
      "timeout": 300
    }
  }
}
```

> **Note:** The `timeout` parameter specifies the maximum time (in milliseconds) that the MCP server will wait for a response before timing out. This is particularly important for the sleep tool, as setting a timeout that's shorter than your sleep duration will cause the operation to fail. Make sure your timeout value is always greater than the maximum sleep duration you plan to use.

## Development

### Setting Up Tests

The tests verify the sleep functionality with various durations:

```bash
npm test
```

### Building

```bash
npm run build
```

## License

MIT
