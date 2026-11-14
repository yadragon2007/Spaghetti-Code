import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const loader = new GLTFLoader();
const rad = THREE.MathUtils.degToRad;

/* load a model, center it, rotate it, and scale its largest side to `size` */
function loadNormalized(src, size, rotation = [0, 0, 0]) {
  return new Promise((resolve, reject) => {
    loader.load(
      src,
      (gltf) => {
        const model = gltf.scene;
        const c = new THREE.Box3()
          .setFromObject(model)
          .getCenter(new THREE.Vector3());
        model.position.sub(c);

        const pivot = new THREE.Group();
        pivot.add(model);
        pivot.rotation.set(
          rad(rotation[0]),
          rad(rotation[1]),
          rad(rotation[2]),
        );
        pivot.updateMatrixWorld(true);

        const dims = new THREE.Box3()
          .setFromObject(pivot)
          .getSize(new THREE.Vector3());
        const k = size / Math.max(dims.x, dims.y, dims.z);

        const group = new THREE.Group();
        group.add(pivot);
        group.scale.setScalar(k);
        resolve({ group, dims: dims.multiplyScalar(k) });
      },
      undefined,
      reject,
    );
  });
}

/* default size and starting spot (x, y) of each model; override any of them from carousel.js */
const DEFAULTS = {
  rocket: { size: 4.6, position: [-1.4, 0] },
  rover: { size: 0.9, position: [1.5, 1.9] },
  capsule: { size: 1.2, position: [1.5, 0.3] },
  stage: { size: 1.4, position: [1.5, -1.6] },
  stageCapsule: { size: 1.9 }, // position is worked out from the stage
};

export async function createRocketPuzzle(container, opts = {}) {
  const {
    models = {},
    sounds = [],
    snapDistance = 0.9,
    onStep = () => {}, // <- add this line
    onComplete = () => {},
  } = opts;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.cssText =
    "display:block;width:100%;height:100%;cursor:grab;touch-action:none;";
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 8);

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.position.set(3, 4, 6);
  scene.add(sun);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  /* ---------- sounds (one per step) ---------- */
  const sfx = sounds.map((src) => {
    if (!src) return null;
    const a = new Audio(src);
    a.volume = 0.6;
    return a;
  });
  function playSound(i) {
    const a = sfx[i];
    if (!a) return;
    a.currentTime = 0;
    a.play().catch(() => {});
  }

  /* ---------- load the five models ---------- */
  const keys = ["rocket", "rover", "capsule", "stage", "stageCapsule"];
  const cfg = (k) => ({ rotation: [0, 0, 0], ...DEFAULTS[k], ...models[k] });
  const loaded = await Promise.all(
    keys.map((k) => loadNormalized(cfg(k).src, cfg(k).size, cfg(k).rotation)),
  );
  const P = Object.fromEntries(keys.map((k, i) => [k, loaded[i]]));

  for (const k of ["rocket", "rover", "capsule", "stage"]) {
    const [x, y] = cfg(k).position;
    P[k].group.position.set(x, y, 0);
    scene.add(P[k].group);
  }

  // the combined model appears where the stage was, with the same bottom edge
  const stagePos = P.stage.group.position;
  P.stageCapsule.group.position.set(
    stagePos.x,
    stagePos.y - P.stage.dims.y / 2 + P.stageCapsule.dims.y / 2,
    0,
  );
  P.stageCapsule.group.visible = false;
  scene.add(P.stageCapsule.group);

  /* ---------- the three steps ---------- */
  const stageTop = stagePos.y + P.stage.dims.y / 2;
  const rocketPos = P.rocket.group.position;
  const rocketTop = rocketPos.y + P.rocket.dims.y / 2;

  const steps = [
    {
      // 1. rover into the capsule
      piece: P.rover,
      target: P.capsule.group.position.clone(),
      ringScale: 0.8,
      done: () => {
        P.rover.group.visible = false;
      },
    },
    {
      // 2. capsule onto the stage
      piece: P.capsule,
      target: new THREE.Vector3(stagePos.x, stageTop + P.capsule.dims.y / 2, 0),
      ringScale: 1.1,
      done: () => {
        P.capsule.group.visible = false;
        P.stage.group.visible = false;
        P.stageCapsule.group.visible = true;
      },
    },
    {
      // 3. stage with capsule onto the top of the rocket
      piece: P.stageCapsule,
      target: new THREE.Vector3(
        rocketPos.x,
        rocketTop + P.stageCapsule.dims.y / 2,
        0,
      ),
      ringScale: 1.4,
      done: () => {
        P.stageCapsule.group.visible = false;
      },
    },
  ];
  let stepIndex = 0;
  let finished = false;

  /* pulsing ring that marks the current target (drawn in front of the models) */
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.58, 48),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      depthTest: false,
    }),
  );
  ring.renderOrder = 10;
  scene.add(ring);

  function showStep(i) {
    const s = steps[i];
    ring.position.set(s.target.x, s.target.y, 1);
    ring.scale.setScalar(s.ringScale);
  }
  showStep(0);

  /* ---------- drag ---------- */
  const LIFT = 0.5; // the piece comes slightly forward while dragged so it doesn't flicker inside other models
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();
  const offset = new THREE.Vector3();
  let dragging = false;

  function aim(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      -((e.clientY - r.top) / r.height) * 2 + 1,
    );
    ray.setFromCamera(ndc, camera);
  }

  renderer.domElement.addEventListener("pointerdown", (e) => {
    if (finished) return;
    aim(e);
    const piece = steps[stepIndex].piece;
    if (!ray.intersectObject(piece.group, true).length) return;
    ray.ray.intersectPlane(plane, hit);
    offset.copy(piece.group.position).sub(hit);
    offset.z = 0;
    dragging = true;
    renderer.domElement.setPointerCapture(e.pointerId);
    renderer.domElement.style.cursor = "grabbing";
  });

  renderer.domElement.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    aim(e);
    if (ray.ray.intersectPlane(plane, hit)) {
      const g = steps[stepIndex].piece.group;
      g.position.copy(hit).add(offset);
      g.position.z = LIFT;
    }
  });

  function release() {
    if (!dragging) return;
    dragging = false;
    renderer.domElement.style.cursor = "grab";

    const step = steps[stepIndex];
    step.piece.group.position.z = 0;

    if (step.piece.group.position.distanceTo(step.target) < snapDistance) {
      playSound(stepIndex); // <- was playSound();
      step.done();
      stepIndex++;

      if (stepIndex >= steps.length) {
        finished = true;
        ring.visible = false;
        onComplete();
      } else {
        showStep(stepIndex);
        onStep(stepIndex);
      }
    }
  }
  renderer.domElement.addEventListener("pointerup", release);
  renderer.domElement.addEventListener("pointercancel", release);

  /* ---------- size + loop ---------- */
  function resize() {
    const w = container.clientWidth,
      h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);
  resize();

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    ring.material.opacity = 0.4 + 0.3 * Math.sin(clock.getElapsedTime() * 3);
    renderer.render(scene, camera);
  });
}
