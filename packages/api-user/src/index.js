import express from 'express';
const app = express();
const port = 3001;

const users = [
  { id: '1', name: 'Alan' },
  { id: '2', name: 'Brandon' },
  { id: '3', name: 'Charles' },
];

app.get('/users', (req, res) => {
  res.json(users);
});

app.get('/users/:id', (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});


app.listen(port, () => {
  console.log(`User API running at http://localhost:${port}`);
});