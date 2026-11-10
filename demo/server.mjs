import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const HOST = '127.0.0.1';
const PORT = 4173;
const PAGE_URL = new URL('./posts/index.html', import.meta.url);

const server = createServer(async (request, response) => {
  const { pathname } = new URL(request.url ?? '/', `http://${HOST}`);

  if (
    pathname !== '/' ||
    (request.method !== 'GET' && request.method !== 'HEAD')
  ) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  try {
    const html = await readFile(PAGE_URL);
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : html);
  } catch {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Internal server error');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Demo server running at http://${HOST}:${PORT}/`);
});
