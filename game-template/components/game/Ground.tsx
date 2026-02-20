import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Ground() {
  const grassTexture = useTexture("/textures/grass.png");
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(20, 20);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial map={grassTexture} />
    </mesh>
  );
}
