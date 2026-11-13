import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import { Suspense, useRef } from "react";

function MarsModel({ speed }) {
  const { scene } = useGLTF("/models/Mars.glb");
  const spinRef = useRef();

  useFrame((_, delta) => {
    if (spinRef.current) spinRef.current.rotation.y += delta * speed;
  });

  return (
    <group ref={spinRef}>
      <primitive object={scene} />
    </group>
  );
}

export default function Mars({
  width = 300,
  height = 300,
  speed = 0.35,
  interactive = true,
}) {
  return (
    <div style={{ width, height }}>
      <Canvas
        camera={{ fov: 45, position: [0, 0, 5] }}
        gl={{ alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 3, 5]} intensity={2.5} />

        <Suspense fallback={null}>
          <Stage environment={null} shadows={false} intensity={0} adjustCamera>
            <MarsModel speed={speed} />
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