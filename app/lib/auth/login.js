export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Logic for verifying the user credentials using your NestJS backend
    // Call NestJS backend to authenticate and get JWT token

    // Example response with token:
    const token = 'your-jwt-token'; // Replace with actual token from backend
    res.status(200).json({ token });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
