import { getAccessToken } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res);
    const { endpoint } = req.query;
    let url = `https://zero-kare5-837262597425.us-central1.run.app/record`;

    switch (endpoint) {
      case 'create':
        if (req.method === 'POST') {
          url += '';
          const response = await fetch(url, {
            method: 'POST',
            headers: { Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify(req.body),
          });
          const data = await response.json();
          res.status(201).json(data);
        } else {
          res.status(405).send('Method Not Allowed');
        }
        break;

      case 'search':
        if (req.method === 'GET') {
          const patientId = req.query.id;
          url += `/search/${patientId}`;
          const response = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const data = await response.json();
          res.status(200).json(data);
        } else {
          res.status(405).send('Method Not Allowed');
        }
        break;

      default:
        res.status(404).send('Endpoint not found');
    }
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});
