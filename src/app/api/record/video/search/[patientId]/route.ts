// app/api/record/video/search/[patientId]/route.ts
import { NextResponse } from 'next/server';
import { createApiClient } from '@/app/api/lib/utils';
import { MediaRecordResponse } from '@/app/api/types';
import { APIError } from '@/app/api/lib/errors';

export async function GET(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const client = createApiClient('/record/video/search');
    const response = await client.get<MediaRecordResponse>(`/${params.patientId}`);
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error searching video record:', error);
    return NextResponse.json(
      { message: error instanceof APIError ? error.message : 'Internal server error' },
      { status: error instanceof APIError ? error.statusCode : 500 }
    );
  }
}