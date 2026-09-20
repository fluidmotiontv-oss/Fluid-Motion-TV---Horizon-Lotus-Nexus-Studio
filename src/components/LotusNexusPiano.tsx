import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Square,
  SkipForward,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Settings,
  Layers,
  Activity,
  Maximize2,
  Film,
  Music,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { CompositionScene, ViewMode } from '../types';

// ─── 30 COMPOSITION PRESETS ───
export const SCENES: CompositionScene[] = [
  { id: 1,  name: "C Major Dawn",       root: 261.63, scale: [0,2,4,5,7,9,11], tempo: 72,  color: [255,200,100], petals: 8 },
  { id: 2,  name: "D Minor Rain",       root: 293.66, scale: [0,2,3,5,7,8,10], tempo: 60,  color: [100,150,255], petals: 6 },
  { id: 3,  name: "E Phrygian Fire",    root: 329.63, scale: [0,1,3,5,7,8,10], tempo: 90,  color: [255,100,50],  petals: 7 },
  { id: 4,  name: "F Lydian Sky",       root: 349.23, scale: [0,2,4,6,7,9,11], tempo: 80,  color: [100,255,200], petals: 9 },
  { id: 5,  name: "G Mixolydian Earth", root: 392.00, scale: [0,2,4,5,7,9,10], tempo: 85,  color: [150,255,100], petals: 8 },
  { id: 6,  name: "A Minor Ocean",      root: 440.00, scale: [0,2,3,5,7,8,10], tempo: 55,  color: [50,150,255],  petals: 5 },
  { id: 7,  name: "B Locrian Void",     root: 493.88, scale: [0,1,3,5,6,8,10], tempo: 45,  color: [150,100,255], petals: 4 },
  { id: 8,  name: "Chromatic Nebula",   root: 523.25, scale: [0,1,2,3,4,5,6,7,8,9,10,11], tempo: 100, color: [255,100,255], petals: 12 },
  { id: 9,  name: "Whole Tone Mist",    root: 277.18, scale: [0,2,4,6,8,10],   tempo: 65,  color: [200,200,255], petals: 6 },
  { id: 10, name: "Pentatonic Sun",     root: 311.13, scale: [0,2,4,7,9],      tempo: 95,  color: [255,220,50],  petals: 5 },
  { id: 11, name: "Harmonic Minor",     root: 369.99, scale: [0,2,3,5,7,8,11], tempo: 70,  color: [255,150,100], petals: 7 },
  { id: 12, name: "Melodic Ascent",     root: 415.30, scale: [0,2,3,5,7,9,11], tempo: 88,  color: [100,255,150], petals: 8 },
  { id: 13, name: "Blues Delta",        root: 233.08, scale: [0,3,5,6,7,10],   tempo: 75,  color: [100,100,255], petals: 6 },
  { id: 14, name: "Hungarian Night",    root: 277.18, scale: [0,2,3,6,7,8,11], tempo: 50,  color: [255,50,100],  petals: 5 },
  { id: 15, name: "Enigmatic",          root: 329.63, scale: [0,1,4,6,8,10,11], tempo: 40, color: [200,100,255], petals: 7 },
  { id: 16, name: "Persian Sands",      root: 369.99, scale: [0,1,4,5,6,8,11], tempo: 78,  color: [255,200,100], petals: 6 },
  { id: 17, name: "Japanese Sakura",    root: 440.00, scale: [0,2,5,7,9],      tempo: 60,  color: [255,180,200], petals: 5 },
  { id: 18, name: "Byzantine Gold",     root: 493.88, scale: [0,1,4,5,7,8,11], tempo: 82,  color: [255,215,0],   petals: 8 },
  { id: 19, name: "Augmented Sky",      root: 277.18, scale: [0,3,4,7,8,11],   tempo: 70,  color: [150,200,255], petals: 6 },
  { id: 20, name: "Diminished Storm",   root: 311.13, scale: [0,2,3,5,6,8,9,11], tempo: 110, color: [255,50,50], petals: 8 },
  { id: 21, name: "Dorian Mist",        root: 293.66, scale: [0,2,3,5,7,9,10], tempo: 68,  color: [150,255,200], petals: 7 },
  { id: 22, name: "Phrygian Dominant",  root: 329.63, scale: [0,1,4,5,7,8,10], tempo: 92,  color: [255,120,0],   petals: 7 },
  { id: 23, name: "Lydian Augmented",   root: 349.23, scale: [0,2,4,6,8,9,11], tempo: 85,  color: [100,255,255], petals: 9 },
  { id: 24, name: "Altered Scale",      root: 466.16, scale: [0,1,3,4,6,8,10], tempo: 95,  color: [255,100,150], petals: 7 },
  { id: 25, name: "Bebop Major",        root: 261.63, scale: [0,2,4,5,7,8,9,11], tempo: 120, color: [255,255,100], petals: 8 },
  { id: 26, name: "Insen",              root: 329.63, scale: [0,1,5,7,10],     tempo: 55,  color: [200,150,255], petals: 5 },
  { id: 27, name: "Iwato",              root: 349.23, scale: [0,1,5,6,10],     tempo: 50,  color: [100,255,180], petals: 5 },
  { id: 28, name: "Kumoi",              root: 392.00, scale: [0,2,3,7,9],      tempo: 58,  color: [255,180,150], petals: 5 },
  { id: 29, name: "Pelog",              root: 440.00, scale: [0,1,3,7,8],      tempo: 62,  color: [180,255,100], petals: 5 },
  { id: 30, name: "Dragon Nine Chord",  root: 54.00,  scale: [0,4,7,11,14],    tempo: 54,  color: [0,200,255],   petals: 9 },
];

