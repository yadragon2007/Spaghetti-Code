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
let rocketPuzzle = null;

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
  }).then((puzzle) => (rocketPuzzle = puzzle));

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

/* ---------- chapter 6 ---------- */
const C6_LINES = [
  {
    text: "Opportunity was launched aboard a Delta II rocket on July 7th, 2003, headed for Mars.",
    voice: "../voiceover/scenes/scene6_1.mp4",
  },
  {
    text: "Nearly a month earlier, its twin, Spirit, went on the same journey.",
    voice: "../voiceover/scenes/scene6_2.mp4",
  },
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let chapter6Started = false;
let launching = false;

async function runChapter6() {
  const text = document.getElementById("c6Text");

  await wait(1800); // let the launch photo fade in first

  for (const line of C6_LINES) {
    text.textContent = line.text;
    text.classList.add("show");
    await playVoice(line.voice); // the next line starts when this voice ends
    text.classList.remove("show");
    await wait(600); // let it fade out
  }

  document.getElementById("launch6").classList.add("ready");
}

// chapter 5 continue -> chapter 6 starts
document.getElementById("continue5").addEventListener("click", () => {
  if (chapter6Started) return;
  chapter6Started = true;
  app.classList.add("chapter6");
  runChapter6();
});

// launch: the rocket flies, then continue appears
document.getElementById("launch6").addEventListener("click", async () => {
  if (launching) return;
  launching = true;
  document.getElementById("launch6").classList.remove("ready");

  app.classList.add("launching"); // screen shake
  await rocketPuzzle.launch(); // rumble sound; resolves when the rocket is off screen
  app.classList.remove("launching");

  document.getElementById("continue6").classList.add("ready");
});

/* ---------- chapter 7 ---------- */

// every delay you may want to change is here (milliseconds)
const C7 = {
  startDelay: 900, // after clicking continue: wait for chapter 6 to fade out
  s1Flight: 10000, // scene 1: how long the capsule flies to Mars (match it to voice 1)
  s1TextDelay: 3000, // scene 1: delay before the sentence and voice 1 start
  s2TextDelay: 1500, // scene 2: delay before the sentence and voice 2 start
  s3TextDelay: 2200, // scene 3: delay before the sentence and voice 3 start
  bounceDelay: 1200, // scene 3: time after the land appears until the airbag drops
  bounceTime: 3600, // scene 3: how long the fall and bounces last
};

const C7_LINES = [
  {
    text: "After six and a half months in space,",
    voice: "../voiceover/scenes/scene7_1.mp3",
  },
  {
    text: "Oppy landed in Meridiani Planum on January 24th, 2004.",
    voice: "../voiceover/scenes/scene7_2.mp3",
  },
  {
    text: "Its airbag-protected lander bounced at least 26 times before settling inside the Eagle Crater.",
    voice: "../voiceover/scenes/scene7_3.mp3",
  },
];

let chapter7Started = false;

/* wind streaks: they travel from the bottom right to the top left */
function buildWind(count = 46) {
  const wind = document.getElementById("wind");
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    const dur = 0.9 + Math.random() * 1.6; // seconds
    s.style.cssText = `
      left: ${Math.random() * 130 - 10}%;
      top: ${Math.random() * 130 - 10}%;
      width: ${60 + Math.random() * 160}px;
      --o: ${0.15 + Math.random() * 0.4};
      animation-duration: ${dur}s;
      animation-delay: -${Math.random() * dur}s;`; // negative delay: already in flight at the start
    wind.appendChild(s);
  }
}

