import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const dict = {
  en: {
    lang: 'English',
    safe_move: 'Safe move',
    link: 'Link',
    verify: 'Verify hash',
    dry_run: 'Dry-run rehearsal'
  },
  af: {
    lang: 'Afrikaans',
    safe_move: 'Veilige skuif',
    link: 'Skakel',
    verify: 'Verifieer hash',
    dry_run: 'Proelopie (droë)'
  }
} as const

export type I18nResult = { out: string, lang: keyof typeof dict }

export function i18nWeave(planPath: string, lang: keyof typeof dict = 'en', outPath?: string): I18nResult {
  const d = dict[lang] || dict.en
  let abs = path.resolve(process.cwd(), planPath)
  if (!fs.existsSync(abs)) {
    // Fix duplicated module segment if present
    const dedup = abs.replace(/vauntico-dream-mover[\\/]+vauntico-dream-mover[\\/]/, 'vauntico-dream-mover' + path.sep)
    if (fs.existsSync(dedup)) {
      abs = dedup
    } else {
      const stripped = planPath.replace(/^vauntico-dream-mover[\\/]/, '')
      abs = path.resolve(process.cwd(), stripped)
    }
  }
  const data = yaml.load(fs.readFileSync(abs, 'utf8')) as any
  const augmented: any = {
    ...data,
    i18n: {
      lang,
      terms: d
    }
  }
  const out = outPath || (() => {
    const dir = path.dirname(abs)
    const base = path.basename(abs).replace(/\.ya?ml$/i, '')
    return path.join(dir, `${base}.${lang}.yml`)
  })()
  const y = yaml.dump(augmented, { lineWidth: 100 })
  fs.writeFileSync(out, y, 'utf8')
  return { out, lang }
}