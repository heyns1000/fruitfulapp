import { base44 } from '@/api/base44Client';

const TIER_MULTIPLIERS = { bronze: 1, silver: 1.5, gold: 2, platinum: 3 };

/**
 * Awards points to a user's loyalty account after a purchase.
 * Call this after a successful order/payment confirmation.
 *
 * @param {string} userEmail - The buyer's email
 * @param {number} amountUSD  - Purchase amount in USD
 * @param {string} description - Human readable description e.g. "Purchase: Be Fruitful Fedora"
 * @param {string} orderId - The order ID
 * @param {string[]} sectors  - Sectors involved (for preference tracking)
 */
export async function awardPointsForPurchase(userEmail, amountUSD, description, orderId, sectors = []) {
  const accounts = await base44.entities.LoyaltyAccount.filter({ userEmail });
  if (!accounts.length) return;

  const account = accounts[0];
  const multiplier = TIER_MULTIPLIERS[account.tier] || 1;
  const pointsEarned = Math.floor(amountUSD * multiplier);

  const newTotal = (account.totalPoints || 0) + pointsEarned;
  const newAvailable = (account.availablePoints || 0) + pointsEarned;
  const newTier = computeTier(newTotal);

  // Update preferences
  const existingPrefs = account.preferences || [];
  const newPrefs = [...new Set([...existingPrefs, ...sectors])];

  await base44.entities.LoyaltyAccount.update(account.id, {
    totalPoints: newTotal,
    availablePoints: newAvailable,
    tier: newTier,
    totalSpend: (account.totalSpend || 0) + amountUSD,
    purchaseCount: (account.purchaseCount || 0) + 1,
    preferences: newPrefs,
    lastActivityDate: new Date().toISOString(),
    pointsHistory: [...(account.pointsHistory || []), {
      date: new Date().toISOString(),
      action: 'earn',
      points: pointsEarned,
      description,
      orderId
    }]
  });
}

function computeTier(totalPoints) {
  if (totalPoints >= 5000) return 'platinum';
  if (totalPoints >= 1500) return 'gold';
  if (totalPoints >= 500) return 'silver';
  return 'bronze';
}

/**
 * Award bonus points for non-purchase actions (e.g. referral, review)
 */
export async function awardBonusPoints(userEmail, points, description) {
  const accounts = await base44.entities.LoyaltyAccount.filter({ userEmail });
  if (!accounts.length) return;

  const account = accounts[0];
  const newTotal = (account.totalPoints || 0) + points;
  const newAvailable = (account.availablePoints || 0) + points;

  await base44.entities.LoyaltyAccount.update(account.id, {
    totalPoints: newTotal,
    availablePoints: newAvailable,
    tier: computeTier(newTotal),
    lastActivityDate: new Date().toISOString(),
    pointsHistory: [...(account.pointsHistory || []), {
      date: new Date().toISOString(),
      action: 'bonus',
      points,
      description
    }]
  });
}