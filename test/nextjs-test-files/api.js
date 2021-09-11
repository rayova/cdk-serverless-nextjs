export default function handler(req, res) {
  res.status(200).json({ randomness: Math.random(), date: new Date().toISOString() });
}
