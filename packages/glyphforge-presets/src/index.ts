export type GlyphPreset = { id: string; type: 'svg' | 'lottie'; file: string; theme?: any; motion?: any };
export const presets: GlyphPreset[] = [];
export function getPreset(id: string): GlyphPreset | undefined { return presets.find(p => p.id === id); }