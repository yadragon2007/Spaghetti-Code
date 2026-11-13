import { Canvas, useFrame, createPortal } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage, Html } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import "./Mars.css";

export const OPPORTUNITY = { name: "Opportunity", lat: -1.9462, lon: 354.4734 };

// lat/lon (degrees) -> point on the sphere, in the planet mesh's own space
function toPosition(lat, lon, radius, center, lonOffset = 0) {
  const phi = THREE.MathUtils.degToRad(lat);
  const theta = THREE.MathUtils.degToRad(lon + lonOffset);
  return new THREE.Vector3(
    radius * Math.cos(phi) * Math.sin(theta),
    radius * Math.sin(phi),
    radius * Math.cos(phi) * Math.cos(theta),
  ).add(center);
}

function Marker({ lat, lon, name, radius, center, lonOffset, planet }) {
  const pos = useMemo(
    () => toPosition(lat, lon, radius, center, lonOffset),
    [lat, lon, radius, center, lonOffset],
  );
  // label floats slightly above the surface, along the outward direction
  const labelPos = useMemo(
    () => pos.clone().sub(center).multiplyScalar(1.12).add(center),
    [pos, center],
  );

  return (
    <>
      <mesh position={pos}>
        <sphereGeometry args={[radius * 0.02, 16, 16]} />
        <meshBasicMaterial color="#ff3700" />
      </mesh>

      <Html
        position={labelPos}
        center
        occlude={[{ current: planet }]}
        style={{ pointerEvents: "none" }}
      >
        <div className="mars-label">{name}</div>
      </Html>
    </>
  );
}
function MarsModel({ speed, markers, lonOffset }) {
  const { scene } = useGLTF("models/Mars.glb");
  const spinRef = useRef();

  const { model, planet, radius, center, offset } = useMemo(() => {
    // clone so the cached original is never re-parented or shifted
    const model = scene.clone(true);

    // world-space center of the whole model (it has no parent yet)
    const box = new THREE.Box3().setFromObject(model);
    const offset = box.getCenter(new THREE.Vector3()).negate();

    let planet = null;
    model.traverse((o) => {
      if (o.isMesh && !planet) planet = o;
    });
    planet.geometry.computeBoundingSphere();
    const { radius, center } = planet.geometry.boundingSphere;

    return { model, planet, radius, center: center.clone(), offset };
  }, [scene]);

  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += delta * speed;
  });

  return (
    // the spin group's origin is now the planet's center
    <group ref={spinRef}>
      <group position={offset}>
        <primitive object={model} />

        {createPortal(
          <>
            {markers.map((m) => (
              <Marker
                key={m.name}
                {...m}
                radius={radius}
                center={center}
                lonOffset={lonOffset}
                planet={planet}
              />
            ))}
          </>,
          planet,
        )}
      </group>
    </group>
  );
}
export default function Mars({
  width = 300,
  height = 300,
  speed = 0.35,
  interactive = true,
  markers = [],
  lonOffset = 0, // calibration, see notes below
}) {
  return (
    <div style={{ width, height, isolation: "isolate" }}>
      <Canvas
        camera={{ fov: 45, position: [0, 0, 5] }}
        gl={{ alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 3, 5]} intensity={2.5} />

        <Suspense fallback={null}>
          <Stage environment={null} shadows={false} intensity={0} adjustCamera>
            <MarsModel speed={speed} markers={markers} lonOffset={lonOffset} />
          </Stage>
        </Suspense>

        {interactive && (
          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        )}
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/Mars.glb");
