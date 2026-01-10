const express = require('express');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');

const app = express();
const PORT = process.env.PORT || 8080;

// Create MCP server
const mcpServer = new Server(
  { name: 'example-server', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

// Handle tools/list
mcpServer.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'echo',
    description: 'Echoes back the input',
    inputSchema: {
      type: 'object',
      properties: { message: { type: 'string' } },
      required: ['message']
    }
  }]
}));

// Handle tools/call
mcpServer.setRequestHandler('tools/call', async (request) => ({
  content: [{ type: 'text', text: `Echo: ${request.params.arguments.message}` }]
}));

// Create transport
const transport = new SSEServerTransport('/messages', mcpServer);

app.get('/sse', (req, res) => transport.connect(req, res));
app.post('/messages', (req, res) => transport.handlePostMessage(req, res));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
