import * as http from 'node:http';
import fs from 'node:fs';

const server = http.createServer(route);
server.listen(8080);

const routes = {
  '/': 'index.html',
};

const contentTypes = {
  html: 'text/html',
};

function route(request, response) {
  const filepath = routes[request.url];
  const extension = filepath.split('.')[1];
  const contentType = contentTypes[extension];

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
