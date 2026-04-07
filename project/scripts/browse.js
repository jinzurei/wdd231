// ── Constants ──────────────────────────────────────────────────
const READING_LIST_KEY = 'librarians-shelf-reading-list';

// ── State ──────────────────────────────────────────────────────
let books        = [];
let activeFilter = 'all';

// ── Init ───────────────────────────────────────────────────────
async function init() {
  try {
    const res = await fetch('data/books.json');
    books = await res.json();
    books.sort((a, b) => new Date(b.date) - new Date(a.date));

    setupFilters();
    setupMobileNav();
    render();
    window.addEventListener('resize', applySlideDirections);
  } catch (err) {
    console.error('Could not load books.json:', err);
  }
}

// ── Render ─────────────────────────────────────────────────────
function render() {
  const grid    = document.getElementById('browseGrid');
  const countEl = document.getElementById('bookCount');
  if (!grid) return;

  const filtered = activeFilter === 'all'
    ? books
    : books.filter(b => b.genre === activeFilter);

  grid.innerHTML = '';

  filtered.forEach(book => {
    const saved = isSaved(book.id);
    const item  = document.createElement('div');
    item.className = 'book-item';

    item.innerHTML = `
      <div class="book-cover genre-${book.genre}" style="--book-color: ${book.color}">
        <span class="book-spine-label" aria-hidden="true">${book.genre}</span>
        <img class="book-img"
             src="images/books/${book.image}"
             alt="${book.title} cover"
             draggable="false"
             style="${book.imagePosition ? `object-position: ${book.imagePosition}` : ''}"
             onerror="this.style.display='none'">
      </div>

      <div class="book-info-card">
        <span class="info-genre genre-${book.genre}">${book.genre}</span>
        <h3 class="info-title">${book.title}</h3>
        <p class="info-author">by ${book.author}</p>
        <p class="info-desc">${book.description}</p>
        <div class="info-actions">
          <button class="save-btn ${saved ? 'saved' : ''}" data-id="${book.id}"
            aria-label="${saved ? 'Remove from reading list' : 'Save to reading list'}">
            <span aria-hidden="true">${saved ? '♥' : '♡'}</span>
          </button>
          <a href="articles/article.html?id=${book.id}" class="info-link">Read &#x2192;</a>
        </div>
      </div>
    `;

    item.querySelector('.save-btn').addEventListener('click', function () {
      const added = toggleSave(book.id);
      this.classList.toggle('saved', added);
      this.querySelector('span').textContent = added ? '♥' : '♡';
      this.setAttribute('aria-label', added ? 'Remove from reading list' : 'Save to reading list');
    });

    item.addEventListener('click', () => {
      if (window.innerWidth > 640) return;
      window.location.href = `articles/article.html?id=${book.id}`;
    });

    grid.appendChild(item);
  });

  applySlideDirections();

  if (countEl) {
    const n     = filtered.length;
    const label = activeFilter === 'all'
      ? `${n} books`
      : `${n} ${activeFilter} book${n !== 1 ? 's' : ''}`;
    countEl.textContent = label;
  }
}

// ── Slide direction ────────────────────────────────────────────
// If the card (220px wide) would overflow the right edge of the viewport,
// flip it to slide left instead.
function applySlideDirections() {
  document.querySelectorAll('#browseGrid .book-item').forEach(item => {
    const spaceRight = window.innerWidth - item.getBoundingClientRect().right;
    item.classList.toggle('slide-left', spaceRight < 240);
  });
}

// ── Filters ────────────────────────────────────────────────────
function setupFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.genre;
      render();
    });
  });
}

// ── Reading list (localStorage) ────────────────────────────────
function getSavedList() {
  return JSON.parse(localStorage.getItem(READING_LIST_KEY) || '[]');
}

function toggleSave(id) {
  const list = getSavedList();
  const idx  = list.indexOf(id);
  if (idx === -1) { list.push(id); } else { list.splice(idx, 1); }
  localStorage.setItem(READING_LIST_KEY, JSON.stringify(list));
  return idx === -1;
}

function isSaved(id) {
  return getSavedList().includes(id);
}

// ── Mobile nav ─────────────────────────────────────────────────
function setupMobileNav() {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// ── Start ──────────────────────────────────────────────────────
init();
