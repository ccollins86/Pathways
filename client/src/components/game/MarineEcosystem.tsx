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
  const currentAngle = useRef(0);
  const accent = accentColor || color;

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = startPos[0] + Math.sin(t) * range;
      ref.current.position.z = startPos[2] + Math.cos(t * 0.7) * range * 0.5;
      ref.current.position.y = startPos[1] + Math.sin(t * 1.3) * 0.2;
      const dx = Math.cos(t) * range;
      const dz = -Math.sin(t * 0.7) * 0.7 * range * 0.5;
      let targetAngle = Math.atan2(dx, dz);
      let diff = targetAngle - currentAngle.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      currentAngle.current += diff * 0.1;
      ref.current.rotation.y = currentAngle.current;
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
  const startPos = useMemo(() => position, []);
  const currentAngle = useRef(0);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = startPos[0] + Math.sin(t) * 2;
      ref.current.position.z = startPos[2] + Math.cos(t * 0.6) * 1.5;
      ref.current.position.y = startPos[1] + Math.sin(t * 0.8) * 0.3;
      const dx = Math.cos(t) * 2;
      const dz = -Math.sin(t * 0.6) * 0.6 * 1.5;
      let targetAngle = Math.atan2(dx, dz);
      let diff = targetAngle - currentAngle.current;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      currentAngle.current += diff * 0.08;
      ref.current.rotation.y = currentAngle.current;
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
  const startPos = useMemo(() => position, []);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = startPos[1] + Math.sin(t * 0.8) * 0.15;
      ref.current.position.x = startPos[0] + Math.sin(t * 0.4) * 0.3;
    }
  });

  return (
    <group ref={ref} position={position} scale={[1.3, 1.3, 1.3]}>
      <mesh position={[0, 0.35, 0]} scale={[0.8, 1, 0.7]}>
        <sphereGeometry args={[0.12, 12, 10]} />
        <meshStandardMaterial color="#ffb74d" emissive="#ff9800" emissiveIntensity={0.3} roughness={0.3} />
      </mesh>
      <mesh position={[0.08, 0.38, 0.05]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.09, 0.38, 0.06]}>
        <sphereGeometry args={[0.012, 6, 4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.08, 0.38, -0.05]}>
        <sphereGeometry args={[0.025, 8, 6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.09, 0.38, -0.06]}>
        <sphereGeometry args={[0.012, 6, 4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.12, 0.34, 0]} rotation={[0, 0, -0.6]}>
        <cylinderGeometry args={[0.015, 0.035, 0.1, 6]} />
        <meshStandardMaterial color="#ffa726" emissive="#ff9800" emissiveIntensity={0.2} />
      </mesh>

      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.15, 8]} />
        <meshStandardMaterial color="#ff9800" emissive="#ff6f00" emissiveIntensity={0.25} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.15, 8]} />
        <meshStandardMaterial color="#f57c00" emissive="#e65100" emissiveIntensity={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.065, 0.06, 0.12, 8]} />
        <meshStandardMaterial color="#ef6c00" emissive="#e65100" emissiveIntensity={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.05, 0.035, 0.1, 8]} />
        <meshStandardMaterial color="#e65100" emissive="#bf360c" emissiveIntensity={0.2} roughness={0.4} />
      </mesh>

      <mesh position={[0.02, -0.2, 0.02]} rotation={[0.6, 0, 0]}>
        <torusGeometry args={[0.06, 0.018, 8, 12, Math.PI * 1.5]} />
        <meshStandardMaterial color="#e65100" emissive="#bf360c" emissiveIntensity={0.25} roughness={0.5} />
      </mesh>

      <mesh position={[-0.02, 0.25, -0.02]} rotation={[0.1, 0, 0.1]} scale={[0.03, 0.18, 0.01]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffcc80" emissive="#ffe0b2" emissiveIntensity={0.2} transparent opacity={0.6} />
      </mesh>

      <mesh position={[0.01, 0.43, 0]}>
        <coneGeometry args={[0.03, 0.06, 5]} />
        <meshStandardMaterial color="#ffa726" emissive="#ff9800" emissiveIntensity={0.25} />
      </mesh>

      {[0.05, 0.12, 0.18].map((y, i) => (
        <mesh key={`ring-${i}`} position={[0, y, 0]}>
          <torusGeometry args={[0.065 - i * 0.005, 0.008, 6, 12]} />
          <meshStandardMaterial color="#e65100" emissive="#ff6f00" emissiveIntensity={0.25} roughness={0.6} />
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
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.7} />
        </mesh>
        <mesh position={[0.15, 0.35, 0.1]}>
          <sphereGeometry args={[0.18, 12, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.7} />
        </mesh>
        <mesh position={[-0.1, 0.3, -0.08]}>
          <sphereGeometry args={[0.2, 14, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.7} />
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
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0.12, 0.4, 0.06]}>
        <cylinderGeometry args={[0.02, 0.1, 0.45, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[-0.1, 0.35, -0.05]}>
        <cylinderGeometry args={[0.02, 0.09, 0.4, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0.05, 0.5, -0.08]}>
        <cylinderGeometry args={[0.015, 0.07, 0.3, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
      {[0, 0.12, -0.1].map((x, i) => (
        <mesh key={`tip-${i}`} position={[x, 0.55 - i * 0.05, i * 0.04]}>
          <sphereGeometry args={[0.04, 8, 6]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
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
      {[-0.06, -0.02, 0.02, 0.06].map((offset, i) => (
        <group key={i}>
          <mesh position={[offset, height * 0.25, offset * 0.4]}>
            <boxGeometry args={[0.08, height * 0.5, 0.04]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#1b5e20" : "#2e7d32"} emissive="#1b5e20" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[offset, height * 0.55, offset * 0.4]}>
            <boxGeometry args={[0.1, height * 0.35, 0.04]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#388e3c" : "#43a047"} emissive="#2e7d32" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[offset, height * 0.75, offset * 0.4]}>
            <boxGeometry args={[0.12, height * 0.15, 0.04]} />
            <meshStandardMaterial color="#4caf50" emissive="#43a047" emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[offset + 0.05, height * 0.8, offset * 0.4]}>
            <sphereGeometry args={[0.04, 8, 6]} />
            <meshStandardMaterial color="#66bb6a" emissive="#66bb6a" emissiveIntensity={0.4} />
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
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1, 8]} />
        <meshStandardMaterial color="#1b5e20" emissive="#1b5e20" emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.045, 0.06, 0.6, 8]} />
        <meshStandardMaterial color="#2e7d32" emissive="#2e7d32" emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.03, 0.045, 0.4, 8]} />
        <meshStandardMaterial color="#388e3c" emissive="#388e3c" emissiveIntensity={0.3} roughness={0.5} />
      </mesh>
      {[0.3, 0.6, 0.9, 1.2, 1.5].map((y, i) => {
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <group key={i}>
            <mesh position={[side * 0.15, y, 0]} rotation={[0, 0, side * 0.35]}>
              <boxGeometry args={[0.28, 0.12, 0.04]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#2e7d32" : "#388e3c"} emissive="#2e7d32" emissiveIntensity={0.35} />
            </mesh>
            <mesh position={[side * 0.08, y, 0.03]} rotation={[0, 0, side * 0.2]}>
              <boxGeometry args={[0.15, 0.08, 0.03]} />
              <meshStandardMaterial color="#43a047" emissive="#43a047" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[side * 0.25, y + 0.02, 0]}>
              <sphereGeometry args={[0.03, 6, 4]} />
              <meshStandardMaterial color="#66bb6a" emissive="#66bb6a" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}
      <mesh position={[0, 1.72, 0]}>
        <sphereGeometry args={[0.07, 8, 6]} />
        <meshStandardMaterial color="#4caf50" emissive="#4caf50" emissiveIntensity={0.4} roughness={0.3} />
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
        <meshStandardMaterial color="#558b2f" emissive="#558b2f" emissiveIntensity={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0.15, 0.08, 0.1]}>
        <sphereGeometry args={[0.12, 10, 6]} />
        <meshStandardMaterial color="#689f38" emissive="#689f38" emissiveIntensity={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[-0.12, 0.09, -0.08]}>
        <sphereGeometry args={[0.14, 10, 6]} />
        <meshStandardMaterial color="#33691e" emissive="#33691e" emissiveIntensity={0.3} roughness={0.6} />
      </mesh>
      <mesh position={[0.08, 0.18, 0.05]}>
        <sphereGeometry args={[0.08, 8, 6]} />
        <meshStandardMaterial color="#7cb342" emissive="#7cb342" emissiveIntensity={0.35} roughness={0.5} />
      </mesh>
      <mesh position={[-0.05, 0.02, 0.12]}>
        <sphereGeometry args={[0.06, 6, 4]} />
        <meshStandardMaterial color="#558b2f" emissive="#558b2f" emissiveIntensity={0.3} roughness={0.7} />
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
      {[-0.1, -0.05, 0, 0.05, 0.1, 0.15].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.25 + i * 0.02, i * 0.015 - 0.04]}>
            <boxGeometry args={[0.05, 0.5 + i * 0.06, 0.025]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#4caf50" : "#388e3c"} emissive={i % 2 === 0 ? "#4caf50" : "#388e3c"} emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[x, 0.5 + i * 0.05, i * 0.015 - 0.04]}>
            <boxGeometry args={[0.07, 0.2 + i * 0.02, 0.025]} />
            <meshStandardMaterial color={i % 3 === 0 ? "#66bb6a" : "#43a047"} emissive="#4caf50" emissiveIntensity={0.35} />
          </mesh>
          <mesh position={[x + 0.025, 0.6 + i * 0.06, i * 0.015 - 0.04]}>
            <sphereGeometry args={[0.02, 6, 4]} />
            <meshStandardMaterial color="#81c784" emissive="#81c784" emissiveIntensity={0.45} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function TrashDebris({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={[2.5, 2.5, 2.5]}>
      <group position={[0, 0.15, 0]} rotation={[0.3, 0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.08, 0.1, 0.35, 8]} />
          <meshStandardMaterial color="#e53935" emissive="#e53935" emissiveIntensity={0.2} roughness={0.4} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.18, 0]}>
          <cylinderGeometry args={[0.085, 0.085, 0.02, 8]} />
          <meshStandardMaterial color="#c62828" metalness={0.6} />
        </mesh>
        <mesh position={[0, 0.05, 0.09]}>
          <boxGeometry args={[0.06, 0.12, 0.01]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
      </group>

      <group position={[0.7, 0.12, 0.5]} rotation={[1.2, 0.3, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
          <meshStandardMaterial color="#2196f3" emissive="#1565c0" emissiveIntensity={0.2} transparent opacity={0.85} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <torusGeometry args={[0.04, 0.01, 6, 12]} />
          <meshStandardMaterial color="#1565c0" />
        </mesh>
      </group>

      <group position={[-0.6, 0.08, -0.4]} rotation={[0.2, 0.8, 0.1]}>
        <mesh scale={[1.2, 0.7, 0.5]}>
          <sphereGeometry args={[0.18, 10, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#e0e0e0" emissiveIntensity={0.3} transparent opacity={0.7} roughness={0.1} />
        </mesh>
        <mesh position={[0.12, 0.08, 0]} rotation={[0, 0, -0.3]}>
          <cylinderGeometry args={[0.02, 0.01, 0.1, 6]} />
          <meshStandardMaterial color="#bdbdbd" />
        </mesh>
      </group>

      <group position={[0.4, 0.06, -0.7]} rotation={[0, 0.5, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 0.4, 10]} />
          <meshStandardMaterial color="#ff9800" emissive="#e65100" emissiveIntensity={0.2} roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.105]}>
          <boxGeometry args={[0.08, 0.15, 0.01]} />
          <meshStandardMaterial color="#fff9c4" emissive="#fff9c4" emissiveIntensity={0.3} />
        </mesh>
      </group>

      <group position={[-0.8, 0.05, 0.6]}>
        <mesh rotation={[-Math.PI / 2, 0, 0.4]} scale={[1.2, 1, 0.3]}>
          <sphereGeometry args={[0.2, 8, 6]} />
          <meshStandardMaterial color="#ffeb3b" emissive="#f9a825" emissiveIntensity={0.2} transparent opacity={0.6} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0.2, 0.08, 0.8]} rotation={[0.5, 1.2, 0.3]}>
        <mesh>
          <boxGeometry args={[0.25, 0.15, 0.04]} />
          <meshStandardMaterial color="#4caf50" emissive="#2e7d32" emissiveIntensity={0.2} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <boxGeometry args={[0.12, 0.06, 0.01]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
        </mesh>
      </group>

      <pointLight position={[0, 0.5, 0]} intensity={3} distance={6} color="#ff8a65" />
    </group>
  );
}

function TrappedFish({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.z = Math.sin(t * 4 + position[0] * 3) * 0.3;
      ref.current.position.y = position[1] + Math.sin(t * 3) * 0.03;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh scale={[1, 0.6, 0.35]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 4]} scale={[0.08, 0.12, 0.03]}>
        <coneGeometry args={[1, 1, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.12, 0.02, 0.04]}>
        <sphereGeometry args={[0.02, 6, 4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

function FishingNets({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={[2.5, 2.5, 2.5]}>
      <mesh position={[0, 0.5, 0]} rotation={[0.2, 0.5, 0.1]}>
        <boxGeometry args={[2.5, 1.2, 0.03]} />
        <meshStandardMaterial color="#bdbdbd" transparent opacity={0.6} wireframe />
      </mesh>
      <mesh position={[0.4, 0.6, 0.5]} rotation={[-0.3, 0.8, 0.2]}>
        <boxGeometry args={[1.8, 0.9, 0.03]} />
        <meshStandardMaterial color="#9e9e9e" transparent opacity={0.5} wireframe />
      </mesh>

      <TrappedFish position={[0.2, 0.55, 0.1]} color="#ff6f00" />
      <TrappedFish position={[-0.3, 0.45, 0.3]} color="#1e88e5" />
      <TrappedFish position={[0.5, 0.65, -0.2]} color="#fdd835" />

      <mesh position={[-0.5, 0.3, 0.1]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial color="#f44336" emissive="#f44336" emissiveIntensity={0.4} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0.6, 0.35, -0.4]}>
        <sphereGeometry args={[0.18, 8, 6]} />
        <meshStandardMaterial color="#e53935" emissive="#e53935" emissiveIntensity={0.4} transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.3, 0.2, -0.5]}>
        <sphereGeometry args={[0.15, 6, 4]} />
        <meshStandardMaterial color="#ef5350" emissive="#ef5350" emissiveIntensity={0.4} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 6]} />
        <meshStandardMaterial color="#e0e0e0" emissive="#bdbdbd" emissiveIntensity={0.2} />
      </mesh>
      <pointLight position={[0, 0.6, 0]} intensity={2} distance={4} color="#ef9a9a" />
    </group>
  );
}

function OilSpill({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={[2, 2, 2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[2.5, 24]} />
        <meshStandardMaterial color="#1a1a1a" emissive="#4a148c" emissiveIntensity={0.15} transparent opacity={0.8} roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.2, 0.06, 0.8]}>
        <circleGeometry args={[1.5, 16]} />
        <meshStandardMaterial color="#2c2c00" emissive="#4a148c" emissiveIntensity={0.1} transparent opacity={0.7} roughness={0.05} metalness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.8, 0.06, -0.5]}>
        <circleGeometry args={[1, 12]} />
        <meshStandardMaterial color="#3e2723" emissive="#4a148c" emissiveIntensity={0.1} transparent opacity={0.6} roughness={0.08} metalness={0.7} />
      </mesh>
      <mesh position={[-1, 0.3, 0.4]} rotation={[0.5, 0.2, 0.3]}>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 10]} />
        <meshStandardMaterial color="#37474f" emissive="#455a64" emissiveIntensity={0.2} roughness={0.6} metalness={0.4} />
      </mesh>
      <pointLight position={[0, 0.4, 0]} intensity={2} distance={5} color="#7c4dff" />
    </group>
  );
}

function CoralReefContent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={[2.5, 2.5, 2.5]}>
      <Fish position={[1.5, 1, 1]} color="#ff6f00" accentColor="#ffab00" scale={1.2} />
      <Fish position={[-2, 0.8, -1.3]} color="#1e88e5" accentColor="#42a5f5" scale={1} />
      <Fish position={[0.6, 1.2, -2]} color="#fdd835" accentColor="#ffee58" scale={1.3} />
      <Fish position={[-1, 0.7, 1.5]} color="#e91e63" accentColor="#f48fb1" scale={0.9} />
      <Fish position={[2.5, 0.9, 0]} color="#7b1fa2" accentColor="#ba68c8" scale={1.1} />
      <Coral position={[-1.5, 0, 0.8]} color="#e91e63" variant={0} />
      <Coral position={[1.3, 0, -0.8]} color="#ff7043" variant={1} />
      <Seaweed position={[-0.6, 0, 2]} height={1.4} />
      <Seaweed position={[2, 0, 1.2]} height={1.2} />
    </group>
  );
}

