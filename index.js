const PALETTES = {
  cyan: "#4fd9ff",
  pink: "#ff6ec7",
  green: "#5cf29a",
  gold: "#ffd54a",
};

const EMAIL = "cauecatonesilva@gmail.com";
const GITHUB_USER = "cauesilva1";
const LINKEDIN_URL = "https://www.linkedin.com/in/cauecatonesilva1551/";
const PORTFOLIO_URL = "https://portifolio-caue.vercel.app";

const FEATURED_PROJECTS = [
  {
    name: "OmniScout",
    blurb: "Multi-sport scouting platform with rankings, dashboards, and live data.",
    url: "https://github.com/cauesilva1",
  },
  {
    name: "Lenda da Quadra",
    blurb: "Browser basketball career sim built around identity and competition.",
    url: "https://github.com/cauesilva1",
  },
  {
    name: "Geracional",
    blurb: "Football manager in the browser — squads, budgets, and rebuild loops.",
    url: "https://github.com/cauesilva1",
  },
  {
    name: "Job Tracker",
    blurb: "Application tracker with auth, dashboards, and role-aware UI.",
    url: "https://github.com/cauesilva1",
  },
];

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function shade(hex, amount) {
  const [r, g, b] = hexToRgb(hex);
  const clamp = (c) => Math.max(0, Math.min(255, Math.round(c + amount)));
  return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
}

function drawPlanet(canvas, baseHex) {
  const ctx = canvas.getContext("2d");
  const size = canvas.width;
  const cx = size / 2 - 0.5;
  const cy = size / 2 - 0.5;
  const radius = size / 2 - 1.2;

  ctx.clearRect(0, 0, size, size);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius) continue;

      const lightDx = dx + 2.2;
      const lightDy = dy + 2.2;
      const lightDist = Math.sqrt(lightDx * lightDx + lightDy * lightDy);
      let color = shade(baseHex, -45);

      if (dist > radius - 1.1) color = shade(baseHex, -90);
      else if (lightDist < radius * 0.55) color = shade(baseHex, 45);
      else if (lightDist < radius * 0.95) color = baseHex;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

