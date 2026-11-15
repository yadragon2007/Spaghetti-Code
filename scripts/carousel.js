import { createViewer, disposeViewers } from "./viewer.js";
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
    group: "carousel", // <- add
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
      group: "flyers", // <- add (same in the #flyer2 call)
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
      group: "flyers", // <- add (same in the #flyer2 call)
    },
  );
  app.classList.add("story");
  chapterVoice("../voiceover/scenes/scene1.mp4", "continue");
  setTimeout(() => {
    disposeViewers("carousel");
    window.mars.dispose();
  }, 1200);
}

document.getElementById("continue").addEventListener("click", () => {
  app.classList.add("chapter2");
  chapterVoice("../voiceover/scenes/scene2.mp4", "continue2");
  setTimeout(() => disposeViewers("flyers"), 600); // <- add
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
    group: "duo",
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
      group: "duo",
    },
  );

  app.classList.add("chapter3");
  chapterVoice("../voiceover/scenes/scene3.mp4", "continue3");
});

let chapter4Started = false;

document.getElementById("continue3").addEventListener("click", () => {
  if (chapter4Started) return;
  chapter4Started = true;

  setTimeout(() => disposeViewers("duo"), 600);
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
      group: "c4",
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
  setTimeout(() => disposeViewers("c4"), 600);

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
    group: "s1",
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
      group: "s1",
    },
  );
  createViewer(document.getElementById("s2Capsule"), "../models/capsule.glb", {
    elevation: 10,
    azimuth: 0,
    headLight: 3,
    studio: 1.5,
    fit: true,
    fitPadding: 1.05,
    group: "s2",
  });
  createViewer(document.getElementById("s3Airbag"), "../models/airbag.glb", {
    elevation: 15,
    azimuth: 0,
    headLight: 3,
    studio: 1.5,
    fit: true,
    fitPadding: 1.05,
    group: "s3",
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
  setTimeout(() => disposeViewers("s1"), 1000);
  await say(1, C7.s2TextDelay);

  // scene 3: land + bouncing airbag
  setScene(3);
  setTimeout(() => disposeViewers("s2"), 1000);
  await say(2, C7.s3TextDelay, true); // the last sentence stays on screen

  document.getElementById("continue7").classList.add("ready");
}

// chapter 6 continue -> chapter 7
document.getElementById("continue6").addEventListener("click", () => {
  if (chapter7Started) return;
  chapter7Started = true;
  setTimeout(() => rocketPuzzle.dispose(), 700);
  app.classList.add("chapter7");
  runChapter7();
});

/* ---------- chapter 8 ---------- */

const C8 = {
  startDelay: 900, // after clicking continue: wait for the airbag, text and wind to fade
  driveIn: 3500, // how long the rover takes to drive in from the left (ms)
  stopAt: 0.38, // where it stops: 0 = left edge, 1 = right edge (its center)
  textDelay: 600, // pause after it stops, before the sentence and voice start
  controlsDelay: 400, // pause after the voice ends, before the arrows appear
  speed: 150, // driving speed while an arrow is held (px per second)
  sink: 16, // lowers the rover onto the ground (px)
  facesRight: true, // set to false if the model faces left when it loads
};

const C8_TEXT =
  "Oppy immediately found several signs of past water, helping scientists establish that water once existed in Meridiani Planum.";
const C8_VOICE = "../voiceover/scenes/scene8.mp4";
const C8_HINT_DRIVE = "Use the arrows to drive Opportunity to the right";
const C8_HINT_BLOCKED = "The way is blocked on this side. Drive to the right!";

// the top edge of the land: the same numbers as the clip-path in .s3-land [x %, y % of the land height]
const RIDGE = [
  [0, 14],
  [12, 6],
  [28, 12],
  [45, 3],
  [63, 10],
  [80, 5],
  [100, 12],
];
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
    azimuth: 90, // side view; try -90 if it looks backwards
    elevation: 8,
    headLight: 3,
    studio: 1.5,
    fit: true,
    fitPadding: 1.05,
    group: "rover", // <- add
  });

  const rw = rover.offsetWidth;
  let x = -rw; // starts just outside the left edge
  let dir = 1; // last direction: 1 = right, -1 = left
  let hold = 0; // arrow being held: -1, 0 or 1
  let active = false; // true while the user can drive
  let finished = false;
  let auto = null; // the automatic drive-in
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
      x = auto.from + (auto.to - auto.from) * (1 - Math.pow(1 - t, 3)); // slows down as it stops
      dir = 1;
      if (t >= 1) {
        const done = auto.resolve;
        auto = null;
        done();
      }
    } else if (active && hold !== 0) {
      x += hold * C8.speed * dt;
      dir = hold;
      if (x < 0) x = 0; // the left side is blocked
    }

    // follow the ridge of the land
    const xPct = Math.max(0, Math.min(100, ((x + rw / 2) / w) * 100));
    const ty = (ridgeAt(xPct) / 100) * land.offsetHeight + C8.sink;
    rover.style.transform = `translate(${x}px, ${ty}px)`;
    flip.style.transform = dir < 0 === C8.facesRight ? "scaleX(-1)" : "none";
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
      return; // stop the loop
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
      btn.addEventListener(ev, () => {
        if (hold === value) hold = 0;
      }),
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
    if (
      (e.key === "ArrowLeft" && hold === -1) ||
      (e.key === "ArrowRight" && hold === 1)
    )
      hold = 0;
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
  setTimeout(() => disposeViewers("s3"), 700);
  app.classList.add("chapter8");
  runChapter8();
});

