import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/lib/stores/useGame";

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
  const dropItem = useGame((s) => s.dropItem);
  const activeDialogue = useGame((s) => s.activeDialogue);
  const currentWorld = useGame((s) => s.currentWorld);
  const hasDivingSuit = useGame((s) => s.hasDivingSuit);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === "q" || e.key === "Q") && !activeDialogue) {
        dropItem();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [dropItem, activeDialogue]);

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

    const bounds = currentWorld === "ocean" ? 80 : 45;
    const minZ = currentWorld === "ocean" ? -75 : -bounds;
    groupRef.current.position.x = Math.max(-bounds, Math.min(bounds, groupRef.current.position.x));
    groupRef.current.position.z = Math.max(minZ, Math.min(bounds, groupRef.current.position.z));

    if (currentWorld === "ocean") {
      const waterLine = -5;
      if (groupRef.current.position.z < waterLine) {
        if (!hasDivingSuit) {
          groupRef.current.position.z = waterLine;
        } else {
          const depth = Math.abs(groupRef.current.position.z - waterLine);
          groupRef.current.position.y = -depth * 0.08;
        }
      } else {
        groupRef.current.position.y = 0;
      }
    }

    onPositionUpdate(groupRef.current.position.clone());
  });

  const inWater = currentWorld === "ocean" && hasDivingSuit;

  return (
    <group ref={groupRef} position={[0, 0, 5]}>
      <mesh position={[-0.2, 0.4, 0]} castShadow>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshStandardMaterial color={inWater ? "#1a1a1a" : "#1a237e"} />
      </mesh>
      <mesh position={[0.2, 0.4, 0]} castShadow>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshStandardMaterial color={inWater ? "#1a1a1a" : "#1a237e"} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.35]} />
        <meshStandardMaterial color={inWater ? "#263238" : "#4caf50"} />
      </mesh>
      <mesh position={[-0.45, 1.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color={inWater ? "#263238" : "#4caf50"} />
      </mesh>
      <mesh position={[0.45, 1.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color={inWater ? "#263238" : "#4caf50"} />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color={inWater ? "#37474f" : "#ffcc80"} />
      </mesh>
      {inWater && (
        <>
          <mesh position={[0, 1.75, 0.15]}>
            <boxGeometry args={[0.35, 0.25, 0.08]} />
            <meshStandardMaterial color="#81d4fa" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 1.1, -0.22]}>
            <cylinderGeometry args={[0.12, 0.12, 0.5, 8]} />
            <meshStandardMaterial color="#ffb300" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[-0.2, 0.05, 0]}>
            <boxGeometry args={[0.3, 0.06, 0.12]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0.2, 0.05, 0]}>
            <boxGeometry args={[0.3, 0.06, 0.12]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </>
      )}
    </group>
  );
}
