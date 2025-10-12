import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

export function ShadowViewer(props: { mmdUrl: string }) {
  const { mmdUrl } = props
  const [svg, setSvg] = useState('')
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        const res = await fetch(mmdUrl)
        const text = await res.text()
        mermaid.initialize({ startOnLoad: false, theme: 'dark' })
        const { svg } = await mermaid.render('shadowGraph', text)
        if (mounted) setSvg(svg)
      } catch (e) {
        console.warn('ShadowViewer failed to render:', e)
      }
    }
    run()
    return () => { mounted = false }
  }, [mmdUrl])

  return <div ref={divRef} dangerouslySetInnerHTML={{ __html: svg }} />
}
