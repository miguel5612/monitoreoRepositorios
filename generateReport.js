const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const chalk = require('chalk');

class ReportGenerator {
  constructor(config) {
    this.config = config;
    this.outputDir = path.resolve(config.report.outputDir);
    
    // Crear directorio de salida si no existe
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Genera el HTML del informe
   */
  generateHTML(data) {
    const { repositories, summary, timestamp, config: dataConfig } = data;
    const colors = this.config.report.colors;
    
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informe de Monitoreo de Repositorios</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            padding: 40px 20px;
            color: ${colors.text};
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 36px;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .header .subtitle {
            font-size: 18px;
            opacity: 0.9;
        }
        
        .header .date {
            font-size: 14px;
            opacity: 0.8;
            margin-top: 10px;
        }
        
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 40px;
            background: ${colors.background};
        }
        
        .summary-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .summary-card .number {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .summary-card .label {
            font-size: 14px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .summary-card.success .number { color: ${colors.success}; }
        .summary-card.warning .number { color: ${colors.warning}; }
        .summary-card.danger .number { color: ${colors.danger}; }
        .summary-card.total .number { color: ${colors.primary}; }
        
        .content {
            padding: 40px;
        }
        
        .repo-section {
            margin-bottom: 40px;
        }
        
        .repo-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%);
            border-radius: 12px;
            margin-bottom: 20px;
        }
        
        .repo-header .repo-name {
            font-size: 24px;
            font-weight: 700;
            color: ${colors.primary};
        }
        
        .repo-header .repo-meta {
            font-size: 14px;
            color: #6b7280;
        }
        
        .repo-header .badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .badge.high {
            background: #fef3c7;
            color: #92400e;
        }
        
        .badge.medium {
            background: #dbeafe;
            color: #1e40af;
        }
        
        .badge.low {
            background: #e5e7eb;
            color: #374151;
        }
        
        .branches-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .branches-table thead {
            background: ${colors.background};
        }
        
        .branches-table th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
        }
        
        .branches-table td {
            padding: 15px;
            border-top: 1px solid #e5e7eb;
        }
        
        .branches-table tbody tr:hover {
            background: ${colors.background};
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
        }
        
        .status-badge.success {
            background: #d1fae5;
            color: #065f46;
        }
        
        .status-badge.warning {
            background: #fef3c7;
            color: #92400e;
        }
        
        .status-badge.danger {
            background: #fee2e2;
            color: #991b1b;
        }
        
        .commit-hash {
            font-family: 'Courier New', monospace;
            background: ${colors.background};
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
        }
        
        .error-message {
            background: #fee2e2;
            color: #991b1b;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            font-weight: 600;
        }
        
        .team-section {
            margin-bottom: 50px;
        }
        
        .team-header {
            font-size: 28px;
            font-weight: 700;
            color: ${colors.primary};
            margin-bottom: 25px;
            padding-bottom: 10px;
            border-bottom: 3px solid ${colors.primary};
        }
        
