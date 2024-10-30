// app/api/record/search/[patientId]/route.ts
import { NextResponse } from 'next/server';
import { APIError } from '@/app/api/lib/errors';
import { createApiClient } from '@/app/api/lib/utils';
import { PatientRecordResponse } from '@/app/api/types';

export async function GET(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const client = createApiClient('/record/search');
    const response = await client.get<PatientRecordResponse>(`/${params.patientId}`);
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error searching patient record:', error);
    return NextResponse.json(
      { message: error instanceof APIError ? error.message : 'Internal server error' },
      { status: error instanceof APIError ? error.statusCode : 500 }
    );
  }
}