import React from 'react';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export default function LottieFromUrl({ src, loop = true, autoplay = true, className = '', style }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const res = await fetch(src, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`Failed to load ${src}: ${res.status}`);
        const json = await res.json();
        if (!canceled) setData(json);
      } catch (e) {
        if (!canceled) setError(e.message);
      }
    }
    load();
    return () => { canceled = true; };
  }, [src]);

  if (error) return <div role="status" className={className} style={style}>Animation error</div>;
  if (!data) return <div role="status" className={className} style={style}>Loading...</div>;
  return <Lottie animationData={data} loop={loop} autoplay={autoplay} className={className} style={style} />;
}