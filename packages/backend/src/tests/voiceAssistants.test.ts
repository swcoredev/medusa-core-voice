// Voice Assistants API Tests
// Note: These tests require the server to be running on localhost:9000

const baseUrl = 'http://localhost:9000'\;

// Mock test data
const testAssistant = {
  name: 'Test Assistant',
  description: 'Test Description',
  category: 'test',
  price: 19.99,
  status: 'active'
};

describe('Voice Assistants API', () => {
  let createdAssistantId: string;

  beforeAll(async () => {
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    // Cleanup: delete test assistant if it exists
    if (createdAssistantId) {
      try {
        await fetch(`${baseUrl}/api/voice-assistants/${createdAssistantId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.log('Cleanup failed:', error);
      }
    }
  });

  describe('GET /api/voice-assistants', () => {
    it('should return list of voice assistants', async () => {
      const response = await fetch(`${baseUrl}/api/voice-assistants`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(typeof data.count).toBe('number');
    });
  });

  describe('POST /api/voice-assistants', () => {
    it('should create a new voice assistant', async () => {
      const response = await fetch(`${baseUrl}/api/voice-assistants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testAssistant)
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.name).toBe(testAssistant.name);
      expect(data.data.description).toBe(testAssistant.description);
      expect(data.data.category).toBe(testAssistant.category);
      expect(data.data.price).toBe(testAssistant.price.toString());
      expect(data.data.status).toBe(testAssistant.status);
      expect(data.data.id).toBeDefined();

      createdAssistantId = data.data.id;
    });

    it('should return error for missing required fields', async () => {
      const response = await fetch(`${baseUrl}/api/voice-assistants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: 'Missing name' })
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Name is required');
    });
  });

  describe('GET /api/voice-assistants/:id', () => {
    it('should return specific voice assistant', async () => {
      if (!createdAssistantId) {
        throw new Error('No assistant ID available for testing');
      }

      const response = await fetch(`${baseUrl}/api/voice-assistants/${createdAssistantId}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(createdAssistantId);
      expect(data.data.name).toBe(testAssistant.name);
    });

    it('should return 404 for non-existent assistant', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await fetch(`${baseUrl}/api/voice-assistants/${fakeId}`);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Voice assistant not found');
    });
  });

  describe('PUT /api/voice-assistants/:id', () => {
    it('should update voice assistant', async () => {
      if (!createdAssistantId) {
        throw new Error('No assistant ID available for testing');
      }

      const updateData = {
        name: 'Updated Test Assistant',
        price: 29.99
      };

      const response = await fetch(`${baseUrl}/api/voice-assistants/${createdAssistantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe(updateData.name);
      expect(data.data.price).toBe(updateData.price.toString());
      expect(data.data.updated_at).not.toBe(data.data.created_at);
    });

    it('should return 404 for non-existent assistant', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await fetch(`${baseUrl}/api/voice-assistants/${fakeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'Updated' })
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Voice assistant not found');
    });
  });

  describe('DELETE /api/voice-assistants/:id', () => {
    it('should delete voice assistant', async () => {
      if (!createdAssistantId) {
        throw new Error('No assistant ID available for testing');
      }

      const response = await fetch(`${baseUrl}/api/voice-assistants/${createdAssistantId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(createdAssistantId);
      expect(data.message).toBe('Voice assistant deleted successfully');

      // Verify deletion
      const getResponse = await fetch(`${baseUrl}/api/voice-assistants/${createdAssistantId}`);
      expect(getResponse.status).toBe(404);

      createdAssistantId = ''; // Clear for cleanup
    });

    it('should return 404 for non-existent assistant', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await fetch(`${baseUrl}/api/voice-assistants/${fakeId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Voice assistant not found');
    });
  });
});
