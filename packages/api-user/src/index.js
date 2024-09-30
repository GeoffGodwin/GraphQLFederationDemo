import express from 'express';
const app = express();
const port = 3001;

app.get('/users', (req, res) => {
  res.json([
    { id: '1', name: 'Johnfrey', yearsOfService: 25.3 },
    { id: '2', name: 'Geofftholomew', yearsOfService: 13.7 },
  ]);
});

app.listen(port, () => {
  console.log(`User API running at http://localhost:${port}`);
});