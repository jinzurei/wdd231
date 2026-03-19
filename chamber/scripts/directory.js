const container = document.getElementById("memberContainer");
const btnGrid = document.getElementById("btnGrid");
const btnList = document.getElementById("btnList");

function membershipLabel(level) {
  switch (Number(level)) {
    case 3:
      return { text: "Gold Member", cls: "badge-gold" };
    case 2:
      return { text: "Silver Member", cls: "badge-silver" };
    default:
      return { text: "Member", cls: "badge-member" };
  }
}

function buildCard(member) {
  const badge = membershipLabel(member.membershipLevel);

  const article = document.createElement("article");
  article.className = "member-card";

  article.innerHTML = `
    <div class="card-img-wrap">
      <img
        src="images/${member.image}"
        alt="${member.name} logo"
        width="220"
        height="100"
        loading="lazy"
      >
    </div>
    <div class="card-body">
      <h2 class="card-name">${member.name}</h2>
      <span class="card-badge ${badge.cls}">${badge.text}</span>
      <p class="card-detail">${member.address}</p>
      <p class="card-detail">${member.phone}</p>
      <p class="card-detail">
        <a href="${member.website}" target="_blank" rel="noopener noreferrer">
          ${member.websiteLabel}
        </a>
      </p>
      <p class="card-detail">${member.description}</p>
    </div>
  `;

  return article;
}

function renderMembers(members) {
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  members.forEach((member) => fragment.appendChild(buildCard(member)));
  container.appendChild(fragment);
}

async function loadMembers() {
  try {
    const response = await fetch("data/members.json");

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    renderMembers(data.members);
  } catch (err) {
    if (container) {
      container.innerHTML = `<p class="card-detail">Unable to load member data. Please try again later.</p>`;
    }
    console.error("loadMembers:", err);
  }
}

function setView(view) {
  const isGrid = view === "grid";
  container.classList.toggle("list-view", !isGrid);

  btnGrid.classList.toggle("active", isGrid);
  btnList.classList.toggle("active", !isGrid);

  btnGrid.setAttribute("aria-pressed", String(isGrid));
  btnList.setAttribute("aria-pressed", String(!isGrid));
}

if (btnGrid && btnList) {
  btnGrid.addEventListener("click", () => setView("grid"));
  btnList.addEventListener("click", () => setView("list"));
}

setView("grid");
loadMembers();
