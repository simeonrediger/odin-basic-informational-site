import * as http from 'node:http';

import route from './route.js';

const PORT = 8080;
export const origin = `http://localhost:${PORT}`;

const server = http.createServer(route);
server.listen(PORT);