/* ---------- chapter 9 ---------- */

const C9 = {
  startDelay: 1200, // after clicking continue: the new land rises, then the rover fades in
  textDelay: 600, // pause before the sentence and voice start
  controlsDelay: 400, // pause after the voice ends, before the arrows appear
  startX: 24, // where the rover appears (px from the left edge)
  speed: 70, // driving speed while moving (px per second); slower than chapter 8
  goMin: 0.5,
  goMax: 1.1, // how long it runs before it stalls (seconds)
  stallMin: 0.25,
  stallMax: 0.7, // how long it stalls (seconds)
  lean: 4, // limp angle while moving (degrees)
  sink: 16, // lowers the rover onto the ground (px)
  facesRight: true, // same setting as chapter 8
};

const C9_TEXT =
  "Oppy explored the Martian surface for several years, facing many difficulties, like losing steering on one of its front wheels and suffering a stuck heater.";
const C9_VOICE = "../voiceover/scenes/scene9.mp4";
const C9_HINT_DRIVE = "Opportunity is damaged. Drive it to the right";
const C9_HINT_BLOCKED = "The way is blocked on this side. Drive to the right!";

// the top edge of the new land: the same numbers as the clip-path in .land9 [x %, y % of the land height]
const RIDGE9 = [
  [0, 6],
  [14, 2],
  [28, 10],
  [42, 18],
  [56, 12],
  [70, 4],
  [84, 12],
  [100, 6],
];
function ridgeOf(points, xPct) {
  const p = Math.max(0, Math.min(100, xPct));
  for (let i = 1; i < points.length; i++) {
    if (p <= points[i][0]) {
      const [x0, y0] = points[i - 1];
      const [x1, y1] = points[i];
      return y0 + (y1 - y0) * ((p - x0) / (x1 - x0));
    }
  }
  return points[points.length - 1][1];
}

const rand = (a, b) => a + Math.random() * (b - a);
let chapter9Started = false;