function KelpForestContent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={[2.5, 2.5, 2.5]}>
      <Fish position={[1, 0.8, 0.7]} color="#ff8f00" accentColor="#ffc107" scale={1.2} />
      <Fish position={[-1.5, 1, -1]} color="#00acc1" accentColor="#26c6da" scale={1} />
      <Fish position={[2, 0.7, 1.5]} color="#7cb342" accentColor="#aed581" scale={0.9} />
      <Fish position={[-0.9, 1.1, 1.3]} color="#fdd835" accentColor="#fff176" scale={1.2} />
      <KelpStalk position={[-2, 0, 0.4]} />
      <KelpStalk position={[1.3, 0, -1.3]} />
      <KelpStalk position={[-0.5, 0, 2]} />
      <KelpStalk position={[2.2, 0, 0.9]} />
      <KelpStalk position={[-1.3, 0, -1.5]} />
      <KelpStalk position={[0.5, 0, -0.5]} />
    </group>
  );
}

function TidePoolContent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={[2.5, 2.5, 2.5]}>
      <Starfish position={[-0.8, 0.1, 0.5]} color="#ff5722" />
      <Starfish position={[1.3, 0.1, -0.8]} color="#ff7043" />
      <Crab position={[0, 0.15, 1.3]} />
      <Algae position={[-1.3, 0, -0.5]} />
      <Algae position={[0.8, 0, 0.8]} />
      <Algae position={[-0.5, 0, -1.3]} />
    </group>
  );
}

