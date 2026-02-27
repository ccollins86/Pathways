import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useGame, type EnvironmentalIssue } from "@/lib/stores/useGame";

interface MarineEcosystemProps {
  index: number;
  name: string;
  position: [number, number, number];
  animalCount: number;
  plantCount: number;
  issue: EnvironmentalIssue;
  surveyed: boolean;
  playerPosition: THREE.Vector3;
  questStarted: boolean;
}

function Fish({ position, color, accentColor, scale = 1 }: { position: [number, number, number]; color: string; accentColor?: string; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  const startPos = useMemo(() => position, []);
  const speed = useMemo(() => 0.3 + Math.random() * 0.5, []);
  const range = useMemo(() => 1.5 + Math.random() * 2, []);
  const accent = accentColor || color;

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = startPos[0] + Math.sin(t) * range;
      ref.current.position.z = startPos[2] + Math.cos(t * 0.7) * range * 0.5;
      ref.current.position.y = startPos[1] + Math.sin(t * 1.3) * 0.2;
      ref.current.rotation.y = Math.cos(t) > 0 ? Math.PI / 2 : -Math.PI / 2;
    }
  });

  const s = scale;
  return (
    <group ref={ref} position={position}>
      <mesh scale={[s * 1.2, s * 0.55, s * 0.4]}>
        <sphereGeometry args={[0.4, 16, 12]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[s * 0.45, 0, 0]} scale={[s * 0.5, s * 0.35, s * 0.08]} rotation={[0, 0, Math.PI / 6]}>
        <coneGeometry args={[0.35, 0.6, 6]} />
        <meshStandardMaterial color={accent} roughness={0.4} />
      </mesh>
      <mesh position={[s * 0.45, 0, 0]} scale={[s * 0.5, s * 0.35, s * 0.08]} rotation={[0, 0, -Math.PI / 6]}>
        <coneGeometry args={[0.35, 0.6, 6]} />
        <meshStandardMaterial color={accent} roughness={0.4} />
      </mesh>
      <mesh position={[0, s * 0.25, 0]} scale={[s * 0.6, s * 0.4, s * 0.04]}>
        <coneGeometry args={[0.2, 0.5, 4]} />
        <meshStandardMaterial color={accent} roughness={0.4} />
      </mesh>
      <mesh position={[-s * 0.15, s * 0.05, s * 0.18]}>
        <sphereGeometry args={[0.06 * s, 10, 10]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-s * 0.18, s * 0.05, s * 0.2]}>
        <sphereGeometry args={[0.03 * s, 8, 8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[-s * 0.15, s * 0.05, -s * 0.18]}>
        <sphereGeometry args={[0.06 * s, 10, 10]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-s * 0.18, s * 0.05, -s * 0.2]}>
        <sphereGeometry args={[0.03 * s, 8, 8]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0, -s * 0.1, s * 0.15]} rotation={[0.3, 0, 0.2]} scale={[s * 0.25, s * 0.15, s * 0.05]}>
        <coneGeometry args={[0.2, 0.4, 4]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, -s * 0.1, -s * 0.15]} rotation={[-0.3, 0, 0.2]} scale={[s * 0.25, s * 0.15, s * 0.05]}>
        <coneGeometry args={[0.2, 0.4, 4]} />
        <meshStandardMaterial color={color} transparent opacity={0.7} />
      </mesh>
      <mesh position={[-s * 0.3, -s * 0.05, 0]} rotation={[0, 0, -0.1]}>
        <sphereGeometry args={[0.06 * s, 8, 4, 0, Math.PI]} />
        <meshStandardMaterial color="#e57373" />
      </mesh>
    </group>
  );
}

