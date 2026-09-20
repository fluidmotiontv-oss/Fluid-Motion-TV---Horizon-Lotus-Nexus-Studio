import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HorizonBroadcast from './components/HorizonBroadcast';
import LotusNexusPiano from './components/LotusNexusPiano';
import StudioDashboard from './components/StudioDashboard';
import { ViewMode } from './types';

export default function App() {
  const [view, setView] = useState<ViewMode>('horizon');

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-cyan-500 selection:text-black">
      <Navigation currentView={view} onNavigate={setView} />

      <main className="relative w-full h-full">
        {view === 'horizon' && <HorizonBroadcast onNavigate={setView} />}
        {view === 'lotus' && <LotusNexusPiano onNavigate={setView} />}
        {view === 'dashboard' && <StudioDashboard onNavigate={setView} />}
      </main>
    </div>
  );
}
