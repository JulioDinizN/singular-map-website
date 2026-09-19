import { Text } from '@react-three/drei';

interface DoorProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  isDouble?: boolean;
  label?: string;
  isEmergency?: boolean;
}

// Single or Double Architectural Door with Frame, Panels, Panic Hardware and Sign
export function ArchitecturalDoor({
  position,
  rotation = [0, 0, 0],
  width = 2.4,
  height = 2.4,
  isDouble = true,
  label = 'SAÍDA DE EMERGÊNCIA',
  isEmergency = true,
}: DoorProps) {
  const leafWidth = isDouble ? width / 2 : width;
  const frameThickness = 0.08;
  const frameDepth = 0.25;

  return (
    <group position={position} rotation={rotation}>
      {/* Outer Door Frame (Jambs & Lintel) */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, height, 0]}>
        <boxGeometry args={[width + frameThickness * 2, frameThickness, frameDepth]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Door Leaves (Architecturally Swung Open at ~60° to Show Walkway Clearance) */}
      {isDouble ? (
        <>
          {/* Left Door Leaf (Hinged on Left, Swung Open) */}
          <group position={[-width / 2 + frameThickness, 0, 0]} rotation={[0, Math.PI / 3, 0]}>
            <mesh position={[leafWidth / 2, height / 2, 0]} castShadow>
              <boxGeometry args={[leafWidth, height - 0.05, 0.06]} />
              <meshStandardMaterial
                color={isEmergency ? '#15803d' : '#f8fafc'}
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
            {/* Panic Exit Push Bar (Horizontal Red/Green Bar) */}
            {isEmergency && (
              <mesh position={[leafWidth / 2, 1.05, 0.05]} castShadow>
                <boxGeometry args={[leafWidth * 0.8, 0.08, 0.06]} />
                <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.5} />
              </mesh>
            )}
          </group>

          {/* Right Door Leaf (Hinged on Right, Swung Open) */}
          <group position={[width / 2 - frameThickness, 0, 0]} rotation={[0, -Math.PI / 3, 0]}>
            <mesh position={[-leafWidth / 2, height / 2, 0]} castShadow>
              <boxGeometry args={[leafWidth, height - 0.05, 0.06]} />
              <meshStandardMaterial
                color={isEmergency ? '#15803d' : '#f8fafc'}
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
            {/* Panic Exit Push Bar */}
            {isEmergency && (
              <mesh position={[-leafWidth / 2, 1.05, 0.05]} castShadow>
                <boxGeometry args={[leafWidth * 0.8, 0.08, 0.06]} />
                <meshStandardMaterial color="#ef4444" roughness={0.2} metalness={0.5} />
              </mesh>
            )}
          </group>
        </>
      ) : (
        /* Single Door Leaf */
        <group position={[-width / 2 + frameThickness, 0, 0]} rotation={[0, Math.PI / 3, 0]}>
          <mesh position={[leafWidth / 2, height / 2, 0]} castShadow>
            <boxGeometry args={[leafWidth, height - 0.05, 0.06]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[leafWidth * 0.85, 1.05, 0.04]}>
            <boxGeometry args={[0.04, 0.15, 0.06]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      )}

      {/* Floor Door Swing Arcs (Classic Architectural Quarter Circles) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[leafWidth * 0.95, leafWidth, 16, 1, 0, Math.PI / 3]} />
        <meshBasicMaterial color="#94a3b8" transparent opacity={0.6} />
      </mesh>
      {isDouble && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[leafWidth * 0.95, leafWidth, 16, 1, Math.PI - Math.PI / 3, Math.PI / 3]} />
          <meshBasicMaterial color="#94a3b8" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Illuminated Header Sign */}
      <group position={[0, height + 0.35, 0]}>
        <mesh castShadow>
          <boxGeometry args={[width * 0.9, 0.35, 0.15]} />
          <meshStandardMaterial
            color={isEmergency ? '#16a34a' : '#0284c7'}
            emissive={isEmergency ? '#15803d' : '#0369a1'}
            emissiveIntensity={0.6}
          />
        </mesh>
        <Text
          position={[0, 0, 0.09]}
          fontSize={0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </group>
  );
}

