import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useEffect } from "react";

interface FollowCameraProps {
  playerPosition: THREE.Vector3;
}

export function FollowCamera({ playerPosition }: FollowCameraProps) {
  const { camera } = useThree();
  const offset = useRef(new THREE.Vector3(0, 10, 12));
  const target = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  useEffect(() => {
    initialized.current = false;
  }, []);

  useFrame((_, delta) => {
    target.current.copy(playerPosition).add(offset.current);
    const desiredLook = new THREE.Vector3(playerPosition.x, playerPosition.y + 1, playerPosition.z);
    if (!initialized.current) {
      camera.position.copy(target.current);
      lookTarget.current.copy(desiredLook);
      initialized.current = true;
    } else {
      const smoothing = 1 - Math.pow(0.001, delta);
      camera.position.lerp(target.current, smoothing);
      lookTarget.current.lerp(desiredLook, smoothing);
    }
    camera.lookAt(lookTarget.current);
  });

  return null;
}
