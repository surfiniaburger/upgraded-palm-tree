"use client"
import React, { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const apiKey = '9GvCqFCOzqmGjuAGOpu5x3RN4ak3mNoyQ57nO71BRuuS0ntu'; // Temporarily hardcode your API key for testing

        const response = await fetch('https://34.49.13.123.nip.io/zk/v1/record', {
          method: 'GET',
          headers: {
            'apikey': apiKey,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`API request failed with status ${response.status}: ${errorData.message}`);
        }

        const responseData = await response.json();
        setData(responseData);
      } catch (err) {
        console.error('Error fetching records:', err);
        setError(err.message);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div>
      <h1>Records</h1>
      {error && <p>Error: {error}</p>}
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