function SeagrassMeadowContent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={[2.5, 2.5, 2.5]}>
      <Fish position={[1.3, 0.8, 0.5]} color="#0288d1" accentColor="#29b6f6" scale={1} />
      <Fish position={[-1.5, 0.7, 0.9]} color="#43a047" accentColor="#66bb6a" scale={0.9} />
      <Seahorse position={[0, 0.7, -0.8]} />
      <Turtle position={[-0.8, 0.5, 1.5]} />
      <SeagrassClump position={[-2, 0, 0.4]} />
      <SeagrassClump position={[1, 0, -1.3]} />
      <SeagrassClump position={[-0.6, 0, 2]} />
      <SeagrassClump position={[2, 0, 1]} />
      <SeagrassClump position={[0, 0, -2]} />
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
  const ref2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.intensity = 5 + Math.sin(state.clock.elapsedTime * 0.5) * 1;
    }
    if (ref2.current) {
      ref2.current.intensity = 3 + Math.sin(state.clock.elapsedTime * 0.7 + 1) * 0.5;
    }
  });

  return (
    <>
      <pointLight ref={ref} position={[position[0], position[1] + 6, position[2]]} color="#4fc3f7" intensity={8} distance={40} />
      <pointLight ref={ref2} position={[position[0], position[1] + 3, position[2]]} color="#ffffff" intensity={5} distance={25} />
      <pointLight position={[position[0] + 3, position[1] + 2, position[2] + 3]} color="#81d4fa" intensity={3} distance={15} />
      <pointLight position={[position[0] - 3, position[1] + 2, position[2] - 3]} color="#81d4fa" intensity={3} distance={15} />
    </>
  );
}

