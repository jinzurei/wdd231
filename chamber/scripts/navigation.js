const menuBtn = document.getElementById("menuButton");
const primaryNav = document.getElementById("primaryNav");

if (menuBtn && primaryNav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.textContent = isOpen ? "\u2715" : "\u2630";
    menuBtn.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });
}
