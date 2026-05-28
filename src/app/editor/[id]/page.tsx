import { EditorClient } from "@/components/editor/EditorClient";
import { getEditorData } from "../actions";
import { redirect } from "next/navigation";

interface EditorPageProps {
  params: {
    id: string;
  };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = params;

  const data = await getEditorData(id);

  if (data.error) {
    redirect('/dashboard');
  }

  // Transform entities from DB format to Zustand format
  const initialEntities = (data.entities || []).map((e: any) => {
    // Hỗ trợ cả 2 định dạng: Array [x,y,z] và Object {x, y, z}
    const parseVec3 = (val: any, defaultVal: number): [number, number, number] => {
      if (Array.isArray(val) && val.length === 3) return val as [number, number, number];
      if (val && typeof val === 'object' && 'x' in val) return [val.x || 0, val.y || 0, val.z || 0];
      return [defaultVal, defaultVal, defaultVal];
    };

    return {
      id: e.id,
      type: e.type,
      name: e.metadata?.name || e.type,
      position: parseVec3(e.position, 0),
      rotation: parseVec3(e.rotation, 0),
      scale: parseVec3(e.scale, 1),
      color: e.color || '#4B5563',
      metadata: e.metadata || {},
      ...(e.scad_code && { scad_code: e.scad_code }),
      ...(e.prompt && { prompt: e.prompt })
    };
  });

  const initialEnvSettings = data.room.environment_settings || {
    backgroundColor: '#0F1117',
    lightIntensity: 1.5,
  };

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0F1117]">
      <EditorClient 
        projectId={id} 
        roomId={data.room.id}
        initialEntities={initialEntities}
        projectName={data.project.name}
        initialEnvSettings={initialEnvSettings}
      />
    </main>
  );
}
