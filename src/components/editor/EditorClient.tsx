'use client'

import { Scene } from "./Scene";
import { Sidebar } from "./Sidebar";
import { PropertiesPanel } from "./PropertiesPanel";
import { useEffect } from "react";
import { useEditorStore, Entity } from "@/store/useEditorStore";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorClientProps {
  projectId: string;
  roomId: string;
  projectName: string;
  initialEntities: Entity[];
  initialEnvSettings?: any;
}

export function EditorClient({ projectId, roomId, projectName, initialEntities, initialEnvSettings }: EditorClientProps) {
  const setRoomId = useEditorStore((state) => state.setRoomId);
  const setEntities = useEditorStore((state) => state.setEntities);
  const setEnvironmentSettings = useEditorStore((state) => state.setEnvironmentSettings);
  const isSidebarOpen = useEditorStore((state) => state.isSidebarOpen);
  const isPropertiesOpen = useEditorStore((state) => state.isPropertiesOpen);
  const setIsSidebarOpen = useEditorStore((state) => state.setIsSidebarOpen);
  const setIsPropertiesOpen = useEditorStore((state) => state.setIsPropertiesOpen);
  const setTransformMode = useEditorStore((state) => state.setTransformMode);
  const duplicateSelected = useEditorStore((state) => state.duplicateSelected);
  const deleteSelected = useEditorStore((state) => state.deleteSelected);
  const moveSelected = useEditorStore((state) => state.moveSelected);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const reorderEntity = useEditorStore((state) => state.reorderEntity);
  const selectedId = useEditorStore((state) => state.selectedId);

  useEffect(() => {
    setRoomId(roomId);
    setEntities(initialEntities);
    if (initialEnvSettings) {
      setEnvironmentSettings(initialEnvSettings);
    }
  }, [roomId, initialEntities, initialEnvSettings, setRoomId, setEntities, setEnvironmentSettings]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget = !!target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (isTypingTarget) return;

      const key = event.key.toLowerCase();
      const step = event.shiftKey ? 0.25 : 0.08;

      if ((event.metaKey || event.ctrlKey) && key === 'd') {
        event.preventDefault();
        duplicateSelected();
        return;
      }

      if ((event.metaKey || event.ctrlKey) && key === 'g') {
        event.preventDefault();
        if (selectedId) {
          reorderEntity(selectedId, event.shiftKey ? 'backward' : 'forward');
        }
        return;
      }

      if (key === 'delete' || key === 'backspace') {
        event.preventDefault();
        deleteSelected();
        return;
      }

      if (key === 'escape') {
        clearSelection();
        return;
      }

      if (key === 't') {
        setTransformMode('translate');
        return;
      }

      if (key === 'r') {
        setTransformMode('rotate');
        return;
      }

      if (key === 's') {
        setTransformMode('scale');
        return;
      }

      if (key === 'arrowup') {
        event.preventDefault();
        moveSelected([0, 0, -step]);
        return;
      }

      if (key === 'arrowdown') {
        event.preventDefault();
        moveSelected([0, 0, step]);
        return;
      }

      if (key === 'arrowleft') {
        event.preventDefault();
        moveSelected([-step, 0, 0]);
        return;
      }

      if (key === 'arrowright') {
        event.preventDefault();
        moveSelected([step, 0, 0]);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection, deleteSelected, duplicateSelected, moveSelected, reorderEntity, selectedId, setTransformMode]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#0F1117]">
      {/* Top Navigation */}
      <div className="h-12 border-b border-white/5 flex items-center px-4 justify-between bg-[#161822]/40 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <a href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 text-gray-400 hover:text-white">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-xs">Dashboard</span>
            </Button>
          </a>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-white font-medium text-xs uppercase tracking-widest opacity-60">
            {projectName}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <p className="text-white/30 text-[10px] uppercase tracking-wider font-bold">Editor Mode</p>
        </div>
      </div>

      <div className="flex-1 relative">
        <ResizablePanelGroup direction="horizontal" className="h-full min-h-0 overflow-hidden">
          {/* Sidebar */}
          {isSidebarOpen && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="bg-[#161822]/80 backdrop-blur-xl overflow-hidden min-h-0">
                <div className="h-full min-h-0 flex flex-col relative overflow-hidden">
                  <Sidebar projectId={projectId} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#161822] border border-white/10 z-50 text-gray-500 hover:text-white"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle className="bg-transparent w-1 hover:bg-violet-500/20 transition-colors" />
            </>
          )}

          {/* Hidden Sidebar Trigger */}
          {!isSidebarOpen && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-50">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-r-xl bg-[#161822]/80 border-y border-r border-white/10 text-gray-500 hover:text-white backdrop-blur-md"
                onClick={() => setIsSidebarOpen(true)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Main Canvas */}
          <ResizablePanel defaultSize={isSidebarOpen && isPropertiesOpen ? 55 : isSidebarOpen || isPropertiesOpen ? 75 : 100} className="min-h-0 overflow-hidden">
            <div className="w-full h-full min-h-0 relative overflow-hidden">
              <Scene />
              
              {/* Footer Info Overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full pointer-events-none">
                <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] font-medium">
                  3D ROOM STUDIO
                </p>
              </div>
            </div>
          </ResizablePanel>

          {/* Properties Panel */}
          {isPropertiesOpen && (
            <>
              <ResizableHandle withHandle className="bg-transparent w-1 hover:bg-violet-500/20 transition-colors" />
              <ResizablePanel defaultSize={25} minSize={20} maxSize={35} className="bg-[#161822]/80 backdrop-blur-xl overflow-hidden min-h-0">
                <div className="h-full min-h-0 flex flex-col relative overflow-hidden">
                  <PropertiesPanel />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#161822] border border-white/10 z-50 text-gray-500 hover:text-white"
                    onClick={() => setIsPropertiesOpen(false)}
                  >
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </ResizablePanel>
            </>
          )}

          {/* Hidden Properties Trigger */}
          {!isPropertiesOpen && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-l-xl bg-[#161822]/80 border-y border-l border-white/10 text-gray-500 hover:text-white backdrop-blur-md"
                onClick={() => setIsPropertiesOpen(true)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
