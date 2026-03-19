import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useGame } from "@/lib/stores/useGame";

const CUSTOMER_NAMES = ["Alex", "Jamie", "Morgan", "Casey", "Riley", "Jordan", "Taylor", "Quinn", "Avery", "Skyler"];

function ShopRoom() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#2d1b4e" />
      </mesh>

      <mesh position={[0, 3, -8]} receiveShadow>
        <boxGeometry args={[16, 6, 0.3]} />
        <meshStandardMaterial color="#1a0a2e" />
      </mesh>
      <mesh position={[-8, 3, 0]} receiveShadow>
        <boxGeometry args={[0.3, 6, 16]} />
        <meshStandardMaterial color="#1a0a2e" />
      </mesh>
      <mesh position={[8, 3, 0]} receiveShadow>
        <boxGeometry args={[0.3, 6, 16]} />
        <meshStandardMaterial color="#1a0a2e" />
      </mesh>

      <mesh position={[0, 6, 0]} receiveShadow>
        <boxGeometry args={[16, 0.2, 16]} />
        <meshStandardMaterial color="#120826" />
      </mesh>

      <mesh position={[0, 3, 8]} receiveShadow>
        <boxGeometry args={[16, 6, 0.3]} />
        <meshStandardMaterial color="#1a0a2e" />
      </mesh>

      <mesh position={[0, 2.5, 8.05]}>
        <boxGeometry args={[3, 4.5, 0.1]} />
        <meshStandardMaterial color="#4a2c1a" />
      </mesh>

      <mesh position={[0, 4.9, 8.06]}>
        <boxGeometry args={[3.2, 0.2, 0.12]} />
        <meshStandardMaterial color="#3a1c0a" />
      </mesh>

      {[-3, 3].map((x, i) => (
        <group key={i} position={[x, 3.5, -7.8]}>
          <mesh>
            <boxGeometry args={[1.5, 2, 0.05]} />
            <meshStandardMaterial color="#1a1a5e" transparent opacity={0.4} />
          </mesh>
          <mesh>
            <boxGeometry args={[1.6, 2.1, 0.08]} />
            <meshStandardMaterial color="#3a1c0a" />
          </mesh>
        </group>
      ))}

      <pointLight position={[0, 5, 0]} color="#9b59b6" intensity={15} distance={14} />
      <pointLight position={[-3, 4, -3]} color="#e74c3c" intensity={4} distance={8} />
      <pointLight position={[3, 4, -3]} color="#3498db" intensity={4} distance={8} />
      <pointLight position={[0, 4, 5]} color="#f39c12" intensity={3} distance={8} />

      {[[-6, 2.5, -7.8], [6, 2.5, -7.8], [-6, 2.5, 7.8], [6, 2.5, 7.8]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 2, 8]} />
            <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={0.3} />
          </mesh>
          <pointLight position={[0, 1, 0]} color="#ffd700" intensity={2} distance={5} />
        </group>
      ))}
    </group>
  );
}

function ReadingTable() {
  return (
    <group position={[0, 0, -1]}>
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[1.8, 1.8, 0.08, 32]} />
        <meshStandardMaterial color="#1a0a2e" />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[1.7, 1.7, 0.04, 32]} />
        <meshStandardMaterial color="#4a0080" emissive="#4a0080" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.38, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.75, 8]} />
        <meshStandardMaterial color="#2d1b4e" />
      </mesh>

      <CrystalBall />
      <Tablet />
    </group>
  );
}

function CrystalBall() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = 0.95 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <group position={[-0.5, 0, 0]}>
      <mesh position={[0, 0.82, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.05, 16]} />
        <meshStandardMaterial color="#4a0080" />
      </mesh>
      <mesh ref={ref} position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color="#e0b0ff"
          emissive="#9b59b6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      <pointLight position={[0, 1, 0]} color="#9b59b6" intensity={2} distance={3} />
    </group>
  );
}

function Tablet() {
  return (
    <group position={[0.6, 0.8, 0.3]} rotation={[-0.3, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.02, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[0.35, 0.005, 0.45]} />
        <meshStandardMaterial color="#111111" emissive="#333355" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

function PlayerChair() {
  return (
    <group position={[0, 0, -3.5]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.8, 0.08, 0.8]} />
        <meshStandardMaterial color="#4a0080" />
      </mesh>
      <mesh position={[0, 0.9, -0.38]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.08]} />
        <meshStandardMaterial color="#4a0080" />
      </mesh>
      {[[-0.35, 0, -0.35], [0.35, 0, -0.35], [-0.35, 0, 0.35], [0.35, 0, 0.35]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.25, p[2]]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
          <meshStandardMaterial color="#2d1b4e" />
        </mesh>
      ))}
    </group>
  );
}

