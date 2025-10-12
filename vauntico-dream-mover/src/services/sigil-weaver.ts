import yaml from 'js-yaml'

export function generateConsult(org: string, hourlyUSD = 200, hours = 1) {
  const total = hourlyUSD * hours
  const doc = {
    org,
    service: 'Consulting',
    hourlyUSD,
    hours,
    totalUSD: total
  }
  return yaml.dump(doc)
}