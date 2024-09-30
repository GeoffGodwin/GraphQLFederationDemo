import express from 'express';
const app = express();
const port = 3001;

app.get('/users', (req, res) => {
  res.json([
    { id: '1', name: 'Johnfrey' },
    { id: '2', name: 'Geofftholomew' },
  ]);
});

app.listen(port, () => {
  console.log(`User API running at http://localhost:${port}`);
});