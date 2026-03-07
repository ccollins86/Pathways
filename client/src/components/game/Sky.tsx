import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const speed = useMemo(() => 0.3 + ((position[0] * 7 + position[2] * 3) % 5) * 0.08, [position]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.x += speed * delta;
    if (groupRef.current.position.x > 60) {
      groupRef.current.position.x = -60;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[2.0, 8, 6]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.85} roughness={1} />
      </mesh>
      <mesh position={[1.8, -0.2, 0.3]}>
        <sphereGeometry args={[1.5, 8, 6]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.8} roughness={1} />
      </mesh>
      <mesh position={[-1.5, -0.3, -0.2]}>
        <sphereGeometry args={[1.6, 8, 6]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.8} roughness={1} />
      </mesh>
      <mesh position={[0.6, 0.4, 0.4]}>
        <sphereGeometry args={[1.3, 7, 5]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.75} roughness={1} />
      </mesh>
      <mesh position={[-0.8, 0.3, -0.3]}>
        <sphereGeometry args={[1.2, 7, 5]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.75} roughness={1} />
      </mesh>
    </group>
  );
}

export function Sky() {
  const skyColor = useMemo(() => new THREE.Color("#7ec8e3"), []);

  const clouds = useMemo(() => [
    { pos: [-25, 22, -20] as [number, number, number], scale: 1.2 },
    { pos: [10, 25, -30] as [number, number, number], scale: 0.9 },
    { pos: [-40, 20, -15] as [number, number, number], scale: 1.4 },
    { pos: [30, 23, -25] as [number, number, number], scale: 1.0 },
    { pos: [-10, 26, -35] as [number, number, number], scale: 0.8 },
    { pos: [45, 21, -18] as [number, number, number], scale: 1.1 },
    { pos: [-50, 24, -28] as [number, number, number], scale: 1.3 },
  ], []);

  return (
    <>
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={["#b8dce8", 45, 90]} />
      {clouds.map((c, i) => (
        <Cloud key={i} position={c.pos} scale={c.scale} />
      ))}
    </>
  );
}
