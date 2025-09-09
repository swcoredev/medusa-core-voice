import { Router, Request, Response } from 'express';
import {
  getAllVoiceAssistants,
  getVoiceAssistantById,
  createVoiceAssistant,
  updateVoiceAssistant,
  deleteVoiceAssistant
} from '../controllers/voiceAssistantController';
import { CreateVoiceAssistantRequest, UpdateVoiceAssistantRequest } from '../models/voiceAssistant';

const router = Router();

// GET /api/voice-assistants - Get all voice assistants
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await getAllVoiceAssistants();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// GET /api/voice-assistants/:id - Get voice assistant by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Voice assistant ID is required'
      });
    }
    
    const result = await getVoiceAssistantById(id);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// POST /api/voice-assistants - Create new voice assistant
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, language, status }: CreateVoiceAssistantRequest = req.body;
    
    // Validation
    if (!name || !language) {
      return res.status(400).json({
        success: false,
        error: 'Name and language are required'
      });
    }
    
    if (status && !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be either "active" or "inactive"'
      });
    }
    
    const result = await createVoiceAssistant({ name, language, status });
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// PUT /api/voice-assistants/:id - Update voice assistant
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateVoiceAssistantRequest = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Voice assistant ID is required'
      });
    }
    
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one field must be provided for update'
      });
    }
    
    if (updateData.status && !['active', 'inactive'].includes(updateData.status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be either "active" or "inactive"'
      });
    }
    
    const result = await updateVoiceAssistant(id, updateData);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// DELETE /api/voice-assistants/:id - Delete voice assistant
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Voice assistant ID is required'
      });
    }
    
    const result = await deleteVoiceAssistant(id);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
