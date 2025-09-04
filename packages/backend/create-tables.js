require('dotenv').config();
const { Client } = require('pg');

async function createTables() {
  // Парсим DATABASE_URL из .env
  const dbUrl = process.env.DATABASE_URL;
  const url = new URL(dbUrl);
  
  const client = new Client({
    host: url.hostname,
    port: url.port,
    database: url.pathname.slice(1), // убираем первый символ '/'
    user: url.username,
    password: url.password
  });

  try {
    console.log('🔌 Подключение к базе данных...');
    await client.connect();
    console.log('✅ Подключение установлено');

    // Создаем базовые таблицы Medusa
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS regions (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        currency_code VARCHAR(3) NOT NULL,
        tax_rate DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS stores (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        region_id VARCHAR(255) REFERENCES regions(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        handle VARCHAR(255) UNIQUE,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS voice_assistants (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        price DECIMAL(10,2),
        developer_id VARCHAR(255) REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    console.log('📊 Создание таблиц...');
    
    for (const table of tables) {
      try {
        await client.query(table);
        console.log('✅ Таблица создана');
      } catch (error) {
        if (error.code === '42P07') { // table already exists
          console.log('ℹ️  Таблица уже существует');
        } else {
          console.error('❌ Ошибка создания таблицы:', error.message);
        }
      }
    }

    console.log('🎉 Все таблицы созданы успешно!');

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Соединение закрыто');
  }
}

createTables(); 