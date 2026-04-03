import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import { Player } from "./Player";
import { FollowCamera } from "./FollowCamera";
import { NPC } from "./NPC";
import { MarineEcosystem } from "./MarineEcosystem";
import { Portal } from "./Portal";
import { useGame, SludgePatch } from "@/lib/stores/useGame";

function Ocean() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.position.y = -0.3 + Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, -40]}>
      <planeGeometry args={[200, 120]} />
      <meshStandardMaterial
        color="#0077be"
        transparent
        opacity={0.5}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
}

function WaterWaves() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = -0.15 + Math.sin(t * 0.8) * 0.08;
      ref.current.position.z = -20 + Math.sin(t * 0.3) * 0.5;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, -20]}>
      <planeGeometry args={[200, 40]} />
      <meshStandardMaterial
        color="#00a0e4"
        transparent
        opacity={0.35}
        roughness={0.1}
        metalness={0.2}
      />
    </mesh>
  );
}

function Beach() {
  const sandTexture = useTexture("/textures/sand.jpg");
  sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
  sandTexture.repeat.set(12, 12);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 15]} receiveShadow>
      <planeGeometry args={[200, 60]} />
      <meshStandardMaterial map={sandTexture} color="#f5deb3" />
    </mesh>
  );
}

function ShorelineWater() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.z = -8 + Math.sin(t * 0.6) * 1.5;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.25 + Math.sin(t * 1.2) * 0.1;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -8]}>
      <planeGeometry args={[200, 8]} />
      <meshStandardMaterial
        color="#87ceeb"
        transparent
        opacity={0.3}
        roughness={0.1}
      />
    </mesh>
  );
}

function BeachBuilding() {
  const woodTexture = useTexture("/textures/wood.jpg");

  return (
    <group position={[8, 0, 10]}>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 3, 5]} />
        <meshStandardMaterial map={woodTexture} color="#deb887" />
      </mesh>

      <mesh position={[0, 4.2, 0]} castShadow>
        <coneGeometry args={[4.5, 2.8, 4]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      <mesh position={[0, 1.2, 2.51]}>
        <boxGeometry args={[1.2, 2, 0.1]} />
        <meshStandardMaterial color="#4a2800" />
      </mesh>

      <mesh position={[0, 1.7, 2.56]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>

      <mesh position={[-2, 2, 2.51]}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>
      <mesh position={[2, 2, 2.51]}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>

      <mesh position={[-2, 2, -2.51]}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>
      <mesh position={[2, 2, -2.51]}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>

      <Text
        position={[0, 3.2, 2.55]}
        fontSize={0.35}
        color="#fff8dc"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#4a2800"
      >
        Beach Station
      </Text>
    </group>
  );
}

function PalmTree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 4, 8]} />
        <meshStandardMaterial color="#8b6914" />
      </mesh>

      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <mesh
            key={i}
            position={[Math.sin(rad) * 1.2, 4.2, Math.cos(rad) * 1.2]}
            rotation={[Math.cos(rad) * 0.6, 0, -Math.sin(rad) * 0.6]}
            castShadow
          >
            <boxGeometry args={[0.6, 0.08, 2.5]} />
            <meshStandardMaterial color="#228b22" />
          </mesh>
        );
      })}

      {[36, 108, 180, 252, 324].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <mesh
            key={`inner-${i}`}
            position={[Math.sin(rad) * 0.8, 4.4, Math.cos(rad) * 0.8]}
            rotation={[Math.cos(rad) * 0.4, 0, -Math.sin(rad) * 0.4]}
            castShadow
          >
            <boxGeometry args={[0.5, 0.08, 1.8]} />
            <meshStandardMaterial color="#2e8b2e" />
          </mesh>
        );
      })}
    </group>
  );
}

