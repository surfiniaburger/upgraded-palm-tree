// app/api/types.ts
export interface BaseResponse {
    message?: string;
  }
  
  export interface RecordCreationResponse extends BaseResponse {
    recordId: string;
  }
  
  export interface BaseRecordResponse {
    patientId: string;
    recordHash: string;
    criteriaHash: string;
    isValid: boolean;
  }
  
  export interface PatientRecordResponse extends BaseRecordResponse {
    decryptedData: string;
  }
  
  export interface MediaRecordResponse extends BaseRecordResponse {
    diagnosticResult: string;
  }