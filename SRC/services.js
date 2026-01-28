const { PrismaClient } = require('@prisma/client');
const { nanoid } = require('nanoid');
const { renderPasteHtml } = require('./pasteRenderer');

const prisma = new PrismaClient();

const isTestMode = process.env.TEST_MODE === '1';

async function createPaste({ content, ttlSeconds, maxViews }) {
  const id = nanoid(10);
  const expiresAt = ttlSeconds ? new Date(Date.now() + ttlSeconds * 1000) : null;

  const paste = await prisma.paste.create({
    data: {
      id,
      content,
      expiresAt,
      maxViews,
      viewCount: 0,
    },
  });

  return { id: paste.id, url: `/p/${paste.id}` };
}

async function getPasteForApi(id, headers = {}) {
  let now = new Date();
  if (isTestMode) {
    const testMs = headers['x-test-now-ms'];
    if (testMs && !isNaN(Number(testMs))) {
      now = new Date(Number(testMs));
    }
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const paste = await tx.paste.findUnique({ where: { id } });
      if (!paste) return { status: 404, error: 'Not found' };

      if (paste.expiresAt && now >= paste.expiresAt) return { status: 404, error: 'Expired' };

      if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
        return { status: 404, error: 'View limit exceeded' };
      }

      const updated = await tx.paste.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
        select: { content: true, maxViews: true, viewCount: true, expiresAt: true },
      });

      const remaining = updated.maxViews !== null ? updated.maxViews - updated.viewCount : null;

      return {
        status: 200,
        data: {
          content: updated.content,
          remaining_views: remaining,
          expires_at: updated.expiresAt ? updated.expiresAt.toISOString() : null,
        },
      };
    });
  } catch (err) {
    console.error(err);
    return { status: 500, error: 'Server error' };
  }
}

async function getPasteForHtml(id) {
  const now = new Date();

  try {
    return await prisma.$transaction(async (tx) => {
      const paste = await tx.paste.findUnique({ where: { id } });
      if (!paste) return { status: 404, html: 'Not found' };

      if (paste.expiresAt && now >= paste.expiresAt) return { status: 404, html: 'Expired' };

      if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
        return { status: 404, html: 'View limit exceeded' };
      }

      await tx.paste.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });

      const html = renderPasteHtml(paste.content, id);
      return { status: 200, html };
    });
  } catch (err) {
    console.error(err);
    return { status: 500, html: 'Server error' };
  }
}

async function healthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  } catch (err) {
    console.error('DB health failed:', err);
    return { ok: false, error: 'Database unavailable' };
  }
}

module.exports = { createPaste, getPasteForApi, getPasteForHtml, healthCheck };