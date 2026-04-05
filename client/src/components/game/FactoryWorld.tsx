import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Player } from "./Player";
import { FollowCamera } from "./FollowCamera";
import { NPC } from "./NPC";
import { Portal } from "./Portal";
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
    </group>
  );
}

function FactoryCeiling() {
  return (
    <group>
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
      <ambientLight intensity={0.5} color="#d4c8b0" />
      <directionalLight
        position={[10, 6, 10]}
        intensity={0.6}
        color="#fff8e1"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-15, 3, -5]} color="#ff8a50" intensity={3} distance={12} />
      <pointLight position={[0, 3, -15]} color="#64b5f6" intensity={3} distance={12} />
      <pointLight position={[15, 3, -5]} color="#81c784" intensity={3} distance={12} />
      <pointLight position={[-15, 5, 10]} color="#fffde7" intensity={3} distance={25} />
      <pointLight position={[15, 5, 10]} color="#fffde7" intensity={3} distance={25} />
      <pointLight position={[0, 5, -10]} color="#fffde7" intensity={3} distance={25} />
    </group>
  );
}

function ConveyorBelt({ position, length }: { position: [number, number, number]; length: number }) {
  const rollersCount = Math.floor(length / 0.8);
  const rollersRef = useRef<THREE.Group>(null);
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
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
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
  machineType,
  playerPosition,
  machineState,
}: {
  position: [number, number, number];
  label: string;
  color: string;
  accentColor: string;
  productShape: "hat" | "tshirt" | "jacket";
  machineType: "hat" | "tshirt" | "jacket";
  playerPosition: THREE.Vector3;
  machineState: string;
}) {
  const glowRef = useRef<THREE.Mesh>(null);
  const armRef = useRef<THREE.Group>(null);
  const productRef = useRef<THREE.Group>(null);
  const [nearMachine, setNearMachine] = useState(false);
  const nearMachineRef = useRef(false);
  const machinePos = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const openMachineSettings = useGame((s) => s.openMachineSettings);
  const activeMachine = useGame((s) => s.activeMachine);
  const world3Dialogue = useGame((s) => s.world3Dialogue);
  const factoryQuestStarted = useGame((s) => s.factoryQuestStarted);

  const outputPos = useMemo(() => new THREE.Vector3(position[0] + 6, position[1], position[2]), [position]);

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
    const dist = playerPosition.distanceTo(machinePos.current);
    const isNear = dist < 5;
    if (isNear !== nearMachineRef.current) {
      nearMachineRef.current = isNear;
      setNearMachine(isNear);
    }
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const w3d = useGame.getState().world3Dialogue;
      const am = useGame.getState().activeMachine;
      const ms = useGame.getState();
      const stateKey = `${machineType}MachineState` as keyof typeof ms;
      const currentState = ms[stateKey];
      if (e.code === "KeyE" && nearMachine && !w3d && !am && currentState === "idle" && ms.factoryQuestStarted) {
        openMachineSettings(machineType);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nearMachine, machineType, openMachineSettings]);

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

      {nearMachine && machineState === "idle" && !activeMachine && !world3Dialogue && factoryQuestStarted && (
        <Text
          position={[0, 5.2, 0]}
          fontSize={0.3}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Press E to configure
        </Text>
      )}

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

