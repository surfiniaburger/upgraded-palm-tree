'use client'
import React, { useState } from 'react';
import { LuLoader } from 'react-icons/lu'; // Assuming you are using a spinner component from the LuLoader library

const HealthRecordVerification = () => {
  const [recordHash, setRecordHash] = useState('');
  const [criteriaHash, setCriteriaHash] = useState('');
  const [proofData, setProofData] = useState(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/record-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordHash, criteriaHash }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify health record');
      }

      const result = await response.json();
      setProofData(result.proofData);
      setVerified(result.verified);
    } catch (error) {
      setError("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
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
          {loading ? <LuLoader size={20} /> : 'Verify Record'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {proofData && (
        <div className="glass-result">
          <h3>Proof Data:</h3>
          <pre>{JSON.stringify(proofData, null, 2)}</pre>
          <h3>Verification Status: {verified ? 'Valid' : 'Invalid'}</h3>
        </div>
      )}
    </div>
  );
};

export default HealthRecordVerification;
