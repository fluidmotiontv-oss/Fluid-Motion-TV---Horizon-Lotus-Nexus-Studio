import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Waves,
  ShieldCheck,
  Clock,
  Radio,
  Zap,
  Globe,
  ChevronDown,
  Play,
  Square,
  Mic,
  User,
  Users,
  Settings,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TideData, ScriptLine, ViewMode } from '../types';

// ─── TELEPROMPTER SCRIPT ───
const SCRIPT_LINES: ScriptLine[] = [
  { speaker: 'timi', text: "The old world runs on 60-minute hours. We run on 54." },
  { speaker: 'kimi', text: "Dragon Nine time. 26.667 hours per cycle. Two apex periods daily at 9 degrees peak." },
  { speaker: 'timi', text: "This is the Horizon Engine. Real-time plasma and geometry fusion." },
  { speaker: 'kimi', text: "Every pixel is generated. Every frequency is synthesized. Nothing is pre-rendered." },
  { speaker: 'timi', text: "The Tide Oracle reads the river mouth bar. Live depth. Live velocity. Live safety." },
  { speaker: 'kimi', text: "Bar crossing safe at 1.5 meters. Flooding or ebbing — the engine knows." },
  { speaker: 'timi', text: "Sovereign infrastructure. No gatekeepers. No middlemen. Just signal." },
  { speaker: 'kimi', text: "Broadcast stage. Mesh gateway. Tide synth. Economy dormant, waiting." },
  { speaker: 'timi', text: "This is Fluid Motion TV. This is the future." },
  { speaker: 'both', text: "Kimi and Timi. Dragon Nine is emerging." },
];