async function runChapter9() {
  const rover = document.getElementById("rover8"); // the same rover as chapter 8
  const flip = rover.querySelector(".rover-flip");
  const land = document.querySelector(".land9");
  const text = document.getElementById("c9Text");
  const hint = document.getElementById("c9Hint");
  const controls = document.getElementById("c9Controls");
  const leftBtn = document.getElementById("c9Left");
  const rightBtn = document.getElementById("c9Right");

  const rw = rover.offsetWidth;
  let x = C9.startX;
  let dir = 1; // last direction: 1 = right, -1 = left
  let hold = 0; // arrow being held: -1, 0 or 1
  let active = false; // true while the user can drive
  let finished = false;
  let moving = false;
  let hintMode = null;
  let go = rand(C9.goMin, C9.goMax); // time left before the next stall
  let stall = 0; // time left in the current stall
  let lurch = 1; // speed multiplier of the current run

  rover.classList.remove("driving");
  rover.classList.add("broken");
  rover.style.bottom = "36%"; // the top line of the new land

  function setHint(mode) {
    if (hintMode === mode) return;
    hintMode = mode;
    hint.classList.remove("show");
    setTimeout(() => {
      if (finished) return;
      hint.textContent = mode === "blocked" ? C9_HINT_BLOCKED : C9_HINT_DRIVE;
      hint.classList.add("show");
    }, 350);
  }

  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const w = app.clientWidth;
    const landH = land.offsetHeight;

    // broken movement: runs, stalls, lurches again at a random speed
    moving = false;
    if (active && hold !== 0) {
      dir = hold;
      if (stall > 0) {
        stall -= dt;
      } else {
        moving = true;
        x += hold * C9.speed * lurch * dt;
        if (x < 0) x = 0; // the left side is blocked
        if (x <= 0 && hold === -1) moving = false;
        go -= dt;
        if (go <= 0) {
          stall = rand(C9.stallMin, C9.stallMax);
          go = rand(C9.goMin, C9.goMax);
          lurch = rand(0.6, 1.5);
        }
      }
    }

    // follow the land and tilt with its slope
    const cx = x + rw / 2;
    const depth = (px) => (ridgeOf(RIDGE9, (px / w) * 100) / 100) * landH;
    const ty = depth(cx) + C9.sink;
    const ang =
      (Math.atan2(depth(cx + 40) - depth(cx - 40), 80) * 180) / Math.PI;
    rover.style.transform = `translate(${x}px, ${ty}px) rotate(${ang}deg)`;

    const flipX = dir < 0 === C9.facesRight ? -1 : 1;
    flip.style.transform = `scaleX(${flipX}) rotate(${moving ? C9.lean : 0}deg)`;
    rover.classList.toggle("driving", moving);

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
      document.getElementById("continue9").classList.add("ready");
      return;
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
      btn.addEventListener(ev, () => {
        if (hold === value) hold = 0;
      }),
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
    if (
      (e.key === "ArrowLeft" && hold === -1) ||
      (e.key === "ArrowRight" && hold === 1)
    )
      hold = 0;
  });

  requestAnimationFrame(tick);

  // 1. the new land rises, then the rover fades in at the left
  await wait(C9.startDelay);
  rover.style.opacity = 1;

  // 2. the sentence and its voice
  await wait(C9.textDelay);
  text.textContent = C9_TEXT;
  text.classList.add("show");
  await playVoice(C9_VOICE);

  // 3. arrows and guide message; the user drives (the loop above handles the ending)
  await wait(C9.controlsDelay);
  active = true;
  controls.classList.add("show");
  setHint("drive");
}

// chapter 8 continue -> chapter 9
document.getElementById("continue8").addEventListener("click", () => {
  if (chapter9Started) return;
  chapter9Started = true;
  app.classList.add("chapter9");
  runChapter9();
});

/* ---------- chapter 10 ---------- */

const C10 = {
  startDelay: 1400, // after clicking continue: the storm fades in, then the rover appears
  rightMargin: 24, // where the rover appears (px from the right edge)
  controlsDelay: 500, // pause after the rover appears, before the arrows appear
  textDelay: 400, // pause after the arrows appear, before the sentence and voice start
  speed: 60, // top speed with full energy (px per second)
  goMin: 0.4,
  goMax: 0.9, // how long it runs before it stalls (seconds)
  stallMin: 0.4,
  stallMax: 1.1, // how long it stalls (seconds)
  lean: 6, // limp angle while moving (degrees)
  sink: 16, // lowers the rover onto the ground (px)
  drain: 0.22, // energy lost per second while moving (1 = full)
  recharge: 0.12, // energy regained per second while resting
  streaks: 46, // dust streaks behind the rover
  clouds: 7, // dust clouds behind the rover
  frontStreaks: 18, // dust streaks in front of the rover
  frontClouds: 4, // dust clouds in front of the rover
  facesRight: true, // same setting as chapters 8, 9 and 11
};

const C10_TEXT =
  "In 2007, a severe dust storm sharply reduced the solar power available. Work was suspended for several weeks.";
const C10_VOICE = "../voiceover/scenes/scene10.mp4";
const C10_HINTS = {
  drive: "The storm is draining Opportunity's power. Try to drive it",
  drained: "Out of power! Let Opportunity recover",
};

// the top edge of the land: the same numbers as the clip-path in .land10 [x %, y % of the land height]
const RIDGE10 = [
  [0, 7],
  [16, 4],
  [34, 8],
  [52, 3],
  [70, 7],
  [86, 4],
  [100, 6],
];

/* the dust storm: JS creates the dust pieces (like the wind in chapter 7) */
function buildStorm() {
  const back = document.getElementById("storm");
  const front = document.getElementById("dustFront");
  const travel = Math.round(app.clientWidth * 1.2 + 220) + "px";
  back.style.setProperty("--travel", travel);
  front.style.setProperty("--travel", travel);

  function addDust(box, kind, count, fast) {
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      const dur =
        kind === "cloud" ? rand(8, 14) : fast ? rand(0.6, 1.3) : rand(0.9, 2);
      s.className = "dust-" + kind;
      s.style.cssText = `
        left: ${rand(100, 120)}%;
        top: ${rand(0, 95)}%;
        width: ${kind === "cloud" ? rand(180, 340) : rand(40, 160)}px;
        height: ${kind === "cloud" ? rand(70, 150) : rand(2, 5)}px;
        --o: ${kind === "cloud" ? rand(0.2, 0.45) : rand(0.15, 0.5)};
        --dy: ${rand(-40, 25)}px;
        animation-duration: ${dur}s;
        animation-delay: -${rand(0, dur)}s;`; // negative delay: already in flight at the start
      box.appendChild(s);
    }
  }

  addDust(back, "cloud", C10.clouds, false);
  addDust(back, "streak", C10.streaks, false);
  addDust(front, "cloud", C10.frontClouds, false);
  addDust(front, "streak", C10.frontStreaks, true);
}

