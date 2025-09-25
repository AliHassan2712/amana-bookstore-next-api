export function middleware(request) {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  return;
}
