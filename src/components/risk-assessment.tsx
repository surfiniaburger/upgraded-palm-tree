'use client'
import React, { useState } from 'react';
import { LuLoader } from 'react-icons/lu'; // Assuming you are using a spinner component

const HealthRiskAssessment = () => {
  const [encryptedRiskScore, setEncryptedRiskScore] = useState('');
  const [realRiskScore, setRealRiskScore] = useState('');
  const [minRisk, setMinRisk] = useState('');
  const [maxRisk, setMaxRisk] = useState('');
  const [proofData, setProofData] = useState(null);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/risk-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          encryptedRiskScore,
          realRiskScore,
          minRisk: parseInt(minRisk),
          maxRisk: parseInt(maxRisk),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assess health risk');
      }

      const result = await response.json();
      setProofData(result.proofData);
      setVerified(result.verified);
    } catch (error) {
      setError('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <form onSubmit={handleSubmit} className="glass-form">
        <input
          type="text"
          placeholder="Encrypted Risk Score"
          value={encryptedRiskScore}
          onChange={(e) => setEncryptedRiskScore(e.target.value)}
          className="glass-input"
        />
        <input
          type="text"
          placeholder="Real Risk Score"
          value={realRiskScore}
          onChange={(e) => setRealRiskScore(e.target.value)}
          className="glass-input"
        />
        <input
          type="number"
          placeholder="Min Risk"
          value={minRisk}
          onChange={(e) => setMinRisk(e.target.value)}
          className="glass-input"
        />
        <input
          type="number"
          placeholder="Max Risk"
          value={maxRisk}
          onChange={(e) => setMaxRisk(e.target.value)}
          className="glass-input"
        />
        <button type="submit" disabled={loading} className="glass-button">
          {loading ? <LuLoader size={20} /> : 'Assess Risk'}
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

export default HealthRiskAssessment;
