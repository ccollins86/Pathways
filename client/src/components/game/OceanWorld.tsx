import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import { Player } from "./Player";
import { FollowCamera } from "./FollowCamera";
import { NPC } from "./NPC";
import { MarineEcosystem } from "./MarineEcosystem";
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

      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[4.5, 2, 4]} />
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
      z: -5 + (Math.cos(i * 3.7) * 5),
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
        <mesh key={`rock-${i}`} position={[rock.x, rock.scale * 0.4, rock.z]}>
          <dodecahedronGeometry args={[rock.scale, 0]} />
          <meshStandardMaterial color="#808080" roughness={0.9} />
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

function ChemicalSludgePatch({
  patch,
  index,
  playerPosition,
  inBoat,
}: {
  patch: SludgePatch;
  index: number;
  playerPosition: THREE.Vector3;
  inBoat: boolean;
}) {
  const [isNear, setIsNear] = useState(false);
  const cleanSludge = useGame((s) => s.cleanSludge);
  const world2Dialogue = useGame((s) => s.world2Dialogue);
  const openWorld2Dialogue = useGame((s) => s.openWorld2Dialogue);
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (patch.cleaned) return;
    const dx = playerPosition.x - patch.position[0];
    const dz = playerPosition.z - patch.position[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    setIsNear(dist < 5);

    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.y = t * 0.1 + index;
      const children = ref.current.children;
      for (let i = 0; i < children.length; i++) {
        if ((children[i] as THREE.Mesh).isMesh) {
          const mesh = children[i] as THREE.Mesh;
          mesh.position.y = patch.position[1] + Math.sin(t * 0.5 + i) * 0.1;
        }
      }
    }
  });

  useEffect(() => {
    if (patch.cleaned || !inBoat) return;
    const handleKey = (e: KeyboardEvent) => {
      if ((e.key === "e" || e.key === "E") && isNear) {
        const w2d = useGame.getState().world2Dialogue;
        if (w2d) return;
        cleanSludge(index);
        openWorld2Dialogue([
          { speaker: "System", text: "Sludge vacuumed up! The ocean is a little cleaner now." },
        ]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isNear, inBoat, patch.cleaned, index, cleanSludge, openWorld2Dialogue]);

  if (patch.cleaned) return null;

  return (
    <group ref={ref} position={patch.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[5, 32]} />
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
        <circleGeometry args={[3, 20]} />
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
        <circleGeometry args={[2.5, 16]} />
        <meshStandardMaterial
          color="#69f0ae"
          emissive="#69f0ae"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
          roughness={0.1}
        />
      </mesh>

      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[2, 16, 12]} />
        <meshStandardMaterial
          color="#39ff14"
          emissive="#39ff14"
          emissiveIntensity={0.6}
          transparent
          opacity={0.25}
        />
      </mesh>

      {[0, 1.5, -1.2, 0.8, -2, 1.8, -0.5].map((x, i) => (
        <mesh key={`bubble-${i}`} position={[x, 0.2 + i * 0.15, i * 0.4 - 1]}>
          <sphereGeometry args={[0.2 + i * 0.05, 8, 6]} />
          <meshStandardMaterial
            color="#b9f6ca"
            emissive="#39ff14"
            emissiveIntensity={1}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}

      <pointLight position={[0, 2, 0]} color="#39ff14" intensity={8} distance={20} />
      <pointLight position={[0, 0.5, 0]} color="#76ff03" intensity={5} distance={15} />

      {inBoat && isNear && !world2Dialogue && (
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
      const w2d = useGame.getState().world2Dialogue;
      if (e.code === "KeyE" && nearBooth && unlocked && !active && !w2d) {
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

  useEffect(() => {
    useGame.getState().preloadOceanQuestions();
  }, []);

  const allSurveyed = ecosystems.every((e) => e.surveyed);
  const allSludgeCleaned = sludgePatches.every((p) => p.cleaned);
  const sludgeCleanedCount = sludgePatches.filter((p) => p.cleaned).length;

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
        />
      ))}

      <OceanPracticeBooth
        position={[-8, 0, 14]}
        playerPosition={playerPos}
        unlocked={oceanPracticeUnlocked}
        active={oceanPracticeActive}
        onInteract={openOceanPractice}
      />
    </>
  );
}
