import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const loader = new GLTFLoader();
const rad = THREE.MathUtils.degToRad;

/* load a model, center it, rotate it, and scale its largest side to `size` */
function loadNormalized(src, size, rotation = [0, 0, 0]) {
  return new Promise((resolve, reject) => {
    loader.load(src, (gltf) => {
      const model = gltf.scene;
      const c = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
      model.position.sub(c);

      const pivot = new THREE.Group();
      pivot.add(model);
      pivot.rotation.set(rad(rotation[0]), rad(rotation[1]), rad(rotation[2]));
      pivot.updateMatrixWorld(true);

      const dims = new THREE.Box3().setFromObject(pivot).getSize(new THREE.Vector3());
      const k = size / Math.max(dims.x, dims.y, dims.z);

      const group = new THREE.Group();
      group.add(pivot);
      group.scale.setScalar(k);
      resolve({ group, dims: dims.multiplyScalar(k) });
    }, undefined, reject);
  });
}

export async function createRocketPuzzle(container, opts = {}) {
  const {
    rocketSrc,
    payloadSrc,
    rocketSize = 4.4,
    payloadSize = 1.3,
    rocketRotation = [0, 0, 0],   // use this if the rocket loads lying down
    payloadRotation = [0, 0, 0],
    snapDistance = 0.9,           // how close counts as "on top"
    onComplete = () => {},
  } = opts;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.cssText = "display:block;width:100%;height:100%;cursor:grab;touch-action:none;";
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

  const [rocket, payload] = await Promise.all([
    loadNormalized(rocketSrc, rocketSize, rocketRotation),
    loadNormalized(payloadSrc, payloadSize, payloadRotation),
  ]);

  // rocket on the left, payload parked on the right
  rocket.group.position.set(-0.9, 0, 0);
  payload.group.position.set(1.5, -1.3, 0);
  scene.add(rocket.group, payload.group);

  // pulsing ring that marks where the payload goes
  const target = new THREE.Vector3(
    rocket.group.position.x,
    rocket.dims.y / 2 + payload.dims.y / 2,
    0
  );
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.58, 48),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 })
  );
  ring.position.copy(target);
  scene.add(ring);

  /* ---------- drag ---------- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // the z = 0 plane
  const hit = new THREE.Vector3();
  const offset = new THREE.Vector3();
  let dragging = false;
  let done = false;

  function aim(e) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  }

  renderer.domElement.addEventListener("pointerdown", (e) => {
    if (done) return;
    aim(e);
    if (!ray.intersectObject(payload.group, true).length) return;
    ray.ray.intersectPlane(plane, hit);
    offset.copy(payload.group.position).sub(hit);
    dragging = true;
    renderer.domElement.setPointerCapture(e.pointerId);
    renderer.domElement.style.cursor = "grabbing";
  });

  renderer.domElement.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    aim(e);
    if (ray.ray.intersectPlane(plane, hit)) {
      payload.group.position.copy(hit).add(offset);
    }
  });

  function release() {
    if (!dragging) return;
    dragging = false;
    renderer.domElement.style.cursor = "grab";

    if (payload.group.position.distanceTo(target) < snapDistance) {
      done = true;
      payload.group.visible = false;   // disappears instantly
      ring.visible = false;
      onComplete();
    }
  }
  renderer.domElement.addEventListener("pointerup", release);
  renderer.domElement.addEventListener("pointercancel", release);

  /* ---------- size + loop ---------- */
  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
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