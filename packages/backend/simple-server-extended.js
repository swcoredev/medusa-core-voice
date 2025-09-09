require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors());
app.use(express.json());

// Проверка подключения к БД
async function checkDatabase() {
  try {
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    console.log('✅ Подключение к PostgreSQL установлено');
    
    // Проверяем таблицы
    const result = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('📊 Найденные таблицы:', result.rows.map(row => row.table_name));
    
    await client.end();
    return true;
  } catch (error) {
    console.error('❌ Ошибка подключения к БД:', error.message);
    return false;
  }
}

// Basic Routes
app.get('/', (req, res) => {
  res.json({
    message: '🎯 Medusa Core Voice Backend работает!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', async (req, res) => {
  const dbStatus = await checkDatabase();
  res.json({
    status: 'ok',
    database: dbStatus ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/tables', async (req, res) => {
  try {
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    const result = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    await client.end();
    
    res.json({
      tables: result.rows.map(row => row.table_name),
      count: result.rows.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Voice Assistants API Routes (Fixed for actual table structure)
// Table structure: id, name, description, category, price, developer_id, status, created_at, updated_at

// GET /api/voice-assistants - Get all voice assistants
app.get('/api/voice-assistants', async (req, res) => {
  try {
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    const result = await client.query('SELECT * FROM voice_assistants ORDER BY created_at DESC');
    await client.end();
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch voice assistants'
    });
  }
});

// GET /api/voice-assistants/:id - Get voice assistant by ID
app.get('/api/voice-assistants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    const result = await client.query('SELECT * FROM voice_assistants WHERE id = $1', [id]);
    await client.end();
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Voice assistant not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch voice assistant'
    });
  }
});

// POST /api/voice-assistants - Create new voice assistant
app.post('/api/voice-assistants', async (req, res) => {
  try {
    const { name, description, category, price, developer_id, status } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }
    
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    const id = uuidv4();
    const assistantStatus = status || 'pending';
    const now = new Date();
    
    const result = await client.query(
      `INSERT INTO voice_assistants (id, name, description, category, price, developer_id, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, name, description || null, category || null, price || null, developer_id || null, assistantStatus, now, now]
    );
    
    await client.end();
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Voice assistant created successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create voice assistant'
    });
  }
});

// PUT /api/voice-assistants/:id - Update voice assistant
app.put('/api/voice-assistants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
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
    
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    
    // Build dynamic update query
    const updateFields = [];
    const values = [];
    let paramCount = 1;
    
    if (updateData.name !== undefined) {
      updateFields.push(`name = $${paramCount++}`);
      values.push(updateData.name);
    }
    
    if (updateData.description !== undefined) {
      updateFields.push(`description = $${paramCount++}`);
      values.push(updateData.description);
    }
    
    if (updateData.category !== undefined) {
      updateFields.push(`category = $${paramCount++}`);
      values.push(updateData.category);
    }
    
    if (updateData.price !== undefined) {
      updateFields.push(`price = $${paramCount++}`);
      values.push(updateData.price);
    }
    
    if (updateData.developer_id !== undefined) {
      updateFields.push(`developer_id = $${paramCount++}`);
      values.push(updateData.developer_id);
    }
    
    if (updateData.status !== undefined) {
      updateFields.push(`status = $${paramCount++}`);
      values.push(updateData.status);
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
      return res.status(404).json({
        success: false,
        error: 'Voice assistant not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Voice assistant updated successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update voice assistant'
    });
  }
});

// DELETE /api/voice-assistants/:id - Delete voice assistant
app.delete('/api/voice-assistants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Voice assistant ID is required'
      });
    }
    
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    const result = await client.query('DELETE FROM voice_assistants WHERE id = $1 RETURNING *', [id]);
    await client.end();
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Voice assistant not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Voice assistant deleted successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete voice assistant'
    });
  }
});

// ===== DEVELOPERS API =====

// POST /api/developers/register - Register new developer
app.post('/api/developers/register', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required'
      });
    }
    
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    const id = uuidv4();
    const now = new Date();
    
    const result = await client.query(
      `INSERT INTO developers (id, name, email, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, name, email, now, now]
    );
    
    await client.end();
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Developer registered successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    if (error.code === '23505') { // Unique constraint violation
      res.status(409).json({
        success: false,
        error: 'Developer with this email already exists'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to register developer'
      });
    }
  }
});

// GET /api/developers - Get all developers
app.get('/api/developers', async (req, res) => {
  try {
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    const result = await client.query('SELECT * FROM developers ORDER BY created_at DESC');
    await client.end();
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch developers'
    });
  }
});

// POST /api/developers/assistants - Upload assistant by developer
app.post('/api/developers/assistants', async (req, res) => {
  try {
    const { developer_id, name, description, category, price } = req.body;
    
    if (!developer_id || !name) {
      return res.status(400).json({
        success: false,
        error: 'Developer ID and name are required'
      });
    }
    
    // Verify developer exists
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    
    const devCheck = await client.query('SELECT id FROM developers WHERE id = $1', [developer_id]);
    if (devCheck.rows.length === 0) {
      await client.end();
      return res.status(404).json({
        success: false,
        error: 'Developer not found'
      });
    }
    
    const id = uuidv4();
    const now = new Date();
    
    const result = await client.query(
      `INSERT INTO voice_assistants (id, name, description, category, price, developer_id, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, name, description || null, category || null, price || null, developer_id, 'pending', now, now]
    );
    
    await client.end();
    
    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Assistant uploaded successfully and pending approval'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload assistant'
    });
  }
});

// GET /api/developers/assistants - Get assistants by developer
app.get('/api/developers/assistants', async (req, res) => {
  try {
    const { developer_id } = req.query;
    
    if (!developer_id) {
      return res.status(400).json({
        success: false,
        error: 'Developer ID is required'
      });
    }
    
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    const result = await client.query(
      'SELECT * FROM voice_assistants WHERE developer_id = $1 ORDER BY created_at DESC',
      [developer_id]
    );
    await client.end();
    
    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch developer assistants'
    });
  }
});

// ===== STATUS MANAGEMENT API =====

// PUT /api/voice-assistants/:id/approve - Approve assistant
app.put('/api/voice-assistants/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    const result = await client.query(
      `UPDATE voice_assistants 
       SET status = 'approved', updated_at = $1
       WHERE id = $2
       RETURNING *`,
      [new Date(), id]
    );
    await client.end();
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Voice assistant not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Voice assistant approved successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve voice assistant'
    });
  }
});

// PUT /api/voice-assistants/:id/reject - Reject assistant
app.put('/api/voice-assistants/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    const result = await client.query(
      `UPDATE voice_assistants 
       SET status = 'rejected', updated_at = $1
       WHERE id = $2
       RETURNING *`,
      [new Date(), id]
    );
    await client.end();
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Voice assistant not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: reason ? `Voice assistant rejected: ${reason}` : 'Voice assistant rejected successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject voice assistant'
    });
  }
});

// PUT /api/voice-assistants/:id/publish - Publish assistant
app.put('/api/voice-assistants/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    await client.connect();
    const result = await client.query(
      `UPDATE voice_assistants 
       SET status = 'published', updated_at = $1
       WHERE id = $2
       RETURNING *`,
      [new Date(), id]
    );
    await client.end();
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Voice assistant not found'
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
      message: 'Voice assistant published successfully'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish voice assistant'
    });
  }
});

// Start server
async function startServer() {
  console.log('🚀 Запуск расширенного Medusa backend...');
  console.log('📊 DATABASE_URL:', process.env.DATABASE_URL);
  console.log('🔴 REDIS_URL:', process.env.REDIS_URL);
  
  // Проверяем БД
  await checkDatabase();
  
  app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
    console.log('🎯 Backend готов к работе!');
    console.log('📱 API endpoints:');
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log(`   GET  http://localhost:${PORT}/api/tables`);
    console.log(`   GET  http://localhost:${PORT}/api/voice-assistants`);
    console.log(`   GET  http://localhost:${PORT}/api/voice-assistants/:id`);
    console.log(`   POST http://localhost:${PORT}/api/voice-assistants`);
    console.log(`   PUT  http://localhost:${PORT}/api/voice-assistants/:id`);
    console.log(`   DELETE http://localhost:${PORT}/api/voice-assistants/:id`);
    console.log('👨‍💻 Developers API:');
    console.log(`   POST http://localhost:${PORT}/api/developers/register`);
    console.log(`   GET  http://localhost:${PORT}/api/developers`);
    console.log(`   POST http://localhost:${PORT}/api/developers/assistants`);
    console.log(`   GET  http://localhost:${PORT}/api/developers/assistants?developer_id=xxx`);
    console.log('📋 Status Management:');
    console.log(`   PUT  http://localhost:${PORT}/api/voice-assistants/:id/approve`);
    console.log(`   PUT  http://localhost:${PORT}/api/voice-assistants/:id/reject`);
    console.log(`   PUT  http://localhost:${PORT}/api/voice-assistants/:id/publish`);
  });
}

startServer().catch(console.error);
