import express from 'express';
import cors from 'cors';

const app = express();
const port = 3003;

app.use(cors());

const authorizationsData = {
  '1': [{ id: 'a1', permission: 'READ' }, { id: 'a2', permission: 'WRITE' }],
  '2': [{ id: 'a3', permission: 'READ' }],
};

app.get('/authorizations/:userId', (req, res) => {
  const authorizations = authorizationsData[req.params.userId] || [];
  res.json(authorizations);
});

app.listen(port, () => {
  console.log(`Authorization API running at http://localhost:${port}`);
});