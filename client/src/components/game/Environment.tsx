import { useMemo } from "react";
import * as THREE from "three";
import { HOUSE_POS } from "./House";

const ROAD_MARGIN = 5;

function isOnRoad(x: number, z: number): boolean {
  return Math.abs(x) < ROAD_MARGIN || Math.abs(z) < ROAD_MARGIN;
}

function PineTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const green = useMemo(() => {
    const greens = ["#1a6b1a", "#228B22", "#2d7a2d", "#1f7a1f"];
    return greens[Math.floor((position[0] * 7 + position[2] * 13) % greens.length + greens.length) % greens.length];
  }, [position]);

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.18, 2.4, 6]} />
        <meshStandardMaterial color="#5D3A1A" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.8, 0]} castShadow>
        <coneGeometry args={[0.6, 1.4, 7]} />
        <meshStandardMaterial color={green} roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.0, 0]} castShadow>
        <coneGeometry args={[0.9, 1.6, 7]} />
        <meshStandardMaterial color={green} roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[1.2, 1.8, 7]} />
        <meshStandardMaterial color={green} roughness={0.8} />
      </mesh>
    </group>
  );
}

function RoundTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const color = useMemo(() => {
    const colors = ["#3a8a3a", "#4a9a3a", "#2d8c4e", "#5aaa3a", "#3b7a2b"];
    return colors[Math.floor((position[0] * 11 + position[2] * 17) % colors.length + colors.length) % colors.length];
  }, [position]);

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 3.6, 6]} />
        <meshStandardMaterial color="#6B3A1A" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.0, 0]} castShadow>
        <sphereGeometry args={[1.6, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[-0.7, 3.5, 0.5]} castShadow>
        <sphereGeometry args={[0.9, 7, 7]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.8, 3.6, -0.4]} castShadow>
        <sphereGeometry args={[0.85, 7, 7]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Bush({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const color = useMemo(() => {
    const colors = ["#2E8B57", "#3a7a4a", "#2a6b3a", "#3d8b5a"];
    return colors[Math.floor((position[0] * 9 + position[2] * 11) % colors.length + colors.length) % colors.length];
  }, [position]);

  return (
    <group position={[position[0], 0, position[2]]} scale={scale}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0.3, 0.3, 0.2]} castShadow>
        <sphereGeometry args={[0.35, 7, 5]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[-0.25, 0.3, -0.15]} castShadow>
        <sphereGeometry args={[0.3, 7, 5]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Rock({ position }: { position: [number, number, number] }) {
  const color = useMemo(() => {
    const colors = ["#7a7a7a", "#8a8580", "#6e6e6e", "#8a7e75"];
    return colors[Math.floor((position[0] * 5 + position[2] * 7) % colors.length + colors.length) % colors.length];
  }, [position]);

  return (
    <group position={[position[0], 0, position[2]]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <dodecahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
      <mesh position={[0.3, 0.12, 0.15]} castShadow>
        <dodecahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color={color} roughness={0.95} />
      </mesh>
    </group>
  );
}

function FlowerPatch({ position }: { position: [number, number, number] }) {
  const flowers = useMemo(() => {
    const allColors = ["#ff6b8a", "#ffb347", "#fff44f", "#ff69b4", "#da70d6", "#ff4444", "#ffa07a", "#ee82ee"];
    const result = [];
    const count = 4 + Math.floor(((position[0] * 3 + position[2] * 7) % 4 + 4) % 4);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + ((position[0] * 5) % 1);
      const r = 0.2 + (((i * 13 + Math.floor(position[0] * 3)) % 5) / 10);
      result.push({
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        color: allColors[Math.floor(((i * 7 + Math.floor(position[2] * 11)) % allColors.length + allColors.length) % allColors.length)],
        stemHeight: 0.15 + (((i * 11) % 5) / 25),
      });
    }
    return result;
  }, [position]);

  return (
    <group position={position}>
      {flowers.map((f, i) => (
        <group key={i} position={[f.x, 0, f.z]}>
          <mesh position={[0, f.stemHeight / 2, 0]}>
            <cylinderGeometry args={[0.01, 0.015, f.stemHeight, 4]} />
            <meshStandardMaterial color="#3a7a2a" />
          </mesh>
          <mesh position={[0, f.stemHeight + 0.04, 0]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color={f.color} emissive={f.color} emissiveIntensity={0.15} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 3, 6]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.05, 0]}>
        <cylinderGeometry args={[0.25, 0.06, 0.15, 8]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial
          color="#fff8e1"
          emissive="#ffe082"
          emissiveIntensity={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>
      <pointLight position={[0, 3.3, 0]} color="#ffe082" intensity={0.4} distance={8} decay={2} />
    </group>
  );
}

function Road() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[5, 42]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.8, 0.015, 0]} receiveShadow>
        <planeGeometry args={[0.8, 42]} />
        <meshStandardMaterial color="#b0a890" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.8, 0.015, 0]} receiveShadow>
        <planeGeometry args={[0.8, 42]} />
        <meshStandardMaterial color="#b0a890" roughness={0.85} />
      </mesh>
      {Array.from({ length: 9 }).map((_, i) => {
        const z = -16 + i * 4;
        if (Math.abs(z) < 3.5) return null;
        return (
          <mesh key={`dash-v-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, z]} receiveShadow>
            <planeGeometry args={[0.12, 1.8]} />
            <meshStandardMaterial color="#e0d8c0" />
          </mesh>
        );
      })}
    </group>
  );
}

function CrossPath() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[42, 4]} />
        <meshStandardMaterial color="#4a4a4a" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, -2.3]} receiveShadow>
        <planeGeometry args={[42, 0.8]} />
        <meshStandardMaterial color="#b0a890" roughness={0.85} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 2.3]} receiveShadow>
        <planeGeometry args={[42, 0.8]} />
        <meshStandardMaterial color="#b0a890" roughness={0.85} />
      </mesh>
      {Array.from({ length: 9 }).map((_, i) => {
        const x = -16 + i * 4;
        if (Math.abs(x) < 4) return null;
        return (
          <mesh key={`dash-h-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 0]} receiveShadow>
            <planeGeometry args={[1.8, 0.12]} />
            <meshStandardMaterial color="#e0d8c0" />
          </mesh>
        );
      })}
    </group>
  );
}

