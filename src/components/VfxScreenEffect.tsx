/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
}

interface VfxScreenEffectProps {
  trigger: boolean;
  type: 'success' | 'celebrate' | 'shop' | null;
  onComplete: () => void;
  lang: 'en' | 'ur';
}

export default function VfxScreenEffect({ trigger, type, onComplete, lang }: VfxScreenEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (trigger && type) {
      // Create bursts of particles
      const count = 60;
      const colors = [
        '#f59e0b', // Amber
        '#10b981', // Emerald
        '#3b82f6', // Blue
        '#ec4899', // Pink
        '#8b5cf6', // Purple
        '#ef4444'  // Red
      ];

      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        // Explode from the center of the viewport
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 15;
        newParticles.push({
          id: Date.now() + i,
          x: 50, // center %
          y: 50, // center %
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 6 + Math.random() * 10,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed
        });
      }

      setParticles(newParticles);
      setShowBanner(true);

      // Animation tick
      let animationFrameId: number;
      const startTime = Date.now();

      const updateParticles = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed > 2000) {
          setParticles([]);
          setShowBanner(false);
          onComplete();
          return;
        }

        setParticles(prev =>
          prev.map(p => ({
            ...p,
            x: p.x + p.velocityX * 0.15,
            y: p.y + p.velocityY * 0.15 + 0.3, // add gravity pull
            velocityY: p.velocityY + 0.1 // gravity acceleration
          }))
        );

        animationFrameId = requestAnimationFrame(updateParticles);
      };

      animationFrameId = requestAnimationFrame(updateParticles);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [trigger, type]);

  if (!trigger) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Screen flash pulse */}
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className={`absolute inset-0 ${
          type === 'shop' ? 'bg-indigo-500/15' : 'bg-emerald-500/15'
        }`}
      />

      {/* Render particles as floating beads */}
      {particles.map(p => (
        <span
          key={p.id}
          className="absolute rounded-full shadow-lg"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${p.size * 1.5}px ${p.color}`
          }}
        />
      ))}

      {/* Stunning celebratory overlay text banner */}
      <AnimatePresence>
        {showBanner && (
          <div className="absolute inset-x-0 bottom-1/3 flex flex-col items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.2, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              className="bg-white/95 backdrop-blur-md px-8 py-4 rounded-3xl shadow-xl border-4 border-[#efebe3] flex flex-col items-center max-w-sm text-center"
            >
              <span className="text-4xl mb-2">🎉</span>
              <h3 className="text-2xl font-serif font-black text-[#5a6a5a] tracking-tight">
                {lang === 'en' ? 'MUBARAK! 🎉' : 'مبارک ہو! 🎉'}
              </h3>
              <p className="text-sm font-medium text-[#3a3a3a] mt-1 leading-relaxed font-sans">
                {type === 'shop'
                  ? (lang === 'en' ? 'Your shop in Sawaldher is live!' : 'صوالڈھیر بازار میں آپ کی دکان کھل گئی!')
                  : (lang === 'en' ? 'Action completed successfully!' : 'کام کامیابی سے مکمل ہو گیا!')}
              </p>
              <div className="w-24 h-1 bg-[#d4a373] rounded-full mt-3 animate-pulse" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
