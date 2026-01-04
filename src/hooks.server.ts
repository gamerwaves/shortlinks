import type { Handle } from '@sveltejs/kit';

const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return url.hostname.endsWith('.dwait.dev') || url.hostname === 'dwait.dev';
  } catch {
    return false;
  }
};

export const handle: Handle = async ({ resolve, event }) => {
  const origin = event.request.headers.get('origin');
  const allowedOrigin = isAllowedOrigin(origin) ? origin : null;

  // Apply CORS header for API routes
  if (event.url.pathname.startsWith('/api')) {
    // Required for CORS to work
    if(event.request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          ...(allowedOrigin && { 'Access-Control-Allow-Origin': allowedOrigin }),
          'Access-Control-Allow-Headers': '*',
        }
      });
    }
  }

  const response = await resolve(event);
  if (event.url.pathname.startsWith('/api') && allowedOrigin) {
    response.headers.append('Access-Control-Allow-Origin', allowedOrigin);
  }
  return response;
};