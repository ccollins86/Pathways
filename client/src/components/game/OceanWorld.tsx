import { useState, useCallback, useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import { Player } from "./Player";
import { FollowCamera } from "./FollowCamera";
import { NPC } from "./NPC";
import { useGame } from "@/lib/stores/useGame";

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
        opacity={0.85}
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
        opacity={0.5}
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
      <fog attach="fog" args={["#87ceeb", 60, 150]} />
    </>
  );
}

function OceanLights() {
  return (
    <>
      <ambientLight intensity={0.6} color="#fff8dc" />
      <directionalLight
        position={[20, 30, 10]}
        intensity={1.2}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
      />
      <hemisphereLight args={["#87ceeb", "#f5deb3", 0.4]} />
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

export function OceanWorld() {
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 15));
  const world2Dialogue = useGame((s) => s.world2Dialogue);
  const openWorld2Dialogue = useGame((s) => s.openWorld2Dialogue);

  const handlePositionUpdate = useCallback((pos: THREE.Vector3) => {
    setPlayerPos(pos);
  }, []);

  const handleJoshInteract = useCallback(() => {
    if (world2Dialogue) return;
    openWorld2Dialogue([
      {
        speaker: "Josh",
        text: "Welcome to the Ocean World! I'm Josh. Looks like you made it through the portal safely.",
      },
      {
        speaker: "Josh",
        text: "This beach station is our base of operations. There's a lot to explore around here!",
      },
      {
        speaker: "Josh",
        text: "More adventures are coming soon. For now, enjoy the ocean view and take a look around!",
      },
    ]);
  }, [world2Dialogue, openWorld2Dialogue]);

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

      <NPC
        name="Josh"
        position={[8, 0, 14]}
        bodyColor="#1b5e20"
        shirtColor="#00bcd4"
        playerPosition={playerPos}
        onInteract={handleJoshInteract}
      />
    </>
  );
}
