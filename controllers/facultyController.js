export async function signup(req, res) {
  res.status(201).json({ message: 'Signup successful' });
}

export async function login(req, res) {
  res.status(201).json({ message: 'Signup successful', data: req.body });
}
