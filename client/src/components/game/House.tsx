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

  return (
    <group>
      {/* Floor */}
      <mesh position={[hx, 0.05, hz]} receiveShadow>
        <boxGeometry args={[8, 0.1, 6]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>

      {/* Back wall */}
      <mesh position={[hx, 1.75, hz - 3]} castShadow>
        <boxGeometry args={[8, 3.5, 0.2]} />
        <meshStandardMaterial color="#e8d5b7" />
      </mesh>

      {/* Left wall */}
      <mesh position={[hx - 4, 1.75, hz]} castShadow>
        <boxGeometry args={[0.2, 3.5, 6]} />
        <meshStandardMaterial color="#e8d5b7" />
      </mesh>

      {/* Right wall */}
      <mesh position={[hx + 4, 1.75, hz]} castShadow>
        <boxGeometry args={[0.2, 3.5, 6]} />
        <meshStandardMaterial color="#e8d5b7" />
      </mesh>

      {/* Front wall left section */}
      <mesh position={[hx - 2.5, 1.75, hz + 3]} castShadow>
        <boxGeometry args={[3, 3.5, 0.2]} />
        <meshStandardMaterial color="#e8d5b7" />
      </mesh>

      {/* Front wall right section */}
      <mesh position={[hx + 2.5, 1.75, hz + 3]} castShadow>
        <boxGeometry args={[3, 3.5, 0.2]} />
        <meshStandardMaterial color="#e8d5b7" />
      </mesh>

      {/* Front wall top (above door) */}
      <mesh position={[hx, 2.75, hz + 3]} castShadow>
        <boxGeometry args={[2, 1.5, 0.2]} />
        <meshStandardMaterial color="#e8d5b7" />
      </mesh>

      {/* Front door frame */}
      <mesh position={[hx, 1, hz + 3.05]} castShadow>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Back door - on back wall */}
      <mesh position={[hx + 2, 1, hz - 3.05]} castShadow>
        <boxGeometry args={[1.5, 2, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Roof */}
      <mesh position={[hx, 3.6, hz]} castShadow>
        <boxGeometry args={[9, 0.2, 7]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>

      {/* Windows - left wall */}
      <mesh position={[hx - 4.11, 2, hz - 0.5]}>
        <boxGeometry args={[0.05, 1.2, 1]} />
        <meshStandardMaterial
          color={hurricaneTasks.window1Boarded ? "#8B4513" : "#87ceeb"}
          transparent={!hurricaneTasks.window1Boarded}
          opacity={hurricaneTasks.window1Boarded ? 1 : 0.5}
        />
      </mesh>

      {/* Windows - right wall */}
      <mesh position={[hx + 4.11, 2, hz - 0.5]}>
        <boxGeometry args={[0.05, 1.2, 1]} />
        <meshStandardMaterial
          color={hurricaneTasks.window2Boarded ? "#8B4513" : "#87ceeb"}
          transparent={!hurricaneTasks.window2Boarded}
          opacity={hurricaneTasks.window2Boarded ? 1 : 0.5}
        />
      </mesh>

      {/* Window labels */}
      <Text position={[hx - 4.2, 2.9, hz - 0.5]} fontSize={0.2} color="#333" anchorX="center" rotation={[0, Math.PI / 2, 0]}>
        Window 1
      </Text>
      <Text position={[hx + 4.2, 2.9, hz - 0.5]} fontSize={0.2} color="#333" anchorX="center" rotation={[0, -Math.PI / 2, 0]}>
        Window 2
      </Text>

      {/* Front door sandbags (when placed) */}
      {hurricaneTasks.frontDoorSandbagged && (
        <group>
          <mesh position={[hx - 0.4, 0.15, hz + 3.5]} castShadow>
            <boxGeometry args={[0.5, 0.25, 0.3]} />
            <meshStandardMaterial color="#c2a366" />
          </mesh>
          <mesh position={[hx + 0.4, 0.15, hz + 3.5]} castShadow>
            <boxGeometry args={[0.5, 0.25, 0.3]} />
            <meshStandardMaterial color="#c2a366" />
          </mesh>
        </group>
      )}

      {/* Back door sandbags (when placed) */}
      {hurricaneTasks.backDoorSandbagged && (
        <group>
          <mesh position={[hx + 1.6, 0.15, hz - 3.5]} castShadow>
            <boxGeometry args={[0.5, 0.25, 0.3]} />
            <meshStandardMaterial color="#c2a366" />
          </mesh>
          <mesh position={[hx + 2.4, 0.15, hz - 3.5]} castShadow>
            <boxGeometry args={[0.5, 0.25, 0.3]} />
            <meshStandardMaterial color="#c2a366" />
          </mesh>
        </group>
      )}

      {/* Wildfire spray effect on walls */}
      {wildfireTasks.houseSprayed && (
        <>
          <mesh position={[hx, 1.75, hz + 3.15]}>
            <boxGeometry args={[8.2, 3.5, 0.01]} />
            <meshStandardMaterial color="#ccddff" transparent opacity={0.3} />
          </mesh>
          <mesh position={[hx, 1.75, hz - 3.15]}>
            <boxGeometry args={[8.2, 3.5, 0.01]} />
            <meshStandardMaterial color="#ccddff" transparent opacity={0.3} />
          </mesh>
          <mesh position={[hx - 4.15, 1.75, hz]}>
            <boxGeometry args={[0.01, 3.5, 6.2]} />
            <meshStandardMaterial color="#ccddff" transparent opacity={0.3} />
          </mesh>
          <mesh position={[hx + 4.15, 1.75, hz]}>
            <boxGeometry args={[0.01, 3.5, 6.2]} />
            <meshStandardMaterial color="#ccddff" transparent opacity={0.3} />
          </mesh>
        </>
      )}

      {/* Interior furniture - table */}
      <mesh position={[hx - 2, 0.5, hz - 1]} castShadow>
        <boxGeometry args={[1.5, 0.1, 1]} />
        <meshStandardMaterial map={woodTexture} />
      </mesh>
      {[[-2.6, 0.25, -1.4], [-1.4, 0.25, -1.4], [-2.6, 0.25, -0.6], [-1.4, 0.25, -0.6]].map(
        (pos, i) => (
          <mesh key={`tleg-${i}`} position={[hx + pos[0], pos[1], hz + pos[2]]} castShadow>
            <boxGeometry args={[0.08, 0.5, 0.08]} />
            <meshStandardMaterial map={woodTexture} />
          </mesh>
        )
      )}

      {/* Interior furniture - cabinet against back wall */}
      <mesh position={[hx - 2.5, 1, hz - 2.5]} castShadow>
        <boxGeometry args={[1.5, 2, 0.6]} />
        <meshStandardMaterial color="#a0522d" />
      </mesh>

      {/* Safety straps on furniture (when placed) */}
      {earthquakeTasks.furnitureStrapped && (
        <>
          <mesh position={[hx - 2.5, 1.5, hz - 2.2]}>
            <boxGeometry args={[0.08, 1.5, 0.08]} />
            <meshStandardMaterial color="#ff6600" />
          </mesh>
          <mesh position={[hx - 2.5, 0.8, hz - 2.2]}>
            <boxGeometry args={[0.08, 1.5, 0.08]} />
            <meshStandardMaterial color="#ff6600" />
          </mesh>
        </>
      )}

      {/* Bookshelf against right side of back wall */}
      <mesh position={[hx + 2, 1.2, hz - 2.5]} castShadow>
        <boxGeometry args={[1.5, 2.4, 0.5]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      {/* Shelves */}
      {[0.4, 1.0, 1.6].map((y, i) => (
        <mesh key={`shelf-${i}`} position={[hx + 2, y, hz - 2.5]}>
          <boxGeometry args={[1.4, 0.05, 0.45]} />
          <meshStandardMaterial color="#8B6914" />
        </mesh>
      ))}
      {/* Books on shelf (disappear when task done) */}
      {!earthquakeTasks.booksInBag && (
        <>
          {[[-0.4, "#e74c3c"], [-0.2, "#3498db"], [0, "#2ecc71"], [0.2, "#9b59b6"], [0.4, "#f39c12"]].map(
            ([xOff, color], i) => (
              <mesh key={`book-${i}`} position={[hx + 2 + (xOff as number), 1.35, hz - 2.5]} castShadow>
                <boxGeometry args={[0.12, 0.3, 0.35]} />
                <meshStandardMaterial color={color as string} />
              </mesh>
            )
          )}
        </>
      )}

      {/* Brown bag on floor (always visible, fills up when books are in it) */}
      <mesh position={[hx + 2, 0.2, hz - 1]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.4]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      <Text position={[hx + 2, 0.5, hz - 0.78]} fontSize={0.12} color="#4a3000" anchorX="center">
        Brown Bag
      </Text>
      {/* Books in bag when task done */}
      {earthquakeTasks.booksInBag && (
        <group>
          {[[-0.15, "#e74c3c"], [0, "#3498db"], [0.15, "#2ecc71"]].map(
            ([xOff, color], i) => (
              <mesh key={`bagbook-${i}`} position={[hx + 2 + (xOff as number), 0.45, hz - 1]} castShadow>
                <boxGeometry args={[0.1, 0.15, 0.3]} />
                <meshStandardMaterial color={color as string} />
              </mesh>
            )
          )}
        </group>
      )}

      {/* Vegetation patches around house (disappear when cleared) */}
      {!wildfireTasks.vegetationCleared && (
        <>
          {[
            [hx - 5.5, 0.25, hz - 1],
            [hx - 5.5, 0.2, hz + 2],
            [hx + 5.5, 0.25, hz - 1],
            [hx + 5.5, 0.2, hz + 2],
            [hx - 2, 0.2, hz + 4.5],
            [hx + 2, 0.25, hz + 4.5],
            [hx, 0.2, hz - 4.5],
          ].map((pos, i) => (
            <mesh key={`veg-${i}`} position={pos as [number, number, number]} castShadow>
              <sphereGeometry args={[0.5, 6, 6]} />
              <meshStandardMaterial color="#3a7a2a" />
            </mesh>
          ))}
        </>
      )}

      {/* Labels for interaction points */}
      <Text position={[hx, 0.3, hz + 4]} fontSize={0.2} color="#FFD700" anchorX="center" outlineWidth={0.02} outlineColor="#000">
        Front Door
      </Text>
      <Text position={[hx + 2, 0.3, hz - 4]} fontSize={0.2} color="#FFD700" anchorX="center" outlineWidth={0.02} outlineColor="#000">
        Back Door
      </Text>
    </group>
  );
}
