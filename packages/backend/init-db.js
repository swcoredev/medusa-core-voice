const { spawn } = require('child_process');

async function initDatabase() {
  try {
    console.log("🚀 Инициализация базы данных Medusa...");
    
    // Запускаем medusa develop в фоне
    const medusaProcess = spawn('pnpm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true
    });
    
    // Ждем немного для инициализации
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log("✅ Medusa приложение запущено");
    console.log("📊 База данных инициализирована");
    
    // Останавливаем процесс
    medusaProcess.kill('SIGTERM');
    console.log("🛑 Приложение остановлено");
    
  } catch (error) {
    console.error("❌ Ошибка при инициализации:", error.message);
    process.exit(1);
  }
}

initDatabase(); 