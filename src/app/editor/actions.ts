'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getEditorData(projectId: string) {
  const supabase = createClient()
  
  // 1. Get project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (projectError || !project) return { error: 'Project not found' }

  // 2. Get or Create Room
  let { data: rooms, error: roomError } = await supabase
    .from('rooms')
    .select('*')
    .eq('project_id', projectId)

  let room;
  if (roomError || !rooms || rooms.length === 0) {
    const { data: newRoom, error: createRoomError } = await supabase
      .from('rooms')
      .insert([{ project_id: projectId, name: 'Default Room' }])
      .select()
      .single()
    
    if (createRoomError) return { error: 'Failed to create room' }
    room = newRoom
  } else {
    room = rooms[0]
  }

  // 3. Get Entities
  const { data: entities, error: entitiesError } = await supabase
    .from('entities')
    .select('*')
    .eq('room_id', room.id)

  return {
    project,
    room,
    entities: entities || [],
  }
}

export async function saveEntity(entity: any, roomId: string) {
  const supabase = createClient()
  
  const payload = {
    id: entity.id,
    room_id: roomId,
    type: entity.type,
    position: { x: entity.position[0], y: entity.position[1], z: entity.position[2] },
    rotation: { x: entity.rotation[0], y: entity.rotation[1], z: entity.rotation[2] },
    scale: { x: entity.scale[0], y: entity.scale[1], z: entity.scale[2] },
    color: entity.color,
    metadata: { name: entity.name },
    ...(entity.scad_code && { scad_code: entity.scad_code }),
    ...(entity.prompt && { prompt: entity.prompt })
  }

  const { error } = await supabase
    .from('entities')
    .upsert([payload])

  if (error) return { error: error.message }
  return { success: true }
}

export async function deleteEntity(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('entities')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  return { success: true }
}

export async function saveAILog(projectId: string, prompt: string, scadCode: string) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData?.user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('ai_logs')
    .insert([{
      user_id: userData.user.id,
      project_id: projectId,
      prompt: prompt,
      scad_code: scadCode,
      status: 'success'
    }]);

  if (error) return { error: error.message };
  return { success: true };
}