function drawShip(canvas) {
  const ctx = canvas.getContext("2d");
  const rows = [
    "............",
    ".....HH.....",
    "....HHHH....",
    "....HDDH....",
    "...HHCCHH...",
    "..HHHCCHHH..",
    "..HDDDDDDH..",
    ".HHDDDDDDHH.",
    ".HDDDDDDDDH.",
    "HHDD....DDHH",
    "HD..EEEE..DH",
    "....EEEE....",
  ];
  const colors = {
    H: "#eef1ff",
    D: "#8f9ae0",
    C: "#4fd9ff",
    E: "#ff8a4c",
  };

  ctx.clearRect(0, 0, 12, 12);
  rows.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell === ".") return;
      ctx.fillStyle = colors[cell];
      ctx.fillRect(x, y, 1, 1);
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function fetchGithub() {
  const [userRes, repoRes] = await Promise.all([
    fetch(`https://api.github.com/users/${GITHUB_USER}`),
    fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=6`
    ),
  ]);
  if (!userRes.ok || !repoRes.ok) throw new Error("scan failed");
  return {
    user: await userRes.json(),
    repos: await repoRes.json(),
  };
}

function githubMarkup(data) {
  const repos = data.repos
    .filter((repo) => !repo.fork)
    .slice(0, 5)
    .map(
      (repo) => `
        <li>
          <a href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer">
            <strong>${escapeHtml(repo.name)}</strong>
            <small>${escapeHtml(repo.description || "No transmission log.")}</small>
          </a>
        </li>`
    )
    .join("");

  return `
    <h2>GITHUB STATION</h2>
    <p class="sector">SECTOR: CODE OUTPOST · @${escapeHtml(GITHUB_USER)}</p>
    <div class="stat-row">
      <span>${data.user.public_repos} REPOS</span>
      <span>${data.user.followers} FOLLOWERS</span>
    </div>
    <p>Latest public builds from this outpost.</p>
    <ul class="mission-list">${repos}</ul>
  `;
}

function githubFallback() {
  return `
    <h2>GITHUB STATION</h2>
    <p class="sector">SECTOR: CODE OUTPOST · @${GITHUB_USER}</p>
    <p>Live scan is offline. The station is still reachable.</p>
    <div class="comms">
      <a class="action" href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener noreferrer">Open GitHub station</a>
    </div>
  `;
}

function linkedinMarkup() {
  return `
    <h2>LINKEDIN ORBIT</h2>
    <p class="sector">SECTOR: CAREER LOG · TORONTO</p>
    <p>Front-end developer shipping product UI with React, Next.js, and TypeScript.</p>
    <ul class="log-list">
      <li><strong>Consultarer</strong> — Front-end Developer, May 2025–present. Remote, Canada.</li>
      <li><strong>Oi</strong> — Junior Software Developer, Oct 2021–Dec 2023. Brazil.</li>
    </ul>
    <p class="note">LinkedIn itself is outside this galaxy. This dossier stays in-mission.</p>
    <div class="comms">
      <a class="action secondary" href="${LINKEDIN_URL}" target="_blank" rel="noopener noreferrer">Warp to LinkedIn profile</a>
    </div>
  `;
}

function projectsMarkup(repos) {
  const items = (repos?.length ? repos : FEATURED_PROJECTS)
    .slice(0, 4)
    .map((item) => {
      const name = item.name;
      const blurb = item.blurb || item.description || "Featured build.";
      const url = item.url || item.html_url || PORTFOLIO_URL;
      return `
        <li>
          <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
            <strong>${escapeHtml(name)}</strong>
            <small>${escapeHtml(blurb)}</small>
          </a>
        </li>`;
    })
    .join("");

  return `
    <h2>PROJECTS COLONY</h2>
    <p class="sector">SECTOR: BUILD LOG</p>
    <p>Selected missions — product-shaped apps, not just demos.</p>
    <ul class="mission-list">${items}</ul>
    <div class="comms">
      <a class="action secondary" href="${PORTFOLIO_URL}" target="_blank" rel="noopener noreferrer">Open full portfolio</a>
    </div>
  `;
}

function contactMarkup() {
  return `
    <h2>CONTACT RELAY</h2>
    <p class="sector">SECTOR: COMMS · TORONTO</p>
    <p>Open to new missions — on-site or remote.</p>
    <p><strong>${EMAIL}</strong></p>
    <div class="comms">
      <button type="button" data-copy-email>Copy transmission address</button>
      <a class="action secondary" href="mailto:${EMAIL}">Send signal</a>
    </div>
  `;
}

function initMap() {
  const map = document.getElementById("map");
  const ship = document.getElementById("ship");
  const pathLine = document.getElementById("pathLine");
  const pathSvg = pathLine?.closest("svg");
  const nodes = [...document.querySelectorAll(".node")];
  const shipCanvas = document.querySelector(".ship canvas");
  const briefing = document.getElementById("briefing");
  const briefingBody = document.getElementById("briefing-body");
  const closeBtn = briefing?.querySelector("[data-close]");

  if (
    !map ||
    !ship ||
    !pathLine ||
    !pathSvg ||
    !shipCanvas ||
    !briefing ||
    !briefingBody ||
    !nodes.length
  ) {
    return;
  }

  document.querySelectorAll("canvas[data-planet]").forEach((canvas) => {
    drawPlanet(canvas, PALETTES[canvas.dataset.planet]);
  });
  drawShip(shipCanvas);

  let githubCache = null;
  let currentPoint = null;
  let currentRotate = 0;
  let launchTimer = 0;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const flightMs = reduceMotion ? 0 : 680;

  function centers() {
    const mapRect = map.getBoundingClientRect();
    return nodes.map((node) => {
      const planet = node.querySelector("canvas") || node;
      const rect = planet.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - mapRect.left - map.clientLeft,
        y: rect.top + rect.height / 2 - mapRect.top - map.clientTop - 22,
      };
    });
  }

  function redrawPath() {
    const points = centers();
    if (!points.length) return points;

    pathSvg.removeAttribute("viewBox");
    pathLine.setAttribute(
      "d",
      points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" ")
    );
    return points;
  }

  function moveShipTo(point, options = {}) {
    const shouldRotate = options.rotate !== false;
    if (shouldRotate && currentPoint) {
      const dx = point.x - currentPoint.x;
      const dy = point.y - currentPoint.y;
      if (Math.hypot(dx, dy) > 12) {
        currentRotate = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      }
    }

    ship.style.left = `${point.x}px`;
    ship.style.top = `${point.y}px`;
    ship.style.transform = `translate(-50%, -50%) rotate(${currentRotate}deg)`;
    currentPoint = { x: point.x, y: point.y };
  }

  function nearestPoint(points, target) {
    return points.reduce((best, point) => {
      const bestDist = (best.x - target.x) ** 2 + (best.y - target.y) ** 2;
      const nextDist = (point.x - target.x) ** 2 + (point.y - target.y) ** 2;
      return nextDist < bestDist ? point : best;
    });
  }

  function sync() {
    const points = redrawPath();
    if (!points.length) return;
    moveShipTo(currentPoint ? nearestPoint(points, currentPoint) : points[0], {
      rotate: false,
    });
  }

  async function renderMission(mission) {
    if (mission === "github") {
      briefingBody.innerHTML = `<h2>GITHUB STATION</h2><p class="sector">SCANNING SECTOR...</p>`;
      try {
        githubCache = githubCache || (await fetchGithub());
        briefingBody.innerHTML = githubMarkup(githubCache);
      } catch {
        briefingBody.innerHTML = githubFallback();
      }
      return;
    }

    if (mission === "linkedin") {
      briefingBody.innerHTML = linkedinMarkup();
      return;
    }

    if (mission === "projects") {
      briefingBody.innerHTML = `<h2>PROJECTS COLONY</h2><p class="sector">SCANNING BUILD LOG...</p>`;
      try {
        githubCache = githubCache || (await fetchGithub());
        const repos = githubCache.repos.filter((repo) => !repo.fork).slice(0, 4);
        briefingBody.innerHTML = projectsMarkup(repos);
      } catch {
        briefingBody.innerHTML = projectsMarkup();
      }
      return;
    }

    briefingBody.innerHTML = contactMarkup();
  }

  function closeBriefing(fromPopstate) {
    briefing.hidden = true;
    document.body.classList.remove("is-briefing");
    nodes.forEach((item) => item.classList.remove("is-target"));
    if (!fromPopstate && location.hash) {
      history.pushState(null, "", location.pathname + location.search);
    }
  }

  async function openBriefing(mission, fromHash) {
    if (!fromHash) {
      history.pushState({ mission }, "", `#${mission}`);
    }
    document.body.classList.add("is-briefing");
    briefing.hidden = false;
    await renderMission(mission);
    closeBtn?.focus();
  }

  function launchTo(node, index) {
    const mission = node.dataset.mission;
    if (!mission) return;

    window.clearTimeout(launchTimer);
    nodes.forEach((item) => item.classList.remove("is-target"));
    node.classList.add("is-target");
    ship.classList.add("is-flying");
    moveShipTo(centers()[index]);

    launchTimer = window.setTimeout(() => {
      ship.classList.remove("is-flying");
      openBriefing(mission);
    }, flightMs);
  }

  nodes.forEach((node, index) => {
    const flyHere = () => moveShipTo(centers()[index]);

    node.addEventListener("pointerenter", flyHere);
    node.addEventListener("focus", flyHere);
    node.addEventListener("click", (event) => {
      event.preventDefault();
      launchTo(node, index);
    });
  });

  closeBtn?.addEventListener("click", () => closeBriefing(false));
  briefing.addEventListener("click", (event) => {
    if (event.target === briefing) closeBriefing(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !briefing.hidden) closeBriefing(false);
  });
  briefingBody.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy-email]");
    if (!button) return;
    try {
      await navigator.clipboard.writeText(EMAIL);
      button.textContent = "Address copied";
    } catch {
      button.textContent = EMAIL;
    }
  });
  window.addEventListener("popstate", () => {
    const mission = location.hash.replace("#", "");
    if (mission) openBriefing(mission, true);
    else closeBriefing(true);
  });

  sync();
  document.fonts?.ready?.then(sync);
  window.addEventListener("resize", sync);
  window.visualViewport?.addEventListener("resize", sync);
  if (window.ResizeObserver) {
    new ResizeObserver(sync).observe(map);
  }

  const initial = location.hash.replace("#", "");
  if (initial) openBriefing(initial, true);
}

initMap();
