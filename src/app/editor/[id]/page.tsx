import { EditorClient } from "@/components/editor/EditorClient";

interface EditorPageProps {
  params: {
    id: string;
  };
}

export default function EditorPage({ params }: EditorPageProps) {
  const { id } = params;

  // In Phase 5, we will fetch project data here or in the client component.
  // For now, we just pass the ID and render the shell.

  return (
    <main className="w-screen h-screen overflow-hidden bg-[#0F1117]">
      <EditorClient projectId={id} />
    </main>
  );
}
