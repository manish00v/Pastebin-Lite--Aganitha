const { validateCreatePaste, isValidId } = require('./validation');
const { createPaste, getPasteForApi, getPasteForHtml, healthCheck } = require('./services');

async function health(req, res) {
  const result = await healthCheck();
  if (result.ok) {
    res.status(200).json({ ok: true });
  } else {
    res.status(503).json(result);
  }
}

// async function create(req, res) {
//   const validation = validateCreatePaste(req.body);
//   if (!validation.valid) {
//     return res.status(400).json({ error: validation.error });
//   }

//   try {
//     const { id, url } = await createPaste(validation.data);
//     const fullUrl = `${req.protocol}://${req.get('host')}${url}`;
//     res.status(201).json({ id, url: fullUrl });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create paste' });
//   }
// }
async function create(req, res) {
  const validation = validateCreatePaste(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const { id, url: relativeUrl } = await createPaste(validation.data);

    // Better URL construction (works locally + on Vercel)
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const fullUrl = `${protocol}://${host}${relativeUrl}`;

    res.status(201).json({ id, url: fullUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create paste' });
  }
}

async function getApi(req, res) {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ error: 'Invalid ID' });

  const result = await getPasteForApi(id, req.headers);
  res.status(result.status).json(result.data || { error: result.error });
}

async function getHtml(req, res) {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).send('Invalid ID');

  const result = await getPasteForHtml(id);
  res.status(result.status).send(result.html);
}

module.exports = { health, create, getApi, getHtml };