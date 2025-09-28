"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    VANTA?: any;
    THREE?: any;
  }
}

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    // Load Three.js and Vanta.js dynamically
    const loadScripts = async () => {
      if (typeof window === "undefined") return;

      // Load Three.js
      if (!window.THREE) {
        const threeScript = document.createElement("script");
        threeScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        document.head.appendChild(threeScript);

        await new Promise((resolve) => {
          threeScript.onload = resolve;
        });
      }

      // Load Vanta Globe
      if (!window.VANTA && window.THREE) {
        const vantaScript = document.createElement("script");
        vantaScript.src =
          "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.globe.min.js";
        document.head.appendChild(vantaScript);

        await new Promise((resolve) => {
          vantaScript.onload = resolve;
        });
      }

      // Initialize Vanta effect
      if (window.VANTA && vantaRef.current && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.GLOBE({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xffd700,
          backgroundColor: 0x0a0a0a,
          size: 0.8,
        });
      }
    };

    loadScripts();

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);

  return <div ref={vantaRef} className="fixed inset-0 -z-10 opacity-20" />;
}
