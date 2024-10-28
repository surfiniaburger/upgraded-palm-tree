import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // **Important: Replace with your actual API key**
    const apiKey = '9GvCqFCOzqmGjuAGOpu5x3RN4ak3mNoyQ57nO71BRuuS0ntu'; 

    const response = await fetch('https://34.49.13.123.nip.io/zk/v1/record', {
      method: 'GET',
      headers: {
        'apikey': apiKey, // Send API key in the header
        'Content-Type': 'application/json', // Set content type if needed
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ message: 'Failed to fetch records' });
  }
}
