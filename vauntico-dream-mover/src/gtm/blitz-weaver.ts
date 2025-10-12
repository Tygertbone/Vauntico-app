import yaml from 'js-yaml'

export function generateWorkshop(attendees: number, priceUSD = 299) {
  const total = attendees * priceUSD
  const doc = {
    workshop: true,
    attendees,
    priceUSD,
    totalUSD: total
  }
  return yaml.dump(doc)
}
