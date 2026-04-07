// ── Constants ──────────────────────────────────────────────────
const READING_LIST_KEY = 'librarians-shelf-reading-list';

// ── Text by genre ──────────────────────────
const PLACEHOLDER = {
  spiritual: {
    paragraphs: [
      `There are books that arrive in your life at precisely the right moment — and then there are books you return to, year after year, each time finding something you missed before. This is one of the latter. I first encountered it during a particularly restless winter, and I remember setting it down after the first chapter with the quiet conviction that I was holding something rare. Not rare in the sense of obscure, but rare in the sense of true.`,
      `The author writes not as a scholar performing erudition but as a practitioner reporting from the field. The prose has that particular quality found only in writers who have actually lived what they are describing — unadorned, precise, and yet somehow charged with a weight that takes time to settle. You do not read it quickly. The book resists speed. I tried twice to read it in the commuter's fragments of twenty minutes at a time, and each time I found I had to start the chapter over from the beginning.`,
      `What distinguishes it from other works in the same tradition is its refusal to offer false comfort. The reader is not told that the journey is easy, only that it is possible, and that others have made it before. There is a kind of companionship in that honesty — a sense that the author trusts you with the difficulty, which is itself a form of respect. I have come to believe that books which tell you hard things are, in the end, far more comforting than books which tell you easy ones.`,
      `I have recommended this book more often than any other in the past several years. Not to everyone — it is the kind of book that needs to find its reader, and pressing it on the wrong person at the wrong moment can do a disservice to both. But when I hand it to someone who is ready, the response is almost always the same. They go quiet for a few days, and then they come back with questions. That is the surest sign I know that a book has done its work.`
    ],
    pullQuote: `"Not every book is for every moment. But this one seems to know when you need it."`
  },

  historical: {
    paragraphs: [
      `History, at its best, does not simply tell you what happened — it changes how you see what is happening now. This book belongs to that rare category. I came to it expecting a narrative and found, instead, a lens. The events described are decades or centuries removed from our present, and yet by the final chapter I found myself thinking about my own city, my own decade, with a clarity I had not had before. That is the trick of the very best narrative history, and this author pulls it off without once announcing that they are doing so.`,
      `What the author has — and it is a gift shared by only the finest historians — is the ability to make the reader feel the contingency of events. The sense that things could have gone otherwise. That the people involved did not know how the story would end. Too much history is written backwards, with the outcome already known, which drains the drama from every decision. Here, that drama is fully restored. You find yourself holding your breath over events whose conclusions you already looked up in a footnote two pages earlier.`,
      `The book also does something quietly remarkable: it challenges the easy distinctions we draw between then and now, between them and us. The political pressures, the institutional failures, the moments when individuals with genuinely good intentions made catastrophic decisions — none of it feels safely antique. That is either the mark of very good history or a very troubling present. Possibly both. I suspect the author intended both, and respected the reader enough not to say so explicitly.`,
      `I finished it on a Sunday evening and sat with it for a long time before reaching for anything else. There is a particular quality of silence that follows a book like this — not emptiness, but density. As if the mind needs time to rearrange the furniture of what it thought it knew. I have not looked at the period it covers the same way since, which is, I think, the only standard by which a work of history should be judged.`
    ],
    pullQuote: `"The past is never settled. The best history books remind you of that on every page."`
  },

  science: {
    paragraphs: [
      `I have always been suspicious of books that promise to make science accessible. Too often they achieve accessibility at the cost of accuracy, smoothing away the strangeness that makes science worth knowing in the first place. The hard edges are filed down. The genuinely weird implications are quietly dropped. What remains is a kind of scientific folklore — comforting, vaguely illuminating, and not quite true. This book is the exception. It does not simplify — it illuminates. And there is a difference.`,
      `The author writes about difficult ideas with a fluency that suggests genuine mastery, and there is no condescension in the prose — no sense that the reader is being handled. Instead, you are treated as an intelligent adult who simply has not encountered this material before, which is both accurate and flattering. The experience is that of a conversation, not a lecture. By the end of the first chapter I had the distinct and somewhat disorienting feeling that I had been thinking about the subject in entirely the wrong terms for my entire adult life.`,
      `What I found most remarkable was the emotional register of the writing. Science is often presented as the domain of cold logic and controlled detachment, but this book keeps returning to the human dimension — the people who made the discoveries, the false starts and obsessions and lucky accidents that produced them. It reads, in places, more like biography than textbook. There is grief in it, and wonder, and the particular joy of a mind that has found a problem it cannot stop thinking about. It is more persuasive for all of it.`,
      `I read the last chapter twice and then went for a long walk. That is my private test of a truly good book — whether it sends me outside to think. This one did. I came back an hour later with more questions than I had started with, which is exactly the right outcome. The universe did not get smaller for having been explained. It got larger, and stranger, and more worth paying attention to.`
    ],
    pullQuote: `"The best science writing does not give you answers. It gives you better questions."`
  },

  philosophy: {
    paragraphs: [
      `Philosophy is the only discipline in which the questions grow harder the longer you study it. You do not progress toward answers — you progress toward better questions, and eventually toward the unsettling recognition that you cannot escape the questions at all. This book understands that. It does not offer resolutions. It offers something rarer: a way of sitting with unresolved things without the discomfort of irresolution. I am not sure any intellectual experience is more valuable than that.`,
      `What the author manages, and what so few philosophical writers manage, is to make the abstract feel urgent. The ideas here are not museum pieces — they are not arguments to be admired from a safe distance and then set aside. They press on you. They follow you into the day. I found myself pausing at odd moments — waiting for coffee, walking between rooms — to turn a single sentence over and examine it from another angle. A book that can do that to you has crossed some threshold that most books never reach.`,
      `There is also a quality of intellectual honesty here that I find increasingly rare. The author does not pretend to have resolved what has not been resolved. The tensions are left as tensions. The paradoxes are presented as paradoxes. This could feel like a failure of nerve, but it does not. It feels, instead, like respect — respect for the difficulty of the subject and for the reader's capacity to remain in uncertainty without demanding an escape.`,
      `I finished it slowly — one section per sitting, sometimes less — not because it was difficult but because the right response to it seemed to be deliberateness. I have marked more pages in this book than in almost anything I have read in the last several years. Not because I agreed with everything, but because it gave me something to argue with. That, too, is a form of companionship that the best books provide.`
    ],
    pullQuote: `"Philosophy does not solve the problem of being human. It teaches you to inhabit it more honestly."`
  }
};

