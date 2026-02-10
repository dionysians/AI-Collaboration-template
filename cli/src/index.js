#!/usr/bin/env node

import { Command } from 'commander';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 模板目录（相对于 cli 目录）
const TEMPLATES_DIR = path.resolve(__dirname, '../../templates');

const program = new Command();

program
  .name('ai-collab-template')
  .description('AI 编程工具配置模板 CLI')
  .version('0.1.0');

// list 命令
program
  .command('list')
  .description('列出所有可用模板')
  .action(async () => {
    const templates = await getTemplates();

    if (templates.length === 0) {
      console.log(chalk.yellow('暂无可用模板'));
      return;
    }

    console.log(chalk.bold('\n可用模板:\n'));

    for (const tpl of templates) {
      console.log(chalk.green(`  ${tpl.id}`));
      console.log(chalk.gray(`    ${tpl.description || '无描述'}`));
      if (tpl.tools?.length) {
        console.log(chalk.gray(`    工具: ${tpl.tools.join(', ')}`));
      }
      console.log();
    }
  });

// init 命令
program
  .command('init')
  .description('初始化模板到当前目录')
  .option('-t, --template <name>', '指定模板名称')
  .option('-y, --yes', '跳过确认')
  .action(async (options) => {
    const templates = await getTemplates();

    if (templates.length === 0) {
      console.log(chalk.yellow('暂无可用模板'));
      return;
    }

    let selectedTemplate = options.template;

    // 交互式选择模板
    if (!selectedTemplate) {
      const response = await prompts({
        type: 'select',
        name: 'template',
        message: '选择项目模板',
        choices: templates.map(t => ({
          title: t.name || t.id,
          description: t.description,
          value: t.id
        }))
      });

      if (!response.template) {
        console.log(chalk.yellow('已取消'));
        return;
      }

      selectedTemplate = response.template;
    }

    // 验证模板存在
    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) {
      console.log(chalk.red(`模板 "${selectedTemplate}" 不存在`));
      return;
    }

    const targetDir = process.cwd();

    // 确认安装
    if (!options.yes) {
      const confirm = await prompts({
        type: 'confirm',
        name: 'value',
        message: `将模板 "${template.name || template.id}" 安装到 ${targetDir}?`,
        initial: true
      });

      if (!confirm.value) {
        console.log(chalk.yellow('已取消'));
        return;
      }
    }

    // 复制模板文件
    const templateDir = path.join(TEMPLATES_DIR, template.id);

    try {
      const files = await fs.readdir(templateDir);

      for (const file of files) {
        // 跳过 manifest.yaml
        if (file === 'manifest.yaml') continue;

        const src = path.join(templateDir, file);
        const dest = path.join(targetDir, file);

        await fs.copy(src, dest, { overwrite: false, errorOnExist: false });
        console.log(chalk.green(`  ✓ ${file}`));
      }

      console.log(chalk.bold.green('\n模板安装完成!'));
    } catch (err) {
      console.error(chalk.red(`安装失败: ${err.message}`));
    }
  });

// 获取所有模板
async function getTemplates() {
  const templates = [];

  if (!await fs.pathExists(TEMPLATES_DIR)) {
    return templates;
  }

  const dirs = await fs.readdir(TEMPLATES_DIR);

  for (const dir of dirs) {
    // 跳过以 _ 开头的目录和文件
    if (dir.startsWith('_') || dir.startsWith('.')) continue;

    const manifestPath = path.join(TEMPLATES_DIR, dir, 'manifest.yaml');

    if (await fs.pathExists(manifestPath)) {
      try {
        const content = await fs.readFile(manifestPath, 'utf-8');
        const manifest = yaml.parse(content);
        templates.push({ ...manifest, id: manifest.id || dir });
      } catch (err) {
        // 忽略解析错误
      }
    }
  }

  return templates;
}

program.parse();