        .footer {
            text-align: center;
            padding: 30px;
            background: ${colors.background};
            color: #6b7280;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>${dataConfig.companyName}</h1>
            <div class="subtitle">${dataConfig.projectName}</div>
            <div class="date">Generado: ${new Date(timestamp).toLocaleString('es-ES', {
              dateStyle: 'full',
              timeStyle: 'short'
            })}</div>
        </div>
        
        <!-- Summary -->
        <div class="summary">
            <div class="summary-card total">
                <div class="number">${summary.total}</div>
                <div class="label">Total Repositorios</div>
            </div>
            <div class="summary-card success">
                <div class="number">${summary.active}</div>
                <div class="label">✅ Activos</div>
            </div>
            <div class="summary-card warning">
                <div class="number">${summary.warning}</div>
                <div class="label">⚠️ Advertencia</div>
            </div>
            <div class="summary-card danger">
                <div class="number">${summary.inactive}</div>
                <div class="label">❌ Inactivos</div>
            </div>
        </div>
        
        <!-- Content -->
        <div class="content">
            ${this.generateTeamSections(repositories, summary)}
        </div>
        
        <!-- Footer -->
        <div class="footer">
            Sistema de Monitoreo de Repositorios | Generado automáticamente
        </div>
    </div>
</body>
</html>
    `;
    
    return html;
  }

  /**
   * Genera las secciones por equipo
   */
  generateTeamSections(repositories, summary) {
    const byTeam = summary.byTeam;
    
    if (Object.keys(byTeam).length === 0) {
      return this.generateRepositoryList(repositories);
    }
    
    let html = '';
    
    Object.entries(byTeam).forEach(([team, repos]) => {
      html += `
        <div class="team-section">
          <div class="team-header">👥 Equipo ${team}</div>
          ${repos.map(repo => this.generateRepositorySection(repo)).join('')}
        </div>
      `;
    });
    
    // Repositorios sin equipo
    const withoutTeam = repositories.filter(r => !r.team);
    if (withoutTeam.length > 0) {
      html += `
        <div class="team-section">
          <div class="team-header">📦 Sin Equipo Asignado</div>
          ${withoutTeam.map(repo => this.generateRepositorySection(repo)).join('')}
        </div>
      `;
    }
    
    return html;
  }

  /**
   * Genera la lista simple de repositorios
   */
  generateRepositoryList(repositories) {
    return repositories.map(repo => this.generateRepositorySection(repo)).join('');
  }

  /**
   * Genera la sección HTML de un repositorio
   */
  generateRepositorySection(repo) {
    if (repo.error) {
      return `
        <div class="repo-section">
          <div class="repo-header">
            <div>
              <div class="repo-name">${repo.name}</div>
              <div class="repo-meta">📂 ${repo.localPath}</div>
            </div>
          </div>
          <div class="error-message">
            ❌ ${repo.error}
          </div>
        </div>
      `;
    }
    
    return `
      <div class="repo-section">
        <div class="repo-header">
          <div>
            <div class="repo-name">${repo.name}</div>
            <div class="repo-meta">
              👤 ${repo.responsible} | 
              📂 ${path.basename(repo.localPath)}
            </div>
          </div>
          <span class="badge ${repo.priority}">${repo.priority}</span>
        </div>
        
        <table class="branches-table">
          <thead>
            <tr>
              <th>Rama</th>
              <th>Estado</th>
              <th>Último Commit</th>
              <th>Autor</th>
              <th>Fecha</th>
              <th>Hace</th>
            </tr>
          </thead>
          <tbody>
            ${repo.branches.map(branch => this.generateBranchRow(branch)).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Genera una fila de rama
   */
  generateBranchRow(branch) {
    if (branch.error) {
      return `
        <tr>
          <td><strong>${branch.name}</strong></td>
          <td colspan="5">
            <div class="error-message" style="padding: 10px;">❌ ${branch.error}</div>
          </td>
        </tr>
      `;
    }
    
    const { lastCommit, status } = branch;
    
    return `
      <tr>
        <td><strong>${branch.name}</strong></td>
        <td>
          <span class="status-badge ${status.level}">
            ${status.icon} ${status.label}
          </span>
        </td>
        <td>
          <span class="commit-hash">${lastCommit.hash}</span>
        </td>
        <td>${lastCommit.author}</td>
        <td>${lastCommit.date.toLocaleDateString('es-ES')}</td>
        <td>${lastCommit.daysAgo} día(s)</td>
      </tr>
    `;
  }

  /**
   * Guarda el HTML en un archivo
   */
  saveHTML(html, filename = 'informe_repos.html') {
    const filepath = path.join(this.outputDir, filename);
    fs.writeFileSync(filepath, html, 'utf-8');
    return filepath;
  }

  /**
   * Guarda los datos en JSON
   */
  saveJSON(data, filename = 'informe_repos.json') {
    const filepath = path.join(this.outputDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
    return filepath;
  }

  /**
   * Convierte HTML a JPG usando Puppeteer
   */
  async convertToJPG(htmlPath, jpgFilename = 'informe_repos.jpg') {
    console.log(chalk.blue('\n🖼️  Generando imagen JPG...'));
    
    const jpgPath = path.join(this.outputDir, jpgFilename);
    
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Configurar viewport para una buena resolución
      await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 2
      });
      
      // Cargar el HTML
      await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle0'
      });
      
      // Esperar a que todo esté renderizado
      await page.waitForTimeout(1000);
      
      // Tomar screenshot de toda la página
      await page.screenshot({
        path: jpgPath,
        type: 'jpeg',
        quality: 95,
        fullPage: true
      });
      
      console.log(chalk.green(`✅ Imagen JPG guardada: ${jpgPath}`));
      
      return jpgPath;
    } finally {
      await browser.close();
    }
  }

  /**
   * Genera el informe completo (HTML, JSON y JPG)
   */
  async generate(data) {
    console.log(chalk.blue.bold('\n📄 Generando Informe...\n'));
    
    const timestamp = Date.now();
    const dateStr = new Date().toISOString().split('T')[0];
    
    // Generar nombres de archivo con timestamp
    const htmlFilename = `${this.config.report.filePrefix}_${dateStr}_${timestamp}.html`;
    const jsonFilename = `${this.config.report.filePrefix}_${dateStr}_${timestamp}.json`;
    const jpgFilename = `${this.config.report.filePrefix}_${dateStr}_${timestamp}.jpg`;
    
    // Generar HTML
    const html = this.generateHTML(data);
    const htmlPath = this.saveHTML(html, htmlFilename);
    console.log(chalk.green(`✅ HTML guardado: ${htmlPath}`));
    
    // Crear copias "latest" para facilitar acceso
    const latestHtmlPath = this.saveHTML(html, 'latest.html');
    
    // Guardar JSON
    const jsonPath = this.saveJSON(data, jsonFilename);
    console.log(chalk.green(`✅ JSON guardado: ${jsonPath}`));
    
    const latestJsonPath = this.saveJSON(data, 'latest.json');
    
    // Generar JPG
    const jpgPath = await this.convertToJPG(htmlPath, jpgFilename);
    
    // Copiar a latest.jpg
    const latestJpgPath = path.join(this.outputDir, 'latest.jpg');
    fs.copyFileSync(jpgPath, latestJpgPath);
    console.log(chalk.green(`✅ Copia latest: ${latestJpgPath}`));
    
    console.log(chalk.green.bold('\n✨ Informe generado exitosamente!\n'));
    
    return {
      html: htmlPath,
      json: jsonPath,
      jpg: jpgPath,
      latest: {
        html: latestHtmlPath,
        json: latestJsonPath,
        jpg: latestJpgPath
      }
    };
  }
}

module.exports = ReportGenerator;
