import { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useGame, ItemType } from "@/lib/stores/useGame";

interface InteractionTargetProps {
  position: [number, number, number];
  label: string;
  requiredItem: ItemType;
  interactRadius?: number;
  playerPosition: THREE.Vector3;
  onUse: () => void;
  onWrongUse?: () => void;
  completed: boolean;
  completedLabel?: string;
}

export function InteractionTarget({
  position,
  label,
  requiredItem,
  interactRadius = 3,
  playerPosition,
  onUse,
  onWrongUse,
  completed,
  completedLabel,
}: InteractionTargetProps) {
  const [isNear, setIsNear] = useState(false);
  const carriedItem = useGame((s) => s.carriedItem);
  const activeDialogue = useGame((s) => s.activeDialogue);
  const hasCorrectItem = carriedItem?.type === requiredItem;
  const hasAnyItem = carriedItem !== null;

  useFrame(() => {
    if (completed) return;
    const targetPos = new THREE.Vector3(...position);
    const dist = targetPos.distanceTo(playerPosition);
    setIsNear(dist < interactRadius);
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (
        (e.key === "e" || e.key === "E") &&
        isNear &&
        hasAnyItem &&
        !completed &&
        !activeDialogue
      ) {
        if (hasCorrectItem) {
          onUse();
        } else if (onWrongUse) {
          onWrongUse();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isNear, hasCorrectItem, hasAnyItem, completed, activeDialogue, onUse, onWrongUse]);

  if (completed) {
    return completedLabel ? (
      <Text
        position={[position[0], position[1] + 0.5, position[2]]}
        fontSize={0.18}
        color="#66bb6a"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {completedLabel}
      </Text>
    ) : null;
  }

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], 0.03, position[2]]}>
        <ringGeometry args={[interactRadius - 0.15, interactRadius, 32]} />
        <meshBasicMaterial
          color={isNear && hasCorrectItem ? "#66bb6a" : isNear && hasAnyItem ? "#ff9800" : isNear ? "#ff9800" : "#ffffff"}
          transparent
          opacity={isNear ? 0.3 : 0.1}
        />
      </mesh>

      {isNear && (
        <Text
          position={[position[0], position[1] + 0.8, position[2]]}
          fontSize={0.18}
          color={hasCorrectItem ? "#66bb6a" : hasAnyItem ? "#ff9800" : "#aaaaaa"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {hasAnyItem
            ? `Press E to ${label}`
            : `Need: ${ITEM_LABELS[requiredItem]}`}
        </Text>
      )}
    </group>
  );
}

const ITEM_LABELS: Record<ItemType, string> = {
  sandbag: "Sandbag",
  wood_board: "Wood Board",
  flame_retardant: "Flame Retardant",
  rake: "Rake",
  safety_strap: "Safety Strap",
  book: "Book",
};
