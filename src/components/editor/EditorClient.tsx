'use client'

import { Scene } from "./Scene";

interface EditorClientProps {
  projectId: string;
}

export function EditorClient({ projectId }: EditorClientProps) {
  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      {/* Header Placeholder */}
      <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-lg">
        <h1 className="text-white font-medium text-sm">Editor Project: {projectId}</h1>
        <p className="text-gray-400 text-xs">Phase 3: 3D Core Enabled</p>
      </div>

      {/* Main 3D Scene */}
      <div className="flex-1 w-full h-full">
        <Scene />
      </div>

      {/* Footer / Instructions Placeholder */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
        <p className="text-white/70 text-[11px]">
          Left Click: Rotate · Right Click: Pan · Scroll: Zoom
        </p>
      </div>
    </div>
  );
}
