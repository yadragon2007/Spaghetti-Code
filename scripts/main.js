import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

/* =====================================================
   SETTINGS
===================================================== */
const MODEL = "/models/Mars.glb";
const SPEED = 0.35; // radians per second (0.35 is about 20 deg/s)
const LON_OFFSET = 0; // calibration: try 90, 180, -90 if markers are off
const CAMERA_DISTANCE = 3.6; // smaller = bigger Mars

// add a location here and the class of the same name works automatically
const ROVERS = {
  opportunity: { name: "Opportunity", lat: -1.9462, lon: 354.4734 },
  spirit: { name: "Spirit", lat: -14.6, lon: 175.5 },
};
const ROVER_KEYS = Object.keys(ROVERS);

/* =====================================================
   STATE (declared first so everything below can use it)
===================================================== */
let focusAngle = null;
let paused = false;
let activeKey = null; // rover currently selected by class
let showLabels = true;
let showDots = true;
let focusOnly = false;
let planet = null;
const markers = []; // { key, dot, label }

/* =====================================================
   ELEMENTS
===================================================== */
const app = document.getElementById("app");
const container = document.getElementById("mars");
const labelsEl = document.getElementById("labels");

/* =====================================================
   SCENE
===================================================== */
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); // transparent background
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0, CAMERA_DISTANCE);

scene.add(new THREE.AmbientLight(0xffffff, 1.2));
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.position.set(5, 3, 5);
scene.add(sun);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.minPolarAngle = Math.PI / 2; // lock vertical orbit
controls.maxPolarAngle = Math.PI / 2;

function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(container);
resize();

/* =====================================================
   LOAD MARS
===================================================== */
const spin = new THREE.Group(); // rotates around the planet's center
scene.add(spin);

new GLTFLoader().load(
  MODEL,
  (gltf) => {
    const model = gltf.scene;
    spin.add(model);
    model.updateMatrixWorld(true);

    model.traverse((o) => {
      if (o.isMesh && !planet) planet = o;
    });

    // center the planet on the origin and make its radius 1
    const box = new THREE.Box3().setFromObject(planet);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    spin.scale.setScalar(2 / Math.max(size.x, size.y, size.z));
    model.position.sub(center);

    addMarkers();
    applyClasses(); // markers exist now, so sync the menu highlight
  },
  undefined,
  (err) => console.error("Could not load " + MODEL, err),
);

/* =====================================================
   MARKERS (lat/lon -> point on the sphere)
===================================================== */
function addMarkers() {
  planet.geometry.computeBoundingSphere();
  const { radius, center } = planet.geometry.boundingSphere;

  for (const [key, r] of Object.entries(ROVERS)) {
    const phi = THREE.MathUtils.degToRad(r.lat);
    const theta = THREE.MathUtils.degToRad(r.lon + LON_OFFSET);

    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.02, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff }),
    );
    dot.position
      .set(
        radius * Math.cos(phi) * Math.sin(theta),
        radius * Math.sin(phi),
        radius * Math.cos(phi) * Math.cos(theta),
      )
      .add(center);
    planet.add(dot); // child of the planet, so it spins with it

    const label = document.createElement("div");
    label.className = "mars-label";
    label.textContent = r.name;
    labelsEl.appendChild(label);

    markers.push({ key, dot, label });
  }
}

// place the HTML labels over the 3D dots and hide them on the far side
const _pos = new THREE.Vector3();
const _toCam = new THREE.Vector3();
const _ndc = new THREE.Vector3();

function updateLabels() {
  for (const m of markers) {
    // with focus-only, every marker except the selected rover is hidden
    const allowed = !focusOnly || m.key === activeKey;

    m.dot.visible = showDots && allowed;

    if (!showLabels || !allowed) {
      m.label.style.opacity = 0;
      continue;
    }

    m.dot.getWorldPosition(_pos);

    _toCam.copy(camera.position).sub(_pos).normalize();
    const facing = _pos.clone().normalize().dot(_toCam) > 0.15;

    _ndc.copy(_pos).project(camera);
    const x = (_ndc.x * 0.5 + 0.5) * container.clientWidth;
    const y = (-_ndc.y * 0.5 + 0.5) * container.clientHeight;

    m.label.style.transform = `translate(${x}px, ${y}px) translate(-50%, -150%)`;
    m.label.style.opacity = facing ? 1 : 0;
  }
}

/* =====================================================
   CONTROL MARS WITH CLASSES
   <div id="mars" class="opportunity">       -> turns to Opportunity
   <div id="mars" class="spirit still">      -> turns to Spirit, no spinning
   <div id="mars">                           -> spins freely
===================================================== */
function applyClasses() {
  const classes = [...container.classList].map((c) => c.toLowerCase());

  const key = ROVER_KEYS.find((k) => classes.includes(k)) ?? null;
  activeKey = key;

  focusAngle = key
    ? -THREE.MathUtils.degToRad(ROVERS[key].lon + LON_OFFSET)
    : null;

  paused = classes.includes("still");
  showLabels = !classes.includes("no-labels");
  showDots = !classes.includes("no-dots");
  focusOnly = classes.includes("focus-only");

  document
    .querySelectorAll(".rover")
    .forEach((b) => b.classList.toggle("active", b.dataset.rover === key));
}
new MutationObserver(applyClasses).observe(container, {
  attributes: true,
  attributeFilter: ["class"],
});
applyClasses(); // apply the classes written in the HTML

/* =====================================================
   ANIMATION LOOP
===================================================== */
const clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.1); // avoid jumps after tab switches

  if (focusAngle !== null) {
    // shortest way round, eased
    let diff = focusAngle - spin.rotation.y;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    spin.rotation.y += diff * Math.min(1, dt * 4);
  } else if (!paused) {
    spin.rotation.y += dt * SPEED;
  }

  controls.update();
  renderer.render(scene, camera);
  updateLabels();
});

/* =====================================================
   UI: START BUTTON + ROVER MENU
===================================================== */
const clickSound = new Audio("../soundEffects/BtnClickSoundEffect.mp3"); // optional: remove if you have no sound
clickSound.volume = 0.5;

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}

// start: hides the title and button, shrinks Mars, shows the menu (all CSS)
document.getElementById("start").addEventListener("click", () => {
  playClick();
  app.classList.add("explore");
  container.classList.remove("no-labels");
  container.classList.remove("no-dots");
});

/* =====================================================
   OPTIONAL HELPERS (use from the console or your own code)
===================================================== */
window.mars = {
  show: (key) => {
    ROVER_KEYS.forEach((k) => container.classList.remove(k));
    if (key) container.classList.add(key);
  },
  still: (on = true) => container.classList.toggle("still", on),
  labels: (on = true) => container.classList.toggle("no-labels", !on),
  dots: (on = true) => container.classList.toggle("no-dots", !on),
  only: (on = true) => container.classList.toggle("focus-only", on),
  back: () => app.classList.remove("explore"),
};
