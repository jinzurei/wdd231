// ── Constants ──────────────────────────────────────────────────
const READING_LIST_KEY = 'librarians-shelf-reading-list';
const RADIUS = window.innerWidth < 640 ? 240 : 370;

// ── State ──────────────────────────────────────────────────────
let books    = [];
let featured = [];
let currentIndex  = 0;
let ringAngle     = 0;
let isDragging    = false;
let dragStartX    = 0;
let dragStartAngle = 0;
let autoTimer     = null;

// ── DOM refs ───────────────────────────────────────────────────
const ring   = document.getElementById('carouselRing');
const infoEl = document.getElementById('carouselInfo');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// ── Init ───────────────────────────────────────────────────────
async function init() {
  try {
    const res = await fetch('data/books.json');
    books    = await res.json();
    featured = books.filter(b => b.featured);

    buildCarousel();
    buildRecentReviews();
    setupDrag();
    setupNav();
    setupMobileNav();
    setupNewsletter();
    updateInfo();
    startAutoRotate();
  } catch (err) {
    console.error('Could not load books.json:', err);
    if (infoEl) {
      infoEl.innerHTML = '<p class="fetch-error">Unable to reach book data at this time. Please try again later.</p>';
    }
    const reviewsGrid = document.getElementById('reviewsGrid');
    if (reviewsGrid) {
      reviewsGrid.innerHTML = '<p class="fetch-error">Unable to reach book data at this time. Please try again later.</p>';
    }
  }
}

// ── Build carousel ─────────────────────────────────────────────
function buildCarousel() {
  const step = 360 / featured.length;

  featured.forEach((book, i) => {
    const el = document.createElement('article');
    el.className = `book genre-${book.genre}`;
    el.dataset.index = i;
    el.style.cssText = `--book-color: ${book.color}; transform: rotateY(${i * step}deg) translateZ(${RADIUS}px);`;

    el.innerHTML = `
      <div class="book-cover">
        <div class="book-spine"><span class="spine-label" aria-hidden="true">${book.genre}</span></div>
        <div class="book-face">
          <div class="book-placeholder" aria-hidden="true"></div>
          <img class="book-img"
               src="images/books/${book.image}"
               alt="${book.title} cover"
               draggable="false"
               style="${book.imagePosition ? `object-position: ${book.imagePosition}` : ''}"
               onerror="this.style.display='none'">
        </div>
      </div>
    `;

    el.addEventListener('click', () => {
      if (isDragging) return;
      if (i === currentIndex) {
        window.location.href = `articles/article.html?id=${book.id}`;
      } else {
        navigateTo(i);
      }
    });

    ring.appendChild(el);
  });
}


// ── Auto-rotate ────────────────────────────────────────────────
const AUTO_INTERVAL = 3500; // ms between advances

function autoAdvance() {
  // Advance one step counter-clockwise without resetting the timer
  const step = 360 / featured.length;
  ringAngle  += step;
  currentIndex = (currentIndex - 1 + featured.length) % featured.length;
  applyRotation();
  updateInfo();
}

function startAutoRotate() {
  stopAutoRotate();
  autoTimer = setInterval(autoAdvance, AUTO_INTERVAL);
}

function stopAutoRotate() {
  clearInterval(autoTimer);
  autoTimer = null;
}

function resetAutoRotate() {
  stopAutoRotate();
  startAutoRotate();
}

// ── Navigation ─────────────────────────────────────────────────
function navigate(direction) {
  const step = 360 / featured.length;
  ringAngle -= direction * step;
  currentIndex = ((currentIndex + direction) % featured.length + featured.length) % featured.length;
  applyRotation();
  updateInfo();
  resetAutoRotate();
}

function navigateTo(index) {
  if (index === currentIndex) return;
  const count = featured.length;
  const step  = 360 / count;
  const diff  = index - currentIndex;
  // always take the shortest arc
  const shortDiff = Math.abs(diff) > count / 2
    ? (diff > 0 ? diff - count : diff + count)
    : diff;
  ringAngle    -= shortDiff * step;
  currentIndex  = ((index % count) + count) % count;
  applyRotation();
  updateInfo();
  resetAutoRotate();
}

function applyRotation(instant = false) {
  ring.classList.toggle('no-transition', instant);
  ring.style.transform = `rotateY(${ringAngle}deg)`;
}

