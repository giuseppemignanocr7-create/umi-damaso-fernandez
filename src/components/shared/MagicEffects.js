import React, { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/* ═══════════════════════════════════════════════════
   MAGIC EFFECTS ENGINE
   - Star burst on page transitions
   - Sparkle trail following cursor
   - Floating ambient particles
   - Scroll-triggered sparkles
   ═══════════════════════════════════════════════════ */

const STAR_CHARS = ['✦', '✧', '⭐', '★', '✨', '⚡', '💫', '·', '✵'];
const COLORS = [
  '#d4a843', '#f5e6a3', '#b8922e',   // gold
  '#9b7ed8', '#c084fc', '#a855f7',   // purple
  '#ffffff', '#e8d5ff', '#fef3c7',   // white/light
];

function randomBetween(a, b) { return a + Math.random() * (b - a); }
function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ─── PARTICLE BURST (page transitions, clicks) ───
function createBurst(container, x, y, count = 30) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const size = randomBetween(6, 20);
    const angle = (Math.PI * 2 * i) / count + randomBetween(-0.3, 0.3);
    const velocity = randomBetween(60, 200);
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    const dur = randomBetween(0.6, 1.4);
    const char = randomItem(STAR_CHARS);
    const color = randomItem(COLORS);

    Object.assign(el.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${size}px`,
      lineHeight: '1',
      color: color,
      pointerEvents: 'none',
      zIndex: '99999',
      textShadow: `0 0 ${size}px ${color}`,
      transform: 'translate(-50%, -50%) scale(1)',
      transition: `all ${dur}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      opacity: '1',
    });
    el.textContent = char;
    container.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0) rotate(${randomBetween(-180, 180)}deg)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), dur * 1000 + 100);
  }
}

// ─── SPARKLE TRAIL (mouse) ───
function createSparkle(container, x, y) {
  const el = document.createElement('div');
  const size = randomBetween(4, 12);
  const color = randomItem(COLORS);
  const char = randomItem(['✦', '✧', '·', '★', '✨']);

  Object.assign(el.style, {
    position: 'fixed',
    left: `${x}px`,
    top: `${y}px`,
    fontSize: `${size}px`,
    lineHeight: '1',
    color: color,
    pointerEvents: 'none',
    zIndex: '99998',
    textShadow: `0 0 ${size * 2}px ${color}`,
    transform: 'translate(-50%, -50%) scale(1)',
    transition: 'all 0.8s ease-out',
    opacity: '1',
  });
  el.textContent = char;
  container.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = `translate(calc(-50% + ${randomBetween(-30, 30)}px), calc(-50% + ${randomBetween(-50, -20)}px)) scale(0)`;
    el.style.opacity = '0';
  });

  setTimeout(() => el.remove(), 900);
}

// ─── SMOKE PUFF ───
function createSmoke(container, x, y, count = 8) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const size = randomBetween(30, 80);
    const dur = randomBetween(1, 2);

    Object.assign(el.style, {
      position: 'fixed',
      left: `${x + randomBetween(-40, 40)}px`,
      top: `${y + randomBetween(-20, 20)}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: `radial-gradient(circle, rgba(155, 126, 216, 0.3) 0%, transparent 70%)`,
      pointerEvents: 'none',
      zIndex: '99997',
      transform: 'translate(-50%, -50%) scale(0.3)',
      transition: `all ${dur}s ease-out`,
      opacity: '0.6',
      filter: 'blur(8px)',
    });
    container.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translate(calc(-50% + ${randomBetween(-60, 60)}px), calc(-50% + ${randomBetween(-120, -40)}px)) scale(1.5)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), dur * 1000 + 100);
  }
}

// ─── FLOATING AMBIENT PARTICLES ───
function createAmbientParticle(container) {
  const el = document.createElement('div');
  const size = randomBetween(2, 5);
  const color = randomItem(COLORS.slice(0, 3)); // only gold
  const startX = randomBetween(0, window.innerWidth);
  const dur = randomBetween(4, 8);

  Object.assign(el.style, {
    position: 'fixed',
    left: `${startX}px`,
    bottom: '-10px',
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 ${size * 3}px ${color}`,
    pointerEvents: 'none',
    zIndex: '99996',
    opacity: '0',
    transition: `all ${dur}s linear`,
  });
  container.appendChild(el);

  requestAnimationFrame(() => {
    el.style.bottom = `${window.innerHeight + 20}px`;
    el.style.left = `${startX + randomBetween(-100, 100)}px`;
    el.style.opacity = '0.7';
  });

  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 1000);
  }, dur * 600);
}

// ─── HAT BURST (for login) ───
export function triggerHatBurst(x, y) {
  const container = document.getElementById('magic-fx-layer');
  if (!container) return;
  createSmoke(container, x, y, 12);
  setTimeout(() => createBurst(container, x, y, 40), 150);
  setTimeout(() => createBurst(container, x, y - 30, 20), 400);
}

// ─── CLICK SPARKLE (for buttons/cards) ───
export function triggerClickSparkle(e) {
  const container = document.getElementById('magic-fx-layer');
  if (!container) return;
  createBurst(container, e.clientX, e.clientY, 12);
}

// ═══ MAIN COMPONENT ═══
export default function MagicEffects() {
  const containerRef = useRef(null);
  const location = useLocation();
  const lastMoveRef = useRef(0);
  const scrollYRef = useRef(0);

  // Page transition burst
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    createSmoke(container, cx, cy, 6);
    setTimeout(() => createBurst(container, cx, cy, 25), 100);
  }, [location.pathname]);

  // Mouse sparkle trail
  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastMoveRef.current < 50) return; // throttle
    lastMoveRef.current = now;

    const container = containerRef.current;
    if (!container) return;

    if (Math.random() > 0.4) return; // only 60% of moves
    createSparkle(container, e.clientX, e.clientY);
  }, []);

  // Scroll sparkles
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const delta = Math.abs(window.scrollY - scrollYRef.current);
    scrollYRef.current = window.scrollY;

    if (delta > 30) {
      for (let i = 0; i < 3; i++) {
        createSparkle(container, randomBetween(0, window.innerWidth), randomBetween(0, window.innerHeight));
      }
    }
  }, []);

  // Ambient floating particles
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.5) createAmbientParticle(container);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleMouseMove, handleScroll]);

  return (
    <div
      id="magic-fx-layer"
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        overflow: 'hidden',
      }}
    />
  );
}
