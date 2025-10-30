const cron = require('node-cron');
const chalk = require('chalk');
const config = require('./config');
const RepositoryMonitor = require('./monitor');
const ReportGenerator = require('./generateReport');

class MonitoringService {
  constructor() {
    this.monitor = new RepositoryMonitor(config);
    this.reportGenerator = new ReportGenerator(config);
    this.job = null;
  }

  /**
   * Ejecuta el monitoreo y genera el informe
   */
  async runMonitoring() {
    try {
      const startTime = Date.now();
      
      console.log(chalk.blue.bold('\n' + '='.repeat(70)));
      console.log(chalk.blue.bold('  🔍 SISTEMA DE MONITOREO DE REPOSITORIOS'));
      console.log(chalk.blue.bold('='.repeat(70) + '\n'));
      
      // Monitorear repositorios
      const data = await this.monitor.monitorAll();
      
      // Generar informe
      const reportPaths = await this.reportGenerator.generate(data);
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(chalk.green.bold('='.repeat(70)));
      console.log(chalk.green.bold(`  ✅ Proceso completado en ${duration}s`));
      console.log(chalk.green.bold('='.repeat(70)));
      console.log(chalk.cyan('\n📁 Archivos generados:'));
      console.log(chalk.gray(`   HTML: ${reportPaths.latest.html}`));
      console.log(chalk.gray(`   JSON: ${reportPaths.latest.json}`));
      console.log(chalk.gray(`   JPG:  ${reportPaths.latest.jpg}`));
      console.log();
      
      return reportPaths;
    } catch (error) {
      console.error(chalk.red.bold('\n❌ Error durante el monitoreo:'));
      console.error(chalk.red(error.message));
      console.error(error.stack);
      throw error;
    }
  }

  /**
   * Inicia el servicio con programación automática
   */
  start() {
    console.log(chalk.green.bold('\n🚀 Iniciando Servicio de Monitoreo\n'));
    
    // Mostrar configuración
    this.displayConfiguration();
    
    // Si está habilitada la programación
    if (config.schedule.enabled) {
      console.log(chalk.blue('⏰ Programación activada'));
      console.log(chalk.gray(`   Expresión cron: ${config.schedule.cronExpression}`));
      console.log(chalk.gray(`   Próxima ejecución: ${this.getNextExecutionTime()}\n`));
      
      // Crear tarea programada
      this.job = cron.schedule(config.schedule.cronExpression, async () => {
        console.log(chalk.yellow('\n⏰ Ejecutando monitoreo programado...\n'));
        await this.runMonitoring();
      }, {
        scheduled: true,
        timezone: this.getTimezone()
      });
      
      console.log(chalk.green('✅ Servicio en ejecución'));
      console.log(chalk.gray('   Presiona Ctrl+C para detener\n'));
      
      // Mantener el proceso vivo
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\n\n⏸️  Deteniendo servicio...'));
        if (this.job) {
          this.job.stop();
        }
        console.log(chalk.green('✅ Servicio detenido\n'));
        process.exit(0);
      });
    } else {
      console.log(chalk.yellow('⚠️  Programación desactivada en config.js'));
      console.log(chalk.gray('   Usa --once para ejecutar manualmente\n'));
    }
  }

  /**
   * Ejecuta una vez y termina
   */
  async runOnce() {
    console.log(chalk.yellow('\n⚡ Modo ejecución única\n'));
    await this.runMonitoring();
    console.log(chalk.green('✅ Ejecución completada. Saliendo...\n'));
    process.exit(0);
  }

  /**
   * Muestra la configuración actual
   */
  displayConfiguration() {
    console.log(chalk.cyan('📋 Configuración:'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(`   Repositorios a monitorear: ${config.repositories.length}`);
    console.log(`   Directorio de reportes: ${config.report.outputDir}`);
    console.log(`   Fetch antes de revisar: ${config.git.fetchBeforeCheck ? 'Sí' : 'No'}`);
    console.log(`   Pull antes de revisar: ${config.git.pullBeforeCheck ? 'Sí' : 'No'}`);
    console.log(chalk.gray('─'.repeat(50) + '\n'));
  }

  /**
   * Obtiene la hora de la próxima ejecución
   */
  getNextExecutionTime() {
    try {
      // Parsear expresión cron y calcular próxima ejecución
      const parts = config.schedule.cronExpression.split(' ');
      const minute = parts[0];
      const hour = parts[1];
      
      if (minute === '*') {
        return 'Cada minuto';
      }
      
      if (hour === '*') {
        return `Cada hora en el minuto ${minute}`;
      }
      
      return `Hoy a las ${hour}:${minute.padStart(2, '0')}`;
    } catch {
      return 'No disponible';
    }
  }

  /**
   * Obtiene la zona horaria del sistema
   */
  getTimezone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}

// ============================================
// PUNTO DE ENTRADA
// ============================================

async function main() {
  const service = new MonitoringService();
  
  // Verificar argumentos de línea de comandos
  const args = process.argv.slice(2);
  
  if (args.includes('--once') || args.includes('-o')) {
    // Ejecutar una vez y salir
    await service.runOnce();
  } else if (args.includes('--help') || args.includes('-h')) {
    // Mostrar ayuda
    console.log(chalk.blue.bold('\n📚 Sistema de Monitoreo de Repositorios\n'));
    console.log('Uso:');
    console.log('  node index.js              Inicia el servicio programado');
    console.log('  node index.js --once       Ejecuta una vez y termina');
    console.log('  node index.js --help       Muestra esta ayuda\n');
    console.log('Alias:');
    console.log('  npm start                  = node index.js');
    console.log('  npm test                   = node index.js --once\n');
  } else {
    // Iniciar servicio programado
    service.start();
  }
}

// Ejecutar
main().catch(error => {
  console.error(chalk.red.bold('\n💥 Error fatal:'));
  console.error(chalk.red(error.message));
  process.exit(1);
});
