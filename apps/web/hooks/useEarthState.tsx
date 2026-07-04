'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { EarthState } from '@ultron/shared';

import { fetchEarthState } from '@/lib/api-endpoints';
import { MOCK_EARTH_STATE } from '@/scenes/earth/earth.mock';
import { useNavigationStore } from '@/stores/navigationStore';

interface EarthStateContextValue {
  readonly state: EarthState;
  readonly sunAngle: number;
  readonly setSunAngle: (angle: number) => void;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly isMockData: boolean;
}

const EarthStateContext = createContext<EarthStateContextValue | null>(null);

export function EarthStateProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const [state, setState] = useState<EarthState>(MOCK_EARTH_STATE);
  const [sunAngle, setSunAngleState] = useState(45);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadEarthState(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchEarthState();
        if (cancelled) {
          return;
        }

        setState(response.data);
        setSunAngleState(((response.data.rotation % 360) + 360) % 360);
        setIsMockData(false);
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        setState(MOCK_EARTH_STATE);
        setIsMockData(true);
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Failed to load earth state',
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadEarthState();

    return () => {
      cancelled = true;
    };
  }, []);

  const setSunAngle = useCallback((angle: number) => {
    setSunAngleState(((angle % 360) + 360) % 360);
  }, []);

  const value = useMemo(
    () => ({
      state,
      sunAngle,
      setSunAngle,
      isLoading,
      error,
      isMockData,
    }),
    [state, sunAngle, setSunAngle, isLoading, error, isMockData],
  );

  return (
    <EarthStateContext.Provider value={value}>
      {children}
    </EarthStateContext.Provider>
  );
}

export function useEarthState(): EarthStateContextValue {
  const context = useContext(EarthStateContext);
  if (!context) {
    throw new Error('useEarthState must be used within EarthStateProvider');
  }
  return context;
}

export function useEarthHudVisibility(): boolean {
  return useNavigationStore((s) => s.currentScale === 'earth');
}
