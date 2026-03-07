export function Lights() {
  return (
    <>
      <ambientLight intensity={0.45} color="#ffeedd" />
      <directionalLight
        position={[12, 18, 8]}
        intensity={1.4}
        color="#fff5e6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={60}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.001}
      />
      <hemisphereLight args={["#87ceeb", "#4a7a3a", 0.35]} />
      <directionalLight
        position={[-8, 10, -6]}
        intensity={0.2}
        color="#b0c4de"
      />
    </>
  );
}
