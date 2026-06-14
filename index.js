import * as http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';

const port = 8080;
const origin = `http://localhost:${port}`;

const server = http.createServer(route);
server.listen(port);

const routes = {
  '/': 'index.html',
  '/about': 'about.html',
  '/contact-me': 'contact-me.html',
  '/style.css': 'style.css',
};

const contentTypes = {
  html: 'text/html',
  css: 'text/css',
};

function route(request, response) {
  const url = new URL(request.url, origin);

  if (url.origin !== origin) {
    console.error('Bad origin:', url.origin);
    return;
  }

  const filepath = routes[url.pathname];
  const extension = path.extname(url.pathname) || '.html';
  const contentType = contentTypes[extension.slice(1)];

  if (!filepath || !contentType) {
    console.error('Bad route:', request.url);
    return;
  }

  response.writeHead(200, { 'Content-Type': contentType });

  try {
    const data = fs.readFileSync(filepath, 'utf8');
    response.end(data);
  } catch (error) {
    console.error(error);
  }
}
