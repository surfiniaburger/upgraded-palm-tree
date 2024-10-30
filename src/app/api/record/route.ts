// app/api/record/route.ts
import { NextResponse } from 'next/server';
import { createApiClient } from '../lib/utils';
import {APIError} from '@/app/api/lib/errors'
import { RecordCreationResponse } from '../types';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = createApiClient('/record');
    const response = await client.post<RecordCreationResponse>(data);
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json(
      { message: error instanceof APIError ? error.message : 'Internal server error' },
      { status: error instanceof APIError ? error.statusCode : 500 }
    );
  }
}