function BeachDecor() {
  const items = useMemo(() => {
    const palmPositions: [number, number, number][] = [
      [-12, 0, 20],
      [-6, 0, 25],
      [18, 0, 22],
      [25, 0, 18],
      [-20, 0, 12],
      [30, 0, 10],
      [-15, 0, 8],
      [22, 0, 28],
    ];

    const shellPositions = Array.from({ length: 15 }, (_, i) => ({
      x: (Math.sin(i * 7.3) * 30),
      z: 2 + (Math.cos(i * 4.1) * 8),
      scale: 0.1 + (Math.abs(Math.sin(i * 2.7)) * 0.15),
      color: i % 3 === 0 ? "#fff5ee" : i % 3 === 1 ? "#ffe4c4" : "#ffdab9",
    }));

    const rockPositions = Array.from({ length: 8 }, (_, i) => ({
      x: (Math.sin(i * 5.1) * 35),
      z: Math.max(-2, -5 + (Math.cos(i * 3.7) * 5)),
      scale: 0.3 + (Math.abs(Math.sin(i * 1.9)) * 0.5),
    }));

    return { palmPositions, shellPositions, rockPositions };
  }, []);

  return (
    <group>
      {items.palmPositions.map((pos, i) => (
        <PalmTree key={`palm-${i}`} position={pos} />
      ))}

      {items.shellPositions.map((shell, i) => (
        <mesh key={`shell-${i}`} position={[shell.x, 0.05, shell.z]} rotation={[0, i * 1.3, 0]}>
          <sphereGeometry args={[shell.scale, 6, 4]} />
          <meshStandardMaterial color={shell.color} />
        </mesh>
      ))}

      {items.rockPositions.map((rock, i) => (
        <mesh key={`rock-${i}`} position={[rock.x, rock.scale * 0.3, Math.max(rock.z, -2)]}>
          <dodecahedronGeometry args={[rock.scale, 0]} />
          <meshStandardMaterial color="#808080" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function BeachUmbrella({ position, color, rotation = 0 }: { position: [number, number, number]; color: string; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 3.6, 6]} />
        <meshStandardMaterial color="#deb887" />
      </mesh>
      <mesh position={[0, 3.2, 0]} rotation={[0.1, 0, 0]} castShadow>
        <coneGeometry args={[1.5, 0.6, 8]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 3.18, 0]} rotation={[0.1, Math.PI / 8, 0]}>
        <coneGeometry args={[1.52, 0.05, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0.6, 0.02, 0.3]} rotation={[-Math.PI / 2, 0, rotation + 0.3]}>
        <planeGeometry args={[1.6, 2.2]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} roughness={0.9} />
      </mesh>
    </group>
  );
}

function BeachChair({ position, rotation = 0, fabricColor = "#1565c0" }: { position: [number, number, number]; rotation?: number; fabricColor?: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-0.28, 0.28].map((x, i) => (
        <group key={`frame-${i}`}>
          <mesh position={[x, 0.22, -0.15]} rotation={[-0.15, 0, 0]} castShadow>
            <boxGeometry args={[0.04, 0.04, 1.5]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[x, 0.22, 0.55]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 6]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[x, 0.22, -0.65]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.44, 6]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[x, 0.55, 0.55]} rotation={[-1.0, 0, 0]} castShadow>
            <boxGeometry args={[0.04, 0.04, 0.7]} />
            <meshStandardMaterial color="#c0c0c0" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.25, -0.15]} rotation={[-0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.52, 0.02, 1.4]} />
        <meshStandardMaterial color={fabricColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.6, 0.5]} rotation={[-1.0, 0, 0]} castShadow>
        <boxGeometry args={[0.52, 0.02, 0.65]} />
        <meshStandardMaterial color={fabricColor} roughness={0.9} />
      </mesh>
      {[-0.28, 0.28].map((x, i) => (
        <mesh key={`arm-${i}`} position={[x, 0.38, 0]} castShadow>
          <boxGeometry args={[0.06, 0.03, 0.8]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function LifeguardTower() {
  const woodTexture = useTexture("/textures/wood.jpg");
  return (
    <group position={[25, 0, 8]}>
      {[[-1, 0, -1], [-1, 0, 1], [1, 0, -1], [1, 0, 1]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 2, pos[2]]} castShadow>
          <cylinderGeometry args={[0.1, 0.12, 4, 6]} />
          <meshStandardMaterial map={woodTexture} color="#c19a6b" />
        </mesh>
      ))}
      <mesh position={[0, 3.5, 0]} castShadow>
        <boxGeometry args={[2.5, 0.15, 2.5]} />
        <meshStandardMaterial map={woodTexture} color="#deb887" />
      </mesh>
      <mesh position={[0, 4.2, 0]} castShadow>
        <boxGeometry args={[2.2, 1.2, 2.2]} />
        <meshStandardMaterial map={woodTexture} color="#f5deb3" />
      </mesh>
      <mesh position={[0, 5.2, 0]} castShadow>
        <coneGeometry args={[1.8, 1, 4]} />
        <meshStandardMaterial color="#cc3333" />
      </mesh>
      <mesh position={[0, 4.2, 1.12]}>
        <boxGeometry args={[1.4, 0.8, 0.05]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
      </mesh>
      <mesh position={[0, 3.5, 1.4]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[1.8, 0.08, 0.6]} />
        <meshStandardMaterial map={woodTexture} color="#deb887" />
      </mesh>
      <mesh position={[1.3, 2, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.12, 3.5, 0.5]} />
        <meshStandardMaterial map={woodTexture} color="#deb887" />
      </mesh>
      <Text
        position={[0, 5.8, 0]}
        fontSize={0.2}
        color="#cc3333"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        LIFEGUARD
      </Text>
    </group>
  );
}

function Sandcastle() {
  return (
    <group position={[-3, 0, 3]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.7, 0.5, 12]} />
        <meshStandardMaterial color="#e8d5a3" roughness={0.95} />
      </mesh>
      {[0, 90, 180, 270].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <group key={i}>
            <mesh position={[Math.sin(rad) * 0.5, 0.6, Math.cos(rad) * 0.5]} castShadow>
              <cylinderGeometry args={[0.12, 0.15, 0.4, 8]} />
              <meshStandardMaterial color="#dcc68e" roughness={0.95} />
            </mesh>
            <mesh position={[Math.sin(rad) * 0.5, 0.82, Math.cos(rad) * 0.5]} castShadow>
              <coneGeometry args={[0.14, 0.12, 8]} />
              <meshStandardMaterial color="#d4bc7a" roughness={0.95} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.3, 0.3, 8]} />
        <meshStandardMaterial color="#dcc68e" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.72, 0]} castShadow>
        <coneGeometry args={[0.27, 0.2, 8]} />
        <meshStandardMaterial color="#d4bc7a" roughness={0.95} />
      </mesh>
    </group>
  );
}

