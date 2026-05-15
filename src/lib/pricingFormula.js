/**
 * Fruitful™ Cost-Price-Linked Pricing Formula
 * Basis: ZAR ex-works cost price
 *
 * costPrice   → wholesale price  (cost × (1 + wholesaleMarkupPct/100))
 * wholesale   → retail price     (wholesale × (1 + retailMarkupPct/100))
 * cost        → online/sub price (cost × (1 + onlineMarkupPct/100))
 * All + VAT at vatPct%
 */

export function calcPrices(formula = {}) {
  const {
    costPriceZAR = 0,
    wholesaleMarkupPct = 40,
    retailMarkupPct = 80,
    onlineMarkupPct = 60,
    vatPct = 15,
    shippingZAR = 0,
  } = formula;

  const vat = (x) => x * (1 + vatPct / 100);

  const wholesale = vat(costPriceZAR * (1 + wholesaleMarkupPct / 100));
  const retail    = vat(wholesale    * (1 + retailMarkupPct   / 100));
  const online    = vat(costPriceZAR * (1 + onlineMarkupPct  / 100)) + shippingZAR;

  return {
    costPriceZAR,
    wholesaleZAR: +wholesale.toFixed(2),
    retailZAR:    +retail.toFixed(2),
    onlineZAR:    +online.toFixed(2),
  };
}

/** Apply subscriber tier discount to a product's online price */
export function applyTierDiscount(onlinePrice, discountPct = 0) {
  return +(onlinePrice * (1 - discountPct / 100)).toFixed(2);
}

/** Subscription monthly amount based on plan */
export const PLAN_CONFIG = {
  starter: {
    label: 'Starter',
    monthlyZAR: 299,
    quarterlyZAR: 799,
    annualZAR: 2799,
    discountPct: 5,
    maxProducts: 10,
    maxOrdersPerMonth: 20,
    freeShipping: false,
    features: ['Access to 10 products', '5% subscriber discount', 'Standard shipping'],
    color: 'from-blue-700 to-cyan-700',
    badge: 'bg-blue-900/40 text-blue-300 border-blue-700',
  },
  professional: {
    label: 'Professional',
    monthlyZAR: 799,
    quarterlyZAR: 2099,
    annualZAR: 7499,
    discountPct: 15,
    maxProducts: 50,
    maxOrdersPerMonth: 100,
    freeShipping: true,
    features: ['Access to 50 products', '15% subscriber discount', 'Free shipping', 'Priority support'],
    color: 'from-orange-700 to-amber-700',
    badge: 'bg-orange-900/40 text-orange-300 border-orange-700',
  },
  enterprise: {
    label: 'Enterprise',
    monthlyZAR: 1999,
    quarterlyZAR: 5299,
    annualZAR: 18999,
    discountPct: 25,
    maxProducts: 999,
    maxOrdersPerMonth: 9999,
    freeShipping: true,
    features: ['Unlimited products', '25% subscriber discount', 'Free shipping', 'Dedicated account manager', 'Sector + subnode access'],
    color: 'from-purple-700 to-indigo-700',
    badge: 'bg-purple-900/40 text-purple-300 border-purple-700',
  },
};