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

function Fish({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<THREE.Group>(null);
  const startPos = useMemo(() => position, []);
  const speed = useMemo(() => 0.3 + Math.random() * 0.5, []);
  const range = useMemo(() => 1 + Math.random() * 1.5, []);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = startPos[0] + Math.sin(t) * range;
      ref.current.position.z = startPos[2] + Math.cos(t * 0.7) * range * 0.5;
      ref.current.rotation.y = Math.cos(t) > 0 ? 0 : Math.PI;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh scale={[scale, scale * 0.5, scale * 0.3]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[scale * 0.25, 0, 0]} scale={[scale * 0.3, scale * 0.25, scale * 0.05]}>
        <coneGeometry args={[0.3, 0.4, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Starfish({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI]}>
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <mesh key={i} position={[Math.cos(rad) * 0.2, Math.sin(rad) * 0.2, 0]}>
            <boxGeometry args={[0.08, 0.25, 0.04]} />
            <meshStandardMaterial color={color} />
          </mesh>
        );
      })}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Crab({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const speed = useMemo(() => 0.3 + Math.random() * 0.3, []);

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime * speed;
      ref.current.position.x = position[0] + Math.sin(t) * 0.5;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 8, 6]} />
        <meshStandardMaterial color="#d4533b" />
      </mesh>
      <mesh position={[-0.2, 0.05, 0]}>
        <sphereGeometry args={[0.06, 6, 4]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
      <mesh position={[0.2, 0.05, 0]}>
        <sphereGeometry args={[0.06, 6, 4]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
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
      ref.current.position.z = position[2] + Math.cos(t * 0.6) * 1;
      ref.current.rotation.y = Math.cos(t) > 0 ? 0 : Math.PI;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh scale={[1, 0.5, 0.8]}>
        <sphereGeometry args={[0.3, 8, 6]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
      <mesh position={[0.25, 0, 0]} scale={[0.5, 0.3, 0.3]}>
        <sphereGeometry args={[0.15, 6, 4]} />
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
      ref.current.position.y = position[1] + Math.sin(t * 1.2) * 0.15;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh>
        <cylinderGeometry args={[0.06, 0.04, 0.4, 6]} />
        <meshStandardMaterial color="#ff9800" />
      </mesh>
      <mesh position={[0.05, 0.15, 0]}>
        <sphereGeometry args={[0.06, 6, 4]} />
        <meshStandardMaterial color="#ffa726" />
      </mesh>
      <mesh position={[0, -0.2, 0]} rotation={[0, 0, 0.5]}>
        <torusGeometry args={[0.08, 0.02, 6, 8, Math.PI]} />
        <meshStandardMaterial color="#e65100" />
      </mesh>
    </group>
  );
}

function Coral({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.12, 0.5, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.1, 0.35, 0.05]}>
        <cylinderGeometry args={[0.02, 0.08, 0.35, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.08, 0.3, -0.05]}>
        <cylinderGeometry args={[0.02, 0.09, 0.3, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function Seaweed({ position, height = 0.8 }: { position: [number, number, number]; height?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.15;
    }
  });

  return (
    <mesh ref={ref} position={[position[0], position[1] + height / 2, position[2]]}>
      <boxGeometry args={[0.08, height, 0.04]} />
      <meshStandardMaterial color="#2e7d32" />
    </mesh>
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
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 1.2, 6]} />
        <meshStandardMaterial color="#1b5e20" />
      </mesh>
      <mesh position={[0.08, 1, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.03]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
      <mesh position={[-0.06, 0.7, 0]}>
        <boxGeometry args={[0.15, 0.12, 0.03]} />
        <meshStandardMaterial color="#388e3c" />
      </mesh>
    </group>
  );
}

function Algae({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.15, 6, 4]} />
        <meshStandardMaterial color="#558b2f" />
      </mesh>
      <mesh position={[0.12, 0.06, 0.08]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshStandardMaterial color="#689f38" />
      </mesh>
      <mesh position={[-0.1, 0.07, -0.06]}>
        <sphereGeometry args={[0.12, 6, 4]} />
        <meshStandardMaterial color="#33691e" />
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
      {[-0.06, 0, 0.06].map((x, i) => (
        <mesh key={i} position={[x, 0.25, i * 0.03 - 0.03]}>
          <boxGeometry args={[0.04, 0.5, 0.02]} />
          <meshStandardMaterial color={i === 1 ? "#4caf50" : "#388e3c"} />
        </mesh>
      ))}
    </group>
  );
}

function TrashDebris({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]} rotation={[0.3, 0.5, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.15]} />
        <meshStandardMaterial color="#78909c" />
      </mesh>
      <mesh position={[0.5, 0.08, 0.3]} rotation={[0.1, 1.2, 0.2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.25, 8]} />
        <meshStandardMaterial color="#90a4ae" />
      </mesh>
      <mesh position={[-0.4, 0.06, -0.2]} rotation={[0.5, 0.3, 0.8]}>
        <boxGeometry args={[0.3, 0.02, 0.2]} />
        <meshStandardMaterial color="#b0bec5" />
      </mesh>
      <mesh position={[0.3, 0.05, -0.4]} rotation={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.3, 6]} />
        <meshStandardMaterial color="#607d8b" />
      </mesh>
      <mesh position={[-0.5, 0.04, 0.4]} rotation={[0.2, 1.5, 0.1]}>
        <boxGeometry args={[0.15, 0.1, 0.12]} />
        <meshStandardMaterial color="#455a64" />
      </mesh>
    </group>
  );
}

