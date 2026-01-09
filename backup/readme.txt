MCP SSE Server (Node.js)

This project is a simple HTTP + SSE (Server-Sent Events) server for MCP experiments.

Features:
- Runs on Node.js
- Supports SSE at the /sse endpoint
- Works locally and when deployed to cloud platforms such as Railway
- Supports dynamic PORT environment variable (for hosting platforms)

Local development:
1. Install dependencies:
   npm install
2. Start the server:
   node server.js
3. Open in browser:
   http://localhost:3000/sse

Cloud deployment (Railway):
- Application will listen on process.env.PORT automatically
- Public URL example:
  https://<your-app>.up.railway.app/sse

Project files:
- server.js  → Main SSE HTTP server
- index.js   → Entry point used by Railway to start server.js
- package.json → Node project configuration

Expected SSE output example:

event: message
data: MCP server is running
data: 2026-01-07T00:00:00.000Z

Usage / 使用方法:

本機運行（Local）：
- 在 Terminal 執行：
  node server.js
- 需要保持 Terminal 開啟及程式正在運行
- 如果關閉 Terminal 或按 Ctrl + C，伺服器就會停止
- 測試網址：
  http://localhost:3000/sse

雲端運行（Railway）：
- 不需要保持你本機 Terminal 開啟
- Railway 會在雲端長期運行你的程式
- 只需要使用 Railway 提供的網址：
  https://<your-app>.up.railway.app/sse

提示：
- 本機＝測試及開發
- Railway＝提供公開 HTTPS 連線給 ChatGPT MCP 使用

Notes:
- This server currently streams simple messages for testing
- MCP protocol JSON messages can be added later
- Good for testing ChatGPT MCP server URL connectivity

End of file.
