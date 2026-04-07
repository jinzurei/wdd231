// ══════════════════════════════════════════════════════════════
//  Book Widget — floating red book showing saved articles
//  Works on all pages; detects /articles/ subdirectory for paths
// ══════════════════════════════════════════════════════════════

const SAVED_KEY    = 'librarians-shelf-reading-list';
const inArticleDir = location.pathname.includes('/articles/');
const ROOT         = inArticleDir ? '../' : '';

let booksCache = null;

// ── Data helpers ───────────────────────────────────────────────
async function loadBooks() {
  if (booksCache) return booksCache;
  try {
    const res  = await fetch(`${ROOT}data/books.json`);
    booksCache = await res.json();
  } catch {
    booksCache = [];
  }
  return booksCache;
}

function getSaved() {
  return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
}

function articleHref(bookId) {
  return inArticleDir
    ? `article.html?id=${bookId}`
    : `articles/article.html?id=${bookId}`;
}

// ── Widget DOM ─────────────────────────────────────────────────
function createWidget() {
  const el = document.createElement('div');
  el.id        = 'bookWidget';
  el.className = 'book-widget';
  el.innerHTML = `
    <div class="book-widget-panel" id="wbPanel" role="dialog"
         aria-label="Your saved articles" aria-hidden="true">
      <div class="wbp-header">
        <h3 class="wbp-title">Saved Articles</h3>
        <button class="wbp-close" id="wbClose" aria-label="Close saved articles">&#x2715;</button>
      </div>
      <div class="wbp-body" id="wbBody"></div>
    </div>

    <button class="book-widget-btn" id="wbBtn"
            aria-label="Open saved reading list" aria-expanded="false">

      <!-- Closed 3D book view -->
      <div class="wb-closed" aria-hidden="true">
        <div class="wb-book">
          <div class="wb-spine"></div>
          <div class="wb-cover"></div>
          <div class="wb-page-edge"></div>
        </div>
      </div>

      <!-- Open book with page-flip animation -->
      <div class="wb-open" aria-hidden="true">
        <div class="wb-open-inner">
          <div class="wb-paper"></div><!-- right cover -->
          <div class="wb-paper"></div><!-- left cover -->
          <div class="wb-paper"></div><!-- flipping pages -->
          <div class="wb-paper"></div>
          <div class="wb-paper"></div>
          <div class="wb-paper"></div>
          <div class="wb-paper"></div>
          <div class="wb-paper"></div>
        </div>
      </div>

      <span class="wb-badge" id="wbBadge" aria-hidden="true" data-empty="true">0</span>
    </button>
  `;
  document.body.appendChild(el);
}

// ── Badge ──────────────────────────────────────────────────────
function refreshBadge() {
  const badge = document.getElementById('wbBadge');
  if (!badge) return;
  const n = getSaved().length;
  badge.textContent       = n;
  badge.dataset.empty     = String(n === 0);
  badge.setAttribute('aria-label', `${n} saved article${n === 1 ? '' : 's'}`);
}

// ── Panel content ──────────────────────────────────────────────
async function renderPanel() {
  const body  = document.getElementById('wbBody');
  if (!body) return;

  const saved = getSaved();

  if (saved.length === 0) {
    body.innerHTML = `
      <div class="wbp-empty">
        <span class="wbp-empty-icon">&#x2661;</span>
        No saved articles yet.<br>
        Click &#x2661; on any review to save it here.
      </div>`;
    return;
  }

  body.innerHTML = '<div class="wbp-empty" style="padding:12px 14px;font-size:11px">Loading&hellip;</div>';

  const books   = await loadBooks();
  const bookMap = Object.fromEntries(books.map(b => [b.id, b]));

  body.innerHTML = saved
    .map(id => {
      const b = bookMap[id];
      if (!b) return '';
      return `
        <a class="wbp-article" href="${articleHref(id)}">
          <span class="wbp-article-dot" aria-hidden="true"></span>
          <span class="wbp-article-text">
            <p class="wbp-article-title">${b.title}</p>
            <p class="wbp-article-author">${b.author}</p>
          </span>
        </a>`;
    })
    .join('');
}

// ── Open / close ───────────────────────────────────────────────
function openPanel() {
  const panel = document.getElementById('wbPanel');
  const btn   = document.getElementById('wbBtn');
  if (!panel) return;
  renderPanel();
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  btn?.setAttribute('aria-expanded', 'true');
}

function closePanel() {
  const panel = document.getElementById('wbPanel');
  const btn   = document.getElementById('wbBtn');
  if (!panel) return;
  panel.classList.remove('open');
  panel.setAttribute('aria-hidden', 'true');
  btn?.setAttribute('aria-expanded', 'false');
}

function isOpen() {
  return document.getElementById('wbPanel')?.classList.contains('open') ?? false;
}

// ── Init ───────────────────────────────────────────────────────
function init() {
  // Inject stylesheet
  const link = document.createElement('link');
  link.rel   = 'stylesheet';
  link.href  = `${ROOT}styles/book-widget.css`;
  document.head.appendChild(link);

  createWidget();
  refreshBadge();

  // Toggle on book click
  document.getElementById('wbBtn')
    ?.addEventListener('click', () => (isOpen() ? closePanel() : openPanel()));

  // Close button
  document.getElementById('wbClose')
    ?.addEventListener('click', closePanel);

  // Click-outside to close
  document.addEventListener('click', e => {
    if (!document.getElementById('bookWidget')?.contains(e.target)) {
      closePanel();
    }
  });

  // Re-sync badge after any save-button click on the same page
  document.addEventListener('click', e => {
    if (e.target.closest('#saveBtn, .article-save-btn')) {
      // localStorage updated synchronously by article.js — read after microtask
      queueMicrotask(() => {
        refreshBadge();
        if (isOpen()) renderPanel();
      });
    }
  });

  // Sync across tabs
  window.addEventListener('storage', e => {
    if (e.key === SAVED_KEY) {
      refreshBadge();
      if (isOpen()) renderPanel();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
