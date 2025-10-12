// Entitlements mapping between Vauntico Vault plans and Dream Mover tiers
export const ENTITLEMENTS_MAP = {
  // Vauntico plans -> Dream Mover tier keys
  "seekers-spark": {
    priceZAR: 199,
    dreamMoverTier: "Practitioner",
  },
  "weavers-pyre": {
    priceZAR: 499,
    dreamMoverTier: "Guild",
  },
  "eternal-blaze": {
    priceZAR: 999,
    dreamMoverTier: "Oracle",
  }
}

export function getPlanKeyByAmountZAR(amount) {
  // helper to reverse lookup by price
  const entry = Object.entries(ENTITLEMENTS_MAP).find(([, v]) => v.priceZAR === amount)
  return entry ? entry[0] : null
}
