import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Lightformer,
} from "@react-three/drei";
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const rad = THREE.MathUtils.degToRad;

/* ---------- the model: centered, normalized, tilted, spinning ---------- */
function Model({ src, fit, scale, rotate, speed, axis, tilt, onLoad }) {
  const { scene } = useGLTF(src);
  const spinRef = useRef();

  const { model, normScale, offset } = useMemo(() => {
    const model = scene.clone(true);
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // fit: make the largest dimension equal to 2 units
    const normScale = fit ? 2 / Math.max(size.x, size.y, size.z) : 1;
    return { model, normScale, offset: center.negate() };
  }, [scene, fit]);

  useLayoutEffect(() => {
    onLoad?.(model);
  }, [model, onLoad]);

  useFrame((_, delta) => {
    if (rotate && spinRef.current) {
      spinRef.current.rotation[axis] += delta * speed;
    }
  });

  return (
    // static tilt / orientation (degrees)
    <group rotation={tilt.map(rad)}>
      {/* spin happens around the model's center, on the chosen axis */}
      <group ref={spinRef}>
        <group scale={normScale * scale}>
          <group position={offset}>
            <primitive object={model} />
          </group>
        </group>
      </group>
    </group>
  );
}

/* ---------- camera position from angles, updates when props change ---------- */
function CameraRig({ azimuth, elevation, distance, fov }) {
  const { camera, controls, invalidate } = useThree();

  useLayoutEffect(() => {
    const az = rad(azimuth);
    const el = rad(elevation);
    camera.fov = fov;
    camera.position.set(
      distance * Math.cos(el) * Math.sin(az),
      distance * Math.sin(el),
      distance * Math.cos(el) * Math.cos(az),
    );
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    controls?.update();
    invalidate();
  }, [azimuth, elevation, distance, fov, camera, controls, invalidate]);

  return null;
}

/* a light that stays in front of the camera, so the visible side is always lit */
function HeadLight({ intensity, color }) {
  const ref = useRef();
  useFrame(({ camera }) => {
    if (!ref.current) return;
    ref.current.position.copy(camera.position);
    ref.current.position.y += 1; // slightly above the camera
  });
  return <directionalLight ref={ref} intensity={intensity} color={color} />;
}

/* local reflections, no download */
function StudioEnvironment({ intensity }) {
  return (
    <Environment resolution={256}>
      <Lightformer
        form="rect"
        intensity={intensity * 2}
        position={[0, 5, -5]}
        scale={[10, 4, 1]}
      />
      <Lightformer
        form="rect"
        intensity={intensity}
        position={[-5, 1, 2]}
        rotation-y={Math.PI / 2}
        scale={[8, 4, 1]}
      />
      <Lightformer
        form="rect"
        intensity={intensity}
        position={[5, 1, 2]}
        rotation-y={-Math.PI / 2}
        scale={[8, 4, 1]}
      />
      <Lightformer
        form="ring"
        intensity={intensity * 1.5}
        position={[0, 3, 5]}
        scale={4}
      />
    </Environment>
  );
}

/* ---------- the component ---------- */
export default function ModelViewer({
  src, // path to .glb / .gltf (e.g. "/Mars.glb")
  width = 300,
  height = 300,

  // model
  scale = 1, // multiplier on top of auto-fit
  fit = true, // auto center + normalize size
  tilt = [0, 0, 0], // static orientation in degrees [x, y, z]

  // spinning
  rotate = true, // true = spins, false = constant
  speed = 0.35, // radians per second (0.35 is about 20 deg/s)
  axis = "y", // "x" | "y" | "z" (in the tilted space)

  // camera / view angle
  azimuth = 0, // degrees around the model (0 = front)
  elevation = 0, // degrees above the horizon (0 = level, 90 = top view)
  distance = 3.6, // smaller = bigger model
  fov = 45,

  // user interaction
  controls = true, // drag to orbit
  zoom = false,
  pan = false,
  lockVertical = true, // only allow horizontal orbit
  minDistance = 2,
  maxDistance = 8,

  // look
  background = null, // null = transparent, or any CSS color
  ambient = 0.6,
  headLight = 2.5, // light that follows the camera (0 = off)
  lightColor = "#ffffff",
  studio = 1, // metal reflections (0 = off)
  environment = null, // drei preset like "city" (needs internet)

  children, // extra 3D objects inside the scene
  onLoad,
  style,
  className,
}) {
  const polar = Math.PI / 2 - rad(elevation); // OrbitControls measures from the top

  return (
    <div
      style={{ width, height, isolation: "isolate", ...style }}
      className={className}
    >
      <Canvas
        dpr={[1, 2]}
        frameloop={rotate ? "always" : "demand"}
        camera={{ fov, position: [0, 0, distance] }}
        gl={{ alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        {background && <color attach="background" args={[background]} />}

        <ambientLight intensity={ambient} />
        {headLight > 0 && (
          <HeadLight intensity={headLight} color={lightColor} />
        )}
        {studio > 0 && <StudioEnvironment intensity={studio} />}

        <CameraRig
          azimuth={azimuth}
          elevation={elevation}
          distance={distance}
          fov={fov}
        />

        <Suspense fallback={null}>
          {environment && <Environment preset={environment} />}
          <Model
            src={src}
            fit={fit}
            scale={scale}
            rotate={rotate}
            speed={speed}
            axis={axis}
            tilt={tilt}
            onLoad={onLoad}
          />
          {children}
        </Suspense>

        {controls && (
          <OrbitControls
            makeDefault
            enableZoom={zoom}
            enablePan={pan}
            minDistance={minDistance}
            maxDistance={maxDistance}
            minPolarAngle={lockVertical ? polar : 0}
            maxPolarAngle={lockVertical ? polar : Math.PI}
          />
        )}
      </Canvas>
    </div>
  );
}

// optional: ModelViewer.preload("/Mars.glb") outside components
ModelViewer.preload = (src) => useGLTF.preload(src);
