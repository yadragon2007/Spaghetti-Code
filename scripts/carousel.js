import { createViewer } from "./viewer.js";
import { createRocketPuzzle } from "./rocket.js";
import { playVoice, stopVoice } from "./voice.js";

/* ---------- data: id must match a key in ROVERS in main.js ---------- */
const rovers = [
  {
    id: "opportunity",
    name: "Opportunity",
    Model: "../models/opportunity.glb",
    enabled: true,
    voice: "../voiceover/opportunity.mp3",
  },
  {
    id: "spirit",
    name: "Spirit",
    Model: "../models/opportunity.glb",
    enabled: false,
    voice: "../voiceover/spirit.mp4",
  },
];

const app = document.getElementById("app");
const mars = document.getElementById("mars");
const track = document.getElementById("track");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

let active = 0;

/* plays a chapter's voiceover, then lets its continue button appear */
function chapterVoice(src, btnId) {
  const btn = document.getElementById(btnId);
  btn.classList.remove("ready");
  playVoice(src).then(() => btn.classList.add("ready"));
}

/* ---------- build the slides ---------- */
rovers.forEach((rover) => {
  const slide = document.createElement("div");
  slide.className = "slide " + (rover.enabled ? "clickable" : "disabled");
  slide.innerHTML = `
    <div class="slide-model"></div>
    <h3 class="slide-title">${rover.name}</h3>
    ${rover.enabled ? "" : '<span class="slide-badge">Coming soon</span>'}
  `;

  if (rover.enabled) {
    slide.tabIndex = 0;
    slide.setAttribute("role", "button");
    slide.addEventListener("click", () => selectRover(rover));
    slide.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectRover(rover);
      }
    });
  } else {
    slide.setAttribute("aria-disabled", "true");
  }

  track.appendChild(slide);

  createViewer(slide.querySelector(".slide-model"), rover.Model, {
    rotate: false,
    elevation: 25,
    azimuth: 40,
    headLight: 3,
    studio: 1.5,
  });
});

let storyStarted = false;

function selectRover(rover) {
  if (storyStarted || rover.id !== "opportunity") return;
  storyStarted = true;

  // stop Mars from showing labels/dots while it leaves
  mars.classList.add("no-labels", "no-dots", "still");

  // flying rover (a different model from the carousel one)

  createViewer(
    document.querySelector("#flyer .flyer-model"),
    "../models/opportunity.glb",
    {
      rotate: false,
      elevation: 10,
      azimuth: 90,
      headLight: 3,
      studio: 1.5,
    },
  );
  // flying mars
  createViewer(
    document.querySelector("#flyer2 .flyer-model"),
    "../models/Mars.glb",
    {
      rotate: false,
      elevation: 10,
      azimuth: -90, // faces left, since this one flies right to left
      headLight: 3,
      studio: 1.5,
    },
  );
  app.classList.add("story");
  chapterVoice("../voiceover/scenes/scene1.mp4", "continue");
}

document.getElementById("continue").addEventListener("click", () => {
  app.classList.add("chapter2");
  chapterVoice("../voiceover/scenes/scene2.mp4", "continue2");
});

let chapter3Started = false;

document.getElementById("continue2").addEventListener("click", () => {
  if (chapter3Started) return;
  chapter3Started = true;

  // Mars on the left (spinning)
  createViewer(document.getElementById("duoMars"), "../models/Mars.glb", {
    rotate: true,
    speed: 0.35,
    elevation: 10,
    azimuth: 0,
    headLight: 2,
    studio: 0.5,
    fit: true,
  });

  // the other object on the right (placeholder model)
  createViewer(
    document.getElementById("duoObject"),
    "../models/mars with oceans.glb",
    {
      rotate: true,
      speed: 0.5,
      elevation: 20,
      azimuth: 30,
      headLight: 3,
      studio: 1.5,
      fit: true,
    },
  );

  app.classList.add("chapter3");
  chapterVoice("../voiceover/scenes/scene3.mp4", "continue3");
});

let chapter4Started = false;

