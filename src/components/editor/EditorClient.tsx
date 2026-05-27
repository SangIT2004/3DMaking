'use client'

import { Scene } from "./Scene";
import { Sidebar } from "./Sidebar";
import { PropertiesPanel } from "./PropertiesPanel";

interface EditorClientProps {
  projectId: string;
}

export function EditorClient({ projectId }: EditorClientProps) {
  return (
    <div className="relative w-full h-full flex overflow-hidden">
      {/* Sidebar (Left) */}
      <Sidebar />

      {/* Main 3D Scene */}
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <h1 className="text-white font-medium text-xs opacity-40">Dự án: {projectId}</h1>
        </div>
        
        <Scene />

        {/* Footer / Shortcut Info */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full pointer-events-none">
          <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-medium">
            3D ROOM STUDIO · EDITOR MODE
          </p>
        </div>
      </div>

      {/* Properties Panel (Right) */}
      <PropertiesPanel />
    </div>
  );
}
