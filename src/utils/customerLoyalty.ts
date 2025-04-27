export const LOYALTY_TIERS = {
  BRONZE: {
    name: 'Bronze',
    minPoints: 0,
    maxPoints: 999,
    benefits: [
      'Welcome drink on arrival',
      'Earn 1 point per $1 spent'
    ],
    discount: 0,
    color: 'bg-orange-700'
  },
  SILVER: {
    name: 'Silver',
    minPoints: 1000,
    maxPoints: 4999,
    benefits: [
      'Welcome drink on arrival',
      'Early check-in/late check-out (subject to availability)',
      'Earn 1.5 points per $1 spent',
      '5% discount on room rates'
    ],
    discount: 5,
    color: 'bg-gray-400'
  },
  GOLD: {
    name: 'Gold',
    minPoints: 5000,
    maxPoints: 9999,
    benefits: [
      'Room upgrade (subject to availability)',
      'Guaranteed early check-in/late check-out',
      'Earn 2 points per $1 spent',
      '10% discount on room rates',
      'Free breakfast',
      'Access to executive lounge'
    ],
    discount: 10,
    color: 'bg-yellow-500'
  },
  PLATINUM: {
    name: 'Platinum',
    minPoints: 10000,
    maxPoints: null,
    benefits: [
      'Guaranteed room upgrade',
      'Guaranteed early check-in/late check-out',
      'Earn 3 points per $1 spent',
      '20% discount on room rates',
      'Free breakfast',
      'Access to executive lounge',
      'Airport transfer service',
      'Personal concierge service'
    ],
    discount: 20,
    color: 'bg-gray-800'
  }
};

export const calculateLoyaltyTier = (points: number): keyof typeof LOYALTY_TIERS => {
  if (points >= LOYALTY_TIERS.PLATINUM.minPoints) return 'PLATINUM';
  if (points >= LOYALTY_TIERS.GOLD.minPoints) return 'GOLD';
  if (points >= LOYALTY_TIERS.SILVER.minPoints) return 'SILVER';
  return 'BRONZE';
};

export const getLoyaltyTierInfo = (tier: keyof typeof LOYALTY_TIERS) => {
  return LOYALTY_TIERS[tier];
};

export const getPointsToNextTier = (currentPoints: number) => {
  const currentTier = calculateLoyaltyTier(currentPoints);
  
  switch (currentTier) {
    case 'BRONZE':
      return LOYALTY_TIERS.SILVER.minPoints - currentPoints;
    case 'SILVER':
      return LOYALTY_TIERS.GOLD.minPoints - currentPoints;
    case 'GOLD':
      return LOYALTY_TIERS.PLATINUM.minPoints - currentPoints;
    case 'PLATINUM':
      return 0; // Already at highest tier
  }
};

export const calculatePointsForBooking = (amount: number, tier: keyof typeof LOYALTY_TIERS) => {
  switch (tier) {
    case 'BRONZE':
      return amount;
    case 'SILVER':
      return amount * 1.5;
    case 'GOLD':
      return amount * 2;
    case 'PLATINUM':
      return amount * 3;
  }
};
