import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = ['http://localhost:3000', 'https://upgraded-palm-tree.vercel.app']; // Add your domains here

 // Load the API key from environment variables
 const apiKey = process.env.NEXT_PUBLIC_API_KEY || ''; 

 // Check if the API key is available
 if (!apiKey) {
   console.log("key not found")
 }

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
};

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  const isPreflight = request.method === 'OPTIONS';
  
  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  const response = NextResponse.next();
  
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: '/api/:path*', // Apply this middleware to API routes only
};
