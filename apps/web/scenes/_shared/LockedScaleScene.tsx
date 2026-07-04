'use client';

import { Html } from '@react-three/drei';
import { useNavigationStore } from '@/stores/navigationStore';

const LOCKED_SCALE_LABELS: Record<string, { title: string; phase: string }> = {
  galaxy: { title: 'Galaxy', phase: 'v2' },
  solar_system: { title: 'Solar System', phase: 'v1' },
  earth: { title: 'Earth', phase: 'v1' },
  orbital_ring: { title: 'Orbital Defense Ring', phase: 'v1' },
};

export default function LockedScaleScene(): React.JSX.Element {
  const currentScale = useNavigationStore((state) => state.currentScale);
  const info = LOCKED_SCALE_LABELS[currentScale] ?? {
    title: currentScale,
    phase: 'v1',
  };

  return (
    <group name={`scale-${currentScale}`}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[500, 32, 32]} />
        <meshStandardMaterial
          color="#0A0E1A"
          wireframe
          opacity={0.3}
          transparent
        />
      </mesh>
      <Html center position={[0, 0, 0]} distanceFactor={500}>
        <div className="border-signal-cyan/30 bg-void-black/90 rounded-lg border px-6 py-4 text-center backdrop-blur-md">
          <p className="text-text-primary text-lg font-medium">{info.title}</p>
          <p className="text-text-secondary mt-1 text-sm">
            Available in {info.phase}
          </p>
        </div>
      </Html>
    </group>
  );
}
