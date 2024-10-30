import { NextResponse } from 'next/server';
import {APIError} from '@/app/api/lib/errors'
import { createApiClient } from '../../lib/utils';

export async function GET() {
  try {
    const client = createApiClient('/record/health');
    const response = await client.get<string>();
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error in health check:', error);
    return NextResponse.json(
      { message: error instanceof APIError ? error.message : 'Internal server error' },
      { status: error instanceof APIError ? error.statusCode : 500 }
    );
  }
}