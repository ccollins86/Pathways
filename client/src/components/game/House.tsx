import { useTexture } from "@react-three/drei";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/lib/stores/useGame";

export const HOUSE_POS: [number, number, number] = [-15, 0, 5];

export function House() {
  const woodTexture = useTexture("/textures/wood.jpg");
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;

  const hurricaneTasks = useGame((s) => s.hurricaneTasks);
  const earthquakeTasks = useGame((s) => s.earthquakeTasks);
  const wildfireTasks = useGame((s) => s.wildfireTasks);

  const hx = HOUSE_POS[0];
  const hy = HOUSE_POS[1];
  const hz = HOUSE_POS[2];

  const W = 14;
  const D = 10;
  const WALL_H = 4;
  const FLOOR2_H = 3.5;

  return (
    <group>
      {/* ===== GROUND FLOOR ===== */}
      <mesh position={[hx, 0.05, hz]} receiveShadow>
        <boxGeometry args={[W, 0.1, D]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>

      {/* Back wall */}
      <mesh position={[hx, WALL_H / 2, hz - D / 2]} castShadow>
        <boxGeometry args={[W, WALL_H, 0.25]} />
        <meshStandardMaterial color="#f0e6d3" />
      </mesh>

      {/* Left wall */}
      <mesh position={[hx - W / 2, WALL_H / 2, hz]} castShadow>
        <boxGeometry args={[0.25, WALL_H, D]} />
        <meshStandardMaterial color="#f0e6d3" />
      </mesh>

      {/* Right wall */}
      <mesh position={[hx + W / 2, WALL_H / 2, hz]} castShadow>
        <boxGeometry args={[0.25, WALL_H, D]} />
        <meshStandardMaterial color="#f0e6d3" />
      </mesh>

      {/* Front wall - left section */}
      <mesh position={[hx - 4, WALL_H / 2, hz + D / 2]} castShadow>
        <boxGeometry args={[6, WALL_H, 0.25]} />
        <meshStandardMaterial color="#f0e6d3" />
      </mesh>

      {/* Front wall - right section */}
      <mesh position={[hx + 4, WALL_H / 2, hz + D / 2]} castShadow>
        <boxGeometry args={[6, WALL_H, 0.25]} />
        <meshStandardMaterial color="#f0e6d3" />
      </mesh>

      {/* Front wall - above double doors */}
      <mesh position={[hx, 3.25, hz + D / 2]} castShadow>
        <boxGeometry args={[2, 1.5, 0.25]} />
        <meshStandardMaterial color="#f0e6d3" />
      </mesh>

      {/* Grand double front doors */}
      <mesh position={[hx - 0.55, 1.25, hz + D / 2 + 0.05]} castShadow>
        <boxGeometry args={[1, 2.5, 0.12]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>
      <mesh position={[hx + 0.55, 1.25, hz + D / 2 + 0.05]} castShadow>
        <boxGeometry args={[1, 2.5, 0.12]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>
      {/* Door handles */}
      <mesh position={[hx - 0.15, 1.2, hz + D / 2 + 0.15]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[hx + 0.15, 1.2, hz + D / 2 + 0.15]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#DAA520" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Front columns */}
      {[-2.5, 2.5].map((xOff) => (
        <mesh key={`col-${xOff}`} position={[hx + xOff, WALL_H / 2, hz + D / 2 + 1]} castShadow>
          <cylinderGeometry args={[0.25, 0.3, WALL_H, 12]} />
          <meshStandardMaterial color="#e8e0d0" />
        </mesh>
      ))}
      {/* Column bases */}
      {[-2.5, 2.5].map((xOff) => (
        <mesh key={`colbase-${xOff}`} position={[hx + xOff, 0.15, hz + D / 2 + 1]}>
          <boxGeometry args={[0.8, 0.3, 0.8]} />
          <meshStandardMaterial color="#d4ccc0" />
        </mesh>
      ))}
      {/* Portico roof */}
      <mesh position={[hx, WALL_H + 0.1, hz + D / 2 + 0.5]} castShadow>
        <boxGeometry args={[7, 0.15, 2.5]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>

      {/* Front porch / steps */}
      <mesh position={[hx, 0.05, hz + D / 2 + 1]} receiveShadow>
        <boxGeometry args={[6, 0.1, 2]} />
        <meshStandardMaterial color="#c9b99a" />
      </mesh>
      <mesh position={[hx, 0.12, hz + D / 2 + 2]}>
        <boxGeometry args={[3, 0.15, 0.6]} />
        <meshStandardMaterial color="#b8a88a" />
      </mesh>

      {/* Back door */}
      <mesh position={[hx + 3, 1.25, hz - D / 2 - 0.05]} castShadow>
        <boxGeometry args={[1.5, 2.5, 0.12]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>

      {/* ===== SECOND FLOOR ===== */}
      <mesh position={[hx, WALL_H + 0.05, hz]} receiveShadow>
        <boxGeometry args={[W, 0.15, D]} />
        <meshStandardMaterial color="#d4c4a8" />
      </mesh>

      {/* 2nd floor walls */}
      <mesh position={[hx, WALL_H + FLOOR2_H / 2, hz - D / 2]} castShadow>
        <boxGeometry args={[W, FLOOR2_H, 0.25]} />
        <meshStandardMaterial color="#f0e6d3" />
      </mesh>
      <mesh position={[hx - W / 2, WALL_H + FLOOR2_H / 2, hz]} castShadow>
        <boxGeometry args={[0.25, FLOOR2_H, D]} />
        <meshStandardMaterial color="#f0e6d3" />
      </mesh>
      <mesh position={[hx + W / 2, WALL_H + FLOOR2_H / 2, hz]} castShadow>
        <boxGeometry args={[0.25, FLOOR2_H, D]} />
        <meshStandardMaterial color="#f0e6d3" />
      </mesh>
      <mesh position={[hx, WALL_H + FLOOR2_H / 2, hz + D / 2]} castShadow>
        <boxGeometry args={[W, FLOOR2_H, 0.25]} />
        <meshStandardMaterial color="#f0e6d3" />
      </mesh>

      {/* 2nd floor windows - front */}
      {[-4, -1.5, 1.5, 4].map((xOff) => (
        <mesh key={`w2f-${xOff}`} position={[hx + xOff, WALL_H + FLOOR2_H / 2, hz + D / 2 + 0.14]}>
          <boxGeometry args={[1, 1.4, 0.05]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
        </mesh>
      ))}
      {/* 2nd floor windows - back */}
      {[-4, -1.5, 1.5, 4].map((xOff) => (
        <mesh key={`w2b-${xOff}`} position={[hx + xOff, WALL_H + FLOOR2_H / 2, hz - D / 2 - 0.14]}>
          <boxGeometry args={[1, 1.4, 0.05]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* ===== ROOF ===== */}
      {/* Main peaked roof */}
      <mesh position={[hx, WALL_H + FLOOR2_H + 1.2, hz]} castShadow rotation={[0, 0, 0]}>
        <boxGeometry args={[W + 1.5, 0.2, D + 1]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      {/* Roof ridge */}
      <mesh position={[hx, WALL_H + FLOOR2_H + 1.8, hz]} castShadow>
        <boxGeometry args={[W - 2, 0.2, D - 2]} />
        <meshStandardMaterial color="#3d2e1f" />
      </mesh>
      {/* Roof peak */}
      <mesh position={[hx, WALL_H + FLOOR2_H + 2.2, hz]} castShadow>
        <boxGeometry args={[W - 5, 0.15, D - 4]} />
        <meshStandardMaterial color="#3d2e1f" />
      </mesh>
      {/* Chimney */}
      <mesh position={[hx + 4, WALL_H + FLOOR2_H + 2.8, hz - 1.5]} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[hx + 4, WALL_H + FLOOR2_H + 3.85, hz - 1.5]}>
        <boxGeometry args={[1.2, 0.15, 1.2]} />
        <meshStandardMaterial color="#6B3410" />
      </mesh>

      {/* ===== GROUND FLOOR WINDOWS ===== */}
      {/* Left wall windows (interactive) */}
      <mesh position={[hx - W / 2 - 0.14, 2.2, hz - 1]}>
        <boxGeometry args={[0.05, 1.4, 1.2]} />
        <meshStandardMaterial
          color={hurricaneTasks.window1Boarded ? "#8B4513" : "#87ceeb"}
          transparent={!hurricaneTasks.window1Boarded}
          opacity={hurricaneTasks.window1Boarded ? 1 : 0.5}
        />
      </mesh>
      <mesh position={[hx - W / 2 - 0.14, 2.2, hz + 2]}>
        <boxGeometry args={[0.05, 1.4, 1.2]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
      </mesh>

      {/* Right wall windows (interactive) */}
      <mesh position={[hx + W / 2 + 0.14, 2.2, hz - 1]}>
        <boxGeometry args={[0.05, 1.4, 1.2]} />
        <meshStandardMaterial
          color={hurricaneTasks.window2Boarded ? "#8B4513" : "#87ceeb"}
          transparent={!hurricaneTasks.window2Boarded}
          opacity={hurricaneTasks.window2Boarded ? 1 : 0.5}
        />
      </mesh>
      <mesh position={[hx + W / 2 + 0.14, 2.2, hz + 2]}>
        <boxGeometry args={[0.05, 1.4, 1.2]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
      </mesh>

      {/* Front windows (decorative) */}
      {[-5, 5].map((xOff) => (
        <mesh key={`fw-${xOff}`} position={[hx + xOff, 2.2, hz + D / 2 + 0.14]}>
          <boxGeometry args={[1.2, 1.4, 0.05]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Window labels */}
      <Text position={[hx - W / 2 - 0.3, 3.2, hz - 1]} fontSize={0.2} color="#333" anchorX="center" rotation={[0, Math.PI / 2, 0]}>
        Window 1
      </Text>
      <Text position={[hx + W / 2 + 0.3, 3.2, hz - 1]} fontSize={0.2} color="#333" anchorX="center" rotation={[0, -Math.PI / 2, 0]}>
        Window 2
      </Text>

      {/* Front door sandbags (when placed) */}
      {hurricaneTasks.frontDoorSandbagged && (
        <group>
          <mesh position={[hx - 0.6, 0.15, hz + D / 2 + 2.2]} castShadow>
            <boxGeometry args={[0.6, 0.25, 0.35]} />
            <meshStandardMaterial color="#c2a366" />
          </mesh>
          <mesh position={[hx + 0.6, 0.15, hz + D / 2 + 2.2]} castShadow>
            <boxGeometry args={[0.6, 0.25, 0.35]} />
            <meshStandardMaterial color="#c2a366" />
          </mesh>
          <mesh position={[hx, 0.15, hz + D / 2 + 2.5]} castShadow>
            <boxGeometry args={[0.6, 0.25, 0.35]} />
            <meshStandardMaterial color="#c2a366" />
          </mesh>
        </group>
      )}

      {/* Back door sandbags (when placed) */}
      {hurricaneTasks.backDoorSandbagged && (
        <group>
          <mesh position={[hx + 2.5, 0.15, hz - D / 2 - 0.5]} castShadow>
            <boxGeometry args={[0.6, 0.25, 0.35]} />
            <meshStandardMaterial color="#c2a366" />
          </mesh>
          <mesh position={[hx + 3.5, 0.15, hz - D / 2 - 0.5]} castShadow>
            <boxGeometry args={[0.6, 0.25, 0.35]} />
            <meshStandardMaterial color="#c2a366" />
          </mesh>
        </group>
      )}

      {/* Wildfire spray effect on walls */}
      {wildfireTasks.houseSprayed && (
        <>
          <mesh position={[hx, WALL_H / 2, hz + D / 2 + 0.2]}>
            <boxGeometry args={[W + 0.2, WALL_H, 0.01]} />
            <meshStandardMaterial color="#ccddff" transparent opacity={0.3} />
          </mesh>
          <mesh position={[hx, WALL_H / 2, hz - D / 2 - 0.2]}>
            <boxGeometry args={[W + 0.2, WALL_H, 0.01]} />
            <meshStandardMaterial color="#ccddff" transparent opacity={0.3} />
          </mesh>
          <mesh position={[hx - W / 2 - 0.2, WALL_H / 2, hz]}>
            <boxGeometry args={[0.01, WALL_H, D + 0.2]} />
            <meshStandardMaterial color="#ccddff" transparent opacity={0.3} />
          </mesh>
          <mesh position={[hx + W / 2 + 0.2, WALL_H / 2, hz]}>
            <boxGeometry args={[0.01, WALL_H, D + 0.2]} />
            <meshStandardMaterial color="#ccddff" transparent opacity={0.3} />
          </mesh>
        </>
      )}

      {/* ===== INTERIOR FURNITURE ===== */}
      {/* Grand dining table */}
      <mesh position={[hx - 3, 0.55, hz - 1]} castShadow>
        <boxGeometry args={[2.5, 0.1, 1.5]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>
      {[[-4, 0.27, -1.6], [-2, 0.27, -1.6], [-4, 0.27, -0.4], [-2, 0.27, -0.4]].map(
        (pos, i) => (
          <mesh key={`tleg-${i}`} position={[hx + pos[0], pos[1], hz + pos[2]]} castShadow>
            <boxGeometry args={[0.1, 0.55, 0.1]} />
            <meshStandardMaterial map={woodTexture} />
          </mesh>
        )
      )}

      {/* Living room couch */}
      <mesh position={[hx + 3, 0.35, hz + 2]} castShadow>
        <boxGeometry args={[3, 0.5, 1]} />
        <meshStandardMaterial color="#6B4226" />
      </mesh>
      <mesh position={[hx + 3, 0.75, hz + 1.6]} castShadow>
        <boxGeometry args={[3, 0.5, 0.2]} />
        <meshStandardMaterial color="#6B4226" />
      </mesh>
      {/* Couch armrests */}
      <mesh position={[hx + 4.4, 0.5, hz + 2]} castShadow>
        <boxGeometry args={[0.2, 0.6, 1]} />
        <meshStandardMaterial color="#5a3520" />
      </mesh>
      <mesh position={[hx + 1.6, 0.5, hz + 2]} castShadow>
        <boxGeometry args={[0.2, 0.6, 1]} />
        <meshStandardMaterial color="#5a3520" />
      </mesh>

      {/* Cabinet against back wall */}
      <mesh position={[hx - 4, 1.1, hz - 4.2]} castShadow>
        <boxGeometry args={[2, 2.2, 0.7]} />
        <meshStandardMaterial color="#a0522d" />
      </mesh>

      {/* Safety straps on furniture (when placed) */}
      {earthquakeTasks.furnitureStrapped && (
        <>
          <mesh position={[hx - 4, 1.6, hz - 3.85]}>
            <boxGeometry args={[0.08, 1.8, 0.08]} />
            <meshStandardMaterial color="#ff6600" />
          </mesh>
          <mesh position={[hx - 4, 0.9, hz - 3.85]}>
            <boxGeometry args={[0.08, 1.8, 0.08]} />
            <meshStandardMaterial color="#ff6600" />
          </mesh>
        </>
      )}

      {/* Bookshelf */}
      <mesh position={[hx + 3, 1.3, hz - 4.2]} castShadow>
        <boxGeometry args={[2, 2.6, 0.6]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      {[0.4, 1.0, 1.6, 2.2].map((y, i) => (
        <mesh key={`shelf-${i}`} position={[hx + 3, y, hz - 4.2]}>
          <boxGeometry args={[1.9, 0.05, 0.55]} />
          <meshStandardMaterial color="#8B6914" />
        </mesh>
      ))}

      {/* Fireplace */}
      <mesh position={[hx, 1.2, hz - 4.3]} castShadow>
        <boxGeometry args={[2.5, 2.4, 0.5]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      <mesh position={[hx, 0.5, hz - 4.1]}>
        <boxGeometry args={[1.2, 1, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Mantle */}
      <mesh position={[hx, 1.5, hz - 4.15]} castShadow>
        <boxGeometry args={[2.8, 0.12, 0.6]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>

      {/* Grand staircase */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((step) => (
        <mesh key={`stair-${step}`} position={[hx + 0.5, 0.25 + step * 0.45, hz + 0.5 - step * 0.5]} castShadow>
          <boxGeometry args={[1.8, 0.12, 0.5]} />
          <meshStandardMaterial color="#8B7355" />
        </mesh>
      ))}
      {/* Staircase railing */}
      <mesh position={[hx + 1.45, 2, hz - 1.5]} castShadow>
        <boxGeometry args={[0.06, 4, 0.06]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>
      <mesh position={[hx - 0.45, 2, hz - 1.5]} castShadow>
        <boxGeometry args={[0.06, 4, 0.06]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>

      {/* Gas pipe along wall */}
      <mesh position={[hx + 5, 0.6, hz - 4.5]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 1.2, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[hx + 5, 1.2, hz - 4.4]} castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.7, 8]} />
        <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Gas valve */}
      <mesh position={[hx + 5, 0.6, hz - 4.3]} castShadow>
        <boxGeometry args={[0.18, 0.18, 0.1]} />
        <meshStandardMaterial color={earthquakeTasks.gasShutOff ? "#4caf50" : "#f44336"} />
      </mesh>
      <Text position={[hx + 5, 0.3, hz - 4.2]} fontSize={0.12} color="#cccccc" anchorX="center">
        {earthquakeTasks.gasShutOff ? "Gas: OFF" : "Gas Line"}
      </Text>

      {/* ===== BACKYARD ===== */}
      {/* Backyard lawn */}
      <mesh position={[hx, 0.02, hz - D / 2 - 7]} receiveShadow>
        <boxGeometry args={[W + 4, 0.04, 10]} />
        <meshStandardMaterial color="#4a8c3f" />
      </mesh>

      {/* Backyard fence */}
      {/* Left fence */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`fl-${i}`} position={[hx - W / 2 - 2, 0.5, hz - D / 2 - 2 - i * 2.5]} castShadow>
          <boxGeometry args={[0.1, 1, 2.5]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
      ))}
      {/* Right fence */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={`fr-${i}`} position={[hx + W / 2 + 2, 0.5, hz - D / 2 - 2 - i * 2.5]} castShadow>
          <boxGeometry args={[0.1, 1, 2.5]} />
          <meshStandardMaterial color="#D2B48C" />
        </mesh>
      ))}
      {/* Back fence */}
      <mesh position={[hx, 0.5, hz - D / 2 - 12]} castShadow>
        <boxGeometry args={[W + 4, 1, 0.1]} />
        <meshStandardMaterial color="#D2B48C" />
      </mesh>
      {/* Fence posts */}
      {[-W / 2 - 2, -W / 2 + 2, 0, W / 2 - 2, W / 2 + 2].map((xOff, i) => (
        <mesh key={`fp-${i}`} position={[hx + xOff, 0.6, hz - D / 2 - 12]}>
          <boxGeometry args={[0.15, 1.2, 0.15]} />
          <meshStandardMaterial color="#C4A87C" />
        </mesh>
      ))}

      {/* Swimming pool */}
      <mesh position={[hx + 2, -0.2, hz - D / 2 - 6]} receiveShadow>
        <boxGeometry args={[5, 0.6, 3]} />
        <meshStandardMaterial color="#e0d8cc" />
      </mesh>
      <mesh position={[hx + 2, -0.05, hz - D / 2 - 6]}>
        <boxGeometry args={[4.6, 0.4, 2.6]} />
        <meshStandardMaterial color="#3da4d4" transparent opacity={0.7} />
      </mesh>
      {/* Pool edge tiles */}
      <mesh position={[hx + 2, 0.12, hz - D / 2 - 6]}>
        <boxGeometry args={[5.2, 0.06, 3.2]} />
        <meshStandardMaterial color="#d4ccc0" />
      </mesh>

      {/* Patio area */}
      <mesh position={[hx - 3, 0.06, hz - D / 2 - 2.5]} receiveShadow>
        <boxGeometry args={[5, 0.08, 3]} />
        <meshStandardMaterial color="#b8a88a" />
      </mesh>

      {/* Patio table */}
      <mesh position={[hx - 3, 0.55, hz - D / 2 - 2.5]} castShadow>
        <cylinderGeometry args={[0.8, 0.8, 0.08, 12]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      <mesh position={[hx - 3, 0.27, hz - D / 2 - 2.5]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.5, 8]} />
        <meshStandardMaterial color="#666" metalness={0.5} />
      </mesh>
      {/* Patio umbrella */}
      <mesh position={[hx - 3, 1.5, hz - D / 2 - 2.5]}>
        <cylinderGeometry args={[0.04, 0.04, 2, 6]} />
        <meshStandardMaterial color="#666" metalness={0.5} />
      </mesh>
      <mesh position={[hx - 3, 2.4, hz - D / 2 - 2.5]}>
        <coneGeometry args={[1.2, 0.5, 8]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>

      {/* Patio chairs */}
      {[[-4.2, -2.5], [-1.8, -2.5], [-3, -1.5], [-3, -3.5]].map(([xOff, zOff], i) => (
        <group key={`chair-${i}`}>
          <mesh position={[hx + xOff, 0.3, hz - D / 2 + zOff]} castShadow>
            <boxGeometry args={[0.5, 0.06, 0.5]} />
            <meshStandardMaterial color="#8B7355" />
          </mesh>
          <mesh position={[hx + xOff, 0.15, hz - D / 2 + zOff]}>
            <cylinderGeometry args={[0.03, 0.03, 0.3, 6]} />
            <meshStandardMaterial color="#666" metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Garden beds along back fence */}
      {[-5, -2, 1, 4].map((xOff, i) => (
        <group key={`garden-${i}`}>
          <mesh position={[hx + xOff, 0.15, hz - D / 2 - 11]}>
            <boxGeometry args={[2, 0.3, 1]} />
            <meshStandardMaterial color="#5a3a1a" />
          </mesh>
          <mesh position={[hx + xOff - 0.4, 0.45, hz - D / 2 - 11]}>
            <sphereGeometry args={[0.25, 6, 6]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#e74c3c" : "#f1c40f"} />
          </mesh>
          <mesh position={[hx + xOff + 0.3, 0.4, hz - D / 2 - 11]}>
            <sphereGeometry args={[0.2, 6, 6]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#e67e22" : "#e74c3c"} />
          </mesh>
          <mesh position={[hx + xOff, 0.42, hz - D / 2 - 11]}>
            <sphereGeometry args={[0.22, 6, 6]} />
            <meshStandardMaterial color="#27ae60" />
          </mesh>
        </group>
      ))}

      {/* Backyard trees */}
      {[[-6, -9], [6, -8]].map(([xOff, zOff], i) => (
        <group key={`byt-${i}`}>
          <mesh position={[hx + xOff, 1.5, hz - D / 2 + zOff]} castShadow>
            <cylinderGeometry args={[0.2, 0.25, 3, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[hx + xOff, 3.2, hz - D / 2 + zOff]} castShadow>
            <sphereGeometry args={[1.5, 8, 8]} />
            <meshStandardMaterial color="#2d7d2d" />
          </mesh>
        </group>
      ))}

      {/* Vegetation patches around mansion (disappear when cleared) */}
      {!wildfireTasks.vegetationCleared && (
        <>
          {[
            [hx - W / 2 - 1.5, 0.25, hz - 2],
            [hx - W / 2 - 1.5, 0.2, hz + 3],
            [hx + W / 2 + 1.5, 0.25, hz - 2],
            [hx + W / 2 + 1.5, 0.2, hz + 3],
            [hx - 3, 0.2, hz + D / 2 + 3],
            [hx + 3, 0.25, hz + D / 2 + 3],
            [hx, 0.2, hz - D / 2 - 1.5],
          ].map((pos, i) => (
            <mesh key={`veg-${i}`} position={pos as [number, number, number]} castShadow>
              <sphereGeometry args={[0.5, 6, 6]} />
              <meshStandardMaterial color="#3a7a2a" />
            </mesh>
          ))}
        </>
      )}

      {/* Labels for interaction points */}
      <Text position={[hx, 0.3, hz + D / 2 + 3]} fontSize={0.25} color="#FFD700" anchorX="center" outlineWidth={0.02} outlineColor="#000">
        Front Door
      </Text>
      <Text position={[hx + 3, 0.3, hz - D / 2 - 1.5]} fontSize={0.25} color="#FFD700" anchorX="center" outlineWidth={0.02} outlineColor="#000">
        Back Door
      </Text>
      <Text position={[hx, 0.3, hz - D / 2 - 6]} fontSize={0.2} color="#87ceeb" anchorX="center" outlineWidth={0.02} outlineColor="#000">
        Swimming Pool
      </Text>
    </group>
  );
}