function DuneGrass() {
  const tufts = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      x: -65 + (Math.sin(i * 8.7) + 1) * 65,
      z: 22 + Math.abs(Math.sin(i * 3.2)) * 18,
      scale: 0.4 + Math.abs(Math.sin(i * 5.1)) * 0.6,
      rotation: Math.sin(i * 2.3) * 0.3,
    }));
  }, []);

  return (
    <group>
      {tufts.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} rotation={[0, t.rotation, 0]}>
          {[0, 0.4, -0.3, 0.2, -0.5].map((offset, j) => (
            <mesh key={j} position={[offset * t.scale * 0.5, t.scale * 0.4, j * 0.06]} rotation={[offset * 0.15, 0, offset * 0.2]}>
              <boxGeometry args={[0.04, t.scale * 0.8, 0.02]} />
              <meshStandardMaterial color={j % 2 === 0 ? "#7caa2d" : "#9ab857"} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Pier() {
  const woodTexture = useTexture("/textures/wood.jpg");
  return (
    <group position={[-20, 0, 2]}>
      {Array.from({ length: 10 }, (_, i) => (
        <group key={i}>
          <mesh position={[0, 0.6, -i * 2.5]} castShadow>
            <boxGeometry args={[3, 0.15, 2.2]} />
            <meshStandardMaterial map={woodTexture} color="#c19a6b" />
          </mesh>
          {[-1.3, 1.3].map((x, j) => (
            <mesh key={j} position={[x, 0.1, -i * 2.5]}>
              <cylinderGeometry args={[0.08, 0.1, 1.2, 6]} />
              <meshStandardMaterial map={woodTexture} color="#8b7355" />
            </mesh>
          ))}
        </group>
      ))}
      {[-1.4, 1.4].map((x, i) => (
        <mesh key={`rail-${i}`} position={[x, 1.0, -11]}>
          <boxGeometry args={[0.08, 0.6, 24]} />
          <meshStandardMaterial map={woodTexture} color="#a08060" />
        </mesh>
      ))}
      {[-1.4, 1.4].map((x, si) =>
        Array.from({ length: 12 }, (_, i) => (
          <mesh key={`post-${si}-${i}`} position={[x, 0.85, 1 - i * 2]}>
            <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
            <meshStandardMaterial map={woodTexture} color="#8b7355" />
          </mesh>
        ))
      )}
    </group>
  );
}

function Buoy({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.15;
      ref.current.rotation.z = Math.sin(t * 0.6 + position[2]) * 0.1;
      ref.current.rotation.x = Math.sin(t * 0.5 + position[0] * 0.5) * 0.08;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.8, 8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

function FloatingBuoys() {
  const buoys = useMemo(() => [
    { pos: [-15, -0.1, -6] as [number, number, number], color: "#ff4444" },
    { pos: [20, -0.1, -8] as [number, number, number], color: "#ffaa00" },
    { pos: [-25, -0.1, -12] as [number, number, number], color: "#ff4444" },
    { pos: [35, -0.1, -10] as [number, number, number], color: "#ffaa00" },
    { pos: [5, -0.1, -5] as [number, number, number], color: "#ffffff" },
  ], []);

  return (
    <group>
      {buoys.map((b, i) => (
        <Buoy key={i} position={b.pos} color={b.color} />
      ))}
    </group>
  );
}

function Seagull({ position, radius, speed }: { position: [number, number, number]; radius: number; speed: number }) {
  const ref = useRef<THREE.Group>(null);
  const wingRef1 = useRef<THREE.Mesh>(null);
  const wingRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = position[0] + Math.sin(t) * radius;
      ref.current.position.z = position[2] + Math.cos(t) * radius;
      ref.current.position.y = position[1] + Math.sin(t * 1.5) * 0.5;
      ref.current.rotation.y = Math.atan2(Math.cos(t), -Math.sin(t));
    }
    if (wingRef1.current && wingRef2.current) {
      const flapAngle = Math.sin(state.clock.elapsedTime * 6 * speed) * 0.4;
      wingRef1.current.rotation.z = flapAngle;
      wingRef2.current.rotation.z = -flapAngle;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[-0.18, 0.02, 0]}>
        <sphereGeometry args={[0.08, 6, 4]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      <mesh position={[-0.25, 0, 0]} rotation={[0, 0.3, 0]}>
        <coneGeometry args={[0.03, 0.12, 4]} />
        <meshStandardMaterial color="#ff8c00" />
      </mesh>
      <mesh ref={wingRef1} position={[0, 0.05, 0.15]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.4]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>
      <mesh ref={wingRef2} position={[0, 0.05, -0.15]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.35, 0.02, 0.4]} />
        <meshStandardMaterial color="#e8e8e8" />
      </mesh>
      <mesh position={[0.2, 0.02, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.02, 0.12, 0.15]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>
    </group>
  );
}

function Seagulls() {
  const birds = useMemo(() => [
    { pos: [10, 12, 5] as [number, number, number], radius: 8, speed: 0.4 },
    { pos: [-5, 14, 0] as [number, number, number], radius: 12, speed: 0.3 },
    { pos: [20, 11, 10] as [number, number, number], radius: 6, speed: 0.5 },
    { pos: [-15, 13, 8] as [number, number, number], radius: 10, speed: 0.35 },
    { pos: [0, 15, -5] as [number, number, number], radius: 15, speed: 0.25 },
    { pos: [30, 12, 3] as [number, number, number], radius: 7, speed: 0.45 },
  ], []);

  return (
    <group>
      {birds.map((b, i) => (
        <Seagull key={i} position={b.pos} radius={b.radius} speed={b.speed} />
      ))}
    </group>
  );
}

function ShorelineFoam() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.z = -6 + Math.sin(t * 0.6) * 1.5;
    }
  });

  const patches = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      x: -40 + i * 4 + Math.sin(i * 3.1) * 1.5,
      scale: 0.8 + Math.abs(Math.sin(i * 2.3)) * 1.2,
    })), []);

  return (
    <group ref={ref}>
      {patches.map((p, i) => (
        <mesh key={i} position={[p.x, 0.02, 0]} rotation={[-Math.PI / 2, 0, i * 0.7]}>
          <circleGeometry args={[p.scale, 12]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.25}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

const ECOSYSTEM_ZONES: [number, number][] = [
  [-30, -30], [35, -25], [-35, -60], [-30, -75],
];
const ECO_EXCLUSION_RADIUS = 12;

function isNearEcosystem(x: number, z: number): boolean {
  return ECOSYSTEM_ZONES.some(([ex, ez]) => {
    const dx = x - ex;
    const dz = z - ez;
    return dx * dx + dz * dz < ECO_EXCLUSION_RADIUS * ECO_EXCLUSION_RADIUS;
  });
}

function UnderwaterDecor() {
  return (
    <group>
      <BubbleColumns />
    </group>
  );
}


function BubbleColumns() {
  const columns = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      x: -25 + Math.sin(i * 5.7) * 25,
      z: -25 - Math.abs(Math.sin(i * 3.3)) * 30,
    })).filter(c => !isNearEcosystem(c.x, c.z)), []);

  return (
    <group>
      {columns.map((col, ci) => (
        <BubbleColumn key={ci} position={[col.x, -0.5, col.z]} />
      ))}
    </group>
  );
}

function BubbleColumn({ position }: { position: [number, number, number] }) {
  const refs = useRef<THREE.Mesh[]>([]);
  const speeds = useMemo(() => Array.from({ length: 6 }, () => 0.5 + Math.random() * 1), []);
  const offsets = useMemo(() => Array.from({ length: 6 }, () => Math.random() * Math.PI * 2), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((mesh, i) => {
      if (mesh) {
        const y = ((t * speeds[i] + offsets[i]) % 4);
        mesh.position.y = y;
        mesh.position.x = Math.sin(t * 0.5 + offsets[i]) * 0.15;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = 0.6 - y * 0.12;
      }
    });
  });

  return (
    <group position={position}>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) refs.current[i] = el; }}
        >
          <sphereGeometry args={[0.05 + i * 0.01, 8, 6]} />
          <meshStandardMaterial
            color="#b3e5fc"
            emissive="#4fc3f7"
            emissiveIntensity={0.3}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function Driftwood() {
  const pieces = useMemo(() => [
    { x: -10, z: 1, rot: 0.8, scale: 1 },
    { x: 15, z: 3, rot: -0.4, scale: 0.7 },
    { x: -25, z: 2, rot: 1.5, scale: 1.2 },
    { x: 32, z: 0.5, rot: 0.2, scale: 0.9 },
  ], []);

  return (
    <group>
      {pieces.map((d, i) => (
        <group key={i} position={[d.x, 0.08, d.z]} rotation={[0.1, d.rot, 0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.05 * d.scale, 0.08 * d.scale, 1.5 * d.scale, 6]} />
            <meshStandardMaterial color="#8b7355" roughness={0.95} />
          </mesh>
          {i % 2 === 0 && (
            <mesh position={[0.3 * d.scale, 0.03, 0.1]} rotation={[0, 0.8, 0.2]}>
              <cylinderGeometry args={[0.02 * d.scale, 0.04 * d.scale, 0.5 * d.scale, 4]} />
              <meshStandardMaterial color="#7a6548" roughness={0.95} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
}

function TidePool({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[1.2, 16]} />
        <meshStandardMaterial color="#2196f3" transparent opacity={0.5} roughness={0.1} />
      </mesh>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 1.1, 0.08, Math.sin(angle) * 1.1]}>
            <dodecahedronGeometry args={[0.15 + (i % 3) * 0.06, 0]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#78909c" : "#90a4ae"} roughness={0.95} />
          </mesh>
        );
      })}
      {[[-0.3, "#ff7043"], [0.4, "#66bb6a"], [-0.5, "#ab47bc"]].map(([x, color], i) => (
        <mesh key={`star-${i}`} position={[Number(x), 0.03, i * 0.3 - 0.3]} rotation={[-Math.PI / 2, 0, i * 1.5]}>
          <circleGeometry args={[0.08, 5]} />
          <meshStandardMaterial color={color as string} />
        </mesh>
      ))}
    </group>
  );
}