function Starfish({ position, color }: { position: [number, number, number]; color: string }) {
  const armAngles = useMemo(() => [0, 72, 144, 216, 288], []);
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
      {armAngles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <group key={i}>
            <mesh position={[Math.cos(rad) * 0.2, Math.sin(rad) * 0.2, 0]}>
              <boxGeometry args={[0.1, 0.3, 0.06]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
            <mesh position={[Math.cos(rad) * 0.35, Math.sin(rad) * 0.35, 0]}>
              <sphereGeometry args={[0.04, 6, 4]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
          </group>
        );
      })}
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 10]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {armAngles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <mesh key={`dot-${i}`} position={[Math.cos(rad) * 0.12, Math.sin(rad) * 0.12, 0.04]}>
            <sphereGeometry args={[0.02, 6, 4]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}

function Crab({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const speed = useMemo(() => 0.3 + Math.random() * 0.3, []);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = position[0] + Math.sin(t) * 0.8;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh scale={[1.2, 0.7, 1]}>
        <sphereGeometry args={[0.18, 12, 8]} />
        <meshStandardMaterial color="#d4533b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.08, 0]} scale={[1, 0.6, 0.8]}>
        <sphereGeometry args={[0.14, 10, 6]} />
        <meshStandardMaterial color="#e57373" roughness={0.6} />
      </mesh>
      <mesh position={[-0.25, 0.08, 0]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color="#c0392b" roughness={0.5} />
      </mesh>
      <mesh position={[-0.35, 0.1, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.06, 0.12, 0.04]} />
        <meshStandardMaterial color="#b71c1c" />
      </mesh>
      <mesh position={[-0.38, 0.16, 0.03]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.04, 0.06, 0.02]} />
        <meshStandardMaterial color="#b71c1c" />
      </mesh>
      <mesh position={[0.25, 0.08, 0]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color="#c0392b" roughness={0.5} />
      </mesh>
      <mesh position={[0.35, 0.1, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.06, 0.12, 0.04]} />
        <meshStandardMaterial color="#b71c1c" />
      </mesh>
      <mesh position={[0.38, 0.16, 0.03]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.04, 0.06, 0.02]} />
        <meshStandardMaterial color="#b71c1c" />
      </mesh>
      <mesh position={[-0.08, 0.15, 0.1]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.08, 0.2, 0.12]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.08, 0.2, 0.14]}>
        <sphereGeometry args={[0.012, 6, 4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.08, 0.15, 0.1]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1, 6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.08, 0.2, 0.12]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.08, 0.2, 0.14]}>
        <sphereGeometry args={[0.012, 6, 4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {[-0.12, -0.06, 0, 0.06, 0.12].map((z, i) => (
        <group key={`leg-${i}`}>
          <mesh position={[-0.18, -0.02, z]} rotation={[0, 0, -0.8]}>
            <boxGeometry args={[0.02, 0.12, 0.02]} />
            <meshStandardMaterial color="#c0392b" />
          </mesh>
          <mesh position={[0.18, -0.02, z]} rotation={[0, 0, 0.8]}>
            <boxGeometry args={[0.02, 0.12, 0.02]} />
            <meshStandardMaterial color="#c0392b" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Turtle({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const speed = useMemo(() => 0.15 + Math.random() * 0.1, []);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = position[0] + Math.sin(t) * 2;
      ref.current.position.z = position[2] + Math.cos(t * 0.6) * 1.5;
      ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.3;
      ref.current.rotation.y = Math.atan2(Math.cos(t), -Math.sin(t) * 0.6);
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh scale={[1.2, 0.6, 1]} position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.35, 16, 12]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.6} />
      </mesh>
      <mesh scale={[1, 0.5, 0.85]} position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.32, 12, 8]} />
        <meshStandardMaterial color="#388e3c" roughness={0.7} />
      </mesh>
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return (
          <mesh key={`shell-${i}`} position={[Math.cos(r) * 0.18, 0.15, Math.sin(r) * 0.15]}>
            <sphereGeometry args={[0.1, 6, 4]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#1b5e20" : "#2e7d32"} roughness={0.8} />
          </mesh>
        );
      })}
      <mesh position={[0.35, 0.08, 0]} scale={[0.6, 0.35, 0.4]}>
        <sphereGeometry args={[0.18, 12, 8]} />
        <meshStandardMaterial color="#4caf50" roughness={0.4} />
      </mesh>
      <mesh position={[0.42, 0.12, 0.06]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.44, 0.12, 0.07]}>
        <sphereGeometry args={[0.012, 6, 4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.42, 0.12, -0.06]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.44, 0.12, -0.07]}>
        <sphereGeometry args={[0.012, 6, 4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.2, -0.05, 0.25]} rotation={[0.3, 0.4, 0]}>
        <boxGeometry args={[0.15, 0.04, 0.1]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
      <mesh position={[0.2, -0.05, -0.25]} rotation={[-0.3, -0.4, 0]}>
        <boxGeometry args={[0.15, 0.04, 0.1]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
      <mesh position={[-0.2, -0.05, 0.2]} rotation={[0.3, -0.3, 0]}>
        <boxGeometry args={[0.12, 0.04, 0.08]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
      <mesh position={[-0.2, -0.05, -0.2]} rotation={[-0.3, 0.3, 0]}>
        <boxGeometry args={[0.12, 0.04, 0.08]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
    </group>
  );
}

function Seahorse({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = position[1] + Math.sin(t * 1.2) * 0.2;
      ref.current.rotation.y = Math.sin(t * 0.3) * 0.3;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.07, 0.05, 0.35, 8]} />
        <meshStandardMaterial color="#ff9800" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.05, 0.15, 8]} />
        <meshStandardMaterial color="#f57c00" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.05, 0.03, 0.15, 8]} />
        <meshStandardMaterial color="#e65100" roughness={0.4} />
      </mesh>
      <mesh position={[0.02, 0.35, 0]} scale={[0.9, 1, 0.8]}>
        <sphereGeometry args={[0.09, 12, 10]} />
        <meshStandardMaterial color="#ffb74d" roughness={0.3} />
      </mesh>
      <mesh position={[0.06, 0.38, 0.04]}>
        <sphereGeometry args={[0.02, 8, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.07, 0.38, 0.05]}>
        <sphereGeometry args={[0.01, 6, 4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.06, 0.38, -0.04]}>
        <sphereGeometry args={[0.02, 8, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.07, 0.38, -0.05]}>
        <sphereGeometry args={[0.01, 6, 4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.1, 0.33, 0]} rotation={[0, 0, -0.5]} scale={[0.5, 0.3, 0.1]}>
        <cylinderGeometry args={[0.04, 0.02, 0.12, 6]} />
        <meshStandardMaterial color="#ffa726" />
      </mesh>
      <mesh position={[0, -0.25, 0.02]} rotation={[0.5, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 8, 12, Math.PI * 1.5]} />
        <meshStandardMaterial color="#e65100" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.25, -0.02]} scale={[0.03, 0.2, 0.01]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffcc80" transparent opacity={0.6} />
      </mesh>
      {[0.05, 0.12, 0.2].map((y, i) => (
        <mesh key={`ring-${i}`} position={[0, y, 0]}>
          <torusGeometry args={[0.06 - i * 0.005, 0.008, 6, 12]} />
          <meshStandardMaterial color="#e65100" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Coral({ position, color, variant = 0 }: { position: [number, number, number]; color: string; variant?: number }) {
  if (variant === 1) {
    return (
      <group position={position}>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.25, 16, 12]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0.15, 0.35, 0.1]}>
          <sphereGeometry args={[0.18, 12, 8]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[-0.1, 0.3, -0.08]}>
          <sphereGeometry args={[0.2, 14, 10]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.08, 0.15, 0.15, 8]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.8} />
        </mesh>
      </group>
    );
  }
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.03, 0.14, 0.6, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0.12, 0.4, 0.06]}>
        <cylinderGeometry args={[0.02, 0.1, 0.45, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[-0.1, 0.35, -0.05]}>
        <cylinderGeometry args={[0.02, 0.09, 0.4, 8]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[0.05, 0.5, -0.08]}>
        <cylinderGeometry args={[0.015, 0.07, 0.3, 6]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {[0, 0.12, -0.1].map((x, i) => (
        <mesh key={`tip-${i}`} position={[x, 0.55 - i * 0.05, i * 0.04]}>
          <sphereGeometry args={[0.04, 8, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

function Seaweed({ position, height = 1 }: { position: [number, number, number]; height?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.15;
    }
  });

  return (
    <group ref={ref} position={position}>
      {[0, 0.04, -0.04].map((offset, i) => (
        <group key={i}>
          <mesh position={[offset, height * 0.3, offset * 0.5]}>
            <boxGeometry args={[0.06, height * 0.6, 0.03]} />
            <meshStandardMaterial color={i === 1 ? "#1b5e20" : "#2e7d32"} />
          </mesh>
          <mesh position={[offset, height * 0.6, offset * 0.5]}>
            <boxGeometry args={[0.08, height * 0.3, 0.03]} />
            <meshStandardMaterial color={i === 0 ? "#388e3c" : "#2e7d32"} />
          </mesh>
          <mesh position={[offset + 0.04, height * 0.7, offset * 0.5]}>
            <sphereGeometry args={[0.03, 6, 4]} />
            <meshStandardMaterial color="#43a047" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function KelpStalk({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 + position[0] * 2) * 0.1;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.4, 8]} />
        <meshStandardMaterial color="#1b5e20" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#2e7d32" roughness={0.5} />
      </mesh>
      {[0.5, 0.8, 1.1, 1.35].map((y, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <group key={i}>
            <mesh position={[side * 0.12, y, 0]} rotation={[0, 0, side * 0.4]}>
              <boxGeometry args={[0.22, 0.1, 0.03]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#2e7d32" : "#388e3c"} />
            </mesh>
            <mesh position={[side * 0.2, y + 0.02, 0]}>
              <sphereGeometry args={[0.025, 6, 4]} />
              <meshStandardMaterial color="#66bb6a" />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#4caf50" roughness={0.3} />
      </mesh>
    </group>
  );
}

function Algae({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.05;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.1, 0]} scale={[1.2, 0.8, 1]}>
        <sphereGeometry args={[0.18, 12, 8]} />
        <meshStandardMaterial color="#558b2f" roughness={0.6} />
      </mesh>
      <mesh position={[0.15, 0.08, 0.1]}>
        <sphereGeometry args={[0.12, 10, 6]} />
        <meshStandardMaterial color="#689f38" roughness={0.6} />
      </mesh>
      <mesh position={[-0.12, 0.09, -0.08]}>
        <sphereGeometry args={[0.14, 10, 6]} />
        <meshStandardMaterial color="#33691e" roughness={0.6} />
      </mesh>
      <mesh position={[0.08, 0.18, 0.05]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color="#7cb342" roughness={0.5} />
      </mesh>
      <mesh position={[-0.05, 0.02, 0.12]}>
        <sphereGeometry args={[0.06, 6, 4]} />
        <meshStandardMaterial color="#558b2f" roughness={0.7} />
      </mesh>
    </group>
  );
}

function SeagrassClump({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.08;
    }
  });

  return (
    <group ref={ref} position={position}>
      {[-0.08, -0.03, 0.02, 0.07, 0.12].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.3 + i * 0.03, i * 0.02 - 0.04]}>
            <boxGeometry args={[0.04, 0.6 + i * 0.05, 0.02]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#4caf50" : "#388e3c"} />
          </mesh>
          <mesh position={[x + 0.02, 0.55 + i * 0.04, i * 0.02 - 0.04]}>
            <sphereGeometry args={[0.015, 6, 4]} />
            <meshStandardMaterial color="#81c784" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function TrashDebris({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]} rotation={[0.3, 0.5, 0]}>
        <boxGeometry args={[0.25, 0.18, 0.18]} />
        <meshStandardMaterial color="#78909c" roughness={0.8} />
      </mesh>
      <mesh position={[0.6, 0.1, 0.4]} rotation={[0.1, 1.2, 0.2]}>
        <cylinderGeometry args={[0.07, 0.07, 0.3, 10]} />
        <meshStandardMaterial color="#90a4ae" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[-0.5, 0.08, -0.3]} rotation={[0.5, 0.3, 0.8]}>
        <boxGeometry args={[0.35, 0.03, 0.25]} />
        <meshStandardMaterial color="#b0bec5" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.07, -0.5]} rotation={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.35, 8]} />
        <meshStandardMaterial color="#607d8b" roughness={0.7} />
      </mesh>
      <mesh position={[-0.6, 0.06, 0.5]} rotation={[0.2, 1.5, 0.1]}>
        <boxGeometry args={[0.18, 0.12, 0.15]} />
        <meshStandardMaterial color="#455a64" roughness={0.8} />
      </mesh>
      <mesh position={[0.2, 0.04, 0.7]} rotation={[0.4, 0.9, 0.3]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color="#cfd8dc" roughness={0.4} />
      </mesh>
    </group>
  );
}

function FishingNets({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} rotation={[0.2, 0.5, 0.1]}>
        <boxGeometry args={[1.8, 0.8, 0.02]} />
        <meshStandardMaterial color="#9e9e9e" transparent opacity={0.5} wireframe />
      </mesh>
      <mesh position={[0.3, 0.5, 0.4]} rotation={[-0.3, 0.8, 0.2]}>
        <boxGeometry args={[1.2, 0.6, 0.02]} />
        <meshStandardMaterial color="#757575" transparent opacity={0.4} wireframe />
      </mesh>
      <mesh position={[-0.4, 0.2, 0.1]}>
        <sphereGeometry args={[0.14, 8, 6]} />
        <meshStandardMaterial color="#f44336" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.5, 0.25, -0.3]}>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshStandardMaterial color="#e53935" transparent opacity={0.7} />
      </mesh>
      <mesh position={[-0.2, 0.15, -0.4]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshStandardMaterial color="#ef5350" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 6]} />
        <meshStandardMaterial color="#bdbdbd" />
      </mesh>
    </group>
  );
}

function OilSpill({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[1.8, 24]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.7} roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, 0.06, 0.6]}>
        <circleGeometry args={[1, 16]} />
        <meshStandardMaterial color="#2c2c00" transparent opacity={0.6} roughness={0.05} metalness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.6, 0.06, -0.4]}>
        <circleGeometry args={[0.7, 12]} />
        <meshStandardMaterial color="#3e2723" transparent opacity={0.5} roughness={0.08} metalness={0.7} />
      </mesh>
      <mesh position={[-0.8, 0.2, 0.3]} rotation={[0.5, 0.2, 0.3]}>
        <cylinderGeometry args={[0.12, 0.12, 0.4, 10]} />
        <meshStandardMaterial color="#37474f" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  );
}