function SeaFloor({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[9, 32]} />
        <meshStandardMaterial color="#8d6e63" roughness={0.7} />
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
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial
          color={surveyed ? "#2e7d32" : "#1565c0"}
          emissive={surveyed ? "#1b5e20" : "#0d47a1"}
          emissiveIntensity={0.5}
          transparent
          opacity={0.5}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[7.5, 8, 32]} />
        <meshStandardMaterial
          color={surveyed ? "#66bb6a" : isNear ? "#ffeb3b" : "#4fc3f7"}
          emissive={surveyed ? "#66bb6a" : isNear ? "#ffeb3b" : "#4fc3f7"}
          emissiveIntensity={isNear ? 1 : 0.6}
          transparent
          opacity={isNear ? 0.9 : 0.7}
        />
      </mesh>

      {ContentComponent && <ContentComponent position={[0, 0, 0]} />}
      {IssueComponent && <IssueComponent position={[2, 0, 2]} />}

      <Text
        position={[0, 5, 0]}
        fontSize={0.8}
        color={surveyed ? "#a5d6a7" : "#e1f5fe"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.06}
        outlineColor="#000000"
      >
        {surveyed ? `${name} ✓` : name}
      </Text>

      {questStarted && isNear && !surveyed && currentSurveyIndex === null && !world2Dialogue && (
        <Text
          position={[0, 4, 0]}
          fontSize={0.4}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          Press E to survey
        </Text>
      )}
    </group>
  );
}
