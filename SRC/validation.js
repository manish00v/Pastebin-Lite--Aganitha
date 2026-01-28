function validateCreatePaste(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
    return { valid: false, error: 'content is required and must be non-empty string' };
  }

  const ttl = body.ttl_seconds !== undefined ? Number(body.ttl_seconds) : null;
  if (ttl !== null && (!Number.isInteger(ttl) || ttl < 1)) {
    return { valid: false, error: 'ttl_seconds must be integer >= 1' };
  }

  const maxV = body.max_views !== undefined ? Number(body.max_views) : null;
  if (maxV !== null && (!Number.isInteger(maxV) || maxV < 1)) {
    return { valid: false, error: 'max_views must be integer >= 1' };
  }

  return { valid: true, data: { content: body.content, ttlSeconds: ttl, maxViews: maxV } };
}

function isValidId(id) {
  return (
    typeof id === 'string' &&
    id.length >= 6 &&
    id.length <= 32 &&
    /^[a-zA-Z0-9]+$/.test(id)   // ← Updated: allows uppercase A-Z + lowercase + digits
  );
}

module.exports = { validateCreatePaste, isValidId };