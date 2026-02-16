import * as THREE from "three";
import { useMemo } from "react";

export function Sky() {
  const skyColor = useMemo(() => new THREE.Color("#87ceeb"), []);
  return (
    <>
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={["#87ceeb", 40, 80]} />
    </>
  );
}
