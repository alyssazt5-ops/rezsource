const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 8000;
const mimeTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.csv': 'text/csv', '.png': 'image/png' };

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(process.cwd(), requestedPath);
  fs.readFile(filePath, (error, content) => {
    if (error) {
      fs.readFile(path.join(process.cwd(), '404.html'), (notFoundError, notFoundPage) => {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html');
        response.end(notFoundError ? 'Page not found' : notFoundPage);
      });
      return;
    }
    response.statusCode = 200;
    response.setHeader('Content-Type', mimeTypes[path.extname(filePath)] || 'application/octet-stream');
    response.end(content);
  });
}).listen(port, () => console.log(`RezSource preview: http://localhost:${port}`));
