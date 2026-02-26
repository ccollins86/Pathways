import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

interface PortalProps {
  position: [number, number, number];
  playerPosition: THREE.Vector3;
  onEnter: () => void;
}

export function Portal({ position, playerPosition, onEnter }: PortalProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const hasEntered = useRef(false);

  const particlePositions = useMemo(() => {
    const count = 60;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 1.8 + Math.random() * 0.8;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 2.5 + Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return positions;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.5;
    }

    if (innerRef.current) {
      const mat = innerRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.4 + Math.sin(t * 2) * 0.15;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.z = -t * 0.3;
      const mat = particlesRef.current.material as THREE.PointsMaterial;
      mat.opacity = 0.5 + Math.sin(t * 3) * 0.3;
    }

    const dx = playerPosition.x - position[0];
    const dz = playerPosition.z - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 2.5 && !hasEntered.current) {
      hasEntered.current = true;
      onEnter();
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh ref={ringRef} position={[0, 2.5, 0]}>
        <torusGeometry args={[2, 0.15, 16, 48]} />
        <meshStandardMaterial
          color="#7c4dff"
          emissive="#7c4dff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={innerRef} position={[0, 2.5, 0]}>
        <circleGeometry args={[1.85, 32]} />
        <meshStandardMaterial
          color="#b388ff"
          emissive="#651fff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 2.5, -0.01]}>
        <circleGeometry args={[1.85, 32]} />
        <meshStandardMaterial
          color="#b388ff"
          emissive="#651fff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#e040fb"
          size={0.12}
          transparent
          opacity={0.7}
          sizeAttenuation
        />
      </points>

      <pointLight
        position={[0, 2.5, 1]}
        color="#7c4dff"
        intensity={8}
        distance={12}
      />
      <pointLight
        position={[0, 2.5, -1]}
        color="#e040fb"
        intensity={5}
        distance={10}
      />

      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2.5, 32]} />
        <meshStandardMaterial
          color="#7c4dff"
          emissive="#7c4dff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>

      <Text
        position={[0, 5.2, 0]}
        fontSize={0.5}
        color="#e040fb"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        Enter Portal
      </Text>
    </group>
  );
}