// All Doors throughout the Exhibition Venue matching the architectural floorplan
export function AllArchitecturalDoors() {
  return (
    <group>
      {/* 1. Main Entrance (Lobby South Facade: 4 Doors) */}
      <ArchitecturalDoor
        position={[-3.0, 0, 19.23]}
        rotation={[0, 0, 0]}
        width={2.6}
        height={2.6}
        isDouble
        isEmergency={false}
        label="ENTRADA PRINCIPAL"
      />
      <ArchitecturalDoor
        position={[3.0, 0, 19.23]}
        rotation={[0, 0, 0]}
        width={2.6}
        height={2.6}
        isDouble
        isEmergency={false}
        label="ENTRADA PRINCIPAL"
      />

      {/* 2. Top Center Emergency Exit (Avenida dos Palcos) */}
      <ArchitecturalDoor
        position={[0.0, 0, -20.88]}
        rotation={[0, Math.PI, 0]}
        width={3.0}
        height={2.5}
        isDouble
        isEmergency
        label="SAÍDA DE EMERGÊNCIA"
      />

      {/* 3. South-West Emergency Exit (under Startups) */}
      <ArchitecturalDoor
        position={[-26.13, 0, 14.04]}
        rotation={[0, 0, 0]}
        width={2.8}
        height={2.5}
        isDouble
        isEmergency
        label="SAÍDA DE EMERGÊNCIA"
      />

      {/* 4. South-East Emergency Exit (under Eve/Palco) */}
      <ArchitecturalDoor
        position={[25.15, 0, 14.04]}
        rotation={[0, 0, 0]}
        width={2.8}
        height={2.5}
        isDouble
        isEmergency
        label="SAÍDA DE EMERGÊNCIA"
      />

      {/* 5. West Mid Emergency Exit */}
      <ArchitecturalDoor
        position={[-35.41, 0, -0.06]}
        rotation={[0, Math.PI / 2, 0]}
        width={2.8}
        height={2.5}
        isDouble
        isEmergency
        label="SAÍDA DE EMERGÊNCIA"
      />

      {/* 6. West Top Emergency Exit */}
      <ArchitecturalDoor
        position={[-35.41, 0, -14.83]}
        rotation={[0, Math.PI / 2, 0]}
        width={2.8}
        height={2.5}
        isDouble
        isEmergency
        label="SAÍDA DE EMERGÊNCIA"
      />

      {/* 7. East Mid Emergency Exit (Food Court) */}
      <ArchitecturalDoor
        position={[36.69, 0, -0.06]}
        rotation={[0, -Math.PI / 2, 0]}
        width={2.8}
        height={2.5}
        isDouble
        isEmergency
        label="SAÍDA DE EMERGÊNCIA"
      />

      {/* 8. East Top Emergency Exit (Cafeteria / Restrooms) */}
      <ArchitecturalDoor
        position={[36.69, 0, -14.83]}
        rotation={[0, -Math.PI / 2, 0]}
        width={2.8}
        height={2.5}
        isDouble
        isEmergency
        label="SAÍDA DE EMERGÊNCIA"
      />

      {/* 9. Lobby Left Stairwell Door */}
      <ArchitecturalDoor
        position={[-11.2, 0, 15.0]}
        rotation={[0, Math.PI / 2, 0]}
        width={1.6}
        height={2.2}
        isDouble={false}
        isEmergency={false}
        label="ESCADA 2F"
      />

      {/* 10. Lobby Right Stairwell Door */}
      <ArchitecturalDoor
        position={[11.2, 0, 15.0]}
        rotation={[0, -Math.PI / 2, 0]}
        width={1.6}
        height={2.2}
        isDouble={false}
        isEmergency={false}
        label="ESCADA 2F"
      />

      {/* 11. Cafeteria Entrance Door */}
      <ArchitecturalDoor
        position={[31.8, 0, -11.23]}
        rotation={[0, Math.PI / 2, 0]}
        width={2.0}
        height={2.3}
        isDouble
        isEmergency={false}
        label="CAFETERIA"
      />

      {/* 12. East Restrooms Entrance Door */}
      <ArchitecturalDoor
        position={[31.8, 0, 10.5]}
        rotation={[0, Math.PI / 2, 0]}
        width={2.0}
        height={2.3}
        isDouble
        isEmergency={false}
        label="SANITÁRIOS"
      />

      {/* 13. North Corridor Central Door (Opening to Avenida dos Palcos) */}
      <ArchitecturalDoor
        position={[0.0, 0, -18.68]}
        rotation={[0, 0, 0]}
        width={2.6}
        height={2.4}
        isDouble
        isEmergency
        label="ACESSO SAÍDA"
      />
    </group>
  );
}
