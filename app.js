import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const badUrl = '/*badUrl';
const routes = {
  '/': 'index.html',
  '/about': 'about.html',
  '/contact-me': 'contact-me.html',
  '/style.css': 'style.css',
  [badUrl]: '404.html',
};

for (const [route, filename] of Object.entries(routes)) {
  app.get(route, (request, response) => {
    if (route === badUrl) {
      response.status(404);
    }

    sendPublicFile(response, filename);
  });
}

app.listen(PORT, error => {
  if (error) {
    throw error;
  }

  console.log(`Listening on port ${PORT}...`);
});

function sendPublicFile(response, filename) {
  const filepath = path.join(__dirname, 'public', filename);
  response.sendFile(filepath);
}
