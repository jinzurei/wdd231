const yearEl = document.getElementById("currentYear");
const modEl = document.getElementById("lastModified");

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (modEl) {
  modEl.textContent = `Last Modified: ${document.lastModified}`;
}
