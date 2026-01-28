function renderPasteHtml(content, id) {
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paste • ${id}</title>
  <style>
    body { font-family: monospace; background: #f9fafb; margin:0; padding:2rem; line-height:1.6; }
    .container { max-width: 960px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    pre { background: #f1f5f9; padding: 1.5rem; border-radius: 8px; white-space: pre-wrap; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Paste</h1>
    <pre>${escaped}</pre>
    <p><small>ID: ${id} | <a href="/">Create new</a></small></p>
  </div>
</body>
</html>`;
}

module.exports = { renderPasteHtml };