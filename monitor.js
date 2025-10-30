const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class RepositoryMonitor {
  constructor(config) {
    this.config = config;
  }

  /**
   * Ejecuta un comando Git en un repositorio
   */
  executeGitCommand(repoPath, command) {
    try {
      const result = execSync(command, {
        cwd: repoPath,
        encoding: 'utf-8',
        timeout: this.config.git.timeout,
        stdio: this.config.logging.showGitOutput ? 'inherit' : 'pipe'
      });
      return result.trim();
    } catch (error) {
      if (this.config.logging.verbose) {
        console.error(chalk.red(`Error ejecutando: ${command}`));
        console.error(chalk.red(error.message));
      }
      return null;
    }
  }

  /**
   * Verifica si un directorio es un repositorio Git válido
   */
  isValidGitRepository(repoPath) {
    if (!fs.existsSync(repoPath)) {
      return false;
    }
    
    const gitDir = path.join(repoPath, '.git');
    return fs.existsSync(gitDir);
  }

  /**
   * Obtiene el último commit de una rama específica
   */
  getLastCommit(repoPath, branch) {
    try {
      // Obtener hash del commit
      const hash = this.executeGitCommand(
        repoPath,
        `git rev-parse ${branch}`
      );

      // Obtener fecha del commit (formato ISO)
      const date = this.executeGitCommand(
        repoPath,
        `git log -1 --format=%cI ${branch}`
      );

      // Obtener autor del commit
      const author = this.executeGitCommand(
        repoPath,
        `git log -1 --format=%an ${branch}`
      );

      // Obtener mensaje del commit
      const message = this.executeGitCommand(
        repoPath,
        `git log -1 --format=%s ${branch}`
      );

      if (!hash || !date) {
        return null;
      }

      return {
        hash: hash.substring(0, 8),
        date: new Date(date),
        author: author || 'Desconocido',
        message: message || 'Sin mensaje',
        daysAgo: this.calculateDaysAgo(new Date(date))
      };
    } catch (error) {
      if (this.config.logging.verbose) {
        console.error(chalk.red(`Error obteniendo último commit de ${branch}`));
      }
      return null;
    }
  }

  /**
   * Calcula cuántos días han pasado desde una fecha
   */
  calculateDaysAgo(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Determina el estado de un repositorio basado en días de inactividad
   */
  getStatus(daysAgo) {
    const thresholds = this.config.report.thresholds;
    
    if (daysAgo <= thresholds.active) {
      return {
        level: 'success',
        label: 'Activo',
        icon: '✅'
      };
    } else if (daysAgo <= thresholds.warning) {
      return {
        level: 'warning',
        label: 'Advertencia',
        icon: '⚠️'
      };
    } else {
      return {
        level: 'danger',
        label: 'Inactivo',
        icon: '❌'
      };
    }
  }

  /**
   * Actualiza un repositorio (fetch o pull)
   */
  updateRepository(repoPath) {
    if (this.config.git.fetchBeforeCheck) {
      if (this.config.logging.verbose) {
        console.log(chalk.blue(`  Actualizando referencias...`));
      }
      this.executeGitCommand(repoPath, 'git fetch --all --prune');
    }

    if (this.config.git.pullBeforeCheck) {
      if (this.config.logging.verbose) {
        console.log(chalk.blue(`  Descargando cambios...`));
      }
      this.executeGitCommand(repoPath, 'git pull');
    }
  }

  /**
   * Monitorea un solo repositorio
   */
  monitorRepository(repoConfig) {
    console.log(chalk.cyan.bold(`\n📦 ${repoConfig.name}`));
    console.log(chalk.gray(`   Ruta: ${repoConfig.localPath}`));

    // Validar que el repositorio existe
    if (!this.isValidGitRepository(repoConfig.localPath)) {
      console.log(chalk.red(`   ❌ No es un repositorio Git válido o no existe`));
      return {
        ...repoConfig,
        error: 'Repositorio no válido',
        branches: []
      };
    }

    // Actualizar repositorio
    this.updateRepository(repoConfig.localPath);

    // Monitorear cada rama
    const branchesData = [];
    
    for (const branch of repoConfig.branches) {
      console.log(chalk.yellow(`   🌿 Rama: ${branch}`));
      
      const lastCommit = this.getLastCommit(repoConfig.localPath, branch);
      
      if (!lastCommit) {
        console.log(chalk.red(`      ❌ No se pudo obtener información`));
        branchesData.push({
          name: branch,
          error: 'No se pudo obtener información',
          status: this.getStatus(999)
        });
        continue;
      }

      const status = this.getStatus(lastCommit.daysAgo);
      
      console.log(chalk.gray(`      Último commit: ${lastCommit.hash}`));
      console.log(chalk.gray(`      Autor: ${lastCommit.author}`));
      console.log(chalk.gray(`      Fecha: ${lastCommit.date.toLocaleDateString('es-ES')}`));
      console.log(chalk.gray(`      Hace: ${lastCommit.daysAgo} días`));
      console.log(`      Estado: ${status.icon} ${status.label}`);

      branchesData.push({
        name: branch,
        lastCommit,
        status
      });
    }

    return {
      ...repoConfig,
      branches: branchesData,
      timestamp: new Date()
    };
  }

  /**
   * Monitorea todos los repositorios configurados
   */
  async monitorAll() {
    console.log(chalk.green.bold('\n🚀 Iniciando Monitoreo de Repositorios\n'));
    console.log(chalk.gray('='.repeat(60)));

    const results = [];

    for (const repoConfig of this.config.repositories) {
      const result = this.monitorRepository(repoConfig);
      results.push(result);
    }

    console.log(chalk.gray('\n' + '='.repeat(60)));
    console.log(chalk.green.bold('\n✅ Monitoreo completado\n'));

    // Generar resumen
    const summary = this.generateSummary(results);
    this.displaySummary(summary);

    return {
      repositories: results,
      summary,
      timestamp: new Date(),
      config: {
        companyName: this.config.report.companyName,
        projectName: this.config.report.projectName
      }
    };
  }

  /**
   * Genera un resumen estadístico
   */
  generateSummary(results) {
    const summary = {
      total: results.length,
      active: 0,
      warning: 0,
      inactive: 0,
      errors: 0,
      byTeam: {},
      byResponsible: {}
    };

    results.forEach(repo => {
      // Contar por estado
      if (repo.error) {
        summary.errors++;
        return;
      }

      repo.branches.forEach(branch => {
        if (branch.error) {
          summary.errors++;
        } else {
          summary[branch.status.level]++;
        }
      });

      // Agrupar por equipo
      if (repo.team) {
        if (!summary.byTeam[repo.team]) {
          summary.byTeam[repo.team] = [];
        }
        summary.byTeam[repo.team].push(repo);
      }

      // Agrupar por responsable
      if (repo.responsible) {
        if (!summary.byResponsible[repo.responsible]) {
          summary.byResponsible[repo.responsible] = [];
        }
        summary.byResponsible[repo.responsible].push(repo);
      }
    });

    return summary;
  }

  /**
   * Muestra el resumen en consola
   */
  displaySummary(summary) {
    console.log(chalk.blue.bold('📊 RESUMEN'));
    console.log(chalk.gray('─'.repeat(40)));
    console.log(`  Total de repositorios: ${summary.total}`);
    console.log(chalk.green(`  ✅ Activos: ${summary.active}`));
    console.log(chalk.yellow(`  ⚠️  Advertencia: ${summary.warning}`));
    console.log(chalk.red(`  ❌ Inactivos: ${summary.inactive}`));
    if (summary.errors > 0) {
      console.log(chalk.red(`  🔴 Errores: ${summary.errors}`));
    }

    if (Object.keys(summary.byTeam).length > 0) {
      console.log(chalk.blue.bold('\n👥 POR EQUIPO'));
      console.log(chalk.gray('─'.repeat(40)));
      Object.entries(summary.byTeam).forEach(([team, repos]) => {
        console.log(`  ${team}: ${repos.length} repositorio(s)`);
      });
    }

    if (Object.keys(summary.byResponsible).length > 0) {
      console.log(chalk.blue.bold('\n👤 POR RESPONSABLE'));
      console.log(chalk.gray('─'.repeat(40)));
      Object.entries(summary.byResponsible).forEach(([person, repos]) => {
        console.log(`  ${person}: ${repos.length} repositorio(s)`);
      });
    }
  }
}

module.exports = RepositoryMonitor;
