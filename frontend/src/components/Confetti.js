/*
src/components/Confetti.js

Canvas-based confetti particle animation system.
 
This component:
Creates a fixed-position canvas covering the entire viewport
Listens for 'fireConfetti' custom events on window
Renders animated particles with physics (gravity, drag, velocity)
Automatically cleans up particles when they fall off screen or expire

Usage: Mount this component once in the root, then dispatch events:
 ```window.dispatchEvent(new CustomEvent('fireConfetti', {  detail: { x: 100, y: 100, count: 80 } }));```
 
Event detail options:
@param {number} x - X coordinate for particle origin (default: center)
@param {number} y - Y coordinate for particle origin (default: upper third)
@param {number} count - Number of particles to create (default: 80)
*/

import React, { useEffect, useRef } from 'react';

function Confetti() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    // Create canvas element and add to DOM
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.left = 0;
    canvas.style.top = 0;
    canvas.style.pointerEvents = 'none';  // Allow clicks to pass through
    canvas.style.zIndex = 9999;           // Display above everything
    document.body.appendChild(canvas);
    
    canvasRef.current = canvas;
    const ctx = canvas.getContext('2d');

    /**
     * Resize canvas to match window dimensions
     * Called on component mount and on window resize
     */
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Array of active particles
    let particles = [];

    /**
     * Create new particles at specified location
     * @param {number} x - X coordinate for particle origin
     * @param {number} y - Y coordinate for particle origin
     * @param {number} count - Number of particles to create
     */
    const createParticles = (x, y, count) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;  // Random direction
        const speed = Math.random() * 6 + 2;         // Random speed 2-8
        
        particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,              // Horizontal velocity
          vy: Math.sin(angle) * speed - 2,          // Vertical velocity (slightly upward)
          size: Math.random() * 6 + 4,              // Size 4-10 pixels
          life: Math.random() * 60 + 60,            // Lifetime 60-120 frames
          color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`  // Random color
        });
      }
    };

    /**
    Animation frame loop
    Updates all particles (position, velocity, life) and renders them
     */

    const render = () => {
      animRef.current = requestAnimationFrame(render);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw each particle
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;
        
        // Apply physics
        p.vy += 0.15;  // Gravity (downward acceleration)
        p.vx *= 0.99;  // Air drag (slow horizontal movement)
        p.life -= 1;   // Decrease lifetime
        
        // Draw particle as ellipse
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, p.vx * 0.05, 0, Math.PI * 2);
        ctx.fill();
        
        // Remove particles that are off-screen or expired
        if (p.y > canvas.height + 50 || p.life <= 0) {
          particles.splice(i, 1);
        }
      }
    };

    render(); // Start animation loop

    /**
     * Handle fireConfetti custom event
     * @param {CustomEvent} e - Event with detail containing x, y, count
     */

    const onFire = (e) => {
      const detail = (e && e.detail) || {};
      const count = detail.count || 80;
      let x = detail.x;
      let y = detail.y;
      
      // Default to center/upper area if coordinates not provided
      if (typeof x !== 'number' || typeof y !== 'number') {
        x = canvas.width / 2;
        y = canvas.height / 3;
      }
      
      createParticles(x, y, count);
    };

    window.addEventListener('fireConfetti', onFire);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('fireConfetti', onFire);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  // This component renders nothing (returns null)
  // It only manages a canvas element for animation
  return null;
}

export default Confetti;
