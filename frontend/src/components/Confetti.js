import React, { useEffect, useRef } from 'react';

// Simple confetti canvas that listens for a 'fireConfetti' CustomEvent on window
// Event detail: { x?: number, y?: number, count?: number }
export default function Confetti() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 9999;
    document.body.appendChild(canvas);
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let particles = [];

    const createParticles = (x, y, count) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          size: Math.random() * 6 + 4,
          life: Math.random() * 60 + 60,
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
        });
      }
    };

    const render = () => {
      animRef.current = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.vx *= 0.99; // air drag
        p.life -= 1;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, p.vx * 0.05, 0, Math.PI * 2);
        ctx.fill();
        if (p.y > canvas.height + 50 || p.life <= 0) {
          particles.splice(i, 1);
        }
      }
    };

    render();

    const onFire = (e) => {
      const detail = (e && e.detail) || {};
      const count = detail.count || 80;
      let x = detail.x;
      let y = detail.y;
      if (typeof x !== 'number' || typeof y !== 'number') {
        x = canvas.width / 2;
        y = canvas.height / 3;
      }
      createParticles(x, y, count);
    };

    window.addEventListener('fireConfetti', onFire);

    return () => {
      window.removeEventListener('fireConfetti', onFire);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return null;
}
