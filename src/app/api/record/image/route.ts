import { NextRequest, NextResponse } from 'next/server';
import multer, { Multer } from 'multer';
import { z } from 'zod';
import { APIError } from '../../lib/errors';
import type { Request } from 'express';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Zod schemas for validation
const uploadedFileSchema = z.object({
  mimetype: z.string(),
  originalFilename: z.string().optional(),
  fieldname: z.string(),
  filename: z.string(),
  path: z.string(),
  size: z.number().max(10 * 1024 * 1024, "File size must not exceed 10MB")
});

const fileUploadResultSchema = z.object({
  fields: z.record(z.array(z.string())),
  files: z.array(uploadedFileSchema).min(1, "At least one file is required").max(5, "Maximum 5 files allowed")
});

const requestSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  metadata: z.string().optional(),
  files: z.array(uploadedFileSchema).min(1, "At least one file is required")
});

// Types
type UploadedFile = z.infer<typeof uploadedFileSchema>;
type FileUploadResult = z.infer<typeof fileUploadResultSchema>;

// Constants
const MAX_FILES = 5;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 10MB
const UPLOAD_DIR = './public/uploads';
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
;

// Configure multer with additional validation
const upload: Multer = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed'));
    }
  }
});

// Modified file upload handler with improved validation and error handling
const handleFileUpload = async (request: Request): Promise<FileUploadResult> => {
  try {
    // Convert NextRequest to Express-like request for multer
    if (!request.body) request.body = {};
    
    // Create a new Promise to handle multer middleware
    const uploadResult = await new Promise<FileUploadResult>((resolve, reject) => {
      upload.array('images', MAX_FILES)(request, {} as any, async (error: any) => {
        if (error) {
          console.error("Multer Error:", error.message);
          reject(new APIError(`File upload failed: ${error.message}`, 400));
          return;
        }

        try {
          console.log("request.files:", request.files)
          // Ensure files array exists and is valid
          if (!request.files || request.files.length === 0) {
            reject(new APIError('No files were uploaded or invalid file format', 400));
            return;
          }

          const result = {
            fields: request.body,
            files: request.files as UploadedFile[]
          };

          // Validate the result
          const validationResult = fileUploadResultSchema.safeParse(result);
          if (!validationResult.success) {
            reject(new APIError(validationResult.error.errors[0].message, 400));
            return;
          }

          resolve(validationResult.data);
        } catch (err) {
          reject(new APIError(`Validation failed: ${err}`, 400));
        }
      });
    });

    return uploadResult;
  } catch (error) {
    if (error instanceof multer.MulterError) {
      throw new APIError(`File upload failed: ${error.message}`, 400);
    }
    throw error;
  }
};

// Helper class for converting files to Blobs
class Blobify {
  static async fromPath(filepath: string): Promise<Blob> {
    const fs = require('fs').promises;
    const buffer = await fs.readFile(filepath);
    return new Blob([buffer]);
  }
}

// Modified API Route handler with improved error handling
export async function POST(request: NextRequest) {
  try {
    console.log("Processing incoming request...");
    
    // Validate API key
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      throw new APIError('API key is not configured', 500);
    }

    // Convert NextRequest to Express-like request
    const expressReq = request as any as Request;
    
    // Handle file upload and validate result
    const uploadResult = await handleFileUpload(expressReq);
    console.log( "upload  ", uploadResult)
    
    // Extract and validate fields with proper type checking
    const patientId = Array.isArray(uploadResult.fields.patientId) 
      ? uploadResult.fields.patientId[0] 
      : uploadResult.fields.patientId;
    
    const metadata = Array.isArray(uploadResult.fields.metadata) 
      ? uploadResult.fields.metadata[0] 
      : uploadResult.fields.metadata;

    // Validate request data
    const validationResult = requestSchema.safeParse({
      patientId,
      metadata,
      files: uploadResult.files
    });

    if (!validationResult.success) {
      throw new APIError(validationResult.error.errors[0].message, 400);
    }

    // Process uploads
    const results = await Promise.all(
      uploadResult.files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', await Blobify.fromPath(file.path), file.originalFilename || 'unnamed');
        formData.append('patientId', patientId.toString());

        if (metadata) {
          formData.append('metadata', metadata.toString());
        }

        console.log(`Sending request for file: ${file.filename}`);
        console.log(`Patient ID: ${patientId}`);
        
        const response = await fetch('https://34.49.13.123.nip.io/zk/v1/record/image', {
          method: 'POST',
          headers: { 'apikey': apiKey },
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Response Error:', errorText);
          throw new APIError(
            `API request failed with status ${response.status}: ${errorText}`,
            response.status
          );
        }

        return await response.json();
      })
    );

    return NextResponse.json(results, { status: 201 });

  } catch (error) {
    console.error('Error processing request:', error);

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
  } finally {
    // TODO: Implement cleanup logic for uploaded files
  }
}