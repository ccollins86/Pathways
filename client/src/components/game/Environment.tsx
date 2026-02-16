import { useMemo } from "react";
import * as THREE from "three";
import { HOUSE_POS } from "./House";

interface TreeProps {
  position: [number, number, number];
}

function Tree({ position }: TreeProps) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 3, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[1.2, 2.5, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  );
}

function Bush({ position }: TreeProps) {
  return (
    <mesh position={[position[0], 0.4, position[2]]} castShadow>
      <sphereGeometry args={[0.5, 8, 8]} />
      <meshStandardMaterial color="#2E8B57" />
    </mesh>
  );
}

function Rock({ position }: TreeProps) {
  return (
    <mesh position={[position[0], 0.25, position[2]]} castShadow>
      <dodecahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial color="#808080" roughness={0.9} />
    </mesh>
  );
}

function Road() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
      <planeGeometry args={[4, 40]} />
      <meshStandardMaterial color="#555555" />
    </mesh>
  );
}

function Path() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
      <planeGeometry args={[40, 3]} />
      <meshStandardMaterial color="#666666" />
    </mesh>
  );
}

export function Environment() {
  const trees = useMemo(() => {
    const positions: [number, number, number][] = [];
    const count = 30;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 15 + (i % 5) * 4;
      const x = Math.cos(angle) * radius + (((i * 7) % 5) - 2);
      const z = Math.sin(angle) * radius + (((i * 13) % 5) - 2);
      const distToHouse = Math.sqrt(
        (x - HOUSE_POS[0]) ** 2 + (z - HOUSE_POS[2]) ** 2
      );
      if (distToHouse > 12) {
        positions.push([x, 0, z]);
      }
    }
    return positions;
  }, []);

  const bushes = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 15; i++) {
      const x = ((i * 17 + 5) % 30) - 15;
      const z = ((i * 23 + 3) % 30) - 15;
      const distToHouse = Math.sqrt(
        (x - HOUSE_POS[0]) ** 2 + (z - HOUSE_POS[2]) ** 2
      );
      if (Math.abs(x) > 3 && Math.abs(z) > 3 && distToHouse > 12) {
        positions.push([x, 0, z]);
      }
    }
    return positions;
  }, []);

  const rocks = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 10; i++) {
      const x = ((i * 19 + 7) % 24) - 12;
      const z = ((i * 29 + 11) % 24) - 12;
      if (Math.abs(x) > 3 && Math.abs(z) > 3) {
        positions.push([x, 0, z]);
      }
    }
    return positions;
  }, []);

  return (
    <>
      <Road />
      <Path />
      {trees.map((pos, i) => (
        <Tree key={`tree-${i}`} position={pos} />
      ))}
      {bushes.map((pos, i) => (
        <Bush key={`bush-${i}`} position={pos} />
      ))}
      {rocks.map((pos, i) => (
        <Rock key={`rock-${i}`} position={pos} />
      ))}
    </>
  );
}