function CustomerChair() {
  return (
    <group position={[0, 0, 1.5]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.8, 0.08, 0.8]} />
        <meshStandardMaterial color="#4a0080" />
      </mesh>
      <mesh position={[0, 0.9, 0.38]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.08]} />
        <meshStandardMaterial color="#4a0080" />
      </mesh>
      {[[-0.35, 0, -0.35], [0.35, 0, -0.35], [-0.35, 0, 0.35], [0.35, 0, 0.35]].map((p, i) => (
        <mesh key={i} position={[p[0], 0.25, p[2]]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
          <meshStandardMaterial color="#2d1b4e" />
        </mesh>
      ))}
    </group>
  );
}

function CustomerNPC({ color, phase }: { color: string; phase: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());
  const doorZ = 7.5;
  const seatZ = 1.5;
  const enterDuration = 2000;

  useFrame(() => {
    if (!groupRef.current) return;
    const elapsed = Date.now() - startTime.current;

    if (phase === "entering") {
      const progress = Math.min(elapsed / enterDuration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      groupRef.current.position.z = doorZ - (doorZ - seatZ) * eased;
      groupRef.current.position.y = 0;

      if (progress >= 1) {
        useGame.getState().seatPsychicCustomer();
      }
    } else if (phase === "guessing" || phase === "won" || phase === "lost") {
      groupRef.current.position.z = seatZ;
      groupRef.current.position.y = 0;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, doorZ]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.6, 0.9, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.28, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {[[-0.15, 0.4, 0], [0.15, 0.4, 0]].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function PlayerAvatar() {
  return (
    <group position={[0, 0, -3.5]} rotation={[0, 0, 0]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <boxGeometry args={[0.6, 0.9, 0.4]} />
        <meshStandardMaterial color="#6a0dad" />
      </mesh>
      <mesh position={[0, 1.6, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.28, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2d1b4e" />
      </mesh>
    </group>
  );
}

function ShopDecorations() {
  return (
    <group>
      {[[-6, 0, -6], [6, 0, -6], [-6, 0, 4], [6, 0, 4]].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 1, 8]} />
            <meshStandardMaterial color="#4a2c1a" />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial
              color={["#e74c3c", "#3498db", "#f1c40f", "#2ecc71"][i]}
              emissive={["#e74c3c", "#3498db", "#f1c40f", "#2ecc71"][i]}
              emissiveIntensity={0.3}
              transparent
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}

      <group position={[0, 4.5, -7.85]}>
        <mesh>
          <boxGeometry args={[4, 1, 0.05]} />
          <meshStandardMaterial color="#1a0a2e" />
        </mesh>
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.35}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          fontWeight="bold"
        >
          MYSTIC VISIONS
        </Text>
      </group>

      {[-5, 5].map((x, i) => (
        <group key={i} position={[x, 0.01, -6]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.8, 32]} />
            <meshStandardMaterial color="#2d1b4e" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
            <ringGeometry args={[0.3, 0.7, 16]} />
            <meshStandardMaterial color="#9b59b6" emissive="#9b59b6" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function DoorAnimation({ isOpen }: { isOpen: boolean }) {
  const doorRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!doorRef.current) return;
    const targetRotation = isOpen ? -Math.PI / 2 : 0;
    doorRef.current.rotation.y += (targetRotation - doorRef.current.rotation.y) * 0.05;
  });

  return (
    <group ref={doorRef} position={[-1.5, 2.5, 8.05]}>
      <mesh position={[1.5, 0, 0]}>
        <boxGeometry args={[3, 4.5, 0.12]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[2.5, 0, 0.07]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#ffd700" />
      </mesh>
    </group>
  );
}

function StaticCamera() {
  useFrame(({ camera }) => {
    camera.position.set(0, 3.5, -6);
    camera.lookAt(0, 1.5, 4);
  });
  return null;
}

export function PsychicWorld() {
  const psychicGamePhase = useGame((s) => s.psychicGamePhase);
  const psychicCustomer = useGame((s) => s.psychicCustomer);
  const summonPsychicCustomer = useGame((s) => s.summonPsychicCustomer);

  const isDoorOpen = psychicGamePhase === "entering";

  useEffect(() => {
    if (psychicGamePhase === "waiting") {
      const delay = 1500 + Math.random() * 2000;
      const timer = setTimeout(() => {
        summonPsychicCustomer();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [psychicGamePhase, summonPsychicCustomer]);

  return (
    <>
      <ambientLight intensity={0.15} color="#9b59b6" />
      <directionalLight position={[5, 8, 3]} intensity={0.3} color="#e0b0ff" />

      <StaticCamera />

      <ShopRoom />
      <ReadingTable />
      <PlayerChair />
      <CustomerChair />
      <PlayerAvatar />
      <ShopDecorations />
      <DoorAnimation isOpen={isDoorOpen} />

      {psychicCustomer && (psychicGamePhase === "entering" || psychicGamePhase === "guessing" || psychicGamePhase === "won" || psychicGamePhase === "lost") && (
        <CustomerNPC color={psychicCustomer.color} phase={psychicGamePhase} />
      )}

      <fog attach="fog" args={["#0a0015", 8, 20]} />
    </>
  );
}
