import { Text } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function USCStand() {
  const woodTexture = useTexture("/textures/wood.jpg");
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;

  return (
    <group position={[8, 0, -5]}>
      {/* Table */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[3, 0.1, 1.5]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>
      {/* Table legs */}
      {[[-1.3, 0.4, -0.6], [1.3, 0.4, -0.6], [-1.3, 0.4, 0.6], [1.3, 0.4, 0.6]].map(
        (pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <boxGeometry args={[0.1, 0.8, 0.1]} />
            <meshStandardMaterial map={woodTexture} />
          </mesh>
        )
      )}
      {/* Canopy poles */}
      {[[-1.4, 1.8, -0.7], [1.4, 1.8, -0.7], [-1.4, 1.8, 0.7], [1.4, 1.8, 0.7]].map(
        (pos, i) => (
          <mesh key={`pole-${i}`} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 2.8, 8]} />
            <meshStandardMaterial color="#888888" />
          </mesh>
        )
      )}
      {/* Canopy top */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <boxGeometry args={[3.2, 0.08, 1.8]} />
        <meshStandardMaterial color="#990000" />
      </mesh>
      {/* USC Sign on front */}
      <Text
        position={[0, 2.5, 0.91]}
        fontSize={0.4}
        color="#FFC72C"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#990000"
        fontWeight="bold"
      >
        USC APPAREL
      </Text>
      {/* Items on table - shirt boxes */}
      <mesh position={[-0.8, 0.95, 0]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.4]} />
        <meshStandardMaterial color="#990000" />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.4]} />
        <meshStandardMaterial color="#FFC72C" />
      </mesh>
      <mesh position={[0.8, 0.95, 0]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.4]} />
        <meshStandardMaterial color="#990000" />
      </mesh>
    </group>
  );
}
