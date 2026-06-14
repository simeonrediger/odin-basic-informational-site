import * as http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';

const port = 8080;
const origin = `http://localhost:${port}`;

const server = http.createServer(route);
server.listen(port);

const contentTypes = {
  html: 'text/html',
  css: 'text/css',
};

function route(request, response) {
  const url = new URL(request.url, origin);

  if (url.pathname === '/') {
    url.pathname += 'index';
  }

  const extension = path.extname(url.pathname) || '.html';

  if (!url.pathname.endsWith(extension)) {
    url.pathname += extension;
  }

  const contentType = contentTypes[extension.slice(1)];

  if (!contentType) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not Found');
    return;
  }

  if (!fs.existsSync('.' + url.pathname)) {
    response.writeHead(404, { 'Content-Type': 'text/html' });

    try {
      const notFoundPage = fs.readFileSync('404.html', 'utf8');
      response.end(notFoundPage);
    } catch (error) {
      console.error(error);
    }

    return;
  }

  response.writeHead(200, { 'Content-Type': contentType });

  try {
    const data = fs.readFileSync('.' + url.pathname, 'utf8');
    response.end(data);
  } catch (error) {
    console.error(error);
  }
}