function Fence({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);
  const cx = (start[0] + end[0]) / 2;
  const cz = (start[2] + end[2]) / 2;
  const postCount = Math.max(2, Math.floor(length / 2));

  return (
    <group>
      <mesh position={[cx, 0.35, cz]} rotation={[0, angle, 0]} castShadow>
        <boxGeometry args={[0.06, 0.06, length]} />
        <meshStandardMaterial color="#c4a56a" roughness={0.8} />
      </mesh>
      <mesh position={[cx, 0.55, cz]} rotation={[0, angle, 0]} castShadow>
        <boxGeometry args={[0.06, 0.06, length]} />
        <meshStandardMaterial color="#c4a56a" roughness={0.8} />
      </mesh>
      {Array.from({ length: postCount }).map((_, i) => {
        const t = i / (postCount - 1);
        const px = start[0] + dx * t;
        const pz = start[2] + dz * t;
        return (
          <mesh key={i} position={[px, 0.38, pz]} castShadow>
            <boxGeometry args={[0.1, 0.76, 0.1]} />
            <meshStandardMaterial color="#b8944a" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Environment() {
  const hx = HOUSE_POS[0];
  const hz = HOUSE_POS[2];

  const trees = useMemo(() => {
    const positions: { pos: [number, number, number]; type: "pine" | "round"; scale: number }[] = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 15 + (i % 5) * 4;
      const x = Math.cos(angle) * radius + (((i * 7) % 5) - 2);
      const z = Math.sin(angle) * radius + (((i * 13) % 5) - 2);
      const distToHouse = Math.sqrt((x - hx) ** 2 + (z - hz) ** 2);
      if (distToHouse > 12 && !isOnRoad(x, z)) {
        const type = i % 3 === 0 ? "round" as const : "pine" as const;
        const scale = 0.8 + (((i * 17) % 10) / 25);
        positions.push({ pos: [x, 0, z], type, scale });
      }
    }
    return positions;
  }, []);

  const bushes = useMemo(() => {
    const positions: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 20; i++) {
      const x = ((i * 17 + 5) % 30) - 15;
      const z = ((i * 23 + 3) % 30) - 15;
      const distToHouse = Math.sqrt((x - hx) ** 2 + (z - hz) ** 2);
      if (!isOnRoad(x, z) && distToHouse > 10) {
        const scale = 0.7 + (((i * 13) % 8) / 12);
        positions.push({ pos: [x, 0, z], scale });
      }
    }
    return positions;
  }, []);

  const rocks = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const x = ((i * 19 + 7) % 24) - 12;
      const z = ((i * 29 + 11) % 24) - 12;
      if (!isOnRoad(x, z)) {
        positions.push([x, 0, z]);
      }
    }
    return positions;
  }, []);

  const flowerPatches = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 18; i++) {
      const x = ((i * 23 + 9) % 32) - 16;
      const z = ((i * 31 + 5) % 32) - 16;
      const distToHouse = Math.sqrt((x - hx) ** 2 + (z - hz) ** 2);
      if (!isOnRoad(x, z) && distToHouse > 8) {
        positions.push([x, 0.01, z]);
      }
    }
    return positions;
  }, []);

  const lampPositions: [number, number, number][] = useMemo(() => [
    [3.8, 0, -10],
    [3.8, 0, 10],
    [-3.8, 0, -10],
    [-3.8, 0, 10],
    [10, 0, 3.2],
    [-10, 0, 3.2],
    [10, 0, -3.2],
    [-10, 0, -3.2],
  ], []);

  return (
    <>
      <Road />
      <CrossPath />

      <Fence start={[hx - 7, 0, hz - 5]} end={[hx + 5, 0, hz - 5]} />
      <Fence start={[hx + 5, 0, hz - 5]} end={[hx + 5, 0, hz + 7]} />
      <Fence start={[hx + 5, 0, hz + 7]} end={[hx - 1, 0, hz + 7]} />
      <Fence start={[hx - 4, 0, hz + 7]} end={[hx - 7, 0, hz + 7]} />
      <Fence start={[hx - 7, 0, hz + 7]} end={[hx - 7, 0, hz - 5]} />

      {trees.map((t, i) =>
        t.type === "round"
          ? <RoundTree key={`tree-${i}`} position={t.pos} scale={t.scale} />
          : <PineTree key={`tree-${i}`} position={t.pos} scale={t.scale} />
      )}
      {bushes.map((b, i) => (
        <Bush key={`bush-${i}`} position={b.pos} scale={b.scale} />
      ))}
      {rocks.map((pos, i) => (
        <Rock key={`rock-${i}`} position={pos} />
      ))}
      {flowerPatches.map((pos, i) => (
        <FlowerPatch key={`flower-${i}`} position={pos} />
      ))}
      {lampPositions.map((pos, i) => (
        <StreetLamp key={`lamp-${i}`} position={pos} />
      ))}
    </>
  );
}