// ── Init ───────────────────────────────────────────────────────
async function init() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { window.location.href = '../browse.html'; return; }

  try {
    const res   = await fetch('../data/books.json');
    const books = await res.json();
    const book  = books.find(b => b.id === id);

    if (!book) { window.location.href = '../browse.html'; return; }

    populatePage(book);
    setupSaveBtn(book.id);
    setupMobileNav();
  } catch (err) {
    console.error('Could not load books.json:', err);
  }
}

// ── Populate page ──────────────────────────────────────────────
function populatePage(book) {
  document.title = `${book.title} — The Librarian's Shelf`;

  // Hero cover
  const cover = document.getElementById('heroCover');
  cover.style.setProperty('--book-color', book.color);
  cover.classList.add(`genre-${book.genre}`);
  const img = document.getElementById('heroCoverImg');
  img.src = `../images/books/${book.image}`;
  img.alt = `${book.title} cover`;
  img.draggable = false;
  if (book.imagePosition) img.style.objectPosition = book.imagePosition;

  // Hero text
  const genreEl = document.getElementById('heroGenre');
  genreEl.textContent = book.genre;
  genreEl.className = `hero-genre-badge genre-${book.genre}`;

  document.getElementById('bookTitle').textContent    = book.title;
  document.getElementById('heroAuthor').textContent   = `by ${book.author}`;
  document.getElementById('heroDate').textContent     = formatDate(book.date);
  document.getElementById('heroDesc').textContent     = book.description;
  document.getElementById('amazonLink').href          = book.amazonUrl;

  // Article body placeholder
  const { paragraphs, pullQuote } = PLACEHOLDER[book.genre];
  const content = document.getElementById('articleContent');

  let html = '';
  paragraphs.forEach((p, i) => {
    html += `<p>${p}</p>\n`;
    if (i === 1) {
      html += `<blockquote class="pull-quote">${pullQuote}</blockquote>\n`;
    }
  });

  // Bottom CTA (duplicates buttons for in-article convenience)
  html += `
    <div class="article-cta">
      <a class="btn-amazon" href="${book.amazonUrl}" target="_blank" rel="noopener noreferrer">
        Find on Amazon &#x2197;
      </a>
      <button class="hero-save-btn article-save-btn" aria-label="Save to reading list">
        <span class="article-save-icon" aria-hidden="true">♡</span>
        <span>Save to Reading List</span>
      </button>
    </div>
  `;

  content.innerHTML = html;

  // Wire up the in-article save button
  content.querySelector('.article-save-btn')?.addEventListener('click', function () {
    const added = toggleSave(book.id);
    syncSaveBtns(added);
  });
}

// ── Save to reading list ───────────────────────────────────────
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

function syncSaveBtns(saved) {
  document.querySelectorAll('#saveBtn, .article-save-btn').forEach(btn => {
    btn.classList.toggle('saved', saved);
  });

  const heroIcon    = document.getElementById('saveBtnIcon');
  const heroLabel   = document.getElementById('saveBtnLabel');
  const articleIcon = document.querySelector('.article-save-icon');

  if (heroIcon)    heroIcon.textContent  = saved ? '♥' : '♡';
  if (heroLabel)   heroLabel.textContent = saved ? 'Saved' : 'Save';
  if (articleIcon) articleIcon.textContent = saved ? '♥' : '♡';

  document.getElementById('saveBtn')?.setAttribute(
    'aria-label', saved ? 'Remove from reading list' : 'Save to reading list'
  );
}

function setupSaveBtn(id) {
  const saved = isSaved(id);
  syncSaveBtns(saved);

  document.getElementById('saveBtn')?.addEventListener('click', () => {
    const added = toggleSave(id);
    syncSaveBtns(added);
  });
}

// ── Helpers ────────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
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