let chapter10Started = false;

async function runChapter10() {
  const rover = document.getElementById("rover8"); // the same rover as chapters 8 and 9
  const flip = rover.querySelector(".rover-flip");
  const land = document.getElementById("land10");
  const text = document.getElementById("c10Text");
  const hint = document.getElementById("c10Hint");
  const controls = document.getElementById("c10Controls");
  const leftBtn = document.getElementById("c10Left");
  const rightBtn = document.getElementById("c10Right");

  const rw = rover.offsetWidth;
  let x = app.clientWidth - rw - C10.rightMargin; // on the right of the screen
  let dir = -1; // last direction: 1 = right, -1 = left (it faces left at first)
  let phase = "wait"; // "wait" -> "drive" -> "done"
  let hintKind = null;
  let energy = 1; // 1 = full, 0 = empty
  let go = rand(C10.goMin, C10.goMax); // time left before the next stall
  let stall = 0; // time left in the current stall
  let lurch = 1; // speed multiplier of the current run

  const input = bindDriveControls(leftBtn, rightBtn, () => phase === "drive");

  buildStorm();

  // the rover (still invisible) goes to the dusty ground, still broken
  rover.classList.remove("driving");
  rover.classList.add("broken");
  rover.style.bottom = "32%"; // the top line of the new land (same as .land10 height)
  rover.style.transformOrigin = "50% 100%"; // it tilts around its wheels

  function setHint(kind) {
    if (hintKind === kind) return;
    hintKind = kind;
    hint.classList.remove("show");
    setTimeout(() => {
      if (hintKind !== kind) return; // a newer message replaced this one
      hint.textContent = C10_HINTS[kind];
      hint.classList.add("show");
    }, 350);
  }
  function hideHint() {
    hintKind = null;
    hint.classList.remove("show");
  }

  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const w = app.clientWidth;
    const maxX = w - rw; // the rover can't leave the screen on either side

    // broken movement: runs, stalls, lurches again at a random speed
    let moving = false;
    if (phase === "drive" && input.hold !== 0) {
      dir = input.hold;
      if (stall > 0) {
        stall -= dt; // stalled: it doesn't move
      } else {
        moving = true;
        x += input.hold * C10.speed * lurch * (0.3 + 0.7 * energy) * dt; // low energy = slow
        x = Math.max(0, Math.min(maxX, x)); // both sides are blocked
        if ((x <= 0 && input.hold === -1) || (x >= maxX && input.hold === 1))
          moving = false;
        go -= dt;
        if (go <= 0) {
          stall = rand(C10.stallMin, C10.stallMax);
          go = rand(C10.goMin, C10.goMax);
          lurch = rand(0.6, 1.5);
        }
      }
    }

    // the storm leaks the rover's energy while it moves; a little comes back while it rests
    energy = moving
      ? Math.max(0, energy - C10.drain * dt)
      : Math.min(1, energy + C10.recharge * dt);
    if (energy <= 0 && stall <= 0) {
      stall = rand(C10.stallMax * 2, C10.stallMax * 3); // out of power: a long stall
      energy = 0.1;
    }

    // follow the ridge of the land and tilt with its slope
    const cx = x + rw / 2;
    const depth = (px) =>
      (ridgeOf(RIDGE10, (px / w) * 100) / 100) * land.offsetHeight;
    const ty = depth(cx) + C10.sink;
    const ang =
      (Math.atan2(depth(cx + 40) - depth(cx - 40), 80) * 180) / Math.PI;
    rover.style.transform = `translate(${x}px, ${ty}px) rotate(${ang}deg)`;
    flip.style.transform = `scaleX(${dir < 0 === C10.facesRight ? -1 : 1}) rotate(${moving ? C10.lean : 0}deg)`;
    rover.classList.toggle("driving", moving);
    rover.classList.toggle("drained", energy < 0.3);

    if (phase === "drive") {
      leftBtn.classList.toggle("blocked", x <= 0.5);
      rightBtn.classList.toggle("blocked", x >= maxX - 0.5);
      if (energy < 0.12) setHint("drained");
      else if (energy > 0.35) setHint("drive");
    }

    // the voice ended: stop the loop
    if (phase === "done") {
      rover.classList.remove("driving", "drained");
      return;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // 1. the storm fades in, then the rover appears on the right
  await wait(C10.startDelay);
  rover.style.opacity = 1;

  // 2. the arrows and the guide message: the user can try to drive
  await wait(C10.controlsDelay);
  phase = "drive";
  controls.classList.add("show");
  setHint("drive");

  // 3. the sentence and its voice (the user can keep trying to drive meanwhile)
  await wait(C10.textDelay);
  text.textContent = C10_TEXT;
  text.classList.add("show");
  await playVoice(C10_VOICE);

  // 4. the voice ended: the arrows leave and continue appears
  phase = "done";
  input.hold = 0;
  controls.classList.remove("show");
  hideHint();
  document.getElementById("continue10").classList.add("ready");
}

// chapter 9 continue -> chapter 10
document.getElementById("continue9").addEventListener("click", () => {
  if (chapter10Started) return;
  chapter10Started = true;
  app.classList.add("chapter10");
  runChapter10();
});

/* ---------- chapter 11 ---------- */

const C11 = {
  fadeOut: 800, // after clicking continue: the new land rises, then the rover fades in
  startX: 10, // where the rover appears (px from the left edge)
  centerAt: 0.5, // where the user drives the rover first: 0 = left edge, 1 = right edge (its center)
  speed: 150, // driving speed while an arrow is held (px per second)
  sink: 16, // lowers the rover onto the ground (px)
  controlsDelay: 500, // pause before the arrows appear (at the start and after the celebration)
  textDelay: 600, // pause after the rover reaches the center, before the sentence and voice start
  celebrateDelay: 500, // pause after the voice ends, before the celebration starts
  hopTime: 3000, // how long the rover hops while celebrating (ms)
  rocks: 26, // how many brown rocks on the ground
  confetti: 130, // how many confetti pieces
  facesRight: true, // same setting as chapters 8 and 9
};

const C11_TEXT =
  "All the hardships weren’t in vain; Oppy found further proof that water once moved through underground fractures, along with clay minerals that formed in neutral-pH water";
const C11_VOICE = "../voiceover/scenes/scene11.mp4";
const C11_HINTS = {
  center: "Drive Opportunity to the center of the screen",
  blocked: "The way is blocked on this side. Drive to the right!",
  exit: "Now drive Opportunity to the right",
};

// the top edge of the land: the same numbers as the clip-path in .land11 [x %, y % of the land height]
const RIDGE11 = [
  [0, 8],
  [18, 5],
  [36, 9],
  [54, 4],
  [72, 8],
  [88, 5],
  [100, 7],
];

/* brown rocks on the ground (JS creates them, like the wind in chapter 7) */
function buildRocks(count) {
  const land = document.getElementById("land11");
  const palette = [
    ["#8a5a34", "#3f2411"], // dark brown
    ["#a06a3c", "#4d2c14"], // medium brown
    ["#c79a6b", "#7a5230"], // light clay
  ];
  for (let i = 0; i < count; i++) {
    const [hi, lo] = palette[Math.floor(Math.random() * palette.length)];
    const w = rand(16, 46);
    const s = document.createElement("span");
    s.className = "rock11";
    s.style.cssText = `
      left: ${rand(-2, 94)}%;
      top: ${rand(2, 78)}%;
      width: ${w}px;
      height: ${w * rand(0.55, 0.85)}px;
      border-radius: ${rand(35, 60)}% ${rand(35, 60)}% ${rand(25, 45)}% ${rand(25, 45)}% / ${rand(45, 65)}% ${rand(45, 65)}% ${rand(30, 50)}% ${rand(30, 50)}%;
      background: linear-gradient(135deg, ${hi}, ${lo});`;
    land.appendChild(s);
  }
}

/* confetti falls from the top and removes itself when it leaves the screen */
function launchConfetti(count) {
  const box = document.getElementById("confetti");
  box.style.setProperty("--fall", app.clientHeight + 40 + "px");
  const colors = [
    "#ff5a2c",
    "#ffd23f",
    "#3bceac",
    "#4cc9f0",
    "#f72585",
    "#ffffff",
  ];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.style.cssText = `
      left: ${rand(0, 100)}%;
      width: ${rand(6, 11)}px;
      height: ${rand(10, 18)}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      --dx: ${rand(-80, 80)}px;
      --rot: ${rand(360, 1080)}deg;
      animation-duration: ${rand(2.6, 4.8)}s;
      animation-delay: ${rand(0, 1.4)}s;`;
    p.addEventListener("animationend", () => p.remove());
    box.appendChild(p);
  }
}

