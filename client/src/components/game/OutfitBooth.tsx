import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useGame, GameWorld } from "@/lib/stores/useGame";

interface OutfitBoothProps {
  position: [number, number, number];
  playerPosition: THREE.Vector3;
  world: GameWorld;
}

export function OutfitBooth({ position, playerPosition, world }: Readonly<OutfitBoothProps>) {
  const [isNear, setIsNear] = useState(false);
  const nearRef = useRef(false);
  const posVec = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const signRef = useRef<THREE.Mesh>(null);
  const openShop = useGame((s) => s.openShop);
  const shopOpen = useGame((s) => s.shopOpen);

  useFrame((state) => {
    const dist = playerPosition.distanceTo(posVec.current);
    const near = dist < 4;
    if (near !== nearRef.current) {
      nearRef.current = near;
      setIsNear(near);
    }
    if (signRef.current) {
      const mat = signRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "KeyE" && nearRef.current && !useGame.getState().shopOpen && !useGame.getState().activeDialogue && !useGame.getState().world2Dialogue && !useGame.getState().world3Dialogue) {
        openShop(world);
      }
    };
    globalThis.addEventListener("keydown", handleKey);
    return () => globalThis.removeEventListener("keydown", handleKey);
  }, [openShop, world]);

  const accentColorMap: Record<string, string> = { town: "#ff6d00", ocean: "#00897b" };
  const accentColor = accentColorMap[world] ?? "#757575";

  return (
    <group position={position}>
      <mesh position={[-1.2, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 2.4, 6]} />
        <meshStandardMaterial color="#8b6914" />
      </mesh>
      <mesh position={[1.2, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 2.4, 6]} />
        <meshStandardMaterial color="#8b6914" />
      </mesh>

      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[3, 0.15, 2]} />
        <meshStandardMaterial color="#a0522d" />
      </mesh>
      <mesh position={[0, 2.6, -0.3]} castShadow>
        <boxGeometry args={[3.2, 0.1, 1.2]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      <mesh position={[0, 0.5, 0.3]} castShadow>
        <boxGeometry args={[2.6, 1, 1.2]} />
        <meshStandardMaterial color="#deb887" />
      </mesh>

      <mesh ref={signRef} position={[0, 3, 0.2]}>
        <boxGeometry args={[2.2, 0.6, 0.08]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.3} />
      </mesh>

      <Text
        position={[0, 3, 0.26]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        fontWeight="bold"
      >
        OUTFIT SHOP
      </Text>

      <mesh position={[-0.6, 1.3, 0.5]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.08]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
      <mesh position={[0, 1.3, 0.5]} castShadow>
        <boxGeometry args={[0.35, 0.6, 0.08]} />
        <meshStandardMaterial color={{ ocean: "#1a3a5c", factory: "#2c3e6b" }[world] ?? "#c2b280"} />
      </mesh>
      <mesh position={[0.6, 1.3, 0.5]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.08]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      {isNear && !shopOpen && (
        <Text
          position={[0, 3.8, 0]}
          fontSize={0.25}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Press E to shop
        </Text>
      )}

      <pointLight position={[0, 2.8, 1]} color={accentColor} intensity={3} distance={6} />
    </group>
  );
}
