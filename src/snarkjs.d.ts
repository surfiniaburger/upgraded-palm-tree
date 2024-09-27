declare module 'snarkjs' {
    export function fullProve(
      input: any,
      wasmPath: string,
      zkeyPath: string
    ): Promise<{ proof: any; publicSignals: any }>;
  
    export function verify(
      vKey: any,
      publicSignals: any,
      proof: any
    ): Promise<boolean>;
  }
  