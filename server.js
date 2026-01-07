const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/sse", (req, res) => {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  res.flushHeaders();

  res.write(`event: message\n`);
  res.write(`data: MCP server is running\n\n`);

  const timer = setInterval(() => {
    res.write(`data: ${new Date().toISOString()}\n\n`);
  }, 3000);

  req.on("close", () => {
    clearInterval(timer);
  });
});

app.listen(3000, () => {
  console.log("MCP SSE server running on http://localhost:3000/sse");
});
