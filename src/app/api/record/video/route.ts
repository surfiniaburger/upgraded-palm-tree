import { NextResponse } from 'next/server';
import { APIError } from '../../lib/errors';
import { UploadResponse } from '@/app/api/lib/utils';

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      throw new APIError('API key is not configured', 500);
    }

    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate video file type
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { message: 'Invalid file type. Only videos are allowed.' },
        { status: 400 }
      );
    }

    const apiFormData = new FormData();
    apiFormData.append('file', file);

    const formDataEntries = Array.from(formData.entries());
    formDataEntries.forEach(([key, value]) => {
      if (key !== 'file') {
        apiFormData.append(key, value);
      }
    });

    const response = await fetch('https://34.49.13.123.nip.io/zk/v1/record/video', {
      method: 'POST',
      headers: {
        'apikey': apiKey,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      throw new APIError(
        `API request failed with status ${response.status}`,
        response.status
      );
    }

    const result = await response.json() as UploadResponse;
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Error uploading video:', error);
    
    if (error instanceof APIError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const revalidate = 0; // adjust as per your requirements
export const maxDuration = 5; // optional, limits execution time if necessary
