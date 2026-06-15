import * as http from 'node:http';

import route from './route.js';

const port = 8080;
export const origin = `http://localhost:${port}`;

const server = http.createServer(route);
server.listen(port);
