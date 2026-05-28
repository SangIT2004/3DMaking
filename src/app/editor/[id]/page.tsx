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
  const initialEntities = (data.entities || []).map((e: any) => ({
    id: e.id,
    type: e.type,
    position: [e.position.x, e.position.y, e.position.z] as [number, number, number],
    rotation: [e.rotation.x, e.rotation.y, e.rotation.z] as [number, number, number],
    scale: [e.scale.x, e.scale.y, e.scale.z] as [number, number, number],
    color: e.color,
    name: e.metadata?.name || e.type,
    ...(e.scad_code && { scad_code: e.scad_code }),
    ...(e.prompt && { prompt: e.prompt })
  }));

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0F1117]">
      <EditorClient 
        projectId={id} 
        roomId={data.room.id}
        initialEntities={initialEntities}
        projectName={data.project.name}
      />
    </main>
  );
}
