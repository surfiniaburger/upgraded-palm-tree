import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { promisify } from "util";

const execPromise = promisify(exec);

// API handler for generating proof
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const circuit = body.circuit;
    
    if (!circuit) {
      return NextResponse.json({ error: "Circuit not provided" }, { status: 400 });
    }

    const wasmPath = path.resolve(process.cwd(), "backend/circom", `${circuit}_js/${circuit}.wasm`);
    const inputPath = path.resolve(process.cwd(), "backend/circom", `input_${circuit.toLowerCase()}.json`);
    const witnessPath = path.resolve(process.cwd(), "backend/circom", `witness_${circuit.toLowerCase()}.wtns`);

    // Run the Node.js witness generation command
    const command = `node ${circuit}_js/generate_witness.js ${wasmPath} ${inputPath} ${witnessPath}`;

    await execPromise(command);

    return NextResponse.json({ message: "Proof generated successfully", witness: witnessPath });
  } catch (error) {
    console.error("Error generating proof:", error);
    return NextResponse.json({ error: "Failed to generate proof" }, { status: 500 });
  }
}
