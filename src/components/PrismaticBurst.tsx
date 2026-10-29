import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../services/audioEngine';

interface PrismaticBurstProps {
  isPlaying?: boolean;
  className?: string;
  intensity?: number;
}

export const PrismaticBurst: React.FC<PrismaticBurstProps> = ({
  isPlaying = false,
  className = '',
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animFrameId: number;
    let time = 0;

    // Prismatic rays configuration
    const rayCount = 36;
    const particlesCount = 45;

    // Floating iridescent sparkles
    const particles = Array.from({ length: particlesCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2.5 + 0.8,
      speedY: Math.random() * 0.001 + 0.0003,
      speedX: (Math.random() - 0.5) * 0.0005,
      alpha: Math.random() * 0.7 + 0.3,
      hue: Math.random() * 60 + 260, // Purple to lavender range
    }));

    const resize = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = (e.clientY - rect.top) / rect.height;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) {
        animFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const originX = mouseRef.current.x * width;
      const originY = mouseRef.current.y * height;

      // Get real audio reactivity if playing
      let audioBoost = 1.0;
      if (isPlaying) {
        const visData = audioEngine.getVisualizerData();
        if (visData && visData.length > 0) {
          const avg = visData.reduce((acc, val) => acc + val, 0) / visData.length;
          audioBoost = 1.0 + (avg / 255) * 0.6;
        }
      }

      // Deep dark violet base canvas
      ctx.fillStyle = '#0f061c';
      ctx.fillRect(0, 0, width, height);

      // Radial base ambient glow
      const baseGrad = ctx.createRadialGradient(
        originX,
        originY,
        0,
        originX,
        originY,
        Math.max(width, height) * 0.8
      );
      baseGrad.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
      baseGrad.addColorStop(0.35, 'rgba(126, 34, 206, 0.25)');
      baseGrad.addColorStop(0.7, 'rgba(59, 7, 100, 0.2)');
      baseGrad.addColorStop(1, 'rgba(15, 6, 28, 0.95)');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Draw Rotating Prismatic Burst Rays
      const speed = (isPlaying ? 0.008 : 0.004) * intensity;
      time += speed;

      const maxRadius = Math.sqrt(width * width + height * height) * 1.2;

      for (let i = 0; i < rayCount; i++) {
        const angleOffset = (i * Math.PI * 2) / rayCount;
        const currentAngle = angleOffset + time * (i % 2 === 0 ? 1 : -0.7);
        const rayWidth = (Math.PI * 2) / (rayCount * (1.8 + Math.sin(time + i) * 0.5));

        const startAngle = currentAngle - rayWidth / 2;
        const endAngle = currentAngle + rayWidth / 2;

        const rayGrad = ctx.createRadialGradient(
          originX,
          originY,
          0,
          originX,
          originY,
          maxRadius * (0.8 + Math.sin(time * 2 + i) * 0.2) * audioBoost
        );

        // Iridescent Color Palette: Violet, Orchid, Pink-Lavender, Pearl White
        const hueShift = (i * 10 + time * 30) % 360;
        if (i % 3 === 0) {
          rayGrad.addColorStop(0, 'rgba(233, 213, 255, 0.85)'); // Pearl White / Lavender
          rayGrad.addColorStop(0.4, 'rgba(192, 132, 252, 0.45)'); // Orchid
          rayGrad.addColorStop(1, 'rgba(59, 7, 100, 0)');
        } else if (i % 3 === 1) {
          rayGrad.addColorStop(0, 'rgba(192, 132, 252, 0.75)'); // Bright Lavender
          rayGrad.addColorStop(0.5, 'rgba(147, 51, 234, 0.35)'); // Royal Purple
          rayGrad.addColorStop(1, 'rgba(30, 10, 55, 0)');
        } else {
          rayGrad.addColorStop(0, 'rgba(244, 114, 182, 0.65)'); // Rose Pink Light
          rayGrad.addColorStop(0.45, 'rgba(126, 34, 206, 0.35)'); // Amethyst
          rayGrad.addColorStop(1, 'rgba(15, 6, 28, 0)');
        }

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.arc(originX, originY, maxRadius, startAngle, endAngle);
        ctx.closePath();
        ctx.fill();
      }

      // Draw Floating Iridescent Sparks
      particles.forEach((p) => {
        p.y -= p.speedY * (isPlaying ? 1.8 : 1.0);
        p.x += p.speedX;

        if (p.y < 0) p.y = 1;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;

        const px = p.x * width;
        const py = p.y * height;

        ctx.fillStyle = `hsla(${p.hue}, 85%, 75%, ${p.alpha * (0.6 + Math.sin(time * 5 + px) * 0.4)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size * (canvas.width / 1000) * audioBoost, 0, Math.PI * 2);
        ctx.fill();
      });

      // Central Prismatic Core Glow
      const coreGrad = ctx.createRadialGradient(
        originX,
        originY,
        0,
        originX,
        originY,
        140 * audioBoost
      );
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coreGrad.addColorStop(0.3, 'rgba(233, 213, 255, 0.7)');
      coreGrad.addColorStop(0.6, 'rgba(168, 85, 247, 0.35)');
      coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(originX, originY, 140 * audioBoost, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying, intensity]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
