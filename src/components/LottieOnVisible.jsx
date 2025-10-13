import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';

export default function LottieOnVisible({ src, loop = true, className = '', style, threshold = 0.4 }) {
  const containerRef = useRef(null);
  const lottieRef = useRef(null);
  const [data, setData] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let canceled = false;
    async function load() {
      const res = await fetch(src, { cache: 'force-cache' });
      if (!res.ok) return;
      const json = await res.json();
      if (!canceled) setData(json);
    }
    load();
    return () => { canceled = true; };
  }, [src]);

  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= threshold);
    }, { threshold });
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (!lottieRef.current) return;
    if (visible) lottieRef.current.play();
    else lottieRef.current.stop();
  }, [visible]);

  return (
    <div ref={containerRef} className={className} style={style}>
      {data && (
        <Lottie lottieRef={lottieRef} animationData={data} loop={loop} autoplay={false} />
      )}
    </div>
  );
}