function ProductPickup({
  position,
  productType,
  accentColor,
  label,
  playerPosition,
}: {
  position: [number, number, number];
  productType: "hats" | "tshirts" | "jackets";
  accentColor: string;
  label: string;
  playerPosition: THREE.Vector3;
}) {
  const pickUpProduct = useGame((s) => s.pickUpProduct);
  const carryingProduct = useGame((s) => s.carryingProduct);
  const [isNear, setIsNear] = useState(false);
  const nearRef = useRef(false);
  const posVec = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const dist = playerPosition.distanceTo(posVec.current);
    const near = dist < 4;
    if (near !== nearRef.current) {
      nearRef.current = near;
      setIsNear(near);
    }
    if (groupRef.current) {
      groupRef.current.position.y = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const w3d = useGame.getState().world3Dialogue;
      const am = useGame.getState().activeMachine;
      const cp = useGame.getState().carryingProduct;
      const cb = useGame.getState().carryingBox;
      if (e.code === "KeyE" && nearRef.current && !w3d && !am && !cp && !cb) {
        pickUpProduct(productType);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [productType, pickUpProduct]);

  return (
    <group position={position}>
      <group ref={groupRef}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.8, 1.2]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[1.0, 0.04, 1.0]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={1.5} />
        </mesh>
      </group>
      <Text
        position={[0, 2, 0]}
        fontSize={0.25}
        color={accentColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {label}
      </Text>
      {isNear && !carryingProduct && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.25}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Press E to pick up
        </Text>
      )}
      <pointLight position={[0, 1.5, 0]} color={accentColor} intensity={5} distance={6} />
    </group>
  );
}

function PackingTable({ position, playerPosition }: { position: [number, number, number]; playerPosition: THREE.Vector3 }) {
  const boxProduct = useGame((s) => s.boxProduct);
  const carryingProduct = useGame((s) => s.carryingProduct);
  const hatMachineState = useGame((s) => s.hatMachineState);
  const tshirtMachineState = useGame((s) => s.tshirtMachineState);
  const jacketMachineState = useGame((s) => s.jacketMachineState);
  const [isNear, setIsNear] = useState(false);
  const nearRef = useRef(false);
  const posVec = useRef(new THREE.Vector3(position[0], position[1], position[2]));

  useFrame(() => {
    const dist = playerPosition.distanceTo(posVec.current);
    const near = dist < 4;
    if (near !== nearRef.current) {
      nearRef.current = near;
      setIsNear(near);
    }
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const w3d = useGame.getState().world3Dialogue;
      const am = useGame.getState().activeMachine;
      const cp = useGame.getState().carryingProduct;
      if (e.code === "KeyE" && nearRef.current && !w3d && !am && cp) {
        boxProduct();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [boxProduct]);

  const boxedItems = [
    hatMachineState === "boxed" || hatMachineState === "loaded" ? "Hats" : null,
    tshirtMachineState === "boxed" || tshirtMachineState === "loaded" ? "T-Shirts" : null,
    jacketMachineState === "boxed" || jacketMachineState === "loaded" ? "Jackets" : null,
  ].filter(Boolean);

  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[4, 0.12, 2]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      {[[-1.6, -0.8], [-1.6, 0.8], [1.6, -0.8], [1.6, 0.8]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.25, z]} castShadow>
          <boxGeometry args={[0.1, 0.5, 0.1]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>
      ))}

      {[-1, 0, 1].map((xOff, i) => (
        <group key={`box-${i}`} position={[xOff * 1.2, 0.75, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1, 0.5, 0.8]} />
            <meshStandardMaterial color="#d7ccc8" />
          </mesh>
          <mesh position={[0, 0, 0.41]}>
            <boxGeometry args={[0.8, 0.04, 0.02]} />
            <meshStandardMaterial color="#795548" />
          </mesh>
          <mesh position={[0, 0, 0.41]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.4, 0.04, 0.02]} />
            <meshStandardMaterial color="#795548" />
          </mesh>
        </group>
      ))}

      <Text
        position={[0, 1.8, 0]}
        fontSize={0.3}
        color="#ff9800"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        fontWeight="bold"
      >
        PACKING TABLE
      </Text>

      {isNear && carryingProduct && (
        <Text
          position={[0, 2.3, 0]}
          fontSize={0.25}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Press E to pack in box
        </Text>
      )}
    </group>
  );
}