function CoralReefContent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Fish position={[1.2, 0.8, 0.8]} color="#ff6f00" accentColor="#ffab00" scale={0.9} />
      <Fish position={[-1.5, 0.6, -1]} color="#1e88e5" accentColor="#42a5f5" scale={0.8} />
      <Fish position={[0.5, 1, -1.5]} color="#fdd835" accentColor="#ffee58" scale={1} />
      <Fish position={[-0.8, 0.5, 1.2]} color="#e91e63" accentColor="#f48fb1" scale={0.7} />
      <Fish position={[2, 0.7, 0]} color="#7b1fa2" accentColor="#ba68c8" scale={0.85} />
      <Coral position={[-1.2, 0, 0.6]} color="#e91e63" variant={0} />
      <Coral position={[1, 0, -0.6]} color="#ff7043" variant={1} />
      <Seaweed position={[-0.5, 0, 1.5]} height={1} />
      <Seaweed position={[1.5, 0, 1]} height={0.8} />
    </group>
  );
}

function KelpForestContent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Fish position={[0.8, 0.6, 0.5]} color="#ff8f00" accentColor="#ffc107" scale={0.9} />
      <Fish position={[-1.2, 0.8, -0.7]} color="#00acc1" accentColor="#26c6da" scale={0.8} />
      <Fish position={[1.5, 0.5, 1.2]} color="#7cb342" accentColor="#aed581" scale={0.7} />
      <Fish position={[-0.7, 0.9, 1]} color="#fdd835" accentColor="#fff176" scale={0.95} />
      <KelpStalk position={[-1.5, 0, 0.3]} />
      <KelpStalk position={[1, 0, -1]} />
      <KelpStalk position={[-0.4, 0, 1.5]} />
      <KelpStalk position={[1.8, 0, 0.7]} />
      <KelpStalk position={[-1, 0, -1.2]} />
      <KelpStalk position={[0.4, 0, -0.4]} />
    </group>
  );
}

