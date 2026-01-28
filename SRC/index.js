require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.use('/', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Base: http://localhost:${PORT}`);
});