function ShippingTruck({ position, playerPosition }: { position: [number, number, number]; playerPosition: THREE.Vector3 }) {
  const loadBox = useGame((s) => s.loadBox);
  const carryingBox = useGame((s) => s.carryingBox);
  const hatMachineState = useGame((s) => s.hatMachineState);
  const tshirtMachineState = useGame((s) => s.tshirtMachineState);
  const jacketMachineState = useGame((s) => s.jacketMachineState);
  const [isNear, setIsNear] = useState(false);
  const nearRef = useRef(false);
  const posVec = useRef(new THREE.Vector3(position[0], position[1], position[2]));

  useFrame(() => {
    const dist = playerPosition.distanceTo(posVec.current);
    const near = dist < 5;
    if (near !== nearRef.current) {
      nearRef.current = near;
      setIsNear(near);
    }
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const w3d = useGame.getState().world3Dialogue;
      const am = useGame.getState().activeMachine;
      const cb = useGame.getState().carryingBox;
      if (e.code === "KeyE" && nearRef.current && !w3d && !am && cb) {
        loadBox();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [loadBox]);

  const loadedCount = [hatMachineState, tshirtMachineState, jacketMachineState].filter(s => s === "loaded").length;

  return (
    <group position={position}>
      <mesh position={[0, 0.01, -8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#444444" roughness={0.95} />
      </mesh>

      <group position={[0, 0, -4]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[4, 2.4, 8]} />
          <meshStandardMaterial color="#6d4c41" />
        </mesh>
        <mesh position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[4.1, 0.15, 8.1]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>

        {[-1.95, 1.95].map((x, i) => (
          <mesh key={`side-${i}`} position={[x, 1.2, 0]} castShadow>
            <boxGeometry args={[0.1, 2.4, 8]} />
            <meshStandardMaterial color="#5d4037" />
          </mesh>
        ))}

        <mesh position={[0, 1.2, -4]} castShadow>
          <boxGeometry args={[4, 2.4, 0.1]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>

        {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
          <mesh key={`wheel-${i}`} position={[x, 0.3, -6]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 12]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))}

        <group position={[0, 1.5, -4.5]}>
          <mesh castShadow>
            <boxGeometry args={[3.5, 2.5, 2]} />
            <meshStandardMaterial color="#6d4c41" />
          </mesh>
          <mesh position={[0, 0.3, 1.01]}>
            <boxGeometry args={[2.5, 1.2, 0.05]} />
            <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} />
          </mesh>
        </group>
      </group>

      <mesh position={[-2.5, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[6, 0.3, 0.3]} />
        <meshStandardMaterial color="#555555" metalness={0.5} />
      </mesh>
      <mesh position={[2.5, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[6, 0.3, 0.3]} />
        <meshStandardMaterial color="#555555" metalness={0.5} />
      </mesh>

      {loadedCount > 0 && Array.from({ length: loadedCount }).map((_, i) => (
        <mesh key={`loaded-${i}`} position={[-0.8 + i * 0.8, 0.6, -3 - i * 1.5]} castShadow>
          <boxGeometry args={[1, 0.7, 0.8]} />
          <meshStandardMaterial color="#d7ccc8" />
        </mesh>
      ))}

      <Text
        position={[0, 3.5, 1]}
        fontSize={0.4}
        color="#ff9800"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
        fontWeight="bold"
      >
        SHIPPING TRUCK
      </Text>

      <Text
        position={[0, 0.5, 1.5]}
        fontSize={0.25}
        color="#ffeb3b"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        Olympic Village - Italy
      </Text>

      {isNear && carryingBox && (
        <Text
          position={[0, 4.2, 1]}
          fontSize={0.3}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Press E to load box
        </Text>
      )}
    </group>
  );
}

function SafetySign({ position, text, rotation = [0, 0, 0] }: Readonly<{ position: [number, number, number]; text: string; rotation?: [number, number, number] }>) {
  return (
    <group position={position} rotation={rotation}>
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

function WallPoster({ position, rotation = [0, 0, 0], bgColor, textColor, title, subtitle }: Readonly<{
  position: [number, number, number];
  rotation?: [number, number, number];
  bgColor: string;
  textColor: string;
  title: string;
  subtitle?: string;
}>) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[1.4, 1.8, 0.05]} />
        <meshStandardMaterial color={bgColor} />
      </mesh>
      <mesh position={[0, 0.55, 0.03]}>
        <boxGeometry args={[1.2, 0.5, 0.01]} />
        <meshStandardMaterial color={textColor} transparent opacity={0.15} />
      </mesh>
      <Text
        position={[0, 0.2, 0.04]}
        fontSize={0.15}
        color={textColor}
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
        maxWidth={1.2}
        textAlign="center"
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          position={[0, -0.2, 0.04]}
          fontSize={0.1}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.1}
          textAlign="center"
        >
          {subtitle}
        </Text>
      )}
    </group>
  );
}

