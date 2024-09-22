// api/risk-assessment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { encryptedRiskScore, realRiskScore, minRisk, maxRisk } = body;

    if (encryptedRiskScore === undefined || realRiskScore === undefined || minRisk === undefined || maxRisk === undefined) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Step 1: Generate proof using ZK-SNARK
    const proofData = await generateProof(encryptedRiskScore, realRiskScore, minRisk, maxRisk);

    // Step 2: Verify the proof
    const verificationResult = await verifyProof(proofData);

    return NextResponse.json({ 
      message: 'Risk Assessment Complete', 
      proofData, 
      verified: verificationResult 
    });
  } catch (error) {
    console.error('Error during risk assessment:', error);
    return NextResponse.json({ error: 'Failed to assess risk' }, { status: 500 });
  }
}

async function generateProof(encryptedRiskScore: string, realRiskScore: string, minRisk: number, maxRisk: number) {
  const circuit = "HealthRiskAssessment";
  const inputPath = path.resolve(process.cwd(), "circom", `input_${circuit.toLowerCase()}.json`);
  const witnessPath = path.resolve(process.cwd(), "circom", `witness_${circuit.toLowerCase()}.wtns`);
  const proofPath = path.resolve(process.cwd(), "circom", `proof_${circuit}.json`);
  const zkeyPath = path.resolve(process.cwd(), "circom", `${circuit}.zkey`);

  // Create input JSON file
  const inputData = JSON.stringify({ encryptedRiskScore, realRiskScore, minRisk, maxRisk });
  require('fs').writeFileSync(inputPath, inputData);

  // Generate witness
  const witnessCommand = `node circom/HealthRiskAssessment_js/generate_witness.js ${zkeyPath} ${inputPath} ${witnessPath}`;
  await execPromise(witnessCommand);

  // Generate proof
  const proofCommand = `snarkjs plonk prove ${zkeyPath} ${witnessPath} ${proofPath}`;
  await execPromise(proofCommand);

  const proofData = require('fs').readFileSync(proofPath, 'utf-8');
  return JSON.parse(proofData);
}

async function verifyProof(proofData: any) {
  const vkeyPath = path.resolve(process.cwd(), "circom", "HealthRiskAssessment.vkey");
  const proofPath = path.resolve(process.cwd(), "circom", `proof_HealthRiskAssessment.json`);

  // Create proof JSON file
  require('fs').writeFileSync(proofPath, JSON.stringify(proofData));

  // Verify proof
  const verifyCommand = `snarkjs plonk verify ${vkeyPath} ${proofPath}`;
  const { stdout } = await execPromise(verifyCommand);

  return stdout.includes('OK');
}
