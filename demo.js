const chalk = require('chalk');
const ReportGenerator = require('./generateReport');
const config = require('./config');

// Generar datos de ejemplo
function generateDemoData() {
  const now = new Date();
  const daysAgo = (days) => {
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    return date;
  };

  return {
    repositories: [
      {
        id: 'demo-backend',
        name: 'API Backend (Demo)',
        localPath: 'C:\\proyectos\\backend',
        responsible: 'Juan Pérez',
        team: 'Backend',
        priority: 'high',
        branches: [
          {
            name: 'main',
            lastCommit: {
              hash: 'a1b2c3d4',
              date: daysAgo(1),
              author: 'Juan Pérez',
              message: 'Feat: Nueva funcionalidad',
              daysAgo: 1
            },
            status: { level: 'success', label: 'Activo', icon: '✅' }
          },
          {
            name: 'develop',
            lastCommit: {
              hash: 'e5f6g7h8',
              date: daysAgo(2),
              author: 'Ana García',
              message: 'Fix: Corregir bug',
              daysAgo: 2
            },
            status: { level: 'success', label: 'Activo', icon: '✅' }
          }
        ],
        timestamp: now
      },
      {
        id: 'demo-frontend',
        name: 'Portal Web (Demo)',
        localPath: 'C:\\proyectos\\frontend',
        responsible: 'Ana García',
        team: 'Frontend',
        priority: 'high',
        branches: [
          {
            name: 'main',
            lastCommit: {
              hash: 'i9j0k1l2',
              date: daysAgo(5),
              author: 'Carlos López',
              message: 'Refactor: Mejorar componentes',
              daysAgo: 5
            },
            status: { level: 'warning', label: 'Advertencia', icon: '⚠️' }
          }
        ],
        timestamp: now
      },
      {
        id: 'demo-mobile',
        name: 'App Móvil (Demo)',
        localPath: 'C:\\proyectos\\mobile',
        responsible: 'Carlos López',
        team: 'Mobile',
        priority: 'medium',
        branches: [
          {
            name: 'main',
            lastCommit: {
              hash: 'm3n4o5p6',
              date: daysAgo(15),
              author: 'María Rodríguez',
              message: 'Update: Actualizar dependencias',
              daysAgo: 15
            },
            status: { level: 'danger', label: 'Inactivo', icon: '❌' }
          }
        ],
        timestamp: now
      }
    ],
    summary: {
      total: 3,
      active: 2,
      warning: 1,
      inactive: 1,
      errors: 0,
      byTeam: {
        'Backend': [{ id: 'demo-backend', name: 'API Backend (Demo)' }],
        'Frontend': [{ id: 'demo-frontend', name: 'Portal Web (Demo)' }],
        'Mobile': [{ id: 'demo-mobile', name: 'App Móvil (Demo)' }]
      },
      byResponsible: {
        'Juan Pérez': [{ id: 'demo-backend', name: 'API Backend (Demo)' }],
        'Ana García': [{ id: 'demo-frontend', name: 'Portal Web (Demo)' }],
        'Carlos López': [{ id: 'demo-mobile', name: 'App Móvil (Demo)' }]
      }
    },
    timestamp: now,
    config: {
      companyName: config.report.companyName + ' (DEMO)',
      projectName: config.report.projectName
    }
  };
}

// Ejecutar demostración
async function runDemo() {
  console.log(chalk.blue.bold('\n' + '='.repeat(70)));
  console.log(chalk.blue.bold('  🎬 MODO DEMOSTRACIÓN - INFORME DE EJEMPLO'));
  console.log(chalk.blue.bold('='.repeat(70) + '\n'));
  
  console.log(chalk.yellow('📋 Generando datos de ejemplo...'));
  console.log(chalk.gray('   (Este informe NO usa repositorios reales)\n'));
  
  const demoData = generateDemoData();
  
  console.log(chalk.cyan('📊 Datos generados:'));
  console.log(chalk.gray(`   Total de repositorios: ${demoData.summary.total}`));
  console.log(chalk.green(`   ✅ Activos: ${demoData.summary.active}`));
  console.log(chalk.yellow(`   ⚠️  Advertencia: ${demoData.summary.warning}`));
  console.log(chalk.red(`   ❌ Inactivos: ${demoData.summary.inactive}`));
  console.log();
  
  const reportGenerator = new ReportGenerator(config);
  
  try {
    const reportPaths = await reportGenerator.generate(demoData);
    
    console.log(chalk.green.bold('\n✨ ¡Informe de demostración generado!\n'));
    console.log(chalk.cyan('📁 Archivos generados:'));
    console.log(chalk.gray(`   HTML: ${reportPaths.latest.html}`));
    console.log(chalk.gray(`   JSON: ${reportPaths.latest.json}`));
    console.log(chalk.gray(`   JPG:  ${reportPaths.latest.jpg}`));
    console.log();
    
    console.log(chalk.blue('💡 Este es un informe de EJEMPLO.'));
    console.log(chalk.gray('   Para usar tus repositorios:'));
    console.log(chalk.gray('   1. Edita config.js'));
    console.log(chalk.gray('   2. Ejecuta: npm test\n'));
    
  } catch (error) {
    console.error(chalk.red.bold('\n❌ Error:'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

// Ejecutar
if (require.main === module) {
  runDemo().catch(error => {
    console.error(chalk.red(error));
    process.exit(1);
  });
}

module.exports = { generateDemoData, runDemo };
