'use client';

import { useEffect, useState } from 'react';

import { GlassPanel } from '@/components/ui/GlassPanel';
import { fetchGovernancePolicies } from '@/lib/api-endpoints';
import { useWorldStore } from '@/stores/worldStore';

export function GovernancePanel(): React.JSX.Element | null {
  const policies = useWorldStore((state) => state.governancePolicies);
  const setGovernancePolicies = useWorldStore(
    (state) => state.setGovernancePolicies,
  );
  const simulationTickId = useWorldStore((state) => state.simulationTickId);
  const worldStateVariables = useWorldStore(
    (state) => state.worldStateVariables,
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void fetchGovernancePolicies()
      .then((response) => {
        setGovernancePolicies(response.data);
      })
      .catch(() => undefined);
  }, [setGovernancePolicies]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
        className="border-steel-blue/50 bg-space-dark/80 text-text-secondary hover:text-signal-cyan absolute top-16 right-4 z-30 rounded border px-3 py-1.5 text-xs backdrop-blur-md"
      >
        Council Policies
      </button>
    );
  }

  return (
    <GlassPanel className="absolute top-16 right-4 z-30 max-h-[50vh] w-80 overflow-auto p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-signal-cyan text-sm tracking-wide">
          Nation-State Rules
        </h2>
        <button
          type="button"
          className="text-text-secondary hover:text-text-primary text-xs"
          onClick={() => {
            setOpen(false);
          }}
        >
          Close
        </button>
      </div>

      {worldStateVariables ? (
        <div className="text-text-secondary mb-3 grid grid-cols-2 gap-2 text-xs">
          <span>Tick: {simulationTickId}</span>
          <span>Prosperity: {worldStateVariables.cityProsperity}</span>
          <span>Morale: {worldStateVariables.agentMorale}</span>
          <span>Defense: {worldStateVariables.defenseReadiness}</span>
        </div>
      ) : null}

      <ul className="space-y-2">
        {policies.map((policy) => (
          <li
            key={policy.id}
            className="border-steel-blue/30 rounded border p-2 text-xs"
          >
            <p className="text-text-primary font-medium">{policy.name}</p>
            <p className="text-text-secondary capitalize">{policy.domain}</p>
            <pre className="text-text-secondary mt-1 overflow-x-auto text-[10px]">
              {JSON.stringify(policy.rules, null, 0)}
            </pre>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
