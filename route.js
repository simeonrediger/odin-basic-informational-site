import path from 'node:path';
import * as fs from 'node:fs/promises';

import { origin } from './index.js';

const contentTypes = {
  html: 'text/html',
  css: 'text/css',
};

export default async function route(request, response) {
  const url = new URL(request.url, origin);

  if (url.pathname === '/') {
    url.pathname += 'index';
  }

  const extension = path.extname(url.pathname) || '.html';

  if (!url.pathname.endsWith(extension)) {
    url.pathname += extension;
  }

  const contentType = contentTypes[extension.slice(1)];

  try {
    if (!contentType) {
      throw new Error('Unrecognized content type');
    }

    const data = await fs.readFile('.' + url.pathname, 'utf8');
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(data);
  } catch (error) {
    if (extension === '.html') {
      try {
        const notFoundPage = await fs.readFile('404.html', 'utf8');
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end(notFoundPage);
        return;
      } catch (error) {}
    }

    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not Found');
  }
}