function BeachVolleyballNet({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-2.5, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 1, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2, 6]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>
      ))}
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[5, 1.2, 0.02]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.4} wireframe />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color="#f0d9a0" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}


function Cooler({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.35]} />
        <meshStandardMaterial color="#e53935" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.52, 0.04, 0.37]} />
        <meshStandardMaterial color="#c62828" roughness={0.5} />
      </mesh>
      <mesh position={[0.22, 0.22, 0]}>
        <boxGeometry args={[0.04, 0.08, 0.2]} />
        <meshStandardMaterial color="#bdbdbd" metalness={0.5} />
      </mesh>
    </group>
  );
}

function Jellyfish({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = position[1] + Math.sin(t * 0.4 + position[0]) * 1;
      ref.current.position.x = position[0] + Math.sin(t * 0.2 + position[2]) * 0.5;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.3, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e1bee7" transparent opacity={0.6} emissive="#ce93d8" emissiveIntensity={0.3} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 0.15, -0.3, Math.sin(angle) * 0.15]}>
            <cylinderGeometry args={[0.01, 0.01, 0.6 + (i % 3) * 0.15, 4]} />
            <meshStandardMaterial color="#ce93d8" transparent opacity={0.4} />
          </mesh>
        );
      })}
    </group>
  );
}


