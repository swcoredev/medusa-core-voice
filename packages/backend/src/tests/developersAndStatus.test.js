// Developers API and Status Management Tests
// Note: These tests require the server to be running on localhost:9000

const baseUrl = 'http://localhost:9000';

describe('Developers API and Status Management', () => {
  let developerId;
  let assistantId;

  beforeAll(async () => {
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    // Cleanup: delete test data if it exists
    if (assistantId) {
      try {
        await fetch(`${baseUrl}/api/voice-assistants/${assistantId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.log('Assistant cleanup failed:', error);
      }
    }
  });

  describe('Developers API', () => {
    it('should register a new developer', async () => {
      const response = await fetch(`${baseUrl}/api/developers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Test Developer',
          email: 'test@example.com'
        })
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Test Developer');
      expect(data.data.email).toBe('test@example.com');
      expect(data.data.id).toBeDefined();

      developerId = data.data.id;
    });

    it('should return error for duplicate email', async () => {
      const response = await fetch(`${baseUrl}/api/developers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Another Developer',
          email: 'test@example.com'
        })
      });

      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Developer with this email already exists');
    });

    it('should get all developers', async () => {
      const response = await fetch(`${baseUrl}/api/developers`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.count).toBeGreaterThan(0);
    });

    it('should upload assistant by developer', async () => {
      if (!developerId) {
        throw new Error('No developer ID available for testing');
      }

      const response = await fetch(`${baseUrl}/api/developers/assistants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          developer_id: developerId,
          name: 'Test Assistant',
          description: 'Test Description',
          category: 'test',
          price: 29.99
        })
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Test Assistant');
      expect(data.data.developer_id).toBe(developerId);
      expect(data.data.status).toBe('pending');

      assistantId = data.data.id;
    });

    it('should get developer assistants', async () => {
      if (!developerId) {
        throw new Error('No developer ID available for testing');
      }

      const response = await fetch(`${baseUrl}/api/developers/assistants?developer_id=${developerId}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.count).toBeGreaterThan(0);
    });
  });

  describe('Status Management API', () => {
    it('should approve assistant', async () => {
      if (!assistantId) {
        throw new Error('No assistant ID available for testing');
      }

      const response = await fetch(`${baseUrl}/api/voice-assistants/${assistantId}/approve`, {
        method: 'PUT'
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('approved');
      expect(data.message).toBe('Voice assistant approved successfully');
    });

    it('should reject assistant', async () => {
      if (!assistantId) {
        throw new Error('No assistant ID available for testing');
      }

      // First approve it again to test rejection
      await fetch(`${baseUrl}/api/voice-assistants/${assistantId}/approve`, {
        method: 'PUT'
      });

      const response = await fetch(`${baseUrl}/api/voice-assistants/${assistantId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: 'Test rejection reason'
        })
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('rejected');
      expect(data.message).toContain('Test rejection reason');
    });

    it('should publish assistant', async () => {
      if (!assistantId) {
        throw new Error('No assistant ID available for testing');
      }

      // First approve it to test publication
      await fetch(`${baseUrl}/api/voice-assistants/${assistantId}/approve`, {
        method: 'PUT'
      });

      const response = await fetch(`${baseUrl}/api/voice-assistants/${assistantId}/publish`, {
        method: 'PUT'
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.status).toBe('published');
      expect(data.message).toBe('Voice assistant published successfully');
    });

    it('should return 404 for non-existent assistant status operations', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      
      const response = await fetch(`${baseUrl}/api/voice-assistants/${fakeId}/approve`, {
        method: 'PUT'
      });

      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Voice assistant not found');
    });
  });
});
