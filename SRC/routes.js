const express = require('express');
const { health, create, getApi, getHtml } = require('./controllers');

const router = express.Router();

router.get('/api/healthz', health);
router.post('/api/pastes', create);
router.get('/api/pastes/:id', getApi);
router.get('/p/:id', getHtml);

// Optional landing page
router.get('/', (req, res) => {
  res.send(`
    <h1>Pastebin Lite</h1>
    <p>POST JSON to <code>/api/pastes</code></p>
    <pre>{
  "content": "Hello world",
  "ttl_seconds": 3600,
  "max_views": 10
}</pre>
    <p>View: <code>/p/&lt;id&gt;</code></p>
  `);
});

module.exports = router;