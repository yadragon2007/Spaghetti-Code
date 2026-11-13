import { createViewer } from "./viewer.js";

/* ---------- data: id must match a key in ROVERS in main.js ---------- */
const rovers = [
  { id: "opportunity", name: "Opportunity", Model: "../models/opportunity.glb" },
  { id: "spirit", name: "Spirit", Model: "../models/opportunity.glb" },
];

const app   = document.getElementById("app");
const mars  = document.getElementById("mars");
const track = document.getElementById("track");
const prev  = document.getElementById("prev");
const next  = document.getElementById("next");

let active = 0;

/* ---------- build the slides ---------- */
rovers.forEach((rover) => {
  const slide = document.createElement("div");
  slide.className = "slide";
  slide.innerHTML = `
    <div class="slide-model"></div>
    <h3 class="slide-title">${rover.name}</h3>
  `;
  track.appendChild(slide);

  createViewer(slide.querySelector(".slide-model"), rover.Model, {
    rotate: false,
    elevation: 25,
    azimuth: 40,
    headLight: 3,
    studio: 1.5,
  });
});

/* ---------- link to Mars (uses the classes from main.js) ---------- */
function clearRoverClasses() {
  rovers.forEach((r) => mars.classList.remove(r.id));
}

function syncMars() {
  clearRoverClasses();
  if (app.classList.contains("explore")) {
    mars.classList.add(rovers[active].id);   // Mars turns to this rover
  }
} 

// intro = Mars spins freely; explore = Mars follows the carousel
new MutationObserver(syncMars).observe(app, {
  attributes: true,
  attributeFilter: ["class"],
});

/* ---------- carousel behaviour ---------- */
function goTo(i) {
  const index = Math.max(0, Math.min(rovers.length - 1, i));
  track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
}

function updateArrows() {
  prev.disabled = active === 0;
  next.disabled = active === rovers.length - 1;
}

track.addEventListener("scroll", () => {
  const i = Math.round(track.scrollLeft / track.clientWidth);
  if (i !== active) {
    active = i;
    updateArrows();
    syncMars();
  }
});

prev.addEventListener("click", () => goTo(active - 1));
next.addEventListener("click", () => goTo(active + 1));
updateArrows();
syncMars();

// optional: control it from the console, e.g. carousel.goTo(1)
window.carousel = { goTo };