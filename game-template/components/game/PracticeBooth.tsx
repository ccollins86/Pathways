import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useGame } from "@/lib/stores/useGame";

interface PracticeBoothProps {
  position: [number, number, number];
  playerPosition: THREE.Vector3;
  practiceUnlocked: boolean;
  practiceActive: boolean;
  onInteract: () => void;
}

export function PracticeBooth({ position, playerPosition, practiceUnlocked, practiceActive, onInteract }: PracticeBoothProps) {
  const boothPos = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const [nearBooth, setNearBooth] = useState(false);
  const glowRef = useRef<THREE.Mesh>(null);

  const nearBoothRef = useRef(false);

  useFrame(() => {
    const dist = playerPosition.distanceTo(boothPos.current);
    const isNear = dist < 4;
    if (isNear !== nearBoothRef.current) {
      nearBoothRef.current = isNear;
      setNearBooth(isNear);
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      if (practiceUnlocked) {
        mat.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.3;
      } else {
        mat.emissiveIntensity = 0.1;
      }
    }
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeDialogue = useGame.getState().activeDialogue;
      if (e.code === "KeyE" && nearBooth && practiceUnlocked && !practiceActive && !activeDialogue) {
        onInteract();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nearBooth, practiceUnlocked, practiceActive, onInteract]);

  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[3, 0.1, 3]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      <mesh position={[0, 1.8, -1.4]} castShadow>
        <boxGeometry args={[3, 3.6, 0.15]} />
        <meshStandardMaterial color="#1a237e" />
      </mesh>

      <mesh position={[-1.45, 1.8, 0]} castShadow>
        <boxGeometry args={[0.15, 3.6, 3]} />
        <meshStandardMaterial color="#1a237e" />
      </mesh>

      <mesh position={[1.45, 1.8, 0]} castShadow>
        <boxGeometry args={[0.15, 3.6, 3]} />
        <meshStandardMaterial color="#1a237e" />
      </mesh>

      <mesh position={[0, 3.65, 0]} castShadow>
        <boxGeometry args={[3.2, 0.12, 3.2]} />
        <meshStandardMaterial color="#0d47a1" />
      </mesh>

      <mesh position={[0, 2.2, -1.3]}>
        <boxGeometry args={[2.2, 1.5, 0.05]} />
        <meshStandardMaterial color="#111111" emissive="#0a1a3a" emissiveIntensity={0.3} />
      </mesh>

      <mesh ref={glowRef} position={[0, 2.2, -1.28]}>
        <boxGeometry args={[2.3, 1.6, 0.02]} />
        <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={0.1} transparent opacity={0.3} />
      </mesh>

      <mesh position={[0, 1.1, -0.3]} castShadow>
        <boxGeometry args={[2, 0.08, 1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <mesh position={[0, 1.18, -0.3]}>
        <boxGeometry args={[1.2, 0.04, 0.5]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      <Text
        position={[0, 4.2, 0]}
        fontSize={0.4}
        color={practiceUnlocked ? "#4fc3f7" : "#666666"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
        fontWeight="bold"
      >
        PRACTICE STATION
      </Text>

      {nearBooth && practiceUnlocked && !practiceActive && (
        <Text
          position={[0, 4.7, 0]}
          fontSize={0.3}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Press E to Practice
        </Text>
      )}

      {nearBooth && !practiceUnlocked && (
        <Text
          position={[0, 4.7, 0]}
          fontSize={0.25}
          color="#999999"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Complete the quest first!
        </Text>
      )}

      <Text
        position={[-1.36, 2.5, 0]}
        fontSize={0.25}
        color="#4fc3f7"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {"{ }"}
      </Text>
      <Text
        position={[1.36, 2.5, 0]}
        fontSize={0.25}
        color="#4fc3f7"
        anchorX="center"
        anchorY="middle"
        rotation={[0, -Math.PI / 2, 0]}
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {"if( )"}
      </Text>

      <mesh position={[0, 3.55, 0]}>
        <boxGeometry args={[0.1, 0.04, 2.5]} />
        <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={practiceUnlocked ? 1 : 0.2} />
      </mesh>
    </group>
  );
}