// ─── D9 CLOCK HOOK ───
function useD9Clock() {
  const [time, setTime] = useState({ hour: '--', minute: '--', progress: 0, label: '' });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nzOffset = 12;
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const nzTime = new Date(utc + nzOffset * 3600000);
      const mins = nzTime.getHours() * 60 + nzTime.getMinutes();
      const d9Hour = Math.floor(mins / 54);
      const d9Min = mins % 54;
      const cycleMins = 1440;
      const progress = (mins / cycleMins) * 100;
      setTime({
        hour: String(d9Hour).padStart(2, '0'),
        minute: String(d9Min).padStart(2, '0'),
        progress,
        label: `Cycle ${progress.toFixed(1)}% • 54m hr`
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─── SIMULATED TIDE HOOK ───
function useSimulatedTide(): TideData {
  const [data, setData] = useState<TideData>({
    heightM: 1.8,
    meanLevelM: 1.4,
    direction: 'flooding',
    velocityKnots: 2.3,
    barCrossingSafe: true,
    locationName: 'River Mouth Bar',
    nextHighAt: new Date(Date.now() + 2.5 * 3600000).toISOString()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const t = Date.now() / 1000;
      const height = 1.4 + 0.8 * Math.sin(t * 0.0008);
      setData(prev => ({
        ...prev,
        heightM: parseFloat(height.toFixed(2)),
        direction: Math.cos(t * 0.0008) > 0 ? 'flooding' : 'ebbing',
        velocityKnots: parseFloat((Math.abs(Math.cos(t * 0.0008)) * 3.5).toFixed(1)),
        barCrossingSafe: height > 1.5
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  return data;
}

// ─── WEBGL PLASMA HOOK ───
function usePlasmaEngine(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const intensityRef = useRef(0.6);
  const rafRef = useRef<number>(0);

  const setIntensity = useCallback((v: number) => {
    intensityRef.current = v;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, preserveDrawingBuffer: true });
    if (!gl) return;

    let W = 0, H = 0, DPR = 1;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      W = rect.width;
      H = rect.height;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    };
    resize();
    window.addEventListener('resize', resize);

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = `attribute vec2 a_pos; void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;
    const fs = `precision highp float;
    uniform float u_time;
    uniform vec2 u_res;
    uniform vec2 u_mouse;
    uniform float u_intensity;
    uniform float u_tideHeight;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 6; i++) {
        v += a * noise(p);
        p *= 2.03;
        a *= 0.49;
      }
      return v;
    }
    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      vec2 p = uv * 3.5;
      vec2 mouse = u_mouse / u_res;
      float md = length(uv - mouse);
      float mi = smoothstep(0.45, 0.0, md) * u_intensity;
      float t = u_time * 0.25;
      float n1 = fbm(p + vec2(t, t * 0.7));
      float n2 = fbm(p * 1.4 - vec2(t * 0.6, t) + 4.0);
      float n3 = fbm(p * 2.1 + vec2(n1 * 1.5, n2 * 1.5) + t * 0.3);
      n3 += mi * sin(md * 40.0 - u_time * 6.0) * 0.5;
      n3 += mi * sin(md * 25.0 + u_time * 4.0) * 0.3;
      float tide = u_tideHeight;
      vec3 c1 = vec3(0.01, 0.02, 0.08);
      vec3 c2 = mix(vec3(0.0, 0.35, 0.55), vec3(0.0, 0.55, 0.35), tide);
      vec3 c3 = mix(vec3(0.45, 0.05, 0.45), vec3(0.55, 0.35, 0.0), 1.0 - tide);
      vec3 c4 = vec3(0.85, 0.95, 1.0);
      vec3 col = mix(c1, c2, n1);
      col = mix(col, c3, n2 * 0.6);
      col = mix(col, c4, pow(max(n3 - 0.3, 0.0), 2.0) * 3.0);
      float vig = 1.0 - length(uv - 0.5) * 0.7;
      col *= vig;
      col *= 0.95 + 0.05 * sin(uv.y * u_res.y * 0.7);
      gl_FragColor = vec4(col, 1.0);
    }`;

    const prog = gl.createProgram();
    if (!prog) return;
    const vsS = compile(gl.VERTEX_SHADER, vs);
    const fsS = compile(gl.FRAGMENT_SHADER, fs);
    if (!vsS || !fsS) return;

    gl.attachShader(prog, vsS);
    gl.attachShader(prog, fsS);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uIntensity = gl.getUniformLocation(prog, 'u_intensity');
    const uTideHeight = gl.getUniformLocation(prog, 'u_tideHeight');

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.tx = (e.clientX - rect.left) * DPR;
      mouseRef.current.ty = (H - (e.clientY - rect.top)) * DPR;
    };
    window.addEventListener('mousemove', onMove);

    const loop = (now: number) => {
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.08;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, now * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uIntensity, intensityRef.current);
      gl.uniform1f(uTideHeight, 0.5);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [canvasRef]);

  return { setIntensity };
}

// ─── PARTICLE FIELD COMPONENT ───
function ParticleField({ tideHeight }: { tideHeight: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, DPR = 1;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      W = rect.width;
      H = rect.height;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
    };
    resize();
    window.addEventListener('resize', resize);

    const phi = (1 + Math.sqrt(5)) / 2;
    const icoVerts = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];
    const anchors = icoVerts.map(v => {
      const len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
      return { x: v[0] / len, y: v[1] / len, z: v[2] / len };
    });

    const particles = Array.from({ length: 600 }, (_, i) => {
      const anchor = anchors[i % anchors.length];
      return {
        ax: anchor.x,
        ay: anchor.y,
        az: anchor.z,
        theta: Math.random() * Math.PI * 2,
        phi: Math.acos(2 * Math.random() - 1),
        radius: 0.25 + Math.random() * 0.15,
        speed: 0.2 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        size: 1 + Math.random() * 2.5,
        life: Math.random()
      };
    });

    let rotX = 0, rotY = 0, rotZ = 0;
    const project = (x: number, y: number, z: number) => {
      const fov = 350, dist = 2.5;
      const scale = fov / (dist + z);
      return { x: W * 0.5 + x * scale * (H / 400), y: H * 0.5 + y * scale * (H / 400), scale };
    };

    const rotate = (x: number, y: number, z: number, rx: number, ry: number, rz: number) => {
      const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
      const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
      const y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
      const x3 = x1 * cz - y2 * sz, y3 = x1 * sz + y2 * cz;
      return { x: x3, y: y3, z: z2 };
    };

    const loop = () => {
      const dt = 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(DPR, DPR);
      rotX += 0.3 * dt;
      rotY += 0.2 * dt;
      rotZ += 0.1 * dt;

      const projPoints = particles.map(pt => {
        pt.life += dt * pt.speed * 0.5;
        const breathe = Math.sin(pt.life + pt.phase) * 0.05;
        const r = pt.radius + breathe;
        const ox = r * Math.sin(pt.phi) * Math.cos(pt.theta + pt.life * pt.speed);
        const oy = r * Math.sin(pt.phi) * Math.sin(pt.theta + pt.life * pt.speed);
        const oz = r * Math.cos(pt.phi);
        const rot = rotate(pt.ax * 0.6 + ox, pt.ay * 0.6 + oy, pt.az * 0.6 + oz, rotX, rotY, rotZ);
        const pr = project(rot.x, rot.y, rot.z);
        return { x: pr.x, y: pr.y, scale: pr.scale, z: rot.z, pt };
      });

      projPoints.sort((a, b) => b.z - a.z);
      ctx.globalCompositeOperation = 'screen';

      for (let i = 0; i < projPoints.length; i++) {
        const a = projPoints[i];
        if (a.z < 0) continue;
        for (let j = i + 1; j < Math.min(i + 5, projPoints.length); j++) {
          const b = projPoints[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 60) {
            const alpha = (1 - dist / 60) * 0.12;
            ctx.strokeStyle = `rgba(100, 210, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of projPoints) {
        const size = p.pt.size * (0.5 + p.scale * 0.003);
        const alpha = Math.min(1, (p.z + 1.5) / 2.5) * 0.7;
        const hue = 180 + p.pt.phase * 20 + (tideHeight > 1.5 ? 40 : 0);
        ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
        if (size > 1.5) {
          ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [tideHeight]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

// ─── SCROLL REVEAL COMPONENT ───
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)'
      }}
    >
      {children}
    </div>
  );
}

// ─── TELEPROMPTER COMPONENT ───
function Teleprompter({
  active,
  speed,
  speakerFilter
}: {
  active: boolean;
  speed: number;
  speakerFilter: 'all' | 'kimi' | 'timi' | 'both';
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const filteredLines = SCRIPT_LINES.filter(
    l => speakerFilter === 'all' || l.speaker === speakerFilter
  );

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % filteredLines.length);
    }, speed * 1000);
    return () => clearInterval(interval);
  }, [active, speed, filteredLines.length]);

  useEffect(() => {
    if (containerRef.current && active) {
      const el = containerRef.current.children[currentIndex] as HTMLElement;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIndex, active]);

  if (!active) return null;

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-slate-950/90 border border-slate-700 rounded-2xl p-5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <Mic className="w-3.5 h-3.5" />
            Kimi & Timi Teleprompter
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {currentIndex + 1} / {filteredLines.length}
          </div>
        </div>
        <div ref={containerRef} className="space-y-2 max-h-48 overflow-y-auto pr-2">
          {filteredLines.map((line, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl transition-all duration-300 ${
                i === currentIndex
                  ? 'bg-cyan-500/10 border border-cyan-500/30'
                  : 'bg-transparent border border-transparent opacity-40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {line.speaker === 'kimi' && <User className="w-3 h-3 text-purple-400" />}
                {line.speaker === 'timi' && <User className="w-3 h-3 text-emerald-400" />}
                {line.speaker === 'both' && <Users className="w-3 h-3 text-amber-400" />}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    line.speaker === 'kimi'
                      ? 'text-purple-400'
                      : line.speaker === 'timi'
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {line.speaker}
                </span>
              </div>
              <p
                className={`text-sm leading-relaxed ${
                  i === currentIndex ? 'text-white font-medium' : 'text-slate-400'
                }`}
              >
                {line.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN HORIZON BROADCAST COMPONENT ───
export default function HorizonBroadcast({ onNavigate }: { onNavigate?: (view: ViewMode) => void }) {
  const plasmaRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [teleprompterOn, setTeleprompterOn] = useState(false);
  const [teleSpeed, setTeleSpeed] = useState(5);
  const [speakerFilter, setSpeakerFilter] = useState<'all' | 'kimi' | 'timi' | 'both'>('all');
  const [showWatermark, setShowWatermark] = useState(true);

  const d9 = useD9Clock();
  const tide = useSimulatedTide();
  const { setIntensity } = usePlasmaEngine(plasmaRef);

  useEffect(() => {
    const onScroll = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      setScrollProgress(max > 0 ? el.scrollTop / max : 0);
    };
    const el = scrollContainerRef.current;
    el?.addEventListener('scroll', onScroll);
    return () => el?.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!broadcastMode) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    let start: number | null = null;
    const duration = 45000;
    const max = el.scrollHeight - el.clientHeight;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      el.scrollTop = ease * max;
      if (p < 1) requestAnimationFrame(step);
      else setBroadcastMode(false);
    };
    requestAnimationFrame(step);
  }, [broadcastMode]);

  useEffect(() => {
    setIntensity(0.4 + scrollProgress * 0.6);
  }, [scrollProgress, setIntensity]);

  const nextHighTime = tide.nextHighAt
    ? new Date(tide.nextHighAt).toLocaleTimeString('en-NZ', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans">
      <canvas ref={plasmaRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <ParticleField tideHeight={tide.heightM} />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 3,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.6) 100%)'
        }}
      />

      {/* Watermark */}
      {showWatermark && (
        <div className="fixed top-20 left-6 z-40 pointer-events-none opacity-80">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest font-semibold">
              Fluid Motion TV × Dragon Nine
            </span>
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden pt-12"
        style={{ zIndex: 10, scrollBehavior: broadcastMode ? 'auto' : 'smooth' }}
      >
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-6">
          <Reveal>
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-xs font-mono tracking-wider shadow-lg shadow-cyan-950/50">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Horizon Engine v1.0
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none bg-gradient-to-b from-white via-cyan-100 to-cyan-900/60 bg-clip-text text-transparent">
                Fluid Motion<br />TV
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                The old world runs on 60-minute hours.
                <span className="block text-cyan-300 font-medium mt-1">We run on 54.</span>
              </p>
              <div className="pt-4 flex items-center justify-center gap-4">
                <button
                  onClick={() => onNavigate?.('lotus')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20"
                >
                  <Sparkles className="w-4 h-4" /> Launch Lotus Nexus 4K
                </button>
                <button
                  onClick={() => onNavigate?.('dashboard')}
                  className="px-6 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:border-slate-500 transition-all backdrop-blur-md"
                >
                  Studio Control <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="pt-6"><ChevronDown className="w-6 h-6 text-slate-500 mx-auto animate-bounce" /></div>
            </div>
          </Reveal>
        </section>

        {/* Dragon Nine Clock Section */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-6">
          <Reveal>
            <div className="text-center space-y-8 max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-cyan-400" />
                <span className="text-sm font-mono text-cyan-400 tracking-widest uppercase">Dragon Nine Time</span>
              </div>
              <div className="relative inline-block">
                <div
                  className="text-8xl sm:text-9xl md:text-[12rem] font-black font-mono text-white leading-none tracking-tighter"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {d9.hour}<span className="text-cyan-500 animate-pulse">:</span>{d9.minute}
                </div>
                <div className="absolute -bottom-8 left-0 right-0 text-center">
                  <span className="text-sm font-mono text-slate-400 bg-slate-950/80 px-4 py-1 rounded-full border border-slate-800">
                    {d9.label}
                  </span>
                </div>
              </div>
              <div className="pt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
                {[
                  { label: 'Hours per cycle', value: '26.667' },
                  { label: 'Minutes per hour', value: '54' },
                  { label: 'Apex periods', value: '2× daily' },
                  { label: 'Phase offset', value: '18 min' }
                ].map(item => (
                  <div key={item.label} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-center backdrop-blur-md">
                    <div className="text-xl font-black text-white font-mono">{item.value}</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* Tide Oracle Section */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-6">
          <Reveal>
            <div className="w-full max-w-5xl mx-auto space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <Waves className="w-6 h-6 text-cyan-400" />
                <span className="text-sm font-mono text-cyan-400 tracking-widest uppercase">Tide Oracle</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-8">
                The tide doesn't wait.<br />
                <span className="text-cyan-300">Neither do we.</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/30 text-center space-y-2 backdrop-blur-md">
                  <div className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-wider">Depth Now</div>
                  <div className="text-3xl font-black text-cyan-300 font-mono">{tide.heightM.toFixed(2)}m</div>
                  <div className="text-[10px] text-slate-400 font-mono">Mean: {tide.meanLevelM}m</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-2 backdrop-blur-md">
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Flow</div>
                  <div className={`text-xl font-black font-mono ${tide.direction === 'flooding' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tide.direction === 'flooding' ? '↗ FLOODING' : '↘ EBBING'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{tide.velocityKnots} knots</div>
                </div>
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-center space-y-2 backdrop-blur-md">
                  <div className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">Next High</div>
                  <div className="text-2xl font-black text-amber-300 font-mono">{nextHighTime}</div>
                  <div className="text-[10px] text-amber-500 font-mono">River Mouth Bar</div>
                </div>
                <div className={`p-5 rounded-2xl border text-center space-y-2 backdrop-blur-md ${tide.barCrossingSafe ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-rose-950/30 border-rose-500/40'}`}>
                  <div className={`text-[10px] font-extrabold uppercase tracking-wider ${tide.barCrossingSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                    Bar Crossing
                  </div>
                  <div className={`text-xl font-black font-mono ${tide.barCrossingSafe ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {tide.barCrossingSafe ? '✅ SAFE' : '⚠️ WAIT'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {tide.barCrossingSafe ? 'Depth > 1.5m' : 'Shallow warning'}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Sovereign Infrastructure Section */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-6">
          <Reveal>
            <div className="w-full max-w-5xl mx-auto space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="text-sm font-mono text-emerald-400 tracking-widest uppercase">Sovereign Infrastructure</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-8">
                No middlemen.<br />
                <span className="text-emerald-300">No gatekeepers.</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Radio className="w-5 h-5 text-cyan-400" />, title: 'Broadcast Stage', status: 'Live', border: 'border-cyan-500/30' },
                  { icon: <Globe className="w-5 h-5 text-emerald-400" />, title: 'Mesh Gateway', status: 'Active', border: 'border-emerald-500/30' },
                  { icon: <Zap className="w-5 h-5 text-amber-400" />, title: 'Tide Synth', status: 'Running', border: 'border-amber-500/30' },
                  { icon: <ShieldCheck className="w-5 h-5 text-purple-400" />, title: 'Economy', status: 'Dormant', border: 'border-purple-500/30' }
                ].map(mod => (
                  <div
                    key={mod.title}
                    className={`p-5 rounded-2xl bg-slate-950/80 border ${mod.border} backdrop-blur-md group cursor-default transition-all hover:bg-slate-900/90`}
                  >
                    <div className="inline-flex p-2 rounded-lg bg-slate-900 mb-3">{mod.icon}</div>
                    <div className="text-sm font-bold text-white mb-1">{mod.title}</div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{mod.status}</div>
                  </div>
                ))}
              </div>

              <div className="pt-8 p-6 rounded-2xl bg-slate-950/70 border border-slate-800 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">System Telemetry</span>
                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    All systems nominal
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Horizon Engine', value: 94, color: 'bg-cyan-500' },
                    { label: 'D9 Clock Sync', value: 100, color: 'bg-emerald-500' },
                    { label: 'Tide Oracle Feed', value: 88, color: 'bg-amber-500' },
                    { label: 'Mesh Uptime', value: 99.9, color: 'bg-purple-500' }
                  ].map(bar => (
                    <div key={bar.label} className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-32 font-mono">{bar.label}</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${bar.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${bar.value}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 font-mono w-10 text-right">{bar.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Footer CTA Section */}
        <section className="min-h-screen flex flex-col items-center justify-center relative px-6 pb-28">
          <Reveal>
            <div className="text-center space-y-8 max-w-3xl mx-auto">
              <h2 className="text-5xl sm:text-7xl font-black text-white leading-tight">
                This is<br />
                <span className="bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
                  the future.
                </span>
              </h2>
              <p className="text-lg text-slate-300">
                Fluid Motion of the Future.<br />
                Dragon Nine is emerging.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => onNavigate?.('lotus')}
                  className="px-8 py-4 rounded-xl bg-cyan-500 text-slate-950 font-black text-sm uppercase tracking-wider hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                >
                  Enter Lotus 4K Studio
                </button>
                <a
                  href="https://www.youtube.com/@fluidmotiontv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl border border-slate-700 bg-slate-950/80 text-white font-bold text-sm uppercase tracking-wider hover:border-slate-500 transition-colors backdrop-blur-md"
                >
                  Subscribe on YouTube
                </a>
              </div>
              <div className="pt-12 flex items-center justify-center gap-6 text-slate-500">
                <span className="text-xs font-mono">Fluid Motion TV</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-xs font-mono">Dragon Nine</span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-xs font-mono">2026</span>
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      {/* Teleprompter Overlay */}
      <Teleprompter active={teleprompterOn} speed={teleSpeed} speakerFilter={speakerFilter} />

      {/* Fixed Broadcast Control Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBroadcastMode(!broadcastMode)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xl ${
              broadcastMode
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse'
                : 'bg-slate-950/90 text-white border border-slate-700 hover:border-slate-500 backdrop-blur-md'
            }`}
          >
            {broadcastMode ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {broadcastMode ? 'Stop Broadcast' : 'Broadcast Mode'}
          </button>
          <button
            onClick={() => setTeleprompterOn(!teleprompterOn)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              teleprompterOn
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                : 'bg-slate-950/90 text-white border-slate-700 hover:border-slate-500 backdrop-blur-md'
            }`}
          >
            <Mic className="w-4 h-4" />
            {teleprompterOn ? 'Hide Script' : 'Teleprompter'}
          </button>
          <button
            onClick={() => setShowWatermark(!showWatermark)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border bg-slate-950/90 text-white border-slate-700 hover:border-slate-500 backdrop-blur-md"
          >
            <Settings className="w-4 h-4" />
            Watermark
          </button>
        </div>

        {teleprompterOn && (
          <div className="flex items-center gap-3 bg-slate-950/90 border border-slate-700 rounded-xl px-4 py-2 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Speed</span>
              <input
                type="range"
                min="3"
                max="10"
                value={teleSpeed}
                onChange={e => setTeleSpeed(parseInt(e.target.value))}
                className="w-20 accent-cyan-500"
              />
              <span className="text-[10px] text-cyan-400 font-mono w-6">{teleSpeed}s</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div className="flex items-center gap-1">
              {(['all', 'kimi', 'timi', 'both'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSpeakerFilter(s)}
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    speakerFilter === s ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar at Top */}
      <div className="fixed top-0 left-0 right-0 h-0.5 bg-slate-900 z-50">
        <div
          className="h-full bg-cyan-500 transition-all duration-100"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* D9 Time Widget Top Right */}
      <div className="fixed top-16 right-6 z-40 hidden sm:block pointer-events-none">
        <div className="px-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md text-right shadow-lg">
          <div className="text-lg font-black text-cyan-400 font-mono" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {d9.hour}:{d9.minute}
          </div>
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">D9 Time</div>
        </div>
      </div>
    </div>
  );
}
