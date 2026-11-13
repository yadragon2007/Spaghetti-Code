import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const loader = new GLTFLoader();
const rad = THREE.MathUtils.degToRad;

export function createViewer(container, src, opts = {}) {
  const {
    rotate = false,     // true = spins
    speed = 0.35,       // radians per second
    elevation = 25,     // degrees above the horizon
    azimuth = 40,       // degrees around the model
    distance = 3.6,     // smaller = bigger model
    fov = 45,
    headLight = 3,      // light that follows the camera
    studio = 1.5,       // metal reflections
    ambient = 0.6,
    tilt = [0, 0, 0],   // static orientation in degrees
  } = opts;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);          // transparent
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);

  // camera position from angles
  const az = rad(azimuth), el = rad(elevation);
  camera.position.set(
    distance * Math.cos(el) * Math.sin(az),
    distance * Math.sin(el),
    distance * Math.cos(el) * Math.cos(az)
  );
  camera.lookAt(0, 0, 0);

  // lights: ambient + a light attached to the camera
  scene.add(new THREE.AmbientLight(0xffffff, ambient));
  const head = new THREE.DirectionalLight(0xffffff, headLight);
  head.position.set(0, 1, 0);
  camera.add(head);
  scene.add(camera);

  // local environment for reflections on metal
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const pivot = new THREE.Group();              // spins
  pivot.rotation.set(rad(tilt[0]), rad(tilt[1]), rad(tilt[2]));
  const spin = new THREE.Group();
  pivot.add(spin);
  scene.add(pivot);

  let visible = true;
  let raf = 0;
  const clock = new THREE.Clock();

  const render = () => renderer.render(scene, camera);

  function loop() {
    raf = 0;
    if (!visible) return;
    spin.rotation.y += Math.min(clock.getDelta(), 0.1) * speed;
    render();
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (rotate && visible && !raf) { clock.getDelta(); raf = requestAnimationFrame(loop); }
    else render();
  }

  loader.load(src, (gltf) => {
    const model = gltf.scene;
    model.traverse((o) => {
      if (o.isMesh && o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => { if ("envMapIntensity" in m) m.envMapIntensity = studio; });
      }
    });

    // center and normalize the size (largest side = 2 units)
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    spin.scale.setScalar(2 / Math.max(size.x, size.y, size.z));
    spin.add(model);
    start();
  }, undefined, (e) => console.error("Could not load " + src, e));

  // follow the container size
  new ResizeObserver(() => {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    render();
  }).observe(container);

  // don't render slides that are scrolled out of view
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  }).observe(container);
}