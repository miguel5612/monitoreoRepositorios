module.exports = {
  // ============================================
  // CONFIGURACIÓN DE REPOSITORIOS
  // ============================================
  repositories: [
    {
      id: 'proyecto1',
      name: 'Proyecto Principal',
      localPath: 'C:\\Users\\Usuario\\proyectos\\proyecto1', // Cambia esta ruta
      branches: ['main', 'develop'],
      responsible: 'Juan Pérez',
      team: 'Backend',
      priority: 'high'
    },
    {
      id: 'frontend',
      name: 'Portal Web',
      localPath: 'C:\\Users\\Usuario\\proyectos\\frontend', // Cambia esta ruta
      branches: ['main'],
      responsible: 'Ana García',
      team: 'Frontend',
      priority: 'high'
    },
    {
      id: 'api',
      name: 'API REST',
      localPath: 'C:\\Users\\Usuario\\proyectos\\api', // Cambia esta ruta
      branches: ['main', 'staging'],
      responsible: 'Carlos López',
      team: 'Backend',
      priority: 'medium'
    }
  ],

  // ============================================
  // CONFIGURACIÓN DE PROGRAMACIÓN
  // ============================================
  schedule: {
    enabled: true,
    cronExpression: '0 9 * * *', // Todos los días a las 9:00 AM
    // Ejemplos:
    // '0 9 * * *'     - Diario a las 9:00 AM
    // '0 9 * * 1-5'   - Lunes a Viernes a las 9:00 AM
    // '*/30 * * * *'  - Cada 30 minutos
    // '0 9,18 * * *'  - Dos veces al día: 9 AM y 6 PM
  },

  // ============================================
  // CONFIGURACIÓN DEL INFORME
  // ============================================
  report: {
    // Directorio donde se guardarán los informes
    outputDir: './reports',
    
    // Prefijo para los archivos generados
    filePrefix: 'informe_repos',
    
    // Información de la empresa/proyecto
    companyName: 'Mi Empresa',
    projectName: 'Monitoreo de Repositorios',
    
    // Colores del informe (formato hexadecimal)
    colors: {
      primary: '#2563eb',     // Azul principal
      secondary: '#1e40af',   // Azul oscuro
      success: '#10b981',     // Verde (activo)
      warning: '#f59e0b',     // Amarillo (advertencia)
      danger: '#ef4444',      // Rojo (inactivo)
      background: '#f3f4f6',  // Gris claro
      text: '#1f2937'         // Gris oscuro
    },
    
    // Umbrales de inactividad (en días)
    thresholds: {
      active: 3,      // Menos de 3 días = Verde
      warning: 7,     // 3-7 días = Amarillo
      inactive: 7     // Más de 7 días = Rojo
    }
  },

  // ============================================
  // CONFIGURACIÓN DE GIT
  // ============================================
  git: {
    // Hacer git fetch antes de revisar (recomendado)
    fetchBeforeCheck: true,
    
    // Hacer git pull antes de revisar (opcional, más lento)
    pullBeforeCheck: false,
    
    // Timeout para comandos Git (en milisegundos)
    timeout: 30000
  },

  // ============================================
  // CONFIGURACIÓN DE LOGGING
  // ============================================
  logging: {
    verbose: true,           // Mostrar información detallada
    showGitOutput: false,    // Mostrar salida de comandos Git
    logToFile: true,         // Guardar logs en archivo
    logFile: './logs/monitor.log'
  }
};