/* the two arrows + the keyboard arrows: input.hold is -1, 0 or 1 while one is held */
function bindDriveControls(leftBtn, rightBtn, isOn) {
  const input = { hold: 0 };

  function bindArrow(btn, value) {
    btn.addEventListener("pointerdown", (e) => {
      if (!isOn()) return;
      e.preventDefault();
      input.hold = value;
      btn.setPointerCapture(e.pointerId);
    });
    ["pointerup", "pointercancel"].forEach((ev) =>
      btn.addEventListener(ev, () => {
        if (input.hold === value) input.hold = 0;
      }),
    );
    btn.addEventListener("contextmenu", (e) => e.preventDefault());
  }
  bindArrow(leftBtn, -1);
  bindArrow(rightBtn, 1);

  // keyboard (desktop)
  window.addEventListener("keydown", (e) => {
    if (!isOn()) return;
    if (e.key === "ArrowLeft") input.hold = -1;
    if (e.key === "ArrowRight") input.hold = 1;
  });
  window.addEventListener("keyup", (e) => {
    if (
      (e.key === "ArrowLeft" && input.hold === -1) ||
      (e.key === "ArrowRight" && input.hold === 1)
    )
      input.hold = 0;
  });

  return input;
}

let chapter11Started = false;

async function runChapter11() {
  const rover = document.getElementById("rover8"); // the same rover as chapters 8 and 9
  const flip = rover.querySelector(".rover-flip");
  const land = document.getElementById("land11");
  const text = document.getElementById("c11Text");
  const hint = document.getElementById("c11Hint");
  const controls = document.getElementById("c11Controls");
  const leftBtn = document.getElementById("c11Left");
  const rightBtn = document.getElementById("c11Right");

  // chapter 10's rover leaves first (it fades out), then it is set up on the new ground
  rover.style.opacity = 0;
  await wait(C11.fadeOut);

  const rw = rover.offsetWidth;
  let x = C11.startX;
  let dir = 1; // last direction: 1 = right, -1 = left
  let phase = "wait"; // "wait" -> "toCenter" -> "locked" -> "exit" -> "done"
  let hintKind = null;
  let arrivedAtCenter = null;
  const reachedCenter = new Promise((resolve) => (arrivedAtCenter = resolve));

  const canDrive = () => phase === "toCenter" || phase === "exit";
  const input = bindDriveControls(leftBtn, rightBtn, canDrive);

  buildRocks(C11.rocks);

  // the rover (still invisible) goes to the new ground, facing right, no longer "broken"
  rover.classList.remove("broken", "driving");
  rover.style.bottom = "34%"; // the top line of the new land (same as .land11 height)
  rover.style.transformOrigin = "50% 100%"; // it tilts around its wheels
  flip.style.transform = "none";

  function setHint(kind) {
    if (hintKind === kind) return;
    hintKind = kind;
    hint.classList.remove("show");
    setTimeout(() => {
      if (hintKind !== kind) return; // a newer message replaced this one
      hint.textContent = C11_HINTS[kind];
      hint.classList.add("show");
    }, 350);
  }
  function hideHint() {
    hintKind = null;
    hint.classList.remove("show");
  }

  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const w = app.clientWidth;
    const centerX = w * C11.centerAt - rw / 2;

    if (canDrive() && input.hold !== 0) {
      x += input.hold * C11.speed * dt;
      dir = input.hold;
      if (x < 0) x = 0; // the left side is blocked

      // first part: it can't go past the center
      if (phase === "toCenter" && x >= centerX) {
        x = centerX;
        phase = "locked";
        input.hold = 0;
        arrivedAtCenter();
      }
    }

    // follow the ridge of the land and tilt with its slope
    const cx = x + rw / 2;
    const depth = (px) =>
      (ridgeOf(RIDGE11, (px / w) * 100) / 100) * land.offsetHeight;
    const ty = depth(cx) + C11.sink;
    const ang =
      (Math.atan2(depth(cx + 40) - depth(cx - 40), 80) * 180) / Math.PI;
    rover.style.transform = `translate(${x}px, ${ty}px) rotate(${ang}deg)`;
    flip.style.transform = dir < 0 === C11.facesRight ? "scaleX(-1)" : "none";
    rover.classList.toggle("driving", canDrive() && input.hold !== 0);

    if (canDrive()) {
      const atWall = x <= 0.5;
      leftBtn.classList.toggle("blocked", atWall);
      if (atWall && input.hold === -1) setHint("blocked");
      else if (x > 30) setHint(phase === "exit" ? "exit" : "center");
    }

    // the rover left the screen on the right
    if (phase === "exit" && x >= w) {
      phase = "done";
      input.hold = 0;
      rover.style.opacity = 0;
      controls.classList.remove("show");
      hideHint();
      disposeViewers("rover"); // it is off screen: free its 3D model
      document.getElementById("continue11").classList.add("ready");
      return; // stop the loop
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // 1. the new land rises, then the rover fades in at the left
  await wait(C11.startDelay);
  rover.style.opacity = 1;

  // 2. the user drives the rover to the center of the screen
  await wait(C11.controlsDelay);
  phase = "toCenter";
  controls.classList.add("show");
  setHint("center");
  await reachedCenter;

  // 3. at the center: the arrows leave, the sentence and its voice start
  controls.classList.remove("show");
  hideHint();
  await wait(C11.textDelay);
  text.textContent = C11_TEXT;
  text.classList.add("show");
  await playVoice(C11_VOICE);

  // 4. the celebration: confetti falls and the rover hops
  await wait(C11.celebrateDelay);
  launchConfetti(C11.confetti);
  rover.classList.add("celebrate");
  await wait(C11.hopTime);
  rover.classList.remove("celebrate");

  // 5. the user drives the rover to the right until it leaves the screen (the loop above handles the ending)
  await wait(C11.controlsDelay);
  phase = "exit";
  controls.classList.add("show");
  setHint("exit");
}

// chapter 10 continue -> chapter 11
document.getElementById("continue10").addEventListener("click", () => {
  if (chapter11Started) return;
  chapter11Started = true;
  app.classList.add("chapter11");
  runChapter11();
});

/* ---------- chapter 12 ---------- */

const C12 = {
  fadeOut: 800, // after clicking continue: wait for chapter 11 to leave
  startDelay: 1200, // after the land rises: the rover fades in
  startX: 24, // where the rover appears (px from the left edge)
  speed: 150, // driving speed while an arrow is held (px per second)
  sink: 16, // lowers the rover onto the ground (px)
  glitchMin: 3,
  glitchMax: 7, // pause between two memory glitches (seconds)
  glitchTimeMin: 0.4,
  glitchTimeMax: 0.9, // how long one glitch lasts (seconds)
  textDelay: 600, // pause after the bubble appears, before the first sentence
  controlsDelay: 400, // pause after the voices end, before the arrows appear
  facesRight: true, // same setting as chapters 8 to 11
};

const C12_BUBBLE = "what must I do?!";
const C12_HINTS = {
  drive: "Memory problems make Oppy freeze sometimes. Drive to the right",
  blocked: "The way is blocked on this side. Drive to the right!",
};
const C12_LINES = [
  {
    text: "Oppy recovered, but more problems arose.",
    voice: "../voiceover/scenes/scene12_1.mp4",
  },
  {
    text: "The rover started developing flash memory problems between 2014 and 2015. It lost steering in one its other front wheel in 2017.",
    voice: "../voiceover/scenes/scene12_2.mp4",
  },
];

// the top edge of the land: the same numbers as the clip-path in .land12 [x %, y % of the land height]
const RIDGE12 = [
  [0, 9],
  [15, 4],
  [33, 10],
  [50, 5],
  [68, 11],
  [85, 6],
  [100, 10],
];

let chapter12Started = false;

async function runChapter12() {
  const rover = document.getElementById("rover8"); // the same rover as before
  const flip = rover.querySelector(".rover-flip");
  const land = document.getElementById("land12");
  const bubble = document.getElementById("c12Bubble");
  const text = document.getElementById("c12Text");
  const hint = document.getElementById("c12Hint");
  const controls = document.getElementById("c12Controls");
  const leftBtn = document.getElementById("c12Left");
  const rightBtn = document.getElementById("c12Right");

  // chapter 11's rover leaves first, then it is set up on the new ground
  rover.classList.remove("driving", "drained", "celebrate", "glitch");
  rover.style.opacity = 0;
  await wait(C12.fadeOut);

  // chapter 11 freed the rover model, so load it again
  createViewer(
    rover.querySelector(".rover-model"),
    "../models/opportunity.glb",
    {
      azimuth: 90, // side view; try -90 if it looks backwards
      elevation: 8,
      headLight: 3,
      studio: 1.5,
      fit: true,
      fitPadding: 1.05,
      group: "rover",
    },
  );

  const rw = rover.offsetWidth;
  const rh = rover.offsetHeight;
  let x = C12.startX;
  let dir = 1; // last direction: 1 = right, -1 = left
  let phase = "wait"; // "wait" -> "drive" -> "done"
  let hintKind = null;
  let glitch = 0; // time left in the current memory glitch (seconds)
  let nextGlitch = rand(C12.glitchMin, C12.glitchMax); // time left before the next glitch

  const canDrive = () => phase === "drive";
  const input = bindDriveControls(leftBtn, rightBtn, canDrive);

  rover.style.bottom = "30%"; // the top line of the new land (same as .land12 height)
  rover.style.transformOrigin = "50% 100%"; // it tilts around its wheels
  flip.style.transform = "none";

  function setHint(kind) {
    if (hintKind === kind) return;
    hintKind = kind;
    hint.classList.remove("show");
    setTimeout(() => {
      if (hintKind !== kind) return; // a newer message replaced this one
      hint.textContent = C12_HINTS[kind];
      hint.classList.add("show");
    }, 350);
  }
  function hideHint() {
    hintKind = null;
    hint.classList.remove("show");
  }

  let last = performance.now();
  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const w = app.clientWidth;

    // it drives well, but a memory glitch stops it for a moment
    let moving = false;
    if (canDrive() && input.hold !== 0) {
      dir = input.hold;
      if (glitch > 0) {
        glitch -= dt; // frozen: it doesn't move
      } else {
        moving = true;
        x += input.hold * C12.speed * dt;
        if (x < 0) x = 0; // the left side is blocked
        nextGlitch -= dt;
        if (nextGlitch <= 0) {
          glitch = rand(C12.glitchTimeMin, C12.glitchTimeMax);
          nextGlitch = rand(C12.glitchMin, C12.glitchMax);
        }
      }
    } else if (glitch > 0) {
      glitch = 0; // no glitch while not driving
    }

    // follow the ridge of the land and tilt with its slope
    const cx = x + rw / 2;
    const depth = (px) =>
      (ridgeOf(RIDGE12, (px / w) * 100) / 100) * land.offsetHeight;
    const ty = depth(cx) + C12.sink;
    const ang =
      (Math.atan2(depth(cx + 40) - depth(cx - 40), 80) * 180) / Math.PI;
    rover.style.transform = `translate(${x}px, ${ty}px) rotate(${ang}deg)`;
    flip.style.transform = dir < 0 === C12.facesRight ? "scaleX(-1)" : "none";
    rover.classList.toggle("driving", moving);
    rover.classList.toggle("glitch", glitch > 0);

    // the speech bubble stays above the rover
    const bh = bubble.offsetHeight;
    const bubbleTop =
      app.clientHeight - (0.3 * app.clientHeight + rh - ty) - bh - 10;
    bubble.style.transform = `translate(${x + rw / 2}px, ${bubbleTop}px) translateX(-50%)`;

    if (canDrive()) {
      const atWall = x <= 0.5;
      leftBtn.classList.toggle("blocked", atWall);
      if (atWall && input.hold === -1) setHint("blocked");
      else if (x > 30) setHint("drive");
    }

    // the rover left the screen on the right
    if (phase === "drive" && x >= w) {
      phase = "done";
      input.hold = 0;
      rover.style.opacity = 0;
      bubble.classList.remove("show");
      controls.classList.remove("show");
      hint.classList.remove("show");
      rover.classList.remove("driving", "glitch");
      disposeViewers("rover"); // it is off screen: free its 3D model
      document.getElementById("continue12").classList.add("ready");
      return; // stop the loop
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // 1. the land rises, then the rover fades in
  rover.style.opacity = 1;
  await wait(C12.startDelay);

  // 2. the speech bubble above the rover
  bubble.textContent = C12_BUBBLE;
  bubble.classList.add("show");

  // 3. the sentences and their voices (the bubble stays)
  await wait(C12.textDelay);
  for (const line of C12_LINES) {
    text.textContent = line.text;
    text.classList.add("show");
    await playVoice(line.voice);
    text.classList.remove("show");
    await wait(600); // let it fade out
  }

  // 4. arrows and guide message; the user drives (the loop above handles the ending)
  await wait(C12.controlsDelay);
  phase = "drive";
  controls.classList.add("show");
  setHint("drive");
}

// chapter 11 continue -> chapter 12
document.getElementById("continue11").addEventListener("click", () => {
  if (chapter12Started) return;
  chapter12Started = true;
  app.classList.add("chapter12");
  runChapter12();
});

document.getElementById("continue12").addEventListener("click", () => {
  console.log("continue 12"); // e.g. app.classList.add("chapter13");
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
