const currentYear = document.getElementById("currentYear");
const lastModified = document.getElementById("lastModified");

if (currentYear) currentYear.textContent = new Date().getFullYear();
if (lastModified) lastModified.textContent = `Last Modification: ${document.lastModified}`;
