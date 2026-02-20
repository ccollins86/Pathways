import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

interface FollowCameraProps {
  playerPosition: THREE.Vector3;
}

export function FollowCamera({ playerPosition }: FollowCameraProps) {
  const { camera } = useThree();
  const offset = useRef(new THREE.Vector3(0, 10, 12));
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    target.current.copy(playerPosition).add(offset.current);
    camera.position.lerp(target.current, 0.05);
    camera.lookAt(playerPosition.x, playerPosition.y + 1, playerPosition.z);
  });

  return null;
}
