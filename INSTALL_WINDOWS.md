# 🪟 Guía de Instalación para Windows

## 📋 Pre-requisitos

### 1. Node.js (Requerido)

1. Ve a https://nodejs.org/
2. Descarga la versión LTS
3. Ejecuta el instalador
4. Reinicia la terminal

Verificar:
```cmd
node --version
npm --version
```

### 2. Git (Requerido)

1. Ve a https://git-scm.com/download/win
2. Descarga Git para Windows
3. Ejecuta el instalador
4. Reinicia la terminal

Verificar:
```cmd
git --version
```

## 🚀 Instalación

### Paso 1: Ejecutar Setup

Abre una terminal en la carpeta y ejecuta:

```cmd
setup.bat
```

Esto instalará todas las dependencias automáticamente.

### Paso 2: Configurar Repositorios

Edita `config.js` con tus repositorios:

```javascript
repositories: [
  {
    id: 'mi-proyecto',
    name: 'Mi Proyecto',
    localPath: 'C:\\Users\\Usuario\\proyectos\\mi-proyecto',
    branches: ['main', 'develop'],
    responsible: 'Tu Nombre',
    team: 'Backend',
    priority: 'high'
  }
]
```

**IMPORTANTE**: Usa doble barra `\\` en las rutas de Windows.

### Paso 3: Probar

```cmd
npm test
```

Revisa el informe en: `reports\latest.jpg`

## 📝 Encontrar Rutas de Repositorios

### Método 1: Explorador de Archivos

1. Abre el repositorio en el Explorador
2. Haz clic en la barra de direcciones
3. Copia la ruta
4. Duplica las barras invertidas en `config.js`

Ejemplo:
- Ruta copiada: `C:\Users\Usuario\proyectos\mi-repo`
- En config.js: `C:\\Users\\Usuario\\proyectos\\mi-repo`

### Método 2: Terminal

```cmd
cd C:\ruta\a\tu\repositorio
cd
```

Copia la ruta y úsala con dobles barras.

## 🧪 Verificar Instalación

```cmd
# Ver informe de demostración
npm run demo

# Probar con tus repositorios
npm test

# Iniciar servicio automático
npm start
```

## 🛠️ Solución de Problemas

### Error: "node no se reconoce"
**Solución**: Instala Node.js y reinicia la terminal

### Error: "git no se reconoce"
**Solución**: Instala Git y reinicia la terminal

### Error: "No es un repositorio válido"
**Solución**: Verifica la ruta en config.js

### Las ramas no aparecen
**Solución**: Verifica el nombre con `git branch -a`

## 📁 Archivos Importantes

- `config.js` - Tu configuración (EDITAR ESTE)
- `reports/` - Informes generados aquí
- `setup.bat` - Instalación automática
- `quick-start.bat` - Menú interactivo

## 🎯 Próximos Pasos

1. ✅ Instalar Node.js y Git
2. ✅ Ejecutar `setup.bat`
3. ✅ Editar `config.js`
4. ✅ Ejecutar `npm test`
5. ✅ Revisar `reports\latest.jpg`

---

**¿Problemas?** Lee el archivo `README.md` completo.
