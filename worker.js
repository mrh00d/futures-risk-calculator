// Simple worker to serve static files
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Default to index.html for root path
    if (url.pathname === '/') {
      url.pathname = '/index.html';
    }
    
    // Fetch the static asset
    const response = await env.ASSETS.fetch(request);
    
    // If 404, try to serve index.html (for SPA routing)
    if (response.status === 404) {
      const indexResponse = await env.ASSETS.fetch(new Request(url.origin + '/index.html', request));
      if (indexResponse.status === 200) {
        return new Response(indexResponse.body, {
          status: 200,
          headers: {
            ...Object.fromEntries(indexResponse.headers),
            'content-type': 'text/html; charset=utf-8',
          },
        });
      }
    }
    
    // Add security headers
    const modifiedResponse = new Response(response.body, response);
    modifiedResponse.headers.set('X-Frame-Options', 'DENY');
    modifiedResponse.headers.set('X-Content-Type-Options', 'nosniff');
    modifiedResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    return modifiedResponse;
  },
};