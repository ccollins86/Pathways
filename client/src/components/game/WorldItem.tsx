import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useGame, ItemType } from "@/lib/stores/useGame";

interface WorldItemProps {
  itemType: ItemType;
  position: [number, number, number];
  playerPosition: THREE.Vector3;
  pickupRadius?: number;
}

const ITEM_CONFIGS: Record<ItemType, { label: string; color: string; shape: "box" | "cylinder"; size: [number, number, number]; }> = {
  sandbag: { label: "Sandbag", color: "#c2a366", shape: "box", size: [0.5, 0.25, 0.3] },
  wood_board: { label: "Wood Board", color: "#a0522d", shape: "box", size: [0.8, 0.08, 0.3] },
  flame_retardant: { label: "Flame Retardant", color: "#2196F3", shape: "cylinder", size: [0.15, 0.5, 0.15] },
  rake: { label: "Rake", color: "#8B4513", shape: "cylinder", size: [0.06, 1.2, 0.06] },
  safety_strap: { label: "Safety Strap", color: "#ff6600", shape: "box", size: [0.4, 0.15, 0.15] },
  book: { label: "Book", color: "#e74c3c", shape: "box", size: [0.3, 0.25, 0.2] },
};

export function WorldItem({ itemType, position, playerPosition, pickupRadius = 2.5 }: WorldItemProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isNear, setIsNear] = useState(false);
  const [pickedUp, setPickedUp] = useState(false);
  const carriedItem = useGame((s) => s.carriedItem);
  const pickUpItem = useGame((s) => s.pickUpItem);
  const activeDialogue = useGame((s) => s.activeDialogue);
  const prevCarriedRef = useRef<ItemType | null>(null);

  const config = ITEM_CONFIGS[itemType];

  useEffect(() => {
    if (prevCarriedRef.current === itemType && carriedItem === null && pickedUp) {
      setPickedUp(false);
    }
    prevCarriedRef.current = carriedItem;
  }, [carriedItem, itemType, pickedUp]);

  useFrame((_, delta) => {
    if (pickedUp || !groupRef.current) return;
    const itemPos = new THREE.Vector3(...position);
    const dist = itemPos.distanceTo(playerPosition);
    setIsNear(dist < pickupRadius);

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        (e.key === "e" || e.key === "E") &&
        isNear &&
        !pickedUp &&
        !carriedItem &&
        !activeDialogue
      ) {
        setPickedUp(true);
        pickUpItem(itemType);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isNear, pickedUp, carriedItem, activeDialogue, itemType, pickUpItem]);

  if (pickedUp) return null;

  return (
    <group ref={groupRef} position={[position[0], position[1] + 0.3, position[2]]}>
      {config.shape === "box" ? (
        <mesh castShadow>
          <boxGeometry args={config.size} />
          <meshStandardMaterial color={config.color} />
        </mesh>
      ) : (
        <mesh castShadow>
          <cylinderGeometry args={[config.size[0], config.size[0], config.size[1], 8]} />
          <meshStandardMaterial color={config.color} />
        </mesh>
      )}

      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {config.label}
      </Text>

      {isNear && !carriedItem && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.15}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Press E to pick up
        </Text>
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, 0]}>
        <ringGeometry args={[pickupRadius - 0.1, pickupRadius, 32]} />
        <meshBasicMaterial
          color={isNear ? "#ffeb3b" : "#ffffff"}
          transparent
          opacity={isNear ? 0.2 : 0.05}
        />
      </mesh>
    </group>
  );
}