function SchoolOfFish({ position, count, color }: { position: [number, number, number]; count: number; color: string }) {
  const ref = useRef<THREE.Group>(null);
  const fishData = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      offset: [(Math.sin(i * 2.3) * 2), (Math.sin(i * 3.7) * 0.5), (Math.cos(i * 1.9) * 2)],
      scale: 0.15 + Math.abs(Math.sin(i * 1.1)) * 0.1,
    })), [count]);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * 0.3;
      ref.current.position.x = position[0] + Math.sin(t) * 8;
      ref.current.position.z = position[2] + Math.cos(t * 0.7) * 5;
      ref.current.rotation.y = Math.atan2(Math.cos(t), -Math.sin(t) * 0.7);
    }
  });

  return (
    <group ref={ref} position={position}>
      {fishData.map((f, i) => (
        <mesh key={i} position={[f.offset[0], f.offset[1], f.offset[2]]} scale={f.scale}>
          <sphereGeometry args={[1, 6, 4]} />
          <meshStandardMaterial color={color} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function BeachExtras() {
  return (
    <group>
      <BeachUmbrella position={[-16, 0, 16]} color="#e53935" rotation={0.5} />
      <BeachUmbrella position={[15, 0, 18]} color="#1e88e5" rotation={-0.3} />
      <BeachUmbrella position={[30, 0, 22]} color="#ffb300" rotation={0.8} />
      <BeachUmbrella position={[-35, 0, 20]} color="#43a047" rotation={0.2} />
      <BeachUmbrella position={[45, 0, 15]} color="#e91e63" rotation={-0.6} />
      <BeachUmbrella position={[-50, 0, 25]} color="#ff7043" rotation={1.1} />
      <BeachUmbrella position={[55, 0, 20]} color="#7b1fa2" rotation={0.4} />

      <BeachChair position={[-15, 0, 17]} rotation={0.6} fabricColor="#1565c0" />
      <BeachChair position={[16, 0, 19]} rotation={-0.2} fabricColor="#e53935" />
      <BeachChair position={[31, 0, 23]} rotation={0.9} fabricColor="#ff8f00" />
      <BeachChair position={[-34, 0, 21]} rotation={0.3} fabricColor="#2e7d32" />
      <BeachChair position={[46, 0, 16]} rotation={-0.5} fabricColor="#6a1b9a" />
      <BeachChair position={[-49, 0, 26]} rotation={1.0} fabricColor="#0097a7" />

      <LifeguardTower />
      <Sandcastle />
      <DuneGrass />
      <Pier />
      <FloatingBuoys />
      <Seagulls />
      <ShorelineFoam />
      <UnderwaterDecor />
      <Driftwood />

      <TidePool position={[-28, 0, -2]} />
      <TidePool position={[35, 0, -4]} />

      <BeachVolleyballNet position={[-30, 0, 18]} />


      <Cooler position={[-14, 0, 16]} />
      <Cooler position={[32, 0, 21]} />

      <Jellyfish position={[-20, -3, -30]} />
      <Jellyfish position={[15, -4, -45]} />
      <Jellyfish position={[-10, -2, -55]} />
      <Jellyfish position={[25, -5, -35]} />

      <SchoolOfFish position={[0, -2, -20]} count={12} color="#64b5f6" />
      <SchoolOfFish position={[-20, -3, -40]} count={8} color="#ffb74d" />
      <SchoolOfFish position={[25, -4, -55]} count={15} color="#81c784" />

      <ExtraBeachDecor />
    </group>
  );
}

function ExtraBeachDecor() {
  const extraPalms = useMemo(() => [
    [-35, 0, 15] as [number, number, number],
    [-40, 0, 28] as [number, number, number],
    [35, 0, 12] as [number, number, number],
    [40, 0, 25] as [number, number, number],
    [45, 0, 30] as [number, number, number],
    [-45, 0, 10] as [number, number, number],
    [-50, 0, 20] as [number, number, number],
    [50, 0, 15] as [number, number, number],
    [55, 0, 28] as [number, number, number],
    [-55, 0, 30] as [number, number, number],
    [-60, 0, 18] as [number, number, number],
    [60, 0, 22] as [number, number, number],
    [65, 0, 10] as [number, number, number],
    [-65, 0, 14] as [number, number, number],
  ], []);

  const extraShells = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      x: -50 + Math.sin(i * 9.1) * 50,
      z: -2 + Math.cos(i * 5.3) * 6,
      scale: 0.08 + Math.abs(Math.sin(i * 3.7)) * 0.12,
      color: ["#fff5ee", "#ffe4c4", "#ffdab9", "#f5deb3", "#ffe0b2"][i % 5],
    })), []);

  const extraRocks = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      x: -55 + Math.sin(i * 6.7) * 55,
      z: Math.max(-2, -6 + Math.cos(i * 4.3) * 8),
      scale: 0.2 + Math.abs(Math.sin(i * 2.3)) * 0.6,
    })), []);

  return (
    <group>
      {extraPalms.map((pos, i) => (
        <PalmTree key={`ep-${i}`} position={pos} />
      ))}
      {extraShells.map((s, i) => (
        <mesh key={`es-${i}`} position={[s.x, 0.04, s.z]} rotation={[0, i * 1.7, 0]}>
          <sphereGeometry args={[s.scale, 6, 4]} />
          <meshStandardMaterial color={s.color} />
        </mesh>
      ))}
      {extraRocks.map((r, i) => (
        <mesh key={`er-${i}`} position={[r.x, r.scale * 0.35, r.z]}>
          <dodecahedronGeometry args={[r.scale, 0]} />
          <meshStandardMaterial color={i % 3 === 0 ? "#9e9e9e" : i % 3 === 1 ? "#78909c" : "#8d6e63"} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}


function OceanSky() {
  return (
    <>
      <color attach="background" args={["#87ceeb"]} />
      <fog attach="fog" args={["#1a6898", 60, 250]} />
    </>
  );
}

function OceanLights() {
  return (
    <>
      <ambientLight intensity={0.9} color="#b3e5fc" />
      <directionalLight
        position={[20, 50, 10]}
        intensity={1.5}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />
      <hemisphereLight args={["#87ceeb", "#4fc3f7", 0.6]} />
      <pointLight position={[0, 10, -40]} color="#4fc3f7" intensity={3} distance={120} />
      <pointLight position={[-30, 8, -50]} color="#00bcd4" intensity={2} distance={80} />
      <pointLight position={[30, 8, -50]} color="#00bcd4" intensity={2} distance={80} />
    </>
  );
}

function BeachSign() {
  const woodTexture = useTexture("/textures/wood.jpg");

  return (
    <group position={[-5, 0, 8]} rotation={[0, 0.3, 0]}>
      <mesh position={[-0.6, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
        <meshStandardMaterial map={woodTexture} color="#8b6914" />
      </mesh>
      <mesh position={[0.6, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3, 8]} />
        <meshStandardMaterial map={woodTexture} color="#8b6914" />
      </mesh>

      <mesh position={[0, 2.6, 0]} castShadow>
        <boxGeometry args={[2.4, 1, 0.12]} />
        <meshStandardMaterial map={woodTexture} color="#deb887" />
      </mesh>

      <mesh position={[0, 2.6, 0.065]}>
        <boxGeometry args={[2.3, 0.9, 0.01]} />
        <meshStandardMaterial color="#2e1a00" />
      </mesh>

      <Text
        position={[0, 2.8, 0.08]}
        fontSize={0.18}
        color="#fff8dc"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#2e1a00"
        maxWidth={2}
        textAlign="center"
      >
        LA Marine
      </Text>
      <Text
        position={[0, 2.5, 0.08]}
        fontSize={0.18}
        color="#fff8dc"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#2e1a00"
        maxWidth={2}
        textAlign="center"
      >
        Nature Preserve
      </Text>
    </group>
  );
}

function DivingSuitStation({ playerPosition }: { playerPosition: THREE.Vector3 }) {
  const [isNear, setIsNear] = useState(false);
  const hasDivingSuit = useGame((s) => s.hasDivingSuit);
  const equipDivingSuit = useGame((s) => s.equipDivingSuit);
  const world2Dialogue = useGame((s) => s.world2Dialogue);
  const openWorld2Dialogue = useGame((s) => s.openWorld2Dialogue);
  const stationPos: [number, number, number] = [-8, 0, 2];

  useFrame(() => {
    const dx = playerPosition.x - stationPos[0];
    const dz = playerPosition.z - stationPos[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    setIsNear(dist < 3.5);
  });

  useEffect(() => {
    if (hasDivingSuit || world2Dialogue) return;
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === "e" || e.key === "E") && isNear) {
        equipDivingSuit();
        openWorld2Dialogue([
          {
            speaker: "System",
            text: "You put on the diving suit! You can now explore the underwater ecosystems. Head into the ocean!",
          },
        ]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isNear, hasDivingSuit, equipDivingSuit, world2Dialogue, openWorld2Dialogue]);

  return (
    <group position={stationPos}>
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[1.5, 2, 0.3]} />
        <meshStandardMaterial color="#455a64" roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[-0.4, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.5, 6]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>
      <mesh position={[0.4, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.5, 6]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>
      <mesh position={[-0.4, 2.6, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>
      <mesh position={[0.4, 2.6, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>
      <mesh position={[-0.4, 2.6, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.85, 6]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>

      {!hasDivingSuit && (
        <>
          <mesh position={[0, 1.3, 0.2]}>
            <boxGeometry args={[0.5, 0.7, 0.15]} />
            <meshStandardMaterial color="#263238" />
          </mesh>
          <mesh position={[0, 1.7, 0.2]} scale={[0.8, 1, 0.6]}>
            <sphereGeometry args={[0.2, 10, 8]} />
            <meshStandardMaterial color="#37474f" />
          </mesh>
          <mesh position={[0, 1.7, 0.3]}>
            <boxGeometry args={[0.25, 0.15, 0.05]} />
            <meshStandardMaterial color="#81d4fa" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0.85, 0.25]}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 8]} />
            <meshStandardMaterial color="#ffb300" roughness={0.4} metalness={0.3} />
          </mesh>
        </>
      )}

      <Text
        position={[0, 2.8, 0.2]}
        fontSize={0.2}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {hasDivingSuit ? "Suit Equipped ✓" : "Diving Suit"}
      </Text>

      {!hasDivingSuit && isNear && !world2Dialogue && (
        <Text
          position={[0, 0.3, 0.2]}
          fontSize={0.18}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          Press E to equip
        </Text>
      )}
    </group>
  );
}

function BoatDock({ playerPosition }: { playerPosition: THREE.Vector3 }) {
  const [isNear, setIsNear] = useState(false);
  const inBoat = useGame((s) => s.inBoat);
  const boardBoat = useGame((s) => s.boardBoat);
  const exitBoat = useGame((s) => s.exitBoat);
  const cleanupQuestStarted = useGame((s) => s.cleanupQuestStarted);
  const world2Dialogue = useGame((s) => s.world2Dialogue);
  const openWorld2Dialogue = useGame((s) => s.openWorld2Dialogue);
  const dockPos: [number, number, number] = [-12, 0, -2];

  useFrame(() => {
    const dx = playerPosition.x - dockPos[0];
    const dz = playerPosition.z - dockPos[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    setIsNear(dist < 4);
  });

  const lastActionRef = useRef(0);
  const dialogueJustClosedRef = useRef(0);

  useEffect(() => {
    if (!cleanupQuestStarted) return;
    const unsub = useGame.subscribe((state, prev) => {
      if (prev.world2Dialogue && !state.world2Dialogue) {
        dialogueJustClosedRef.current = Date.now();
      }
    });
    return unsub;
  }, [cleanupQuestStarted]);

  useEffect(() => {
    if (!cleanupQuestStarted) return;
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === "e" || e.key === "E") && isNear) {
        const w2d = useGame.getState().world2Dialogue;
        if (w2d) return;
        const now = Date.now();
        if (now - dialogueJustClosedRef.current < 300) return;
        if (now - lastActionRef.current < 500) return;
        lastActionRef.current = now;
        if (!inBoat) {
          boardBoat();
          openWorld2Dialogue([
            { speaker: "System", text: "You boarded the cleanup boat! Use WASD to drive across the water. Get close to the green sludge patches and press E to vacuum them up." },
          ]);
        } else {
          exitBoat();
          openWorld2Dialogue([
            { speaker: "System", text: "You exited the boat. Talk to Josh when you're done cleaning up!" },
          ]);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isNear, inBoat, cleanupQuestStarted, boardBoat, exitBoat, openWorld2Dialogue]);

  if (!cleanupQuestStarted) return null;

  return (
    <group position={dockPos}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[4, 0.3, 3]} />
        <meshStandardMaterial color="#6d4c41" roughness={0.9} />
      </mesh>
      <mesh position={[-1.8, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      <mesh position={[1.8, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      <mesh position={[-1.8, 0.5, -1.3]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      <mesh position={[1.8, 0.5, -1.3]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>

      <Text
        position={[0, 1.5, 0]}
        fontSize={0.25}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        {inBoat ? "Press E to exit boat" : "Cleanup Boat Dock"}
      </Text>

      {!inBoat && isNear && !world2Dialogue && (
        <Text
          position={[0, 0.9, 0]}
          fontSize={0.2}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000"
        >
          Press E to board boat
        </Text>
      )}

      {!inBoat && (
        <group position={[0, 0.4, -2]}>
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[2.2, 0.35, 3.5]} />
            <meshStandardMaterial color="#5d4037" roughness={0.8} />
          </mesh>
          <mesh position={[-1, 0.25, 0]} castShadow>
            <boxGeometry args={[0.12, 0.5, 3.5]} />
            <meshStandardMaterial color="#4e342e" />
          </mesh>
          <mesh position={[1, 0.25, 0]} castShadow>
            <boxGeometry args={[0.12, 0.5, 3.5]} />
            <meshStandardMaterial color="#4e342e" />
          </mesh>
          <mesh position={[1.1, 0.5, -1]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
            <meshStandardMaterial color="#78909c" metalness={0.6} />
          </mesh>
          <mesh position={[1.1, 0.9, -1]} rotation={[0, 0, -0.3]} castShadow>
            <cylinderGeometry args={[0.04, 0.12, 1, 8]} />
            <meshStandardMaterial color="#546e7a" metalness={0.5} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function SludgeCleanedEffect({ position }: Readonly<{ position: [number, number, number] }>) {
  const [visible, setVisible] = useState(true);
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(0);

  useFrame((state) => {
    if (!visible || !groupRef.current) return;
    if (startTime.current === 0) startTime.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startTime.current;
    if (elapsed > 2) {
      setVisible(false);
      return;
    }
    groupRef.current.position.y = position[1] + 1 + elapsed * 1.5;
    const scale = elapsed < 0.3 ? elapsed / 0.3 : 1;
    groupRef.current.scale.setScalar(scale);
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={[position[0], position[1] + 1, position[2]]}>
      <Text
        fontSize={0.6}
        color="#4ade80"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000"
      >
        +5
      </Text>
    </group>
  );
}

const BUBBLE_POSITIONS = [
  [0, 0.2, -1],
  [1.5, 0.35, -0.6],
  [-1.2, 0.5, -0.2],
] as const;

function ChemicalSludgePatch({
  patch,
  index,
  playerPosition,
  inBoat,
  onCleaned,
}: {
  patch: SludgePatch;
  index: number;
  playerPosition: THREE.Vector3;
  inBoat: boolean;
  onCleaned: (index: number) => void;
}) {
  const isNearRef = useRef(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (patch.cleaned) return;
    const dx = playerPosition.x - patch.position[0];
    const dz = playerPosition.z - patch.position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    const near = dist < 5;
    if (near !== isNearRef.current) {
      isNearRef.current = near;
      setShowPrompt(near);
    }

    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.position.y = Math.sin(t * 0.4 + index) * 0.03;
    }
  });

  useEffect(() => {
    if (patch.cleaned || !inBoat) return;
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === "e" || e.key === "E") && isNearRef.current) {
        const w2d = useGame.getState().world2Dialogue;
        if (w2d) return;
        onCleaned(index);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [inBoat, patch.cleaned, index, onCleaned]);

  if (patch.cleaned) return null;

  return (
    <group position={patch.position}>
      <group ref={groupRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[5, 16]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.9}
          transparent
          opacity={0.85}
          roughness={0.1}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, 0.06, 1.5]}>
        <circleGeometry args={[3, 12]} />
        <meshStandardMaterial
          color="#76ff03"
          emissive="#76ff03"
          emissiveIntensity={0.7}
          transparent
          opacity={0.75}
          roughness={0.1}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.8, 0.06, -1.2]}>
        <circleGeometry args={[2.5, 12]} />
        <meshStandardMaterial
          color="#69f0ae"
          emissive="#69f0ae"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
          roughness={0.1}
        />
      </mesh>

      {BUBBLE_POSITIONS.map((pos, i) => (
        <mesh key={`bubble-${i}`} position={[pos[0], pos[1], pos[2]]}>
          <sphereGeometry args={[0.25, 6, 4]} />
          <meshStandardMaterial
            color="#b9f6ca"
            emissive="#39ff14"
            emissiveIntensity={1}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
      </group>

      {inBoat && showPrompt && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.4}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000"
        >
          Press E to vacuum sludge
        </Text>
      )}

      <Text
        position={[0, 1.3, 0]}
        fontSize={0.3}
        color="#b9f6ca"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000"
      >
        Chemical Sludge
      </Text>
    </group>
  );
}

function OceanPracticeBooth({
  position,
  playerPosition,
  unlocked,
  active,
  onInteract,
}: {
  position: [number, number, number];
  playerPosition: THREE.Vector3;
  unlocked: boolean;
  active: boolean;
  onInteract: () => void;
}) {
  const boothPos = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const [nearBooth, setNearBooth] = useState(false);
  const nearBoothRef = useRef(false);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const dist = playerPosition.distanceTo(boothPos.current);
    const isNear = dist < 4;
    if (isNear !== nearBoothRef.current) {
      nearBoothRef.current = isNear;
      setNearBooth(isNear);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = unlocked ? 0.5 + Math.sin(Date.now() * 0.003) * 0.3 : 0.1;
    }
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = useGame.getState();
      if (e.code === "KeyE" && nearBooth && unlocked && !active && !s.world2Dialogue) {
        onInteract();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nearBooth, unlocked, active, onInteract]);

  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[3, 0.1, 3]} />
        <meshStandardMaterial color="#1a3a4a" />
      </mesh>
      <mesh position={[0, 1.8, -1.4]} castShadow>
        <boxGeometry args={[3, 3.6, 0.15]} />
        <meshStandardMaterial color="#004d40" />
      </mesh>
      <mesh position={[-1.45, 1.8, 0]} castShadow>
        <boxGeometry args={[0.15, 3.6, 3]} />
        <meshStandardMaterial color="#004d40" />
      </mesh>
      <mesh position={[1.45, 1.8, 0]} castShadow>
        <boxGeometry args={[0.15, 3.6, 3]} />
        <meshStandardMaterial color="#004d40" />
      </mesh>
      <mesh position={[0, 3.65, 0]} castShadow>
        <boxGeometry args={[3.2, 0.12, 3.2]} />
        <meshStandardMaterial color="#00695c" />
      </mesh>
      <mesh position={[0, 2.2, -1.3]}>
        <boxGeometry args={[2.2, 1.5, 0.05]} />
        <meshStandardMaterial color="#111111" emissive="#0a2a1a" emissiveIntensity={0.3} />
      </mesh>
      <mesh ref={glowRef} position={[0, 2.2, -1.28]}>
        <boxGeometry args={[2.3, 1.6, 0.02]} />
        <meshStandardMaterial color="#69f0ae" emissive="#69f0ae" emissiveIntensity={0.1} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 1.1, -0.3]} castShadow>
        <boxGeometry args={[2, 0.08, 1]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0, 1.18, -0.3]}>
        <boxGeometry args={[1.2, 0.04, 0.5]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <Text
        position={[0, 4.2, 0]}
        fontSize={0.35}
        color={unlocked ? "#69f0ae" : "#666666"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
        fontWeight="bold"
      >
        OCEAN PRACTICE
      </Text>
      {nearBooth && unlocked && !active && (
        <Text
          position={[0, 4.7, 0]}
          fontSize={0.3}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Press E to Practice
        </Text>
      )}
      {nearBooth && !unlocked && (
        <Text
          position={[0, 4.7, 0]}
          fontSize={0.25}
          color="#999999"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Complete the lessons first!
        </Text>
      )}
      <Text
        position={[-1.36, 2.5, 0]}
        fontSize={0.22}
        color="#69f0ae"
        anchorX="center"
        anchorY="middle"
        rotation={[0, Math.PI / 2, 0]}
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {"for( )"}
      </Text>
      <Text
        position={[1.36, 2.5, 0]}
        fontSize={0.22}
        color="#69f0ae"
        anchorX="center"
        anchorY="middle"
        rotation={[0, -Math.PI / 2, 0]}
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {"while( )"}
      </Text>
      <mesh position={[0, 3.55, 0]}>
        <boxGeometry args={[0.1, 0.04, 2.5]} />
        <meshStandardMaterial color="#69f0ae" emissive="#69f0ae" emissiveIntensity={unlocked ? 1 : 0.2} />
      </mesh>
    </group>
  );
}

export function OceanWorld() {
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 15));
  const world2Dialogue = useGame((s) => s.world2Dialogue);
  const openWorld2Dialogue = useGame((s) => s.openWorld2Dialogue);
  const oceanQuestStarted = useGame((s) => s.oceanQuestStarted);
  const startOceanQuest = useGame((s) => s.startOceanQuest);
  const ecosystems = useGame((s) => s.ecosystems);
  const oceanQuestCompleted = useGame((s) => s.oceanQuestCompleted);
  const completeOceanQuest = useGame((s) => s.completeOceanQuest);
  const currentSurveyIndex = useGame((s) => s.currentSurveyIndex);
  const cleanupQuestStarted = useGame((s) => s.cleanupQuestStarted);
  const startCleanupQuest = useGame((s) => s.startCleanupQuest);
  const sludgePatches = useGame((s) => s.sludgePatches);
  const cleanupQuestCompleted = useGame((s) => s.cleanupQuestCompleted);
  const completeCleanupQuest = useGame((s) => s.completeCleanupQuest);
  const inBoat = useGame((s) => s.inBoat);
  const oceanPracticeUnlocked = useGame((s) => s.oceanPracticeUnlocked);
  const oceanPracticeActive = useGame((s) => s.oceanPracticeActive);
  const openOceanPractice = useGame((s) => s.openOceanPractice);
  const oceanLessonPhase = useGame((s) => s.oceanLessonPhase);
  const oceanPortalActive = useGame((s) => s.oceanPortalActive);
  const enterFactoryPortal = useGame((s) => s.enterFactoryPortal);
  const cleanSludge = useGame((s) => s.cleanSludge);
  const addTotalScore = useGame((s) => s.addTotalScore);

  const allSurveyed = ecosystems.every((e) => e.surveyed);
  const allSludgeCleaned = sludgePatches.every((p) => p.cleaned);
  const sludgeCleanedCount = sludgePatches.filter((p) => p.cleaned).length;

  const [cleanedEffects, setCleanedEffects] = useState<{ id: number; position: [number, number, number] }[]>([]);
  const cleanedEffectIdRef = useRef(0);

  const handleSludgeCleaned = useCallback((index: number) => {
    const patch = useGame.getState().sludgePatches[index];
    cleanSludge(index);
    addTotalScore(5);
    cleanedEffectIdRef.current += 1;
    const effectId = cleanedEffectIdRef.current;
    setCleanedEffects((prev) => [...prev, { id: effectId, position: patch.position }]);
    setTimeout(() => {
      setCleanedEffects((prev) => prev.filter((e) => e.id !== effectId));
    }, 2500);
  }, [cleanSludge, addTotalScore]);

  const handlePositionUpdate = useCallback((pos: THREE.Vector3) => {
    setPlayerPos(pos);
  }, []);

  const handleJoshInteract = useCallback(() => {
    if (world2Dialogue || currentSurveyIndex !== null) return;

    if (cleanupQuestCompleted) {
      openWorld2Dialogue([
        {
          speaker: "Josh",
          text: "You're a true hero of the ocean! The chemical spill has been completely cleaned up thanks to you.",
        },
        {
          speaker: "Josh",
          text: "The marine ecosystems can begin recovering now. Great work, marine biologist!",
        },
      ]);
      return;
    }

    if (cleanupQuestStarted && allSludgeCleaned && !cleanupQuestCompleted) {
      completeCleanupQuest();
      openWorld2Dialogue([
        {
          speaker: "Josh",
          text: "You cleaned up ALL the chemical sludge?! That's incredible work!",
        },
        {
          speaker: "Josh",
          text: "The ocean is safe again thanks to you. The marine life in our ecosystems can start recovering.",
        },
        {
          speaker: "Josh",
          text: "Outstanding job, marine biologist! You've truly made a difference today.",
        },
      ]);
      return;
    }

    if (cleanupQuestStarted && !allSludgeCleaned) {
      openWorld2Dialogue([
        {
          speaker: "Josh",
          text: "There's still green sludge out there in the ocean! We can't stop until it's all cleaned up.",
        },
        {
          speaker: "Josh",
          text: "While there is still sludge in the water, keep vacuuming it up! Get back in the boat and keep cleaning!",
        },
      ]);
      return;
    }

    if (oceanQuestCompleted && !cleanupQuestStarted) {
      startCleanupQuest();
      openWorld2Dialogue([
        {
          speaker: "Josh",
          text: "Emergency! We just got reports of a massive chemical spill in the ocean!",
        },
        {
          speaker: "Josh",
          text: "A tanker ship leaked toxic chemical sludge — it's that bright green glowing stuff spreading across the water.",
        },
        {
          speaker: "Josh",
          text: "This sludge is extremely dangerous to all the marine life we just surveyed. We need to clean it up immediately!",
        },
        {
          speaker: "Josh",
          text: "I've set up a cleanup boat at the dock near the shore. It has a large industrial vacuum mounted on it.",
        },
        {
          speaker: "Josh",
          text: "Board the boat, drive it out to each sludge patch, and use the vacuum to suck it all up. We don't know how much is out there, so while there's still sludge, keep cleaning!",
        },
        {
          speaker: "Josh",
          text: "Head to the Boat Dock to the left of the beach. Press E to board, then drive with WASD. Press E near the sludge to vacuum it. Good luck!",
        },
      ]);
      return;
    }

    if (allSurveyed && !oceanQuestCompleted) {
      completeOceanQuest();
      startCleanupQuest();
      openWorld2Dialogue([
        {
          speaker: "Josh",
          text: "You've surveyed all four marine ecosystems? That's outstanding work!",
        },
        {
          speaker: "Josh",
          text: "Your data on the animal populations, plant life, and environmental issues will help us protect these habitats.",
        },
        {
          speaker: "Josh",
          text: "But wait — Emergency! We just got reports of a massive chemical spill in the ocean!",
        },
        {
          speaker: "Josh",
          text: "A tanker ship leaked toxic chemical sludge — it's that bright green glowing stuff spreading across the water.",
        },
        {
          speaker: "Josh",
          text: "This sludge is extremely dangerous to all the marine life we just surveyed. We need to clean it up immediately!",
        },
        {
          speaker: "Josh",
          text: "I've set up a cleanup boat at the dock near the shore. It has a large industrial vacuum mounted on it.",
        },
        {
          speaker: "Josh",
          text: "Board the boat, drive it out to each sludge patch, and use the vacuum to suck it all up. We don't know how much is out there, so while there's still sludge, keep cleaning!",
        },
        {
          speaker: "Josh",
          text: "Head to the Boat Dock to the left of the beach. Press E to board, then drive with WASD. Press E near the sludge to vacuum it. Good luck!",
        },
      ]);
      return;
    }

    if (oceanQuestStarted) {
      const remaining = ecosystems.filter((e) => !e.surveyed);
      const names = remaining.map((e) => e.name).join(", ");
      openWorld2Dialogue([
        {
          speaker: "Josh",
          text: `You still have ${remaining.length} ecosystem${remaining.length > 1 ? "s" : ""} to survey: ${names}.`,
        },
        {
          speaker: "Josh",
          text: "Walk to each ecosystem zone, count the animals and plants, and identify the environmental issue. You've got this!",
        },
      ]);
      return;
    }

    startOceanQuest();
    openWorld2Dialogue([
      {
        speaker: "Josh",
        text: "Welcome to the LA Marine Nature Preserve! I'm Josh, the head researcher here at the Beach Station.",
      },
      {
        speaker: "Josh",
        text: "You must be our new marine biologist. Perfect timing — I have an important assignment for you!",
      },
      {
        speaker: "Josh",
        text: "We have 4 marine ecosystems out in the ocean that need surveying. I need you to dive underwater and visit each one.",
      },
      {
        speaker: "Josh",
        text: "But first — you'll need a diving suit! Grab one from the Diving Suit Station near the shoreline before heading into the water.",
      },
      {
        speaker: "Josh",
        text: "At each ecosystem, count the number of marine animals and marine plants you observe.",
      },
      {
        speaker: "Josh",
        text: "Also, each ecosystem has an environmental issue — it could be lots of trash, fishing nets trapping fish, or an oil spill. I need you to identify which one.",
      },
      {
        speaker: "Josh",
        text: "The 4 ecosystems are: the Coral Reef, the Kelp Forest, the Tide Pool, and the Seagrass Meadow. They're spread out across the ocean floor.",
      },
      {
        speaker: "Josh",
        text: "Put on your diving suit, swim to each one and press E to begin your survey. Report back to me when you've surveyed all four. Good luck!",
      },
    ]);
  }, [world2Dialogue, currentSurveyIndex, oceanQuestStarted, oceanQuestCompleted, allSurveyed, ecosystems,
      startOceanQuest, completeOceanQuest, openWorld2Dialogue, cleanupQuestStarted, startCleanupQuest,
      cleanupQuestCompleted, completeCleanupQuest, allSludgeCleaned, sludgeCleanedCount, sludgePatches.length]);

  return (
    <>
      <OceanSky />
      <OceanLights />
      <Beach />
      <Ocean />
      <WaterWaves />
      <ShorelineWater />
      <BeachBuilding />
      <BeachSign />
      <BeachDecor />
      <BeachExtras />

      <Player onPositionUpdate={handlePositionUpdate} />
      <FollowCamera playerPosition={playerPos} />

      <DivingSuitStation playerPosition={playerPos} />
      <BoatDock playerPosition={playerPos} />

      <NPC
        name="Josh"
        position={[8, 0, 14]}
        bodyColor="#1b5e20"
        shirtColor="#00bcd4"
        playerPosition={playerPos}
        onInteract={handleJoshInteract}
      />

      {oceanQuestStarted && ecosystems.map((eco, i) => (
        <MarineEcosystem
          key={i}
          index={i}
          name={eco.name}
          position={eco.position}
          animalCount={eco.animalCount}
          plantCount={eco.plantCount}
          issue={eco.issue}
          surveyed={eco.surveyed}
          playerPosition={playerPos}
          questStarted={oceanQuestStarted}
        />
      ))}

      {cleanupQuestStarted && sludgePatches.map((patch, i) => (
        <ChemicalSludgePatch
          key={`sludge-${i}`}
          patch={patch}
          index={i}
          playerPosition={playerPos}
          inBoat={inBoat}
          onCleaned={handleSludgeCleaned}
        />
      ))}

      {cleanedEffects.map((effect) => (
        <SludgeCleanedEffect key={`cleaned-${effect.id}`} position={effect.position} />
      ))}

      <OceanPracticeBooth
        position={[-8, 0, 14]}
        playerPosition={playerPos}
        unlocked={oceanPracticeUnlocked}
        active={oceanPracticeActive}
        onInteract={openOceanPractice}
      />

      {oceanPortalActive && (
        <Portal
          position={[0, 0, 10]}
          playerPosition={playerPos}
          onEnter={enterFactoryPortal}
        />
      )}
    </>
  );
}
