require('dotenv').config();
const express = require('express');
const cors = require('cors');

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

// Routes
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

// Voice Assistants API
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
    const result = await client.query("SELECT * FROM voice_assistants");
    await client.end();
    
    res.json({
      voice_assistants: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
async function startServer() {
  console.log('🚀 Запуск простого Medusa backend...');
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
  });
}

startServer().catch(console.error); 