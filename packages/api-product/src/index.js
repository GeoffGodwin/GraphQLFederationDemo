import express from 'express';
const app = express();
const port = 3002;

app.get('/products', (req, res) => {
  res.json([
    { id: '1', name: 'Laptop', price: 999 },
    { id: '2', name: 'Phone', price: 699 },
  ]);
});

app.listen(port, () => {
  console.log(`Product API running at http://localhost:${port}`);
});