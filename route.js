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

    const content = await readPublicFile(url.pathname);
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(content);
  } catch (error) {
    await handleFileNotFound(response, extension);
  }
}

async function readPublicFile(pathname) {
  return fs.readFile('./public' + pathname, { encoding: 'utf8' });
}

async function handleFileNotFound(response, extension) {
  if (extension === '.html') {
    try {
      const notFoundPage = await readPublicFile('/404.html');
      response.writeHead(404, { 'Content-Type': 'text/html' });
      response.end(notFoundPage);
      return;
    } catch (error) {}
  }

  response.writeHead(404, { 'Content-Type': 'text/plain' });
  response.end('Not Found');
}
