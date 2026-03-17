import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/lib/stores/useGame";
import { HOUSE_POS } from "./House";

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
  const smoothY = useRef(0);
  const speed = 8;
  const dropItem = useGame((s) => s.dropItem);
  const activeDialogue = useGame((s) => s.activeDialogue);
  const currentWorld = useGame((s) => s.currentWorld);
  const hasDivingSuit = useGame((s) => s.hasDivingSuit);
  const inBoat = useGame((s) => s.inBoat);
  const respawnTrigger = useGame((s) => s.respawnTrigger);

  useEffect(() => {
    if (respawnTrigger > 0 && groupRef.current) {
      groupRef.current.position.set(HOUSE_POS[0] + 3, 0, HOUSE_POS[2] + 3);
      onPositionUpdate(groupRef.current.position.clone());
    }
  }, [respawnTrigger]);

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

    const currentSpeed = inBoat ? 12 : speed;

    if (direction.length() > 0) {
      direction.normalize();
      groupRef.current.position.x += direction.x * currentSpeed * delta;
      groupRef.current.position.z += direction.z * currentSpeed * delta;

      const angle = Math.atan2(direction.x, direction.z);
      groupRef.current.rotation.y = angle + Math.PI;
    }

    const bounds = currentWorld === "ocean" ? 80 : currentWorld === "factory" ? 28 : 45;
    const minZ = currentWorld === "ocean" ? -75 : -bounds;
    groupRef.current.position.x = Math.max(-bounds, Math.min(bounds, groupRef.current.position.x));
    groupRef.current.position.z = Math.max(minZ, Math.min(bounds, groupRef.current.position.z));

    if (currentWorld === "ocean") {
      let targetY = 0;
      if (inBoat) {
        targetY = 0.3;
        if (groupRef.current.position.z > -2) {
          groupRef.current.position.z = -2;
        }
      } else {
        const waterLine = -5;
        if (groupRef.current.position.z < waterLine) {
          if (!hasDivingSuit) {
            groupRef.current.position.z = waterLine;
          } else {
            const depth = Math.abs(groupRef.current.position.z - waterLine);
            targetY = -depth * 0.08;
          }
        }
      }
      smoothY.current += (targetY - smoothY.current) * Math.min(1, delta * 5);
      groupRef.current.position.y = smoothY.current;
    }

    onPositionUpdate(groupRef.current.position.clone());
  });

  const inWater = currentWorld === "ocean" && hasDivingSuit && !inBoat;

  if (inBoat) {
    return (
      <group ref={groupRef} position={[0, 0, 5]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.5, 0.4, 4]} />
          <meshStandardMaterial color="#5d4037" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.3, -1.8]} castShadow>
          <boxGeometry args={[2.5, 0.6, 0.15]} />
          <meshStandardMaterial color="#4e342e" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.3, 1.8]} castShadow>
          <boxGeometry args={[2.5, 0.6, 0.15]} />
          <meshStandardMaterial color="#4e342e" roughness={0.8} />
        </mesh>
        <mesh position={[-1.2, 0.3, 0]} castShadow>
          <boxGeometry args={[0.15, 0.6, 4]} />
          <meshStandardMaterial color="#4e342e" roughness={0.8} />
        </mesh>
        <mesh position={[1.2, 0.3, 0]} castShadow>
          <boxGeometry args={[0.15, 0.6, 4]} />
          <meshStandardMaterial color="#4e342e" roughness={0.8} />
        </mesh>

        <mesh position={[1.3, 0.6, -1.2]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
          <meshStandardMaterial color="#78909c" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[1.3, 1.2, -1.2]} rotation={[0, 0, -0.3]} castShadow>
          <cylinderGeometry args={[0.06, 0.15, 1.5, 8]} />
          <meshStandardMaterial color="#546e7a" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[1.8, 1.5, -1.2]} rotation={[0, 0, -1.2]} castShadow>
          <cylinderGeometry args={[0.25, 0.08, 0.6, 10]} />
          <meshStandardMaterial color="#455a64" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[2.1, 1.6, -1.2]} rotation={[0, 0, -1.2]}>
          <torusGeometry args={[0.28, 0.04, 8, 16]} />
          <meshStandardMaterial color="#37474f" metalness={0.7} roughness={0.2} />
        </mesh>

        <mesh position={[0, 0.7, 0.8]} castShadow>
          <boxGeometry args={[0.4, 0.5, 0.3]} />
          <meshStandardMaterial color="#263238" />
        </mesh>
        <mesh position={[0, 1.2, 0.8]} castShadow>
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshStandardMaterial color="#37474f" />
        </mesh>
        <mesh position={[0, 1.2, 0.95]}>
          <boxGeometry args={[0.3, 0.2, 0.06]} />
          <meshStandardMaterial color="#81d4fa" transparent opacity={0.6} />
        </mesh>

        <mesh position={[-0.6, 0.4, -0.5]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, 0.5, 8]} />
          <meshStandardMaterial color="#e53935" roughness={0.6} />
        </mesh>
      </group>
    );
  }

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
