import React, { useEffect, useRef } from 'react';

interface SilkBackgroundProps {
  className?: string;
  speed?: number;
  scale?: number;
  interactive?: boolean;
}

export const SilkBackground: React.FC<SilkBackgroundProps> = ({
  className = '',
  speed = 0.6,
  scale = 1.0,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetMouse = useRef({ x: 0.5, y: 0.5 });
  const currentMouse = useRef({ x: 0.5, y: 0.5 });
  const targetScroll = useRef(0);
  const currentScroll = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    }) || (canvas.getContext('webgl') as WebGLRenderingContext | null);

    if (!gl) return;

    // Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec vec4(a_position, 0.0, 1.0);
      }
    `.replace('vec vec4', 'vec4');

    // Fragment Shader - ReactBits Silk Shader (Liquid Wave Domain-Warped Noise with Satin Specular)
    const fsSource = `
      precision highp float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform float uScroll;
      uniform float uScale;

      varying vec2 v_uv;

      // 2D Simplex Noise generator
      vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ) );
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Multi-layer Fractional Brownian Motion for liquid silk folds
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for (int i = 0; i < 4; i++) {
          value += amplitude * snoise(p * frequency);
          p += vec2(1.7, 3.2);
          frequency *= 2.05;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
        st *= 2.2 * uScale;

        // Interactive mouse & scroll influence
        vec2 mouseOffset = (uMouse - 0.5) * 1.2;
        st += mouseOffset * 0.3;
        st.y += uScroll * 0.0008;

        float t = uTime * 0.35;

        // Domain warping creating liquid ribbon folds
        vec2 q = vec2(0.0);
        q.x = fbm(st + vec2(0.0, t * 0.4));
        q.y = fbm(st + vec2(1.0, t * 0.3));

        vec2 r = vec2(0.0);
        r.x = fbm(st + 1.2 * q + vec2(1.7, 9.2) + 0.15 * t);
        r.y = fbm(st + 1.2 * q + vec2(8.3, 2.8) + 0.126 * t);

        // Add mouse ripple flow
        float distToMouse = length(v_uv - uMouse);
        float mouseWave = sin(distToMouse * 20.0 - t * 3.0) * exp(-distToMouse * 3.5) * 0.25;

        float f = fbm(st + r + mouseWave);

        // Silk Color Palette: Deep Violet, Electric Lavender, Satin Purple, Pearl Highlight
        vec3 colDeepViolet = vec3(0.09, 0.04, 0.20);   // #170a33
        vec3 colRoyalPurple = vec3(0.35, 0.12, 0.62);  // #591f9e
        vec3 colElectricLavender = vec3(0.65, 0.38, 0.95); // #a661f2
        vec3 colSatinHighlight = vec3(0.92, 0.85, 1.00);  // #ebe3ff
        vec3 colIndigoAccent = vec3(0.22, 0.28, 0.82); // #3847d1

        // Blend color layers based on domain warp result
        vec3 color = mix(colDeepViolet, colRoyalPurple, clamp(f * f * 3.5, 0.0, 1.0));
        color = mix(color, colElectricLavender, clamp(length(q), 0.0, 1.0));
        color = mix(color, colIndigoAccent, clamp(r.x * r.x, 0.0, 1.0));

        // Satin Specular Highlight for silk shine texture
        float df = length(q);
        float specular = pow(clamp(f * 1.3, 0.0, 1.0), 3.0) * 0.85;
        color += colSatinHighlight * specular;

        // Soft vignetting
        float vignette = 1.0 - smoothstep(0.5, 1.5, length(v_uv - 0.5));
        color *= vignette;

        gl_FragColor = vec4(color, 0.92);
      }
    `;

    // Helper to compile shader
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uResLoc = gl.getUniformLocation(program, 'uResolution');
    const uMouseLoc = gl.getUniformLocation(program, 'uMouse');
    const uScrollLoc = gl.getUniformLocation(program, 'uScroll');
    const uScaleLoc = gl.getUniformLocation(program, 'uScale');

    let animationFrameId: number;
    let startTime = performance.now();

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    const handleScroll = () => {
      targetScroll.current = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height; // Invert Y for WebGL
      targetMouse.current = { x, y };
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    resize();

    // Smooth render loop with lerp
    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001 * speed;

      // Smooth interpolation for mouse and scroll physics
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * 0.06;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * 0.06;
      currentScroll.current += (targetScroll.current - currentScroll.current) * 0.08;

      gl.useProgram(program);

      if (uTimeLoc) gl.uniform1f(uTimeLoc, elapsed);
      if (uResLoc) gl.uniform2f(uResLoc, canvas.width, canvas.height);
      if (uMouseLoc) gl.uniform2f(uMouseLoc, currentMouse.current.x, currentMouse.current.y);
      if (uScrollLoc) gl.uniform1f(uScrollLoc, currentScroll.current);
      if (uScaleLoc) gl.uniform1f(uScaleLoc, scale);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);

      gl.deleteBuffer(positionBuffer);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
    };
  }, [speed, scale, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full block pointer-events-none ${className}`}
    />
  );
};
