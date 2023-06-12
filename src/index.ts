import http from 'http';

import { environment } from './config/environment';

export const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      data: 'It works!',
    })
  );
});

server.listen(3000, () => {
  console.log(environment);
  console.log('Server running on http://localhost:3000/');
});