function CeilingPipes() {
  return (
    <group>
      {[[-25, 7, 0], [-25, 6.5, 0], [25, 7, 0], [25, 6.5, 0]].map(([x, y, z], i) => (
        <mesh key={`pipe-long-${i}`} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 60, 8]} />
          <meshStandardMaterial color="#6d6d6d" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {[-25, 25].map((x, xi) =>
        [-20, -5, 10, 25].map((z, zi) => (
          <group key={`pipe-elbow-${xi}-${zi}`} position={[x, 7, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 4, 8]} />
              <meshStandardMaterial color="#6d6d6d" metalness={0.7} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.15, 8]} />
              <meshStandardMaterial color="#555555" metalness={0.8} />
            </mesh>
          </group>
        ))
      )}

      {[-10, 10].map((x, i) => (
        <mesh key={`pipe-cross-${i}`} position={[x, 7.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 40, 8]} />
          <meshStandardMaterial color="#8a8a8a" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}

      {[-25, 25].map((x, xi) =>
        [-15, 0, 15].map((z, zi) => (
          <mesh key={`valve-${xi}-${zi}`} position={[x, 6.5, z]}>
            <group>
              <mesh>
                <cylinderGeometry args={[0.18, 0.18, 0.1, 8]} />
                <meshStandardMaterial color="#b71c1c" metalness={0.5} />
              </mesh>
              <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.4, 0.06, 0.06]} />
                <meshStandardMaterial color="#c62828" metalness={0.4} />
              </mesh>
            </group>
          </mesh>
        ))
      )}
    </group>
  );
}

function DustParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 80;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = 1 + Math.random() * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return pos;
  }, []);

  const speeds = useMemo(() => {
    const s = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      s[i] = 0.2 + Math.random() * 0.4;
    }
    return s;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const geo = particlesRef.current.geometry;
    const posArr = geo.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < particleCount; i++) {
      posArr[i * 3] += Math.sin(t * speeds[i] + i) * 0.003;
      posArr[i * 3 + 1] += Math.sin(t * 0.3 + i * 0.5) * 0.002;
      posArr[i * 3 + 2] += Math.cos(t * speeds[i] + i) * 0.003;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
        />
      </bufferGeometry>
      <pointsMaterial color="#fff8e1" size={0.08} transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function ShippingCrate({ position, color, size = [1.2, 1, 1.2] }: Readonly<{
  position: [number, number, number];
  color: string;
  size?: [number, number, number];
}>) {
  return (
    <group position={position}>
      <mesh position={[0, size[1] / 2, 0]} castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, size[1] / 2, size[2] / 2 + 0.01]}>
        <boxGeometry args={[size[0] * 0.8, 0.05, 0.02]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      <mesh position={[0, size[1] / 2, size[2] / 2 + 0.01]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[size[1] * 0.7, 0.05, 0.02]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
    </group>
  );
}

function Pallet({ position }: Readonly<{ position: [number, number, number] }>) {
  return (
    <group position={position}>
      {[-0.4, 0, 0.4].map((x, i) => (
        <mesh key={`slat-${i}`} position={[x, 0.04, 0]} castShadow>
          <boxGeometry args={[0.15, 0.08, 1.2]} />
          <meshStandardMaterial color="#a1887f" />
        </mesh>
      ))}
      {[-0.45, 0, 0.45].map((z, i) => (
        <mesh key={`board-${i}`} position={[0, 0.1, z]} castShadow>
          <boxGeometry args={[1, 0.04, 0.18]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
      ))}
    </group>
  );
}

function HazardStripe({ position, rotation = [0, 0, 0], width, length }: Readonly<{
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  length: number;
}>) {
  return (
    <group position={position} rotation={rotation}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#ffeb3b" transparent opacity={0.4} />
      </mesh>
      <mesh position={[width / 2 + 0.02, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, length]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-width / 2 - 0.02, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, length]} />
        <meshStandardMaterial color="#1a1a1a" transparent opacity={0.6} />
      </mesh>
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

      <ShippingCrate position={[25, 0, -20]} color="#8d6e63" />
      <ShippingCrate position={[25, 0, 5]} color="#8d6e63" />
      <ShippingCrate position={[26.5, 0, -20]} color="#a1887f" size={[1, 0.8, 1]} />
      <ShippingCrate position={[25, 0.95, -20]} color="#6d4c41" size={[1, 0.7, 1]} />
      <ShippingCrate position={[26.5, 0, 5]} color="#795548" size={[1.1, 0.9, 1.1]} />

      <Pallet position={[24, 0, -10]} />
      <ShippingCrate position={[24, 0.13, -10]} color="#8d6e63" size={[0.9, 0.7, 0.9]} />
      <Pallet position={[26, 0, 15]} />
      <Pallet position={[24, 0, 20]} />
      <ShippingCrate position={[24, 0.13, 20]} color="#a1887f" size={[0.8, 0.6, 0.8]} />
      <ShippingCrate position={[24.7, 0.13, 20]} color="#6d4c41" size={[0.8, 0.6, 0.8]} />

      <SafetySign position={[-29.5, 4, -15]} text="SAFETY FIRST" rotation={[0, Math.PI / 2, 0]} />
      <SafetySign position={[-29.5, 4, 15]} text="WEAR PPE" rotation={[0, Math.PI / 2, 0]} />

      <WallPoster
        position={[-29.5, 3, 0]}
        rotation={[0, Math.PI / 2, 0]}
        bgColor="#1565c0"
        textColor="#ffffff"
        title="QUALITY CONTROL"
        subtitle="Check every item before packing"
      />
      <WallPoster
        position={[29.5, 3, -10]}
        rotation={[0, -Math.PI / 2, 0]}
        bgColor="#c62828"
        textColor="#ffffff"
        title="FIRE EXIT"
        subtitle="Keep clear at all times"
      />
      <WallPoster
        position={[29.5, 3, 10]}
        rotation={[0, -Math.PI / 2, 0]}
        bgColor="#2e7d32"
        textColor="#ffffff"
        title="PRODUCTION GOAL"
        subtitle="Fill orders accurately and on time"
      />
      <WallPoster
        position={[-10, 3, -29.5]}
        rotation={[0, 0, 0]}
        bgColor="#e65100"
        textColor="#ffffff"
        title="MACHINE AREA"
        subtitle="Authorized personnel only"
      />
      <WallPoster
        position={[10, 3, -29.5]}
        rotation={[0, 0, 0]}
        bgColor="#4527a0"
        textColor="#ffffff"
        title="TEAM WORK"
        subtitle="Together we deliver excellence"
      />

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

      <HazardStripe position={[0, 0.01, 0]} width={3} length={55} />

      {[-8, 8].map((x, i) => (
        <mesh key={`lane-${i}`} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.15, 60]} />
          <meshStandardMaterial color="#ffeb3b" transparent opacity={0.5} />
        </mesh>
      ))}

      {[[-15, 0.01, -5], [0, 0.01, -15], [15, 0.01, -5]].map(([x, y, z], i) => (
        <mesh key={`machine-zone-${i}`} position={[x, y, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[6, 5]} />
          <meshStandardMaterial color="#ff9800" transparent opacity={0.08} />
        </mesh>
      ))}
      {[[-15, 0.01, -5], [0, 0.01, -15], [15, 0.01, -5]].map(([x, y, z], i) => (
        <group key={`machine-border-${i}`}>
          {[[-3, 0, -2.5], [3, 0, -2.5], [-3, 0, 2.5], [3, 0, 2.5]].map(([ox, , oz], j) => (
            <mesh key={`corner-${i}-${j}`} position={[x + ox, y, z + oz]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.8, 0.08]} />
              <meshStandardMaterial color="#ff9800" transparent opacity={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      <CeilingPipes />
      <DustParticles />
    </group>
  );
}

function FactoryPracticeBooth({ position, playerPosition }: { position: [number, number, number]; playerPosition: THREE.Vector3 }) {
  const factoryPracticeUnlocked = useGame((s) => s.factoryPracticeUnlocked);
  const factoryPracticeCompleted = useGame((s) => s.factoryPracticeCompleted);
  const factoryPracticeActive = useGame((s) => s.factoryPracticeActive);
  const openFactoryPractice = useGame((s) => s.openFactoryPractice);
  const [isNear, setIsNear] = useState(false);
  const nearRef = useRef(false);
  const posVec = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const dist = playerPosition.distanceTo(posVec.current);
    const near = dist < 4;
    if (near !== nearRef.current) {
      nearRef.current = near;
      setIsNear(near);
    }
    if (glowRef.current && factoryPracticeUnlocked && !factoryPracticeCompleted) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = useGame.getState();
      if (e.code === "KeyE" && nearRef.current && s.factoryPracticeUnlocked && !s.factoryPracticeActive && !s.world3Dialogue && !s.activeMachine) {
        openFactoryPractice();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openFactoryPractice]);

  if (!factoryPracticeUnlocked) return null;

  const boothColor = factoryPracticeCompleted ? "#4caf50" : "#ff9800";

  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[3, 2.4, 2]} />
        <meshStandardMaterial color="#37474f" />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[3.2, 0.15, 2.2]} />
        <meshStandardMaterial color="#263238" />
      </mesh>
      <mesh ref={glowRef} position={[0, 1.5, 1.02]}>
        <boxGeometry args={[2.2, 1.2, 0.05]} />
        <meshStandardMaterial color={boothColor} emissive={boothColor} emissiveIntensity={0.5} />
      </mesh>
      <Text
        position={[0, 3.2, 0]}
        fontSize={0.35}
        color={boothColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        fontWeight="bold"
      >
        PRACTICE STATION
      </Text>
      {factoryPracticeCompleted && (
        <Text
          position={[0, 2.8, 0]}
          fontSize={0.2}
          color="#69f0ae"
          anchorX="center"
          anchorY="middle"
        >
          COMPLETED
        </Text>
      )}
      {isNear && !factoryPracticeActive && (
        <Text
          position={[0, 3.8, 0]}
          fontSize={0.25}
          color="#ffeb3b"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          Press E to Practice
        </Text>
      )}
      <pointLight position={[0, 3, 1]} color={boothColor} intensity={4} distance={8} />
    </group>
  );
}

export function FactoryWorld() {
  const [playerPos, setPlayerPos] = useState(new THREE.Vector3(0, 0, 25));
  const world3Dialogue = useGame((s) => s.world3Dialogue);
  const openWorld3Dialogue = useGame((s) => s.openWorld3Dialogue);
  const factoryQuestStarted = useGame((s) => s.factoryQuestStarted);
  const startFactoryQuest = useGame((s) => s.startFactoryQuest);
  const hatMachineState = useGame((s) => s.hatMachineState);
  const tshirtMachineState = useGame((s) => s.tshirtMachineState);
  const jacketMachineState = useGame((s) => s.jacketMachineState);
  const factoryOrderComplete = useGame((s) => s.factoryOrderComplete);
  const factoryPortalActive = useGame((s) => s.factoryPortalActive);
  const enterPsychicPortal = useGame((s) => s.enterPsychicPortal);

  const handlePositionUpdate = useCallback((pos: THREE.Vector3) => {
    setPlayerPos(pos.clone());
  }, []);

  const handleGeorgeInteract = useCallback(() => {
    if (world3Dialogue) return;

    if (!factoryQuestStarted) {
      openWorld3Dialogue([
        { speaker: "George", text: "Welcome to the manufacturing plant! I'm George, the floor manager." },
        { speaker: "George", text: "We just received a big order from the Olympic Village in Italy! I need your help to fulfill it." },
        { speaker: "George", text: "Here's what they need:" },
        { speaker: "George", text: "First: 2 size LARGE hats — white top, green brim, with red lettering that says \"Italy\"." },
        { speaker: "George", text: "Second: 3 size MEDIUM t-shirts — red sleeves, blue body, with white lettering that says \"USA\"." },
        { speaker: "George", text: "Third: 5 size LARGE jackets — black sleeves, red body, with yellow lettering that says \"Germany\"." },
        { speaker: "George", text: "Go to each machine and configure the settings to match the order. Press E near a machine to open its control panel." },
        { speaker: "George", text: "After each machine produces the items, pick them up, pack them in a box at the packing table, then load the box onto the shipping truck." },
        { speaker: "George", text: "Let's get this order filled! The Olympic Village is counting on us!" },
      ]);
      startFactoryQuest();
    } else if (factoryOrderComplete) {
      openWorld3Dialogue([
        { speaker: "George", text: "Outstanding work! All three shipments are loaded and ready to go!" },
        { speaker: "George", text: "The Olympic Village in Italy is going to be thrilled with their hats, t-shirts, and jackets." },
        { speaker: "George", text: "You're a natural at this. Great job fulfilling the order!" },
        { speaker: "George", text: "Now head over to the Practice Station to test what you've learned about functions!" },
      ]);
    } else {
      openWorld3Dialogue([
        { speaker: "George", text: "Remember the order for the Olympic Village:" },
        { speaker: "George", text: "2 LARGE hats: white top, green brim, \"Italy\" in red." },
        { speaker: "George", text: "3 MEDIUM t-shirts: red sleeves, blue body, \"USA\" in white." },
        { speaker: "George", text: "5 LARGE jackets: black sleeves, red body, \"Germany\" in yellow." },
        { speaker: "George", text: "Use each machine, pick up the products, box them at the packing table, and load them on the truck!" },
      ]);
    }
  }, [world3Dialogue, factoryQuestStarted, factoryOrderComplete, openWorld3Dialogue, startFactoryQuest]);

  const hatOutputPos: [number, number, number] = [-15 + 6, 0, -5];
  const tshirtOutputPos: [number, number, number] = [0 + 6, 0, -15];
  const jacketOutputPos: [number, number, number] = [15 + 6, 0, -5];

  return (
    <>
      <fog attach="fog" args={["#2a2418", 30, 65]} />
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
        machineType="hat"
        playerPosition={playerPos}
        machineState={hatMachineState}
      />

      <Machine
        position={[0, 0, -15]}
        label="T-SHIRT MAKER"
        color="#455a64"
        accentColor="#2196f3"
        productShape="tshirt"
        machineType="tshirt"
        playerPosition={playerPos}
        machineState={tshirtMachineState}
      />

      <Machine
        position={[15, 0, -5]}
        label="JACKET MAKER"
        color="#455a64"
        accentColor="#4caf50"
        productShape="jacket"
        machineType="jacket"
        playerPosition={playerPos}
        machineState={jacketMachineState}
      />

      {hatMachineState === "produced" && (
        <ProductPickup
          position={hatOutputPos}
          productType="hats"
          accentColor="#f44336"
          label="HATS READY"
          playerPosition={playerPos}
        />
      )}

      {tshirtMachineState === "produced" && (
        <ProductPickup
          position={tshirtOutputPos}
          productType="tshirts"
          accentColor="#2196f3"
          label="T-SHIRTS READY"
          playerPosition={playerPos}
        />
      )}

      {jacketMachineState === "produced" && (
        <ProductPickup
          position={jacketOutputPos}
          productType="jackets"
          accentColor="#4caf50"
          label="JACKETS READY"
          playerPosition={playerPos}
        />
      )}

      <PackingTable position={[0, 0, 10]} playerPosition={playerPos} />
      <ShippingTruck position={[20, 0, 25]} playerPosition={playerPos} />
      <FactoryPracticeBooth position={[-15, 0, 20]} playerPosition={playerPos} />

      {factoryPortalActive && (
        <Portal
          position={[0, 0, -25]}
          playerPosition={playerPos}
          onEnter={enterPsychicPortal}
        />
      )}
    </>
  );
}
