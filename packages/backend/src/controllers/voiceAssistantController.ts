import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { 
  VoiceAssistant, 
  CreateVoiceAssistantRequest, 
  UpdateVoiceAssistantRequest,
  VoiceAssistantResponse,
  VoiceAssistantsListResponse 
} from '../models/voiceAssistant';

// Database connection configuration
const dbConfig = {
  host: 'localhost',
  port: 5433,
  database: 'medusa-db',
  user: 'medusa',
  password: 'medusadbpass'
};

// Helper function to get database client
async function getDbClient(): Promise<Client> {
  const client = new Client(dbConfig);
  await client.connect();
  return client;
}

// GET /api/voice-assistants - Get all voice assistants
export async function getAllVoiceAssistants(): Promise<VoiceAssistantsListResponse> {
  try {
    const client = await getDbClient();
    
    const result = await client.query(
      'SELECT * FROM voice_assistants ORDER BY created_at DESC'
    );
    
    await client.end();
    
    return {
      success: true,
      data: result.rows,
      count: result.rows.length
    };
  } catch (error) {
    console.error('Error getting voice assistants:', error);
    return {
      success: false,
      error: 'Failed to fetch voice assistants'
    };
  }
}

// GET /api/voice-assistants/:id - Get voice assistant by ID
export async function getVoiceAssistantById(id: string): Promise<VoiceAssistantResponse> {
  try {
    const client = await getDbClient();
    
    const result = await client.query(
      'SELECT * FROM voice_assistants WHERE id = $1',
      [id]
    );
    
    await client.end();
    
    if (result.rows.length === 0) {
      return {
        success: false,
        error: 'Voice assistant not found'
      };
    }
    
    return {
      success: true,
      data: result.rows[0]
    };
  } catch (error) {
    console.error('Error getting voice assistant:', error);
    return {
      success: false,
      error: 'Failed to fetch voice assistant'
    };
  }
}

// POST /api/voice-assistants - Create new voice assistant
export async function createVoiceAssistant(
  data: CreateVoiceAssistantRequest
): Promise<VoiceAssistantResponse> {
  try {
    const client = await getDbClient();
    
    const id = uuidv4();
    const status = data.status || 'active';
    const now = new Date();
    
    const result = await client.query(
      `INSERT INTO voice_assistants (id, name, language, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, data.name, data.language, status, now, now]
    );
    
    await client.end();
    
    return {
      success: true,
      data: result.rows[0],
      message: 'Voice assistant created successfully'
    };
  } catch (error) {
    console.error('Error creating voice assistant:', error);
    return {
      success: false,
      error: 'Failed to create voice assistant'
    };
  }
}

// PUT /api/voice-assistants/:id - Update voice assistant
export async function updateVoiceAssistant(
  id: string,
  data: UpdateVoiceAssistantRequest
): Promise<VoiceAssistantResponse> {
  try {
    const client = await getDbClient();
    
    // Build dynamic update query
    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    if (data.name !== undefined) {
      updateFields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    
    if (data.language !== undefined) {
      updateFields.push(`language = $${paramCount++}`);
      values.push(data.language);
    }
    
    if (data.status !== undefined) {
      updateFields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    
    if (updateFields.length === 0) {
      await client.end();
      return {
        success: false,
        error: 'No fields to update'
      };
    }
    
    updateFields.push(`updated_at = $${paramCount++}`);
    values.push(new Date());
    values.push(id); // for WHERE clause
    
    const query = `
      UPDATE voice_assistants 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    
    const result = await client.query(query, values);
    
    await client.end();
    
    if (result.rows.length === 0) {
      return {
        success: false,
        error: 'Voice assistant not found'
      };
    }
    
    return {
      success: true,
      data: result.rows[0],
      message: 'Voice assistant updated successfully'
    };
  } catch (error) {
    console.error('Error updating voice assistant:', error);
    return {
      success: false,
      error: 'Failed to update voice assistant'
    };
  }
}

// DELETE /api/voice-assistants/:id - Delete voice assistant
export async function deleteVoiceAssistant(id: string): Promise<VoiceAssistantResponse> {
  try {
    const client = await getDbClient();
    
    const result = await client.query(
      'DELETE FROM voice_assistants WHERE id = $1 RETURNING *',
      [id]
    );
    
    await client.end();
    
    if (result.rows.length === 0) {
      return {
        success: false,
        error: 'Voice assistant not found'
      };
    }
    
    return {
      success: true,
      data: result.rows[0],
      message: 'Voice assistant deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting voice assistant:', error);
    return {
      success: false,
      error: 'Failed to delete voice assistant'
    };
  }
}
