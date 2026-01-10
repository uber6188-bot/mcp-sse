const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { SSEServerTransport } = require("@modelcontextprotocol/sdk/server/sse.js");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

const server = new Server(
  {
    name: "example-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler("tools/list", async () => {
  return {
    tools: [
      {
        name: "echo",
        description: "Echoes back the input",
        inputSchema: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Message to echo",
            },
          },
          required: ["message"],
        },
      },
    ],
  };
});

server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "echo") {
    return {
      content: [
        {
          type: "text",
          text: `Echo: ${request.params.arguments.message}`,
        },
      ],
    };
  }
  throw new Error("Unknown tool");
});

const transport = new SSEServerTransport("/messages", server);

app.get("/sse", async (req, res) => {
  await transport.handleSseConnection(req, res);
});

app.post("/messages", async (req, res) => {
  await transport.handlePostMessage(req, res);
});

app.listen(PORT, () => {
  console.log(`MCP SSE server running on port ${PORT}`);
});