function TidePoolContent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Starfish position={[-0.6, 0.08, 0.4]} color="#ff5722" />
      <Starfish position={[1, 0.08, -0.6]} color="#ff7043" />
      <Crab position={[0, 0.12, 1]} />
      <Algae position={[-1, 0, -0.4]} />
      <Algae position={[0.6, 0, 0.6]} />
      <Algae position={[-0.4, 0, -1]} />
    </group>
  );
}

function SeagrassMeadowContent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Fish position={[1, 0.6, 0.4]} color="#0288d1" accentColor="#29b6f6" scale={0.8} />
      <Fish position={[-1.2, 0.5, 0.7]} color="#43a047" accentColor="#66bb6a" scale={0.7} />
      <Seahorse position={[0, 0.5, -0.6]} />
      <Turtle position={[-0.6, 0.4, 1.2]} />
      <SeagrassClump position={[-1.5, 0, 0.3]} />
      <SeagrassClump position={[0.8, 0, -1]} />
      <SeagrassClump position={[-0.5, 0, 1.6]} />
      <SeagrassClump position={[1.6, 0, 0.8]} />
      <SeagrassClump position={[0, 0, -1.5]} />
    </group>
  );
}

const ECOSYSTEM_CONTENT: Record<string, React.FC<{ position: [number, number, number] }>> = {
  "Coral Reef": CoralReefContent,
  "Kelp Forest": KelpForestContent,
  "Tide Pool": TidePoolContent,
  "Seagrass Meadow": SeagrassMeadowContent,
};

