import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

interface PlayerProps {
  onPositionUpdate: (pos: THREE.Vector3) => void;
}

export function Player({ onPositionUpdate }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls<Controls>();
  const speed = 8;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const { forward, back, left, right } = getKeys();
    const direction = new THREE.Vector3();

    if (forward) direction.z -= 1;
    if (back) direction.z += 1;
    if (left) direction.x -= 1;
    if (right) direction.x += 1;

    if (direction.length() > 0) {
      direction.normalize();
      groupRef.current.position.x += direction.x * speed * delta;
      groupRef.current.position.z += direction.z * speed * delta;

      const angle = Math.atan2(direction.x, direction.z);
      groupRef.current.rotation.y = angle + Math.PI;
    }

    const bounds = 45;
    groupRef.current.position.x = Math.max(-bounds, Math.min(bounds, groupRef.current.position.x));
    groupRef.current.position.z = Math.max(-bounds, Math.min(bounds, groupRef.current.position.z));

    onPositionUpdate(groupRef.current.position.clone());
  });

  return (
    <group ref={groupRef} position={[0, 0, 5]}>
      {/* Legs */}
      <mesh position={[-0.2, 0.4, 0]} castShadow>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshStandardMaterial color="#1a237e" />
      </mesh>
      <mesh position={[0.2, 0.4, 0]} castShadow>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshStandardMaterial color="#1a237e" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.35]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.45, 1.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
      <mesh position={[0.45, 1.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#ffcc80" />
      </mesh>
    </group>
  );
}