document.getElementById("continue3").addEventListener("click", () => {
  if (chapter4Started) return;
  chapter4Started = true;

  createViewer(
    document.getElementById("c4Rover"),
    "../models/opportunity.glb",
    {
      rotate: true,
      speed: 0.35,
      elevation: 20,
      azimuth: 40,
      headLight: 8,
      studio: 9,
    },
  );

  app.classList.add("chapter4");
  chapterVoice("../voiceover/scenes/scene4.mp4", "continue4");
});

/* ---------- chapter 5: instructions + voiceovers ---------- */
const C5_HINTS = [
  "Drag Opportunity into the capsule",
  "Now drag the capsule onto the stage",
  "Drag the loaded stage onto the top of the rocket",
];
let c5Step = 0;
let c5HintReady = false; // becomes true when the first voice ends
let c5Finished = false;

function showHint(text) {
  const hint = document.getElementById("c5Hint");
  hint.classList.remove("show"); // fade out the old one
  setTimeout(() => {
    if (c5Finished) return;
    hint.textContent = text;
    hint.classList.add("show"); // fade in the new one
  }, 350);
}

let chapter5Started = false;

document.getElementById("continue4").addEventListener("click", () => {
  if (chapter5Started) return;
  chapter5Started = true;

  createRocketPuzzle(document.getElementById("c5Stage"), {
    models: {
      rocket: { src: "../models/rocket.glb" },
      rover: { src: "../models/opportunity.glb" },
      capsule: { src: "../models/capsule.glb" },
      stage: { src: "../models/stage.glb" },
      stageCapsule: { src: "../models/stage-capsule.glb" },
    },
    sounds: [
      "../soundEffects/screwdriver/screwdriver1.mp3",
      "../soundEffects/screwdriver/screwdriver2.mp3",
      "../soundEffects/screwdriver/screwdriver4.mp3",
    ],
    onStep: (i) => {
      c5Step = i;
      if (c5HintReady) showHint(C5_HINTS[i]);
    },
    onComplete: () => {
      c5Finished = true;
      document.getElementById("c5Hint").classList.remove("show");

      const text = document.getElementById("c5Text");
      text.classList.add("swapping");
      setTimeout(() => {
        text.textContent = "Let's launch";
        text.classList.remove("swapping");
        // voice 2 starts with the new text, and the button waits for it to end
        playVoice("../voiceover/scenes/scene5_2.mp4").then(() =>
          app.classList.add("rocket-done"),
        );
      }, 350);
    },
  });

  app.classList.add("chapter5");

  // voice 1 starts when the first text fades in (1.8s), then the instruction appears
  setTimeout(() => {
    if (c5Finished) return;
    playVoice("../voiceover/scenes/scene5_1.mp4").then(() => {
      c5HintReady = true;
      showHint(C5_HINTS[c5Step]);
    });
  }, 1800);
});

document.getElementById("continue5").addEventListener("click", () => {
  console.log("continue 5");
  // e.g. app.classList.add("chapter6");
});

/* ---------- link to Mars (uses the classes from main.js) ---------- */
function clearRoverClasses() {
  rovers.forEach((r) => mars.classList.remove(r.id));
}

function syncMars() {
  clearRoverClasses();
  if (app.classList.contains("explore")) {
    mars.classList.add(rovers[active].id); // Mars turns to this rover
  }
}

// intro = Mars spins freely; explore = Mars follows the carousel
new MutationObserver(syncMars).observe(app, {
  attributes: true,
  attributeFilter: ["class"],
});

/* ---------- say the selected rover's name ---------- */
function speakActive() {
  // only while the carousel is on screen (not before explore, not after the story starts)
  if (!app.classList.contains("explore") || app.classList.contains("story"))
    return;
  playVoice(rovers[active].voice);
}

let wasCarousel = false;
new MutationObserver(() => {
  const isCarousel =
    app.classList.contains("explore") && !app.classList.contains("story");

  if (isCarousel && !wasCarousel) setTimeout(speakActive, 700); // wait for the carousel to fade in
  wasCarousel = isCarousel;
}).observe(app, { attributes: true, attributeFilter: ["class"] });

track.addEventListener("scroll", () => {
  const i = Math.round(track.scrollLeft / track.clientWidth);
  if (i !== active) {
    active = i;
    updateArrows();
    syncMars();
    speakActive(); // <- add this line
  }
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
