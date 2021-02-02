import {existsSync, writeFileSync, statSync, readdirSync, readFileSync} from 'fs';
import {copySync} from 'fs-extra';
import $path from 'path';
import chalk from 'chalk';
import {exec, fromCLIRoot, fromRoot, getRootPath, throwError} from '../../utils';
import {ProjectConfig} from '../project/project.service';
import {VueWorkstationCreator} from './proxys/vue';

export const WORKSTATION_TYPES_MAP = {
  vue: true,
  angular: true,
  react: true,
};

export declare type WorkstationTypes = keyof typeof WORKSTATION_TYPES_MAP;

export const WORKSTATION_LANGUAGES_MAP = {
  js: true,
  ts: true,
};
export declare type WorkstationLanguages = keyof typeof WORKSTATION_LANGUAGES_MAP;

export interface WorkstationConfig {
  name: string;
  type: WorkstationTypes;
  language: WorkstationLanguages;
  projects: ProjectConfig[];
}

export class WorkstationService {
  ext = ['ts', 'tsx', 'js', 'jsx', 'vue'];
  configPath = '';
  config!: WorkstationConfig;

  setConfig(config: WorkstationConfig) {
    this.config = config;
    return this.syncConfig();
  }

  syncConfig() {
    if (!getRootPath()) {
      return throwError('The ops cli requires to be run in an Octopus workstation, ' +
        'but a workstation definition could not be found.', true);
    }

    if (!this.configPath) {
      this.configPath = fromRoot('workstation.json');
    }

    if (!this.config && existsSync(this.configPath)) {
      this.config = require(this.configPath);
    }

    writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
  }

  create(name: string, type: WorkstationTypes) {
    switch (type) {
      case 'vue':
        return new VueWorkstationCreator(name).create();
    }
    return Promise.resolve();
  }

  private async modifyProjectAlias(rootPath: string, oldAlias: string, newAlias: string) {
    if (statSync(rootPath).isDirectory()) {
      const subDirs = readdirSync(rootPath);
      for await (const dir of subDirs) {
        await this.modifyProjectAlias($path.join(rootPath, dir), oldAlias, newAlias);
      }
    } else {
      if (!this.ext.includes($path.basename(rootPath))) return;
      const content = readFileSync(rootPath).toString();
      writeFileSync(rootPath, content.replace(new RegExp(oldAlias, 'g'), newAlias));
    }
  }

  async addProject(name: string) {
    console.log(`✨ Creating ${name} project...`);

    const noSameProjectName = this.config.projects.every(p => p.name !== name);
    if (!noSameProjectName) return throwError('A project with the same name already exists.', true);

    const alias = `@${name}/`;
    if (this.config.language === 'ts') {
      console.log(`📝 Appending project alias to tsconfig.json...`);
      const tsconfigPath = fromRoot('tsconfig.json');
      const tsconfig = require(tsconfigPath);
      tsconfig.compilerOptions.paths[`${alias}*`] = [`projects/${name}/*`];
      writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    }

    console.log(`📝 Appending project info to workstation.json...`);
    const root = `projects/${name}`;
    this.config.projects.push({
      name,
      root,
      port: 9621 + this.config.projects.length,
    });
    this.syncConfig();

    console.log(`📝 Copying project template file to workstation...`);
    [
      `project/${this.config.type}/common`,
      `project/${this.config.type}/${this.config.language}`,
    ].forEach(dir => {
      copySync(
        fromCLIRoot(dir),
        fromRoot(root),
        {recursive: true, preserveTimestamps: true},
      );
    });

    console.log(`📝 Modifying project alias...`);
    await this.modifyProjectAlias(fromRoot(root), '@/', alias);

    console.log(`✨ Successfully created project ${chalk.yellow(name)}.`);
    console.log(`✨ Get started with the following commands:`);
    console.log();
    console.log(` $ ${chalk.blueBright(`cd ${this.config.name}`)}`);
    console.log(` $ ${chalk.blueBright(`npm run serve`)}`);
    console.log();
  }

  renameProject(name: string) {
    const noSameProjectName = this.config.projects.every(p => p.name !== name);
    if (noSameProjectName) return throwError('Project not found', true);

    // tsconfig.json 修改 项目别名
    // workstation.json 修改 项目信息
    // 将 project 目录重命名
    // 修改项目中的别名
  }

  removeProject(name: string) {
    const noSameProjectName = this.config.projects.every(p => p.name !== name);
    if (noSameProjectName) return throwError('Project not found', true);

    // tsconfig.json 删除 项目别名
    // workstation.json 删除 项目信息
    // 弹出确认框，删除不可恢复，请谨慎
    // 若确认，删除 project 目录
  }
}

export const $workstation = new WorkstationService();
