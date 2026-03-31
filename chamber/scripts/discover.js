import { attractions } from "../data/discover.mjs";

// ── Build cards ─────────────────────────────────────────
const grid = document.getElementById("discoverGrid");

attractions.forEach((place, index) => {
  const card = document.createElement("article");
  card.className = "discover-card";
  card.style.gridArea = `card${index + 1}`;

  card.innerHTML = `
    <figure class="discover-figure">
      <img
        src="${place.image}"
        alt="${place.alt}"
        width="300"
        height="200"
        loading="lazy"
      >
    </figure>
    <div class="discover-body">
      <h2 class="discover-title">${place.name}</h2>
      <address class="discover-address">${place.address}</address>
      <p class="discover-desc">${place.description}</p>
      <button class="discover-btn" type="button">Learn More</button>
    </div>
  `;

  grid.appendChild(card);
});

// ── localStorage visit message ──────────────────────────
const visitBanner = document.getElementById("visitBanner");

const lastVisit = localStorage.getItem("discoverLastVisit");
const now = Date.now();

let message;

if (!lastVisit) {
  message = "Welcome! Let us know if you have any questions.";
} else {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysDiff = Math.floor((now - Number(lastVisit)) / msPerDay);

  if (daysDiff < 1) {
    message = "Back so soon! Awesome!";
  } else if (daysDiff === 1) {
    message = "You last visited 1 day ago.";
  } else {
    message = `You last visited ${daysDiff} days ago.`;
  }
}

visitBanner.textContent = message;
localStorage.setItem("discoverLastVisit", String(now));
