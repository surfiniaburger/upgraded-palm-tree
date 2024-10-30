"use client"
import { useState, useEffect } from 'react';

export default function Page() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/record'); // Call your API route
        if (!response.ok) {
          throw new Error('Failed to fetch records');
        }
        const data = await response.json();
        console.log(data)
        setRecords(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, []);

  // ... rest of your component logic to display records
}
