import { Text } from '@react-three/drei';

interface ModularBoothProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  number: string;
  brandColor?: string;
}

function ModularStartupBooth({
  position,
  rotation = [0, 0, 0],
  number,
  brandColor = '#3b82f6',
}: ModularBoothProps) {
  const w = 1.25;
  const h = 2.2;
  const d = 1.7;

  return (
    <group position={position} rotation={rotation}>
      {/* Floor Plinth */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
      </mesh>

      {/* Back Wall (White Modular Panel) */}
      <mesh position={[0, h / 2, -d / 2 + 0.04]} castShadow receiveShadow>
        <boxGeometry args={[w, h, 0.08]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* Side Partition Walls */}
      <mesh position={[-w / 2 + 0.04, h / 2, 0]} castShadow>
        <boxGeometry args={[0.08, h, d * 0.95]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      <mesh position={[w / 2 - 0.04, h / 2, 0]} castShadow>
        <boxGeometry args={[0.08, h, d * 0.95]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* Branded Header Fascia Beam */}
      <mesh position={[0, h + 0.15, 0]} castShadow>
        <boxGeometry args={[w, 0.28, d * 0.98]} />
        <meshStandardMaterial color={brandColor} roughness={0.3} />
      </mesh>

      {/* Booth Number Plaque on Fascia */}
      <Text
        position={[0, h + 0.15, d / 2]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {number}
      </Text>

      {/* Front Reception Desk */}
      <mesh position={[0, 0.5, d * 0.15]} castShadow receiveShadow>
        <boxGeometry args={[w * 0.75, 0.9, 0.45]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Desk Top */}
      <mesh position={[0, 0.96, d * 0.15]} castShadow>
        <boxGeometry args={[w * 0.82, 0.06, 0.52]} />
        <meshStandardMaterial color="#334155" roughness={0.3} />
      </mesh>

      {/* Laptop / Monitor Display on Desk */}
      <mesh position={[0, 1.15, d * 0.12]} castShadow>
        <boxGeometry args={[0.35, 0.25, 0.04]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>

      {/* Stool / Chair behind the desk */}
      <mesh position={[0, 0.35, -d * 0.2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.65, 16]} />
        <meshStandardMaterial color="#64748b" roughness={0.5} />
      </mesh>
    </group>
  );
}

export function StartupAlley() {
  // 8 South Startup Booths (101 to 108) under Nubank
  const southBooths = [
    { num: '101', x: -24.8, color: '#0041C2' },
    { num: '102', x: -23.5, color: '#00A868' },
    { num: '103', x: -22.2, color: '#f43f5e' },
    { num: '104', x: -20.9, color: '#7c3aed' },
    { num: '105', x: -19.6, color: '#ea580c' },
    { num: '106', x: -18.3, color: '#0284c7' },
    { num: '107', x: -17.0, color: '#10b981' },
    { num: '108', x: -15.7, color: '#ca8a04' },
  ];

  // 8 West Startup Booths (W101 to W108) along the west wall
  const westBooths = [
    // Upper segment
    { num: 'W101', z: -12.5, color: '#6366f1' },
    { num: 'W102', z: -10.5, color: '#06b6d4' },
    { num: 'W103', z: -8.5, color: '#8b5cf6' },
    { num: 'W104', z: -6.5, color: '#ec4899' },
    // Lower segment
    { num: 'W105', z: 3.5, color: '#14b8a6' },
    { num: 'W106', z: 5.5, color: '#f59e0b' },
    { num: 'W107', z: 7.5, color: '#3b82f6' },
    { num: 'W108', z: 9.5, color: '#10b981' },
  ];

  return (
    <group>
      {/* South Row: facing North (towards Nubank) */}
      {southBooths.map((b) => (
        <ModularStartupBooth
          key={b.num}
          position={[b.x, 0, 13.0]}
          rotation={[0, 0, 0]}
          number={b.num}
          brandColor={b.color}
        />
      ))}

      {/* West Column: facing East (towards central aisles) */}
      {westBooths.map((b) => (
        <ModularStartupBooth
          key={b.num}
          position={[-34.2, 0, b.z]}
          rotation={[0, Math.PI / 2, 0]}
          number={b.num}
          brandColor={b.color}
        />
      ))}
    </group>
  );
}