async function runChapter7() {
  const ch = document.getElementById("chapter7");
  const text = document.getElementById("c7Text");

  // send the timing settings to the CSS
  ch.style.setProperty("--s1-flight", C7.s1Flight + "ms");
  ch.style.setProperty("--bounce-time", C7.bounceTime + "ms");
  ch.style.setProperty("--bounce-delay", C7.bounceDelay + "ms");

  buildWind();

  // load the four models now so nothing pops in later
  createViewer(document.getElementById("s1Mars"), "../models/Mars.glb", {
    rotate: true,
    speed: 0.25,
    elevation: 10,
    azimuth: 0,
    headLight: 2,
    studio: 0.5,
    fit: true,
    fitPadding: 1.05,
  });
  createViewer(
    document.getElementById("s1Capsule"),
    "../models/stage-capsule.glb",
    {
      elevation: 5,
      azimuth: 0,
      tilt: [0, 0, 45], // points the nose up-left, toward Mars
      headLight: 3,
      studio: 1.5,
      fit: true,
      fitPadding: 1.6,
    },
  );
  createViewer(document.getElementById("s2Capsule"), "../models/capsule.glb", {
    elevation: 10,
    azimuth: 0,
    headLight: 3,
    studio: 1.5,
    fit: true,
    fitPadding: 1.05,
  });
  createViewer(document.getElementById("s3Airbag"), "../models/airbag.glb", {
    elevation: 15,
    azimuth: 0,
    headLight: 3,
    studio: 1.5,
    fit: true,
    fitPadding: 1.05,
  });

  function setScene(n) {
    ch.dataset.scene = n; // shows this scene, hides the others
    ch.classList.add("go" + n); // starts this scene's motion (never removed)
  }

  // shows a sentence after `delay`, plays its voice, and resolves when the voice ends
  async function say(i, delay, keep = false) {
    await wait(delay);
    text.textContent = C7_LINES[i].text;
    text.classList.add("show");
    await playVoice(C7_LINES[i].voice);
    if (!keep) text.classList.remove("show");
  }

  await wait(C7.startDelay);

  // scene 1: flying to Mars
  setScene(1);
  await say(0, C7.s1TextDelay);

  // scene 2: red atmosphere, falling capsule
  app.classList.add("sky-on"); // the sky and wind stay until the end
  setScene(2);
  await say(1, C7.s2TextDelay);

  // scene 3: land + bouncing airbag
  setScene(3);
  await say(2, C7.s3TextDelay, true); // the last sentence stays on screen

  document.getElementById("continue7").classList.add("ready");
}

// chapter 6 continue -> chapter 7
document.getElementById("continue6").addEventListener("click", () => {
  if (chapter7Started) return;
  chapter7Started = true;
  app.classList.add("chapter7");
  runChapter7();
});






/* ---------- chapter 8 ---------- */

const C8 = {
  startDelay: 900,       // after clicking continue: wait for the airbag, text and wind to fade
  driveIn: 3500,         // how long the rover takes to drive in from the left (ms)
  stopAt: 0.38,          // where it stops: 0 = left edge, 1 = right edge (its center)
  textDelay: 600,        // pause after it stops, before the sentence and voice start
  controlsDelay: 400,    // pause after the voice ends, before the arrows appear
  speed: 150,            // driving speed while an arrow is held (px per second)
  sink: 16,              // lowers the rover onto the ground (px)
  facesRight: true,      // set to false if the model faces left when it loads
};

const C8_TEXT =
  "Oppy immediately found several signs of past water, helping scientists establish that water once existed in Meridiani Planum.";
const C8_VOICE = "../voiceover/scenes/scene8.mp4";
const C8_HINT_DRIVE = "Use the arrows to drive Opportunity to the right";
const C8_HINT_BLOCKED = "The way is blocked on this side. Drive to the right!";

// the top edge of the land: the same numbers as the clip-path in .s3-land [x %, y % of the land height]
const RIDGE = [[0, 14], [12, 6], [28, 12], [45, 3], [63, 10], [80, 5], [100, 12]];
function ridgeAt(xPct) {
  for (let i = 1; i < RIDGE.length; i++) {
    if (xPct <= RIDGE[i][0]) {
      const [x0, y0] = RIDGE[i - 1];
      const [x1, y1] = RIDGE[i];
      return y0 + (y1 - y0) * ((xPct - x0) / (x1 - x0));
    }
  }
  return RIDGE[RIDGE.length - 1][1];
}

let chapter8Started = false;

