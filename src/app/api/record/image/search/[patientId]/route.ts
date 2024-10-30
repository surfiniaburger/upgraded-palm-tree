// app/api/record/image/search/[patientId]/route.ts
import { NextResponse } from 'next/server';
import { MediaRecordResponse } from '@/app/api/types';
import { createApiClient } from '@/app/api/lib/utils';
import { APIError } from '@/app/api/lib/errors';

export async function GET(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const client = createApiClient('/record/image/search');
    const response = await client.get<MediaRecordResponse>(`/${params.patientId}`);
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error searching image record:', error);
    return NextResponse.json(
      { message: error instanceof APIError ? error.message : 'Internal server error' },
      { status: error instanceof APIError ? error.statusCode : 500 }
    );
  }
}
