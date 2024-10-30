// app/api/lib/errors.ts
export class APIError extends Error {
    constructor(
      message: string,
      public statusCode: number
    ) {
      super(message);
      this.name = 'APIError';
    }
  }