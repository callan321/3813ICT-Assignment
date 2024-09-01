const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist/your-angular-app-name')));

app.get('/api', (req, res) => {
  res.json({ status: 'Server is running', port: port });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}/api`);
});
