"use client";
import React, { useState } from "react";
import { LuLoader } from "react-icons/lu";
import { PackedGroth16Proof } from "@zk-kit/utils";

// Define the type for HealthRecordProof
interface HealthRecordProof {
  proof: PackedGroth16Proof;
}

const HealthRecordVerification = () => {
  const [recordHash, setRecordHash] = useState("");
  const [criteriaHash, setCriteriaHash] = useState("");
  const [proofData, setProofData] = useState<HealthRecordProof | null>(null);
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Generate the proof using the generate function
      // const proof: HealthRecordProof = await generate(recordHash, criteriaHash);

      // Set the proof data in the state
      // setProofData(proof);

      // Verify the proof using the verify function and await the result
      // const isVerified: boolean = await verify(recordHash, criteriaHash, proof.proof);

      // Update the verification status
      // setVerified(isVerified);
    } catch (error) {
      setError("Failed to generate or verify the proof.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[50rem] w-full dark:bg-black bg-gray-900 dark:bg-dot-white/[0.1] bg-dot-white/[0.1] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-gray-800 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="glass-card relative z-20">
        <form onSubmit={handleSubmit} className="glass-form">
          <input
            type="text"
            placeholder="Record Hash"
            value={recordHash}
            onChange={(e) => setRecordHash(e.target.value)}
            className="glass-input"
          />
          <input
            type="text"
            placeholder="Criteria Hash"
            value={criteriaHash}
            onChange={(e) => setCriteriaHash(e.target.value)}
            className="glass-input"
          />
          <button type="submit" disabled={loading} className="glass-button">
            {loading ? <LuLoader size={20} /> : "Verify Record"}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
        {proofData && (
          <div className="glass-result">
            <h3>Proof Data:</h3>
            <pre>{JSON.stringify(proofData, null, 2)}</pre>
            <h3>Verification Status: {verified ? "Valid" : "Invalid"}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthRecordVerification;