const ISSUE_COMPONENTS: Record<EnvironmentalIssue, React.FC<{ position: [number, number, number] }>> = {
  trash: TrashDebris,
  nets: FishingNets,
  oil_spill: OilSpill,
};

function UnderwaterGlow({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return <pointLight ref={ref} position={[position[0], position[1] + 3, position[2]]} color="#00bcd4" intensity={1.5} distance={15} />;
}

function SeaFloor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[5.5, 32]} />
        <meshStandardMaterial color="#5d4037" roughness={0.9} />
      </mesh>
      {[[-2, 0, -1.5], [1.8, 0, 2], [-1, 0, 2.5], [2.5, 0, -0.5]].map((pos, i) => (
        <mesh key={`pebble-${i}`} position={pos as [number, number, number]} rotation={[0, i * 1.5, 0]}>
          <dodecahedronGeometry args={[0.12 + i * 0.03, 0]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#795548" : "#8d6e63"} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export function MarineEcosystem({
  index,
  name,
  position,
  issue,
  surveyed,
  playerPosition,
  questStarted,
}: MarineEcosystemProps) {
  const [isNear, setIsNear] = useState(false);
  const openSurvey = useGame((s) => s.openSurvey);
  const currentSurveyIndex = useGame((s) => s.currentSurveyIndex);
  const world2Dialogue = useGame((s) => s.world2Dialogue);

  useFrame(() => {
    const dx = playerPosition.x - position[0];
    const dz = playerPosition.z - position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    setIsNear(dist < 6);
  });

  useEffect(() => {
    if (!questStarted || surveyed || currentSurveyIndex !== null || world2Dialogue) return;
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === "e" || e.key === "E") && isNear) {
        openSurvey(index);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isNear, questStarted, surveyed, index, openSurvey, currentSurveyIndex, world2Dialogue]);

  const ContentComponent = ECOSYSTEM_CONTENT[name];
  const IssueComponent = ISSUE_COMPONENTS[issue];

  return (
    <group position={position}>
      <SeaFloor position={[0, 0, 0]} />
      <UnderwaterGlow position={[0, 0, 0]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[5, 32]} />
        <meshStandardMaterial
          color={surveyed ? "#1b5e20" : "#0d47a1"}
          transparent
          opacity={0.25}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[4.8, 5, 32]} />
        <meshStandardMaterial
          color={surveyed ? "#66bb6a" : isNear ? "#ffeb3b" : "#4fc3f7"}
          transparent
          opacity={isNear ? 0.7 : 0.4}
          emissive={isNear ? "#ffeb3b" : "#4fc3f7"}
          emissiveIntensity={isNear ? 0.3 : 0.1}
        />
      </mesh>

      {ContentComponent && <ContentComponent position={[0, 0, 0]} />}
      {IssueComponent && <IssueComponent position={[2, 0, 2]} />}

      <Text
        position={[0, 2.5, 0]}
        fontSize={0.45}
        color={surveyed ? "#66bb6a" : "white"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {surveyed ? `${name} ✓` : name}
      </Text>

      {questStarted && isNear && !surveyed && currentSurveyIndex === null && !world2Dialogue && (
        <Text
          position={[0, 1.9, 0]}
          fontSize={0.28}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Press E to survey
        </Text>
      )}
    </group>
  );
}
