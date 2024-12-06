export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, firstName, lastName, phone, password } = req.body;

    // Logic for saving the user to your database (use your NestJS backend)
    // You should call your NestJS backend here and create a user

    res.status(200).json({ message: 'User registered successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
