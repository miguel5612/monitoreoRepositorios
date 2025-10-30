/**
 * ARCHIVO DE EJEMPLO DE CONFIGURACIÓN
 * 
 * Este archivo muestra todas las opciones disponibles.
 * Puedes copiar ejemplos de aquí a tu config.js
 */

module.exports = {
  repositories: [
    // ========== EJEMPLO 1: Proyecto Backend ==========
    {
      id: 'backend-api',
      name: 'API Backend Principal',
      
      // IMPORTANTE: En Windows usa doble barra o barra normal
      localPath: 'C:\\Users\\Usuario\\proyectos\\backend',
      // También válido: 'C:/Users/Usuario/proyectos/backend'
      
      branches: ['main', 'develop', 'staging'],
      responsible: 'Juan Pérez',
      team: 'Backend',
      priority: 'high'  // high, medium, low
    },

    // ========== EJEMPLO 2: Proyecto Frontend ==========
    {
      id: 'frontend-web',
      name: 'Portal Web React',
      localPath: 'C:\\Users\\Usuario\\proyectos\\frontend',
      branches: ['main', 'develop'],
      responsible: 'Ana García',
      team: 'Frontend',
      priority: 'high'
    },

    // ========== EJEMPLO 3: App Móvil ==========
    {
      id: 'mobile-app',
      name: 'App Móvil',
      localPath: 'C:\\Users\\Usuario\\proyectos\\mobile',
      branches: ['main', 'ios', 'android'],
      responsible: 'Carlos López',
      team: 'Mobile',
      priority: 'medium'
    }
  ],

  // ========== PROGRAMACIÓN ==========
  schedule: {
    enabled: true,
    cronExpression: '0 9 * * *',
    
    // EJEMPLOS DE CRON:
    // '0 9 * * *'       - Diario a las 9 AM
    // '0 9 * * 1-5'     - Lunes a Viernes 9 AM
    // '0 9,18 * * *'    - 9 AM y 6 PM
    // '*/30 * * * *'    - Cada 30 minutos
    // '0 */4 * * *'     - Cada 4 horas
  },

  // ========== INFORME ==========
  report: {
    outputDir: './reports',
    filePrefix: 'informe_repos',
    companyName: 'Mi Empresa',
    projectName: 'Monitoreo de Repositorios',
    
    // COLORES (hexadecimal)
    colors: {
      primary: '#2563eb',
      secondary: '#1e40af',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      background: '#f3f4f6',
      text: '#1f2937'
    },
    
    // UMBRALES (días)
    thresholds: {
      active: 3,      // < 3 días = Verde
      warning: 7,     // 3-7 días = Amarillo
      inactive: 7     // > 7 días = Rojo
    }
  },

  // ========== GIT ==========
  git: {
    fetchBeforeCheck: true,   // Recomendado
    pullBeforeCheck: false,   // Opcional
    timeout: 30000
  },

  // ========== LOGGING ==========
  logging: {
    verbose: true,
    showGitOutput: false,
    logToFile: true,
    logFile: './logs/monitor.log'
  }
};
