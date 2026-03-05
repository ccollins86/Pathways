import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Player } from "./Player";
import { FollowCamera } from "./FollowCamera";
import { NPC } from "./NPC";
import { useGame } from "@/lib/stores/useGame";

function FactoryFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#5c5c5c" roughness={0.9} />
    </mesh>
  );
}

function FactoryWalls() {
  const wallColor = "#7a7a7a";
  const wallHeight = 8;
  const wallLength = 60;

  return (
    <group>
      <mesh position={[0, wallHeight / 2, -30]} castShadow receiveShadow>
        <boxGeometry args={[wallLength, wallHeight, 0.3]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      <mesh position={[0, wallHeight / 2, 30]} castShadow receiveShadow>
        <boxGeometry args={[wallLength, wallHeight, 0.3]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      <mesh position={[-30, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, wallHeight, wallLength]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      <mesh position={[30, wallHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, wallHeight, wallLength]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {[[-20, -29.85], [-10, -29.85], [0, -29.85], [10, -29.85], [20, -29.85]].map(([x, z], i) => (
        <group key={`window-back-${i}`}>
          <mesh position={[x, 5, z]}>
            <boxGeometry args={[3, 2.5, 0.1]} />
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.4} emissive="#87ceeb" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[x, 5, z + 0.05]}>
            <boxGeometry args={[3.2, 2.7, 0.05]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
        </group>
      ))}

      {[[-20, 29.85], [-10, 29.85], [0, 29.85], [10, 29.85], [20, 29.85]].map(([x, z], i) => (
        <group key={`window-front-${i}`}>
          <mesh position={[x, 5, z]}>
            <boxGeometry args={[3, 2.5, 0.1]} />
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.4} emissive="#87ceeb" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[x, 5, z - 0.05]}>
            <boxGeometry args={[3.2, 2.7, 0.05]} />
            <meshStandardMaterial color="#555555" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FactoryCeiling() {
  return (
    <group>
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[60, 0.3, 60]} />
        <meshStandardMaterial color="#6b6b6b" />
      </mesh>

      {[-15, 0, 15].map((x, i) => (
        <group key={`beam-${i}`}>
          <mesh position={[x, 7.5, 0]}>
            <boxGeometry args={[0.4, 0.8, 60]} />
            <meshStandardMaterial color="#4a4a4a" metalness={0.3} />
          </mesh>
        </group>
      ))}

      {[-20, -10, 0, 10, 20].map((z, i) => (
        <group key={`light-fixture-${i}`}>
          <mesh position={[0, 7.3, z]}>
            <boxGeometry args={[1.5, 0.1, 0.4]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
          </mesh>
          <pointLight position={[0, 7, z]} color="#fffde7" intensity={3} distance={20} />
        </group>
      ))}
    </group>
  );
}

function FactoryLights() {
  return (
    <group>
      <ambientLight intensity={0.4} color="#e8e0d0" />
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.6}
        color="#fff8e1"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </group>
  );
}

function ConveyorBelt({ position, length }: { position: [number, number, number]; length: number }) {
  const rollersCount = Math.floor(length / 0.8);
  const rollersRef = useRef<THREE.Group>(null);
  const beltRef = useRef<THREE.Mesh>(null);
  const carrierRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (rollersRef.current) {
      rollersRef.current.children.forEach((child) => {
        child.rotation.x = t * 3;
      });
    }
    if (carrierRef.current) {
      const cycle = ((t * 0.5) % 1);
      carrierRef.current.position.z = -length / 2 + cycle * length;
      carrierRef.current.visible = true;
    }
  });

  return (
    <group position={position}>
      <mesh ref={beltRef} position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 0.08, length]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>
      <mesh position={[-0.9, 0.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, length]} />
        <meshStandardMaterial color="#555555" metalness={0.5} />
      </mesh>
      <mesh position={[0.9, 0.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, length]} />
        <meshStandardMaterial color="#555555" metalness={0.5} />
      </mesh>
      <mesh ref={carrierRef} position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[0.6, 0.08, 0.4]} />
        <meshStandardMaterial color="#ff9800" />
      </mesh>
      <group ref={rollersRef}>
        {Array.from({ length: rollersCount }).map((_, i) => (
          <mesh key={i} position={[0, 0.35, -length / 2 + 0.4 + i * 0.8]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.06, 1.7, 8]} />
            <meshStandardMaterial color="#888888" metalness={0.6} />
          </mesh>
        ))}
      </group>
      <mesh position={[-1.05, 0, -length / 2 + 0.2]}>
        <boxGeometry args={[0.3, 0.45, 0.3]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[1.05, 0, -length / 2 + 0.2]}>
        <boxGeometry args={[0.3, 0.45, 0.3]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[-1.05, 0, length / 2 - 0.2]}>
        <boxGeometry args={[0.3, 0.45, 0.3]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[1.05, 0, length / 2 - 0.2]}>
        <boxGeometry args={[0.3, 0.45, 0.3]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </group>
  );
}

function Machine({
  position,
  label,
  color,
  accentColor,
  productShape,
}: {
  position: [number, number, number];
  label: string;
  color: string;
  accentColor: string;
  productShape: "hat" | "tshirt" | "jacket";
}) {
  const glowRef = useRef<THREE.Mesh>(null);
  const armRef = useRef<THREE.Group>(null);
  const productRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.3;
    }
    if (armRef.current) {
      armRef.current.position.y = 3.5 + Math.sin(t * 1.5) * 0.3;
    }
    if (productRef.current) {
      productRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[4, 3, 3]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.3} />
      </mesh>

      <mesh position={[0, 3.05, 0]} castShadow>
        <boxGeometry args={[4.2, 0.1, 3.2]} />
        <meshStandardMaterial color={accentColor} metalness={0.5} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.4, 0.15, 3.4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      <mesh ref={glowRef} position={[0, 2.2, 1.52]}>
        <boxGeometry args={[2.5, 1, 0.05]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.5} />
      </mesh>

      <mesh position={[0, 2.2, 1.54]}>
        <boxGeometry args={[2.6, 1.1, 0.02]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      <mesh position={[-1.5, 0.8, 1.52]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#ff1744" emissive="#ff1744" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.8, 0.8, 1.52]}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#76ff03" emissive="#76ff03" emissiveIntensity={0.5} />
      </mesh>

      {[-1.8, 1.8].map((x, i) => (
        <mesh key={i} position={[x, 3.5, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 1, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.6} />
        </mesh>
      ))}

      <group ref={armRef} position={[0, 3.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[3.6, 0.2, 0.2]} />
          <meshStandardMaterial color="#888888" metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.6} />
        </mesh>
      </group>

      <mesh position={[1.5, 3.8, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 12]} />
        <meshStandardMaterial color="#555555" metalness={0.4} />
      </mesh>

      <Text
        position={[0, 4.5, 0]}
        fontSize={0.45}
        color={accentColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
        fontWeight="bold"
      >
        {label}
      </Text>

      <group ref={productRef} position={[3.5, 1.2, 0]}>
        {productShape === "hat" && <HatProduct color={accentColor} />}
        {productShape === "tshirt" && <TShirtProduct color={accentColor} />}
        {productShape === "jacket" && <JacketProduct color={accentColor} />}
      </group>

      <ConveyorBelt position={[3.5, 0, 0]} length={4} />

      <pointLight position={[0, 4, 1]} color={accentColor} intensity={3} distance={8} />
    </group>
  );
}

function HatProduct({ color }: { color: string }) {
  return (
    <group position={[0, 0.5, 0]}>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.08, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.35, 0.45, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.3, 0.05, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.15, 0.35, 0.3]} castShadow>
        <boxGeometry args={[0.2, 0.12, 0.08]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </group>
  );
}

function TShirtProduct({ color }: { color: string }) {
  return (
    <group position={[0, 0.5, 0]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.6, 0.7, 0.08]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.45, 0.35, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.45, 0.35, 0]} castShadow>
        <boxGeometry args={[0.3, 0.2, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.08, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function JacketProduct({ color }: { color: string }) {
  return (
    <group position={[0, 0.5, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.7, 0.8, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.5, 0.35, 0]} castShadow>
        <boxGeometry args={[0.3, 0.6, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.5, 0.35, 0]} castShadow>
        <boxGeometry args={[0.3, 0.6, 0.1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.14]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0.22, 0.1, 0.07]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
      </mesh>
      <mesh position={[0.22, 0.25, 0.07]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
      </mesh>
      <mesh position={[0.22, 0.4, 0.07]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
      </mesh>
    </group>
  );
}

function SafetySign({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[2, 1, 0.08]} />
        <meshStandardMaterial color="#ffeb3b" />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.8, 0.8, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.2}
        color="#ffeb3b"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {text}
      </Text>
    </group>
  );
}

function FactoryDecor() {
  return (
    <group>
      {[[-25, 0, -25], [-25, 0, 0], [-25, 0, 25]].map(([x, y, z], i) => (
        <group key={`barrel-${i}`} position={[x, y, z]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[0.4, 0.45, 1.2, 12]} />
            <meshStandardMaterial color="#1565c0" />
          </mesh>
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.05, 12]} />
            <meshStandardMaterial color="#0d47a1" metalness={0.4} />
          </mesh>
        </group>
      ))}

      {[[25, 0, -20], [25, 0, 5], [25, 0, 20]].map(([x, y, z], i) => (
        <group key={`crate-${i}`} position={[x, y, z]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1.2, 1, 1.2]} />
            <meshStandardMaterial color="#8d6e63" />
          </mesh>
          <mesh position={[0, 0.5, 0.61]}>
            <boxGeometry args={[1.0, 0.05, 0.02]} />
            <meshStandardMaterial color="#5d4037" />
          </mesh>
          <mesh position={[0, 0.5, 0.61]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.8, 0.05, 0.02]} />
            <meshStandardMaterial color="#5d4037" />
          </mesh>
        </group>
      ))}

      <SafetySign position={[-29.8, 4, -15]} text="SAFETY FIRST" />
      <SafetySign position={[-29.8, 4, 15]} text="WEAR PPE" />

      <group position={[0, 0, -28]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[6, 3, 2]} />
          <meshStandardMaterial color="#455a64" metalness={0.3} />
        </mesh>
        <mesh position={[0, 3.1, 0]} castShadow>
          <boxGeometry args={[6.2, 0.2, 2.2]} />
          <meshStandardMaterial color="#37474f" />
        </mesh>
        <Text
          position={[0, 3.8, 0]}
          fontSize={0.4}
          color="#ff9800"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          fontWeight="bold"
        >
          CONTROL ROOM
        </Text>
        <mesh position={[0, 1.5, 1.02]}>
          <boxGeometry args={[1.5, 2, 0.05]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[0.5, 1.5, 1.04]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.8} />
        </mesh>
      </group>

      {[[-12, 0, 27], [12, 0, 27]].map(([x, y, z], i) => (
        <group key={`forklift-${i}`} position={[x, y, z]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[1.2, 0.5, 2]} />
            <meshStandardMaterial color="#ff8f00" />
          </mesh>
          <mesh position={[0, 0.9, -0.3]} castShadow>
            <boxGeometry args={[1, 0.8, 1]} />
            <meshStandardMaterial color="#ff8f00" />
          </mesh>
          <mesh position={[0, 0.3, 1.2]} castShadow>
            <boxGeometry args={[0.8, 0.06, 0.6]} />
            <meshStandardMaterial color="#555555" metalness={0.5} />
          </mesh>
          <mesh position={[-0.35, 0.5, 1.2]} castShadow>
            <boxGeometry args={[0.06, 0.5, 0.06]} />
            <meshStandardMaterial color="#555555" metalness={0.5} />
          </mesh>
          <mesh position={[0.35, 0.5, 1.2]} castShadow>
            <boxGeometry args={[0.06, 0.5, 0.06]} />
            <meshStandardMaterial color="#555555" metalness={0.5} />
          </mesh>
          {[-0.5, 0.5].map((wx, wi) => (
            <mesh key={wi} position={[wx, 0.15, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.1, 12]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>
          ))}
        </group>
      ))}

      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 60]} />
        <meshStandardMaterial color="#ffeb3b" transparent opacity={0.3} />
      </mesh>
      {[-8, 8].map((x, i) => (
        <mesh key={`lane-${i}`} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.15, 60]} />
          <meshStandardMaterial color="#ffeb3b" transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function FactoryWorld() {
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 25));
  const world3Dialogue = useGame((s) => s.world3Dialogue);
  const openWorld3Dialogue = useGame((s) => s.openWorld3Dialogue);
  const factoryQuestStarted = useGame((s) => s.factoryQuestStarted);
  const startFactoryQuest = useGame((s) => s.startFactoryQuest);

  const handlePositionUpdate = useCallback((pos: THREE.Vector3) => {
    setPlayerPos(pos.clone());
  }, []);

  const handleGeorgeInteract = useCallback(() => {
    if (world3Dialogue) return;

    if (!factoryQuestStarted) {
      openWorld3Dialogue([
        { speaker: "George", text: "Welcome to the manufacturing plant! I'm George, the floor manager here." },
        { speaker: "George", text: "We produce three types of products: hats, t-shirts, and jackets." },
        { speaker: "George", text: "Each machine is specialized — take a look around and get familiar with the floor." },
        { speaker: "George", text: "The Hat Maker is on the left, the T-Shirt Maker is in the center, and the Jacket Maker is on the right." },
        { speaker: "George", text: "Go ahead and explore the machines. I'll be here if you need anything!" },
      ]);
      startFactoryQuest();
    } else {
      openWorld3Dialogue([
        { speaker: "George", text: "How's it going? Take your time exploring the machines." },
        { speaker: "George", text: "Each one produces a different product — hats, t-shirts, and jackets." },
        { speaker: "George", text: "Let me know if you have any questions!" },
      ]);
    }
  }, [world3Dialogue, factoryQuestStarted, openWorld3Dialogue, startFactoryQuest]);

  return (
    <>
      <FactoryLights />
      <FactoryFloor />
      <FactoryWalls />
      <FactoryCeiling />
      <FactoryDecor />

      <Player onPositionUpdate={handlePositionUpdate} />
      <FollowCamera playerPosition={playerPos} />

      <NPC
        name="George"
        position={[0, 0, 20]}
        bodyColor="#37474f"
        shirtColor="#ff9800"
        playerPosition={playerPos}
        onInteract={handleGeorgeInteract}
      />

      <Machine
        position={[-15, 0, -5]}
        label="HAT MAKER"
        color="#455a64"
        accentColor="#f44336"
        productShape="hat"
      />

      <Machine
        position={[0, 0, -15]}
        label="T-SHIRT MAKER"
        color="#455a64"
        accentColor="#2196f3"
        productShape="tshirt"
      />

      <Machine
        position={[15, 0, -5]}
        label="JACKET MAKER"
        color="#455a64"
        accentColor="#4caf50"
        productShape="jacket"
      />
    </>
  );
}