async function runChapter8() {
  const rover = document.getElementById("rover8");
  const flip = rover.querySelector(".rover-flip");
  const model = rover.querySelector(".rover-model");
  const land = document.querySelector(".s3-land");
  const text = document.getElementById("c8Text");
  const hint = document.getElementById("c8Hint");
  const controls = document.getElementById("c8Controls");
  const leftBtn = document.getElementById("c8Left");
  const rightBtn = document.getElementById("c8Right");

  createViewer(model, "../models/opportunity.glb", {
    azimuth: 90,                 // side view; try -90 if it looks backwards
    elevation: 8,
    headLight: 3,
    studio: 1.5,
    fit: true,
    fitPadding: 1.05,
  });

  const rw = rover.offsetWidth;
  let x = -rw;                   // starts just outside the left edge
  let dir = 1;                   // last direction: 1 = right, -1 = left
  let hold = 0;                  // arrow being held: -1, 0 or 1
  let active = false;            // true while the user can drive
  let finished = false;
  let auto = null;               // the automatic drive-in
  let hintMode = null;

  function setHint(mode) {
    if (hintMode === mode) return;
    hintMode = mode;
    hint.classList.remove("show");
    setTimeout(() => {
      if (finished) return;
      hint.textContent = mode === "blocked" ? C8_HINT_BLOCKED : C8_HINT_DRIVE;
      hint.classList.add("show");
    }, 350);
  }

  function driveTo(target, ms) {
    return new Promise((resolve) => {
      auto = { from: x, to: target, t0: performance.now(), ms, resolve };
    });
  }

  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const w = app.clientWidth;

    if (auto) {
      const t = Math.max(0, Math.min((now - auto.t0) / auto.ms, 1));
      x = auto.from + (auto.to - auto.from) * (1 - Math.pow(1 - t, 3));   // slows down as it stops
      dir = 1;
      if (t >= 1) {
        const done = auto.resolve;
        auto = null;
        done();
      }
    } else if (active && hold !== 0) {
      x += hold * C8.speed * dt;
      dir = hold;
      if (x < 0) x = 0;          // the left side is blocked
    }

    // follow the ridge of the land
    const xPct = Math.max(0, Math.min(100, ((x + rw / 2) / w) * 100));
    const ty = (ridgeAt(xPct) / 100) * land.offsetHeight + C8.sink;
    rover.style.transform = `translate(${x}px, ${ty}px)`;
    flip.style.transform = (dir < 0) === C8.facesRight ? "scaleX(-1)" : "none";
    rover.classList.toggle("driving", !!auto || (active && hold !== 0));

    if (active) {
      const atWall = x <= 0.5;
      leftBtn.classList.toggle("blocked", atWall);
      if (atWall && hold === -1) setHint("blocked");
      else if (x > 30) setHint("drive");
    }

    // the rover left the screen on the right
    if (active && x >= w) {
      finished = true;
      active = false;
      hold = 0;
      rover.style.opacity = 0;
      controls.classList.remove("show");
      hint.classList.remove("show");
      document.getElementById("continue8").classList.add("ready");
      return;                    // stop the loop
    }
    requestAnimationFrame(tick);
  }

  // arrows: hold to drive
  function bindArrow(btn, value) {
    btn.addEventListener("pointerdown", (e) => {
      if (!active) return;
      e.preventDefault();
      hold = value;
      btn.setPointerCapture(e.pointerId);
    });
    ["pointerup", "pointercancel"].forEach((ev) =>
      btn.addEventListener(ev, () => { if (hold === value) hold = 0; })
    );
    btn.addEventListener("contextmenu", (e) => e.preventDefault());
  }
  bindArrow(leftBtn, -1);
  bindArrow(rightBtn, 1);

  // keyboard (desktop)
  window.addEventListener("keydown", (e) => {
    if (!active) return;
    if (e.key === "ArrowLeft") hold = -1;
    if (e.key === "ArrowRight") hold = 1;
  });
  window.addEventListener("keyup", (e) => {
    if ((e.key === "ArrowLeft" && hold === -1) || (e.key === "ArrowRight" && hold === 1)) hold = 0;
  });

  requestAnimationFrame(tick);

  // 1. the rover drives in from the left and stops
  await wait(C8.startDelay);
  const stopX = app.clientWidth * C8.stopAt - rw / 2;
  await driveTo(stopX, C8.driveIn);

  // 2. the sentence and its voice
  await wait(C8.textDelay);
  text.textContent = C8_TEXT;
  text.classList.add("show");
  await playVoice(C8_VOICE);

  // 3. arrows and guide message; the user drives (the loop above handles the ending)
  await wait(C8.controlsDelay);
  active = true;
  controls.classList.add("show");
  setHint("drive");
}

// chapter 7 continue -> chapter 8
document.getElementById("continue7").addEventListener("click", () => {
  if (chapter8Started) return;
  chapter8Started = true;
  app.classList.add("chapter8");
  runChapter8();
});

document.getElementById("continue8").addEventListener("click", () => {
  console.log("continue 8"); // e.g. app.classList.add("chapter9");
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