function FishingNets({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} rotation={[0.2, 0.5, 0.1]}>
        <boxGeometry args={[1.5, 0.6, 0.02]} />
        <meshStandardMaterial color="#9e9e9e" transparent opacity={0.6} wireframe />
      </mesh>
      <mesh position={[0.2, 0.4, 0.3]} rotation={[-0.3, 0.8, 0.2]}>
        <boxGeometry args={[1, 0.5, 0.02]} />
        <meshStandardMaterial color="#757575" transparent opacity={0.5} wireframe />
      </mesh>
      <mesh position={[-0.3, 0.15, 0.1]}>
        <sphereGeometry args={[0.12, 6, 4]} />
        <meshStandardMaterial color="#f44336" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.4, 0.2, -0.2]}>
        <sphereGeometry args={[0.1, 6, 4]} />
        <meshStandardMaterial color="#e53935" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function OilSpill({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[1.5, 16]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.7} roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.8, 0.04, 0.5]}>
        <circleGeometry args={[0.8, 12]} />
        <meshStandardMaterial color="#2c2c00" transparent opacity={0.6} roughness={0.05} metalness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.5, 0.04, -0.3]}>
        <circleGeometry args={[0.6, 12]} />
        <meshStandardMaterial color="#3e2723" transparent opacity={0.5} roughness={0.08} metalness={0.7} />
      </mesh>
    </group>
  );
}

function CoralReefContent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Fish position={[1, 0.5, 0.5]} color="#ff6f00" scale={0.8} />
      <Fish position={[-1, 0.4, -0.8]} color="#42a5f5" scale={0.7} />
      <Fish position={[0.5, 0.6, -1.2]} color="#ffeb3b" scale={0.9} />
      <Fish position={[-0.8, 0.3, 1]} color="#e91e63" scale={0.6} />
      <Fish position={[1.5, 0.5, 0]} color="#ab47bc" scale={0.75} />
      <Coral position={[-1, 0, 0.5]} color="#e91e63" />
      <Coral position={[0.8, 0, -0.5]} color="#ff7043" />
      <Seaweed position={[-0.5, 0, 1.2]} />
      <Seaweed position={[1.2, 0, 0.8]} height={0.6} />
    </group>
  );
}

function KelpForestContent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Fish position={[0.5, 0.4, 0.3]} color="#ff8f00" scale={0.8} />
      <Fish position={[-1, 0.5, -0.5]} color="#26c6da" scale={0.7} />
      <Fish position={[1.2, 0.3, 1]} color="#aed581" scale={0.6} />
      <Fish position={[-0.5, 0.6, 0.8]} color="#ffd54f" scale={0.85} />
      <KelpStalk position={[-1.2, 0, 0.2]} />
      <KelpStalk position={[0.8, 0, -0.8]} />
      <KelpStalk position={[-0.3, 0, 1.2]} />
      <KelpStalk position={[1.5, 0, 0.5]} />
      <KelpStalk position={[-0.8, 0, -1]} />
      <KelpStalk position={[0.3, 0, -0.3]} />
    </group>
  );
}

function TidePoolContent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Starfish position={[-0.5, 0.05, 0.3]} color="#ff5722" />
      <Starfish position={[0.8, 0.05, -0.5]} color="#ff7043" />
      <Crab position={[0, 0.1, 0.8]} />
      <Algae position={[-0.8, 0, -0.3]} />
      <Algae position={[0.5, 0, 0.5]} />
      <Algae position={[-0.3, 0, -0.8]} />
    </group>
  );
}

function SeagrassMeadowContent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Fish position={[0.8, 0.4, 0.3]} color="#29b6f6" scale={0.7} />
      <Fish position={[-1, 0.3, 0.5]} color="#66bb6a" scale={0.6} />
      <Seahorse position={[0, 0.3, -0.5]} />
      <Turtle position={[-0.5, 0.2, 1]} />
      <SeagrassClump position={[-1.2, 0, 0.2]} />
      <SeagrassClump position={[0.6, 0, -0.8]} />
      <SeagrassClump position={[-0.4, 0, 1.3]} />
      <SeagrassClump position={[1.3, 0, 0.6]} />
      <SeagrassClump position={[0, 0, -1.2]} />
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
    setIsNear(dist < 5);
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[4, 24]} />
        <meshStandardMaterial
          color={surveyed ? "#1b5e20" : "#0d47a1"}
          transparent
          opacity={0.35}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[3.8, 4, 24]} />
        <meshStandardMaterial
          color={surveyed ? "#66bb6a" : isNear ? "#ffeb3b" : "#4fc3f7"}
          transparent
          opacity={isNear ? 0.6 : 0.3}
        />
      </mesh>

      {ContentComponent && <ContentComponent position={[0, 0, 0]} />}
      {IssueComponent && <IssueComponent position={[1.5, 0, 1.5]} />}

      <Text
        position={[0, 2, 0]}
        fontSize={0.35}
        color={surveyed ? "#66bb6a" : "white"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {surveyed ? `${name} ✓` : name}
      </Text>

      {questStarted && isNear && !surveyed && currentSurveyIndex === null && !world2Dialogue && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.22}
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