function setupNav() {
  prevBtn?.addEventListener('click', () => navigate(-1));
  nextBtn?.addEventListener('click', () => navigate(+1));

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(+1);
  });
}

// ── Drag ───────────────────────────────────────────────────────
function setupDrag() {
  ring.addEventListener('pointerdown', e => {
    dragStartX     = e.clientX;
    dragStartAngle = ringAngle;
    isDragging     = false;
    ring.setPointerCapture(e.pointerId);
    ring.classList.add('dragging');
    stopAutoRotate();
  });

  ring.addEventListener('pointermove', e => {
    if (!ring.hasPointerCapture(e.pointerId)) return;
    const delta = e.clientX - dragStartX;
    if (Math.abs(delta) > 5) isDragging = true;
    ringAngle = dragStartAngle + delta * 0.35;
    ring.style.transform = `rotateY(${ringAngle}deg)`;
  });

  ring.addEventListener('pointerup', e => {
    if (!ring.hasPointerCapture(e.pointerId)) return;
    ring.releasePointerCapture(e.pointerId);
    ring.classList.remove('dragging');

    // Snap ringAngle to the nearest multiple of step
    const step    = 360 / featured.length;
    const snapped = Math.round(ringAngle / step) * step;
    ringAngle     = snapped;
    currentIndex  = ((Math.round(-snapped / step) % featured.length) + featured.length) % featured.length;

    applyRotation();
    updateInfo();
    resetAutoRotate();

    // Delay so click handlers see isDragging = true and bail
    setTimeout(() => { isDragging = false; }, 50);
  });
}

// ── Info panel ─────────────────────────────────────────────────
function updateInfo() {
  const book = featured[currentIndex];
  if (!book || !infoEl) return;

  infoEl.innerHTML = `
    <h2 class="info-title">${book.title}</h2>
    <p class="info-author">by ${book.author}</p>
    <p class="info-desc">${book.description}</p>
  `;

  document.querySelectorAll('.book').forEach((el, i) => {
    el.classList.toggle('active', i === currentIndex);
  });

}

// ── Recent reviews ─────────────────────────────────────────────
function buildRecentReviews() {
  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;

  const recent = [...books]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  recent.forEach(book => {
    const saved = isSaved(book.id);
    const card  = document.createElement('article');
    card.className = 'review-card';

    card.innerHTML = `
      <div class="card-cover-area">
        <div class="card-book-visual" style="--book-color: ${book.color}">
          <div class="card-book-spine genre-${book.genre}"><span class="spine-label" aria-hidden="true">${book.genre}</span></div>
          <div class="card-book-face">
            <img class="card-book-img"
                 src="images/books/${book.image}"
                 alt="${book.title} cover"
                 draggable="false"
                 style="${book.imagePosition ? `object-position: ${book.imagePosition}` : ''}"
                 onerror="this.style.display='none'">
          </div>
        </div>
      </div>
      <div class="card-body">
        <div class="card-top-row">
          <span class="card-genre-badge genre-${book.genre}">${book.genre}</span>
          <button class="save-btn ${saved ? 'saved' : ''}" data-id="${book.id}"
            aria-label="${saved ? 'Remove from reading list' : 'Save to reading list'}">
            <span aria-hidden="true">${saved ? '♥' : '♡'}</span>
          </button>
        </div>
        <h3 class="card-title">${book.title}</h3>
        <p class="card-author">by ${book.author}</p>
        <p class="card-desc">${book.description}</p>
        <a href="articles/article.html?id=${book.id}" class="card-link">Read the Review &#x2192;</a>
      </div>
    `;

    card.querySelector('.save-btn').addEventListener('click', function () {
      const added = toggleSave(book.id);
      this.classList.toggle('saved', added);
      this.querySelector('span').textContent = added ? '♥' : '♡';
      this.setAttribute('aria-label', added ? 'Remove from reading list' : 'Save to reading list');
    });

    grid.appendChild(card);
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
  return idx === -1; // true = added
}

function isSaved(id) {
  return getSavedList().includes(id);
}

// ── Newsletter ─────────────────────────────────────────────────
function setupNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value.trim();
    if (email) {
      window.location.href = `newsletter-thanks.html?email=${encodeURIComponent(email)}`;
    }
  });
}

// ── Mobile nav toggle ──────────────────────────────────────────
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
