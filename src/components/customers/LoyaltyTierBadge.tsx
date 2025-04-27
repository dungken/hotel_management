'use client';

import React from 'react';
import { LOYALTY_TIERS } from '@/utils/customerLoyalty';

interface LoyaltyTierBadgeProps {
  tier: keyof typeof LOYALTY_TIERS;
  points?: number;
  showPoints?: boolean;
}

export const LoyaltyTierBadge: React.FC<LoyaltyTierBadgeProps> = ({ 
  tier, 
  points, 
  showPoints = false 
}) => {
  const tierInfo = LOYALTY_TIERS[tier];

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${tierInfo.color} text-white`}>
      <span>{tierInfo.name}</span>
      {showPoints && points !== undefined && (
        <span className="ml-2">({points} pts)</span>
      )}
    </div>
  );
};