interface BloomParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  hue: number;
  sat: number;
  light: number;
}

export default function LotusNexusPiano({ onNavigate }: { onNavigate?: (view: ViewMode) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pCanvasRef = useRef<HTMLCanvasElement>(null);

  // Audio state
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const mediaDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const noteIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const noteCountRef = useRef<number>(0);

  // Batch & Recording State
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBatchRunning, setIsBatchRunning] = useState<boolean>(false);
  const [completedScenes, setCompletedScenes] = useState<number[]>([]);
  const [sceneDuration, setSceneDuration] = useState<number>(180); // seconds
  const [bitrateMbps, setBitrateMbps] = useState<number>(50); // Mbps
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Live Stats State
  const [fps, setFps] = useState<number>(60);
  const [totalNotes, setTotalNotes] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [panelOpen, setPanelOpen] = useState<boolean>(true);

  // MediaRecorder Ref
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Bloom Particles Ref
  const bloomParticlesRef = useRef<BloomParticle[]>([]);
  const lotusRotationRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const currentScene = SCENES[activeSceneIndex];

  // ─── AUDIO SETUP ───
  const initAudioEngine = useCallback(() => {
    if (audioCtxRef.current) return;
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioCtxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = isMuted ? 0 : 0.22;
    masterGainRef.current = masterGain;

    // Create Convolution Reverb
    const rate = ctx.sampleRate;
    const len = rate * 2.5;
    const buf = ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const ch = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = buf;

    // Delay Node
    const delay = ctx.createDelay();
    delay.delayTime.value = 0.4;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.35;

    // Analyser Node
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    // Stream Destination for video recording
    const mediaDest = ctx.createMediaStreamDestination();
    mediaDestRef.current = mediaDest;

    masterGain.connect(conv);
    conv.connect(ctx.destination);
    conv.connect(mediaDest);

    masterGain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(ctx.destination);
    delayGain.connect(mediaDest);

    masterGain.connect(analyser);
  }, [isMuted]);

  // Frequency helper
  const freqFromNote = useCallback((noteIndex: number, scene: CompositionScene) => {
    const semitones = scene.scale[noteIndex % scene.scale.length] + Math.floor(noteIndex / scene.scale.length) * 12;
    return scene.root * Math.pow(2, semitones / 12);
  }, []);

  // Trigger Particle Bloom Effect
  const triggerBloom = useCallback((freq: number) => {
    const hue = (Math.log2(freq / 220) * 120 + 30) % 360;
    const count = 14 + Math.floor(Math.random() * 10);
    const particles: BloomParticle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + Math.random() * 0.3;
      const speed = 3 + Math.random() * 6;
      particles.push({
        x: 3840 * 0.5,
        y: 2160 * 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.012 + Math.random() * 0.018,
        size: 4 + Math.random() * 8,
        hue: (hue + Math.random() * 40) % 360,
        sat: 75 + Math.random() * 25,
        light: 55 + Math.random() * 30
      });
    }

    bloomParticlesRef.current.push(...particles);
  }, []);

  // Play single note step
  const playNote = useCallback(() => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const scene = SCENES[activeSceneIndex];

    // Melody Note
    const melodyIndex = Math.floor(Math.random() * scene.scale.length) + (Math.random() > 0.65 ? 7 : 0);
    const melodyFreq = freqFromNote(melodyIndex, scene);

    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = Math.random() > 0.4 ? 'sine' : 'triangle';
    osc.frequency.value = melodyFreq;

    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.18, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

    osc.connect(g);
    g.connect(masterGainRef.current);

    osc.start(now);
    osc.stop(now + 2.8);

    // Bass Drone
    if (noteCountRef.current % 4 === 0) {
      const bassFreq = scene.root * (Math.random() > 0.5 ? 0.5 : 0.75);
      const bass = ctx.createOscillator();
      const bg = ctx.createGain();
      bass.type = 'sine';
      bass.frequency.value = bassFreq;

      bg.gain.setValueAtTime(0, now);
      bg.gain.linearRampToValueAtTime(0.12, now + 0.6);
      bg.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

      bass.connect(bg);
      bass.connect(masterGainRef.current);

      bass.start(now);
      bass.stop(now + 4.5);
    }

    // Harmony Pad
    if (noteCountRef.current % 2 === 0) {
      const padFreq = freqFromNote(Math.floor(Math.random() * 3), scene);
      const pad = ctx.createOscillator();
      const pg = ctx.createGain();
      pad.type = 'sine';
      pad.frequency.value = padFreq;

      pg.gain.setValueAtTime(0, now);
      pg.gain.linearRampToValueAtTime(0.09, now + 1.2);
      pg.gain.exponentialRampToValueAtTime(0.001, now + 6.0);

      pad.connect(pg);
      pad.connect(masterGainRef.current);

      pad.start(now);
      pad.stop(now + 6.0);
    }

    noteCountRef.current += 1;
    setTotalNotes(prev => prev + 1);
    triggerBloom(melodyFreq);
  }, [activeSceneIndex, freqFromNote, triggerBloom]);

  // Start Composition Loop
  const startMusic = useCallback(() => {
    initAudioEngine();
    if (noteIntervalRef.current) clearInterval(noteIntervalRef.current);
    const msPerBeat = 60000 / SCENES[activeSceneIndex].tempo;
    noteIntervalRef.current = setInterval(playNote, msPerBeat * (0.45 + Math.random() * 0.45));
    setIsPlaying(true);
  }, [activeSceneIndex, initAudioEngine, playNote]);

  // Stop Music Loop
  const stopMusic = useCallback(() => {
    if (noteIntervalRef.current) clearInterval(noteIntervalRef.current);
    noteIntervalRef.current = null;
    setIsPlaying(false);
  }, []);

  // Start MediaRecorder for live scene download
  const startRecordingScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const canvasStream = canvas.captureStream(60);
      const audioStream = mediaDestRef.current?.stream;

      const combinedTracks = [
        ...canvasStream.getVideoTracks(),
        ...(audioStream ? audioStream.getAudioTracks() : [])
      ];

      const stream = new MediaStream(combinedTracks);
      const options = {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: bitrateMbps * 1000000
      };

      const recorder = new MediaRecorder(
        stream,
        MediaRecorder.isTypeSupported(options.mimeType) ? options : undefined
      );

      recordedChunksRef.current = [];
      recorder.ondataavailable = e => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Lotus_Nexus_4K_Scene_${SCENES[activeSceneIndex].id}_${SCENES[activeSceneIndex].name.replace(/\s+/g, '_')}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
    } catch (err) {
      console.warn("Recording stream creation notice:", err);
    }
  }, [activeSceneIndex, bitrateMbps]);

  // Stop MediaRecorder
  const stopRecordingScene = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  }, []);

  // Handle Mute
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(
        isMuted ? 0 : 0.22,
        audioCtxRef.current.currentTime
      );
    }
  }, [isMuted]);

  // Timer effect for current scene
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  // Batch orchestrator
  useEffect(() => {
    if (!isBatchRunning) return;

    startMusic();
    startRecordingScene();

    const sceneTimer = setTimeout(() => {
      stopRecordingScene();
      stopMusic();
      setCompletedScenes(prev => [...new Set([...prev, activeSceneIndex])]);

      if (activeSceneIndex < SCENES.length - 1) {
        setActiveSceneIndex(prev => prev + 1);
      } else {
        setIsBatchRunning(false);
      }
    }, sceneDuration * 1000);

    return () => {
      clearTimeout(sceneTimer);
    };
  }, [isBatchRunning, activeSceneIndex, sceneDuration, startMusic, stopMusic, startRecordingScene, stopRecordingScene]);

  // Start Batch
  const startBatch = () => {
    setCompletedScenes([]);
    setActiveSceneIndex(0);
    setIsBatchRunning(true);
  };

  // Stop Batch
  const stopBatch = () => {
    setIsBatchRunning(false);
    stopRecordingScene();
    stopMusic();
  };

  // Skip Scene
  const skipScene = () => {
    stopRecordingScene();
    stopMusic();
    setCompletedScenes(prev => [...new Set([...prev, activeSceneIndex])]);
    if (activeSceneIndex < SCENES.length - 1) {
      setActiveSceneIndex(prev => prev + 1);
    } else {
      setIsBatchRunning(false);
    }
  };

  // ─── VISUALIZER CANVAS LOOP ───
  useEffect(() => {
    const canvas = canvasRef.current;
    const pCanvas = pCanvasRef.current;
    if (!canvas || !pCanvas) return;

    const ctx = canvas.getContext('2d');
    const pCtx = pCanvas.getContext('2d');
    if (!ctx || !pCtx) return;

    canvas.width = 3840;
    canvas.height = 2160;
    pCanvas.width = 3840;
    pCanvas.height = 2160;

    let frameCount = 0;
    let lastFpsTime = performance.now();

    const render = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastFpsTime = now;
      }

      const scene = SCENES[activeSceneIndex];
      const cx = 3840 * 0.5;
      const cy = 2160 * 0.5;

      // Dark background trail
      ctx.fillStyle = 'rgba(2, 2, 6, 0.18)';
      ctx.fillRect(0, 0, 3840, 2160);

      lotusRotationRef.current += 0.0025;

      // Draw Lotus Petals
      const petals = scene.petals;
      const [rC, gC, bC] = scene.color;

      ctx.save();
      ctx.translate(cx, cy);

      // Concentric Mandala Rings
      for (let layer = 0; layer < 6; layer++) {
        const radius = 280 + layer * 140;
        const ringPetals = petals * (layer % 2 === 0 ? 1 : 2);
        const rotSign = layer % 2 === 0 ? 1 : -1;
        const layerAngle = lotusRotationRef.current * rotSign * (1 + layer * 0.15);

        ctx.strokeStyle = `rgba(${rC}, ${gC}, ${bC}, ${0.12 - layer * 0.015})`;
        ctx.lineWidth = 2.5;

        for (let p = 0; p < ringPetals; p++) {
          const a = (Math.PI * 2 / ringPetals) * p + layerAngle;
          const px = Math.cos(a) * radius;
          const py = Math.sin(a) * radius;

          ctx.beginPath();
          ctx.arc(px, py, 40 + layer * 15, 0, Math.PI * 2);
          ctx.stroke();

          // Petal Curve
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const cp1x = Math.cos(a - 0.2) * (radius * 0.6);
          const cp1y = Math.sin(a - 0.2) * (radius * 0.6);
          const cp2x = Math.cos(a + 0.2) * (radius * 0.9);
          const cp2y = Math.sin(a + 0.2) * (radius * 0.9);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, px, py);

          ctx.strokeStyle = `rgba(${rC}, ${gC}, ${bC}, ${0.25 - layer * 0.03})`;
          ctx.stroke();
        }
      }

      // Pulsing Core Lotus Glow
      const corePulse = 180 + Math.sin(now * 0.003) * 35;
      const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, corePulse * 2);
      grad.addColorStop(0, `rgba(255, 255, 255, 0.9)`);
      grad.addColorStop(0.3, `rgba(${rC}, ${gC}, ${bC}, 0.6)`);
      grad.addColorStop(0.7, `rgba(${rC}, ${gC}, ${bC}, 0.15)`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, corePulse * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Render Particle Bloom
      pCtx.clearRect(0, 0, 3840, 2160);
      pCtx.globalCompositeOperation = 'screen';

      const particles = bloomParticlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vx *= 0.97;
        pt.vy *= 0.97;
        pt.life -= pt.decay;

        if (pt.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        pCtx.fillStyle = `hsla(${pt.hue}, ${pt.sat}%, ${pt.light}%, ${pt.life})`;
        pCtx.beginPath();
        pCtx.arc(pt.x, pt.y, pt.size * (0.8 + pt.life * 0.5), 0, Math.PI * 2);
        pCtx.fill();

        if (pt.size > 5) {
          pCtx.fillStyle = `hsla(${pt.hue}, ${pt.sat}%, 80%, ${pt.life * 0.3})`;
          pCtx.beginPath();
          pCtx.arc(pt.x, pt.y, pt.size * 2.2, 0, Math.PI * 2);
          pCtx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [activeSceneIndex]);

  // Format Time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const remainingBatchSecs = (SCENES.length - activeSceneIndex) * sceneDuration - elapsedTime;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white font-sans select-none">
      {/* 4K Canvas Viewport */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
          style={{ aspectRatio: '16/9' }}
        />
        <canvas
          ref={pCanvasRef}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ aspectRatio: '16/9' }}
        />
      </div>

      {/* HUD OVERLAY */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 z-20">
        {/* HUD TOP */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800/80 px-4 py-2.5 rounded-2xl backdrop-blur-md shadow-2xl">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shadow-lg shadow-amber-500/50" />
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                Lotus Nexus Piano <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">4K Batch</span>
              </h1>
              <span className="text-[10px] font-mono text-slate-400">Generative Harmonic Visualizer Engine</span>
            </div>
          </div>

          <div className="text-right bg-slate-950/80 border border-slate-800/80 px-5 py-2.5 rounded-2xl backdrop-blur-md shadow-2xl">
            <div className="text-xl font-black font-mono text-amber-400">
              Scene #{currentScene.id.toString().padStart(2, '0')}
            </div>
            <div className="text-xs font-semibold text-slate-200">{currentScene.name}</div>
          </div>
        </div>

        {/* HUD BOTTOM */}
        <div className="flex items-end justify-between">
          <div className="bg-slate-950/80 border border-slate-800/80 px-4 py-2.5 rounded-2xl backdrop-blur-md font-mono text-[11px] text-slate-400 space-y-1 shadow-2xl">
            <div className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>3840 × 2160 @ 60fps</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400 font-bold">FPS: {fps}</span>
              <span className="text-cyan-400 font-bold">Notes: {totalNotes}</span>
              <span className="text-purple-400 font-bold">Tempo: {currentScene.tempo} BPM</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {(isPlaying || isBatchRunning) && (
              <div className="flex items-center gap-2 bg-rose-950/80 border border-rose-500/40 text-rose-300 px-4 py-2 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider backdrop-blur-md animate-pulse shadow-xl">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>{isBatchRunning ? 'Batch Recording' : 'Live Synth Playing'}</span>
              </div>
            )}

            <div className="bg-slate-950/80 border border-slate-800/80 px-5 py-2.5 rounded-2xl backdrop-blur-md text-right font-mono text-sm font-bold text-slate-200 shadow-2xl">
              {formatTime(elapsedTime)} / {formatTime(sceneDuration)}
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING SIDE PANEL */}
      {panelOpen ? (
        <div className="fixed top-6 left-6 z-30 w-80 max-h-[calc(100vh-48px)] bg-slate-950/95 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Batch 4K Studio Control</span>
            </div>
            <button
              onClick={() => setPanelOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          <div className="overflow-y-auto space-y-4 py-3 pr-1">
            {/* Status & Progress */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 uppercase tracking-wider">Status</span>
                <span className={`px-2 py-0.5 rounded-md font-bold uppercase ${isBatchRunning ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-300'}`}>
                  {isBatchRunning ? 'Batch Active' : isPlaying ? 'Manual Play' : 'Ready'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${((activeSceneIndex + 1) / SCENES.length) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Scene {activeSceneIndex + 1} / {SCENES.length}</span>
                <span>ETA: {formatTime(Math.max(0, remainingBatchSecs))}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {!isBatchRunning ? (
                <button
                  onClick={startBatch}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Film className="w-4 h-4" /> Start 30-Scene 4K Batch
                </button>
              ) : (
                <button
                  onClick={stopBatch}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <Square className="w-4 h-4" /> Stop Batch Recording
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                {!isPlaying ? (
                  <button
                    onClick={startMusic}
                    className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold uppercase text-[10px] tracking-wider flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 text-emerald-400" /> Play Live
                  </button>
                ) : (
                  <button
                    onClick={stopMusic}
                    className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold uppercase text-[10px] tracking-wider flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Square className="w-3.5 h-3.5 text-rose-400" /> Stop Live
                  </button>
                )}

                <button
                  onClick={skipScene}
                  disabled={!isBatchRunning}
                  className="py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 disabled:opacity-40 font-bold uppercase text-[10px] tracking-wider flex items-center justify-center gap-1.5 transition-all"
                >
                  <SkipForward className="w-3.5 h-3.5" /> Skip
                </button>
              </div>

              <div className="flex items-center justify-between px-2 pt-1">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isMuted ? 'Muted' : 'Audio On'}</span>
                </button>

                <button
                  onClick={playNote}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Trigger Bloom
                </button>
              </div>
            </div>

            {/* Sliders Config */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Scene Duration</span>
                  <span className="text-amber-400 font-bold">{formatTime(sceneDuration)}</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="30"
                  value={sceneDuration}
                  onChange={e => setSceneDuration(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                  <span>Video Bitrate</span>
                  <span className="text-amber-400 font-bold">{bitrateMbps} Mbps</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="10"
                  value={bitrateMbps}
                  onChange={e => setBitrateMbps(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Scene Selector List */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Composition Presets</span>
                <span>30 total</span>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1 pr-1 border border-slate-800/80 rounded-xl p-1 bg-slate-900/40">
                {SCENES.map((sc, idx) => {
                  const isDone = completedScenes.includes(idx);
                  const isActive = idx === activeSceneIndex;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => {
                        setActiveSceneIndex(idx);
                        if (isPlaying) startMusic();
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-[11px] transition-all ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : isDone
                          ? 'bg-slate-900 text-emerald-400'
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="truncate">
                        #{sc.id.toString().padStart(2, '0')} {sc.name}
                      </span>
                      <span className="font-mono text-[10px] ml-2 shrink-0">
                        {isDone ? <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" /> : `${sc.tempo} BPM`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System Info Note */}
            <div className="p-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl text-[10px] text-slate-400 leading-relaxed font-mono">
              <strong>Lotus Engine Note:</strong> Each scene algorithmically synthesizes melody, bass drones, harmony pads, and audio-reactive 4K lotus mandala geometry.
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setPanelOpen(true)}
          className="fixed top-20 left-6 z-30 px-3 py-2 rounded-xl bg-slate-950/90 border border-slate-800 text-amber-400 hover:text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2 backdrop-blur-md shadow-2xl"
        >
          <Sliders className="w-4 h-4" /> Open Control Panel
        </button>
      )}
    </div>
  );
}
