const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

// Read API key from js/config.js
const configText = fs.readFileSync(path.join(__dirname, "js", "config.js"), "utf-8");
const match = configText.match(/OPENAI_API_KEY\s*=\s*['"](.+?)['"]/);
if (!match) {
  console.error("Could not find OPENAI_API_KEY in js/config.js");
  process.exit(1);
}
const OPENAI_API_KEY = match[1];

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function serveStaticFile(res, filePath) {
  const ext = path.extname(filePath);
  const mime = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  });
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString()));
  });
}

const server = http.createServer(async (req, res) => {
  // Proxy endpoint
  if (req.method === "POST" && req.url === "/api/ask") {
    const body = await readBody(req);

    const options = {
      hostname: "api.openai.com",
      path: "/v1/responses",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    };

    const proxyReq = https.request(options, (proxyRes) => {
      const chunks = [];
      proxyRes.on("data", (chunk) => chunks.push(chunk));
      proxyRes.on("end", () => {
        const responseBody = Buffer.concat(chunks).toString();
        if (proxyRes.statusCode !== 200) {
          console.error("OpenAI error:", proxyRes.statusCode, responseBody);
        }
        res.writeHead(proxyRes.statusCode, {
          "Content-Type": "application/json",
        });
        res.end(responseBody);
      });
    });

    proxyReq.on("error", (err) => {
      res.writeHead(502);
      res.end(JSON.stringify({ error: err.message }));
    });

    proxyReq.write(body);
    proxyReq.end();
    return;
  }

  // Static file serving
  let filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
  serveStaticFile(res, filePath);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});