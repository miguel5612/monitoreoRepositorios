# 🔍 Sistema de Monitoreo de Repositorios Git

Sistema automatizado para monitorear repositorios Git locales y generar informes visuales en formato JPG.

## ✨ Características

- ✅ **100% Local**: No requiere tokens ni APIs externas
- 📊 **Informes Visuales**: Genera automáticamente informes en HTML y JPG
- ⏰ **Programación Automática**: Ejecución diaria configurable
- 🎨 **Diseño Profesional**: Informes con diseño moderno y colores personalizables
- 👥 **Organización por Equipos**: Agrupa repositorios por equipos y responsables
- 🚦 **Estados Visuales**: Indicadores claros de actividad (verde/amarillo/rojo)
- 🌿 **Multi-Rama**: Monitorea múltiples ramas por repositorio
- 💾 **Historial Completo**: Guarda todos los reportes con timestamp

## 📋 Requisitos

- **Node.js** 14 o superior
- **Git** instalado y configurado
- Repositorios Git clonados localmente

## 🚀 Instalación Rápida

### 1. Instalar dependencias

```bash
# Ejecutar el script de instalación
setup.bat

# O manualmente
npm install
```

### 2. Configurar repositorios

Edita el archivo `config.js` y modifica la sección `repositories`:

```javascript
repositories: [
  {
    id: 'mi-proyecto',
    name: 'Mi Proyecto',
    localPath: 'C:\\Users\\Usuario\\proyectos\\mi-proyecto',
    branches: ['main', 'develop'],
    responsible: 'Juan Pérez',
    team: 'Backend',
    priority: 'high'
  }
]
```

**IMPORTANTE**: En Windows, usa doble barra invertida (`\\`) en las rutas.

### 3. Probar el sistema

```bash
# Ejecutar una vez para probar
npm test
```

Los informes se generan en la carpeta `reports/`.

## 📖 Uso

### Modo Manual (Una Sola Vez)

```bash
npm test
```

### Modo Automático (Programado)

```bash
npm start
```

Por defecto se ejecuta todos los días a las 9:00 AM.

### Ver Demo

```bash
npm run demo
```

## 📊 Informe Generado

El sistema genera tres archivos:

1. **latest.html** - Informe interactivo
2. **latest.json** - Datos estructurados
3. **latest.jpg** - Imagen visual

Cada informe incluye:
- Estado de cada repositorio y rama
- Último commit (hash, autor, fecha)
- Días de inactividad
- Alertas visuales (verde/amarillo/rojo)
- Resumen por equipo y responsable

## ⚙️ Configuración

### Programación (Cron)

En `config.js`:

```javascript
schedule: {
  enabled: true,
  cronExpression: '0 9 * * *'  // Diario a las 9 AM
}
```

**Ejemplos:**
- `'0 9 * * *'` - Todos los días a las 9:00 AM
- `'0 9 * * 1-5'` - Lunes a Viernes a las 9:00 AM
- `'0 9,18 * * *'` - 9:00 AM y 6:00 PM

### Umbrales de Inactividad

```javascript
thresholds: {
  active: 3,      // < 3 días = Verde
  warning: 7,     // 3-7 días = Amarillo  
  inactive: 7     // > 7 días = Rojo
}
```

### Colores Personalizados

```javascript
colors: {
  primary: '#2563eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
}
```

## 🛠️ Solución de Problemas

### "node no se reconoce"
- Instala Node.js: https://nodejs.org/
- Reinicia la terminal

### "git no se reconoce"  
- Instala Git: https://git-scm.com/
- Reinicia la terminal

### "No es un repositorio válido"
- Verifica la ruta en `config.js`
- Asegúrate de que existe la carpeta `.git`

### "No se encontró la rama"
- Verifica el nombre con: `git branch -a`
- Los nombres son case-sensitive

## 📁 Estructura

```
monitoreo-repositorios/
├── config.js              # Configuración (EDITAR ESTE)
├── index.js              # Orquestador principal
├── monitor.js            # Módulo de monitoreo
├── generateReport.js     # Generador de informes
├── demo.js               # Script de demostración
├── setup.bat             # Instalación
├── quick-start.bat       # Menú rápido
│
├── reports/              # Informes generados
│   ├── latest.html
│   ├── latest.json
│   └── latest.jpg
│
└── logs/                 # Logs del sistema
```

## 💡 Consejos

1. Usa rutas absolutas en Windows con `\\`
2. Ejecuta `npm run demo` para ver un ejemplo
3. Los informes JPG son perfectos para compartir
4. Revisa el JSON para integraciones personalizadas

## 📞 Ayuda

- Documentación: Ver archivo `README.md`
- Instalación Windows: Ver `INSTALL_WINDOWS.md`
- Ejemplos: Ver `config.example.js`

## 📄 Licencia

MIT License - Usa libremente este código.

---

**¡Disfruta del monitoreo automatizado! 🚀**
