import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface NPCProps {
  name: string;
  position: [number, number, number];
  bodyColor: string;
  shirtColor: string;
  playerPosition: THREE.Vector3;
  interactRadius?: number;
  onInteract: () => void;
  showPrompt?: boolean;
}

export function NPC({
  name,
  position,
  bodyColor,
  shirtColor,
  playerPosition,
  interactRadius = 3,
  onInteract,
  showPrompt = true,
}: NPCProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isNear, setIsNear] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useFrame(() => {
    if (!groupRef.current) return;
    const npcPos = new THREE.Vector3(...position);
    const dist = npcPos.distanceTo(playerPosition);
    setIsNear(dist < interactRadius);

    if (dist < interactRadius) {
      const dir = new THREE.Vector3()
        .subVectors(playerPosition, npcPos)
        .normalize();
      const angle = Math.atan2(dir.x, dir.z);
      groupRef.current.rotation.y = angle;
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "e" || e.key === "E") && isNear) {
        setHasInteracted(true);
        onInteract();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isNear, onInteract]);

  return (
    <group ref={groupRef} position={position}>
      {/* Legs */}
      <mesh position={[-0.2, 0.4, 0]} castShadow>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh position={[0.2, 0.4, 0]} castShadow>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.35]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.45, 1.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      <mesh position={[0.45, 1.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color={shirtColor} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#ffcc80" />
      </mesh>

      {/* Name tag */}
      <Text
        position={[0, 2.3, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {name}
      </Text>

      {/* Interaction prompt */}
      {isNear && showPrompt && (
        <Text
          position={[0, 2.7, 0]}
          fontSize={0.2}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Press E to talk
        </Text>
      )}

      {/* Proximity indicator circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[interactRadius - 0.1, interactRadius, 32]} />
        <meshBasicMaterial
          color={isNear ? "#ffeb3b" : "#ffffff"}
          transparent
          opacity={isNear ? 0.3 : 0.1}
        />
      </mesh>
    </group>
  );
}
