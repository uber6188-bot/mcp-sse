const express = require('express');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');
const { ListToolsRequestSchema, CallToolRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

const server = new Server(
  { name: 'example-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: 'echo',
      description: 'Echoes back the input message',
      inputSchema: {
        type: 'object',
        properties: {
          message: { type: 'string', description: 'Message to echo' }
        },
        required: ['message']
      }
    }]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'echo') {
    return {
      content: [{
        type: 'text',
        text: `Echo: ${request.params.arguments.message}`
      }]
    };
  }
  throw new Error(`Unknown tool: ${request.params.name}`);
});

// SSE transport
let transport;

app.get('/sse', async (req, res) => {
  transport = new SSEServerTransport('/messages', res);
  await server.connect(transport);
});

app.post('/messages', async (req, res) => {
  if (!transport) {
    return res.status(500).send('Transport not initialized');
  }
  await transport.handlePostMessage(req, res);
});

app.listen(PORT, () => {
  console.log(`MCP SSE server running on port ${PORT}`);
});
