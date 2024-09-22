// app/api/record-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import sanitize from 'sanitize-filename'; // Install this package to sanitize inputs
import fs from 'fs';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recordHash, criteriaHash } = body;

    if (!recordHash || !criteriaHash) {
      return NextResponse.json({ error: 'Record hash and criteria hash are required' }, { status: 400 });
    }

    // Step 1: Sanitize inputs to prevent command injection
    const sanitizedRecordHash = sanitize(recordHash);
    const sanitizedCriteriaHash = sanitize(criteriaHash);

    // Step 2: Generate proof using ZK-SNARK
    const proofData = await generateProof(sanitizedRecordHash, sanitizedCriteriaHash);

    // Step 3: Verify the proof
    const verificationResult = await verifyProof(proofData);

    return NextResponse.json({ 
      message: 'Record Verification Complete', 
      proofData, 
      verified: verificationResult 
    });
  } catch (error) {
    console.error('Error during record verification:', error);
    return NextResponse.json({ error: 'Failed to verify record' }, { status: 500 });
  }
}

async function generateProof(recordHash: string, criteriaHash: string) {
  const circuit = "HealthRecordVerification";
  //const uniqueSuffix = Date.now(); // Generate unique file suffix for each request
  const inputPath = path.resolve(process.cwd(), "groth", `input_${circuit.toLowerCase()}.json`);
  const witnessPath = path.resolve(process.cwd(), "groth", `witness_${circuit.toLowerCase()}.wtns`);
  const proofPath = path.resolve(process.cwd(), "groth", `proof_${circuit}.json`);
  const zkeyPath = path.resolve(process.cwd(), "groth", `${circuit}_final.zkey`);

  // Create input JSON file
  const inputData = JSON.stringify({ recordHash, criteriaHash });
  fs.writeFileSync(inputPath, inputData);

  // Generate witness
  const isWindows = process.platform === "win32";
  const witnessCommand = isWindows 
    ? `groth\\HealthRecordVerification_cpp\\HealthRecordVerification.exe ${inputPath} ${witnessPath}`
    : `./groth/HealthRecordVerification_cpp/HealthRecordVerification ${inputPath} ${witnessPath}`;
  await execPromise(witnessCommand);

  // Generate proof
  const proofCommand = `snarkjs groth prove ${zkeyPath} ${witnessPath} ${proofPath}`;
  await execPromise(proofCommand);

  const proofData = fs.readFileSync(proofPath, 'utf-8');
  return JSON.parse(proofData);
}

async function verifyProof(proofData: any) {
  const vkeyPath = path.resolve(process.cwd(), "circom", "HealthRecordVerification.vkey");
  const uniqueSuffix = Date.now(); // Unique suffix for the proof file as well
  const proofPath = path.resolve(process.cwd(), "circom", `proof_HealthRecordVerification.json`);

  // Create proof JSON file
  fs.writeFileSync(proofPath, JSON.stringify(proofData));

  // Verify proof
  const verifyCommand = `snarkjs groth verify ${vkeyPath} ${proofPath}`;
  const { stdout } = await execPromise(verifyCommand);

  return stdout.includes('OK');
}

// (Optional) Background job queue (this is an example of how you might offload tasks)
// For example, you can use Bull or another job queue system.
// async function queueProofGeneration(recordHash: string, criteriaHash: string) {
//   // Push to a queue system like BullMQ, Redis, or an async task runner.
//   await jobQueue.add('generateProof', { recordHash, criteriaHash });
// }
