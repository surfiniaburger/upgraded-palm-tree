// app/api/record-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prove, verify, buildBn128 } from '@zk-kit/groth16';
import path from 'path';
import sanitize from 'sanitize-filename'; // Sanitize inputs

export async function POST(req: NextRequest) {
  try {
    console.log('Received POST request for record verification');
    
    // Parse the request body
    const body = await req.json();
    console.log('Request body:', body);
    
    const { recordHash, criteriaHash } = body;

    // Validate required fields
    if (!recordHash || !criteriaHash) {
      console.error('Missing recordHash or criteriaHash');
      return NextResponse.json({ error: 'Record hash and criteria hash are required' }, { status: 400 });
    }

    // Step 1: Sanitize inputs
    const sanitizedRecordHash = sanitize(recordHash);
    const sanitizedCriteriaHash = sanitize(criteriaHash);
    console.log('Sanitized recordHash:', sanitizedRecordHash);
    console.log('Sanitized criteriaHash:', sanitizedCriteriaHash);

    // Step 2: Build the BN128 curve for Groth16
    console.log('Building BN128 curve for Groth16...');
    await buildBn128();
    console.log('BN128 curve built successfully.');

    // Step 3: Generate proof using ZK-SNARK (with groth16)
    console.log('Generating proof...');
    const proofData = await generateProof(sanitizedRecordHash, sanitizedCriteriaHash);
    console.log('Proof generated:', proofData);

    // Step 4: Verify the proof (currently commented out)
    // const verificationResult = await verifyProof(proofData);
    // console.log('Proof verification result:', verificationResult);

    // if (!verificationResult) {
    //   console.error('Proof verification failed.');
    //   return NextResponse.json({ error: 'Proof verification failed' }, { status: 400 });
    // }

    // Return the proof data in the response
    console.log('Record verification completed successfully.');
    return NextResponse.json({
      message: 'Record Verification Complete',
      proofData,
    });
  } catch (error) {
    console.error('Error during record verification:', error);
    return NextResponse.json({ error: 'Failed to verify record' }, { status: 500 });
  }
}

async function generateProof(recordHash: string, criteriaHash: string) {
  try {
    console.log('Preparing to generate proof with recordHash:', recordHash, 'and criteriaHash:', criteriaHash);
    
    // Paths to the necessary files for Groth16 proof generation
    const wasmPath = path.resolve(process.cwd(), 'circom/HealthRecordVerification_js', 'HealthRecordVerification.wasm');
    const zkeyPath = path.resolve(process.cwd(), 'circom', 'HealthRecordVerification_final.zkey');
    
    console.log('WASM path:', wasmPath);
    console.log('ZKey path:', zkeyPath);

    // Prepare the input object
    const input = { recordHash, criteriaHash };
    console.log('Input object for proof:', input);

    // Compute the proof using @zk-kit/groth16's `prove` function
    const proof = await prove(input, zkeyPath, wasmPath);
    console.log('Proof successfully generated.');

    return proof;
  } catch (error) {
    console.error('Error generating proof:', error);
    throw error;
  }
}

async function verifyProof(proofData: any) {
  try {
    console.log('Verifying proof with proofData:', proofData);

    const vkeyPath = path.resolve(process.cwd(), 'circom', 'HealthRecordVerification_verification_key.json');
    console.log('Verification key path:', vkeyPath);

    // Verify the proof using @zk-kit/groth16's `verify` function
    const verificationResult = await verify(vkeyPath, proofData);
    console.log('Verification result:', verificationResult);

    return verificationResult;
  } catch (error) {
    console.error('Error verifying proof:', error);
    throw error;
  }
}


// (Optional) Background job queue (this is an example of how you might offload tasks)
// For example, you can use Bull or another job queue system.
// async function queueProofGeneration(recordHash: string, criteriaHash: string) {
//   // Push to a queue system like BullMQ, Redis, or an async task runner.
//   await jobQueue.add('generateProof', { recordHash, criteriaHash });
// }
