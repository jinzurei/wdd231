// ── Init ──────────────────────────────────────────────────────
async function init() {
  try {
    const res   = await fetch('data/books.json');
    const books = await res.json();
    buildList(books);
    setupMobileNav();
  } catch (err) {
    console.error('Could not load books.json:', err);
  }
}

// ── Build card list ────────────────────────────────────────────
function buildList(books) {
  const list = document.getElementById('rlList');
  if (!list) return;

  books.forEach(book => {
    const card = document.createElement('article');
    card.className = `rl-card genre-${book.genre}`;
    card.setAttribute('role', 'listitem');
    card.style.setProperty('--book-color', book.color);

    card.innerHTML = `
      <div class="rl-book">
        <div class="rl-spine"></div>
        <div class="rl-face">
          <img class="rl-cover-img"
               src="images/books/${book.image}"
               alt="${book.title} cover"
               draggable="false"
               style="${book.imagePosition ? `object-position: ${book.imagePosition}` : ''}"
               onerror="this.style.display='none'">
        </div>
      </div>

      <div class="rl-info">
        <p class="rl-title">${book.title}</p>
        <p class="rl-author">by ${book.author}</p>
        <div class="rl-expand">
          <span class="rl-genre genre-${book.genre}">${book.genre}</span>
          <p class="rl-desc">${book.description}</p>
        </div>
      </div>

      <div class="rl-side">
        <div class="rl-expand">
          <a href="${book.amazonUrl}"
             class="rl-amazon"
             target="_blank"
             rel="noopener noreferrer">
            Buy on Amazon &#x2197;
          </a>
        </div>
      </div>
    `;

    list.appendChild(card);
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
