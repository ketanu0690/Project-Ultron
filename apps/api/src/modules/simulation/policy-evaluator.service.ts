import { Injectable } from '@nestjs/common';
import type { WorldStateVariables } from '@ultron/shared';

import { GovernanceService } from './governance.service';

export interface PolicyEvaluationResult {
  readonly wanderSpeedMultiplier: number;
  readonly roomBoundsEnforced: boolean;
  readonly crossDistrictBlocked: boolean;
  readonly utilizationCeiling: number;
}

@Injectable()
export class PolicyEvaluatorService {
  constructor(private readonly governance: GovernanceService) {}

  async evaluate(): Promise<PolicyEvaluationResult> {
    const rules = await this.governance.getRulesMap();

    const defenseLockdown = rules.defenseLockdown === true;
    const restrictOnAlert = rules.restrictCrossDistrictOnAlert === true;
    const threatLevel = rules.threatResponseLevel;

    return {
      wanderSpeedMultiplier:
        typeof rules.maxWanderSpeed === 'number'
          ? Math.min(rules.maxWanderSpeed, 2)
          : 1,
      roomBoundsEnforced: rules.enforceRoomBounds !== false,
      crossDistrictBlocked:
        defenseLockdown || (restrictOnAlert === true && threatLevel === 'auto'),
      utilizationCeiling:
        typeof rules.buildingUtilizationCeiling === 'number'
          ? rules.buildingUtilizationCeiling
          : 1,
    };
  }

  applyToWorldMetrics(
    variables: WorldStateVariables,
    evaluation: PolicyEvaluationResult,
  ): Partial<WorldStateVariables> {
    const patch: Partial<WorldStateVariables> = {};

    if (evaluation.crossDistrictBlocked) {
      patch.defenseReadiness = Math.min(100, variables.defenseReadiness + 2);
      patch.agentMorale = Math.max(0, variables.agentMorale - 1);
    }

    patch.cityProsperity = Math.min(
      100,
      Math.round(variables.cityProsperity * evaluation.utilizationCeiling),
    );

    return patch;
  }
}
