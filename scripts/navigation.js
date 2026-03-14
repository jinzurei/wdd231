const menuButton = document.getElementById("menuButton");
const primaryNav = document.getElementById("primaryNav");

if (menuButton && primaryNav) {
  menuButton.addEventListener("click", () => {
    menuButton.textContent = primaryNav.classList.toggle("is-open") ? "X" : "☰";
    menuButton.setAttribute("aria-expanded", String(primaryNav.classList.contains("is-open")));
  });
}
