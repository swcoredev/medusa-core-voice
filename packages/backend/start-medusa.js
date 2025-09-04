require('dotenv').config();

async function startMedusa() {
  try {
    console.log('🚀 Запуск Medusa...');
    console.log('📊 DATABASE_URL:', process.env.DATABASE_URL);
    console.log('🔴 REDIS_URL:', process.env.REDIS_URL);
    
    // Проверяем подключение к БД
    const { Client } = require('pg');
    const client = new Client({
      host: 'localhost',
      port: 5433,
      database: 'medusa-db',
      user: 'medusa',
      password: 'medusadbpass'
    });
    
    console.log('🔌 Проверка подключения к БД...');
    await client.connect();
    console.log('✅ Подключение к БД установлено');
    await client.end();
    
    // Запускаем Medusa
    console.log('🎯 Запуск Medusa сервера...');
    
    // Используем spawn для запуска medusa develop
    const { spawn } = require('child_process');
    const medusaProcess = spawn('npx', ['@medusajs/medusa-cli', 'develop'], {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'development'
      }
    });
    
    medusaProcess.on('error', (error) => {
      console.error('❌ Ошибка запуска Medusa:', error.message);
    });
    
    medusaProcess.on('exit', (code) => {
      console.log(`🛑 Medusa завершил работу с кодом: ${code}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

startMedusa(); 