#!/usr/bin/env node

/**
 * 索引生成脚本
 * 从 workspace/resources 和 workspace/frameworks 中读取所有 metadata.yaml，生成索引文件
 */

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESOURCES_DIR = path.resolve(__dirname, '../workspace/resources');
const FRAMEWORKS_DIR = path.resolve(__dirname, '../workspace/frameworks');
const INDEXES_DIR = path.resolve(__dirname, '../workspace/indexes');

async function main() {
  // 确保索引目录存在
  if (!fs.existsSync(INDEXES_DIR)) {
    fs.mkdirSync(INDEXES_DIR, { recursive: true });
  }

  // 读取所有资源
  const resources = readMetadataFromDir(RESOURCES_DIR, 'resource');
  console.log(`找到 ${resources.length} 个资源`);

  // 读取所有框架
  const frameworks = readMetadataFromDir(FRAMEWORKS_DIR, 'framework');
  console.log(`找到 ${frameworks.length} 个框架\n`);

  // 合并所有条目
  const allItems = [...resources, ...frameworks];

  // 生成索引
  generateByTypeIndex(allItems);
  generateByToolIndex(allItems);
  generateBySourceIndex(allItems);

  console.log('\n索引生成完成!');
}

function readMetadataFromDir(dir, category) {
  const items = [];

  if (!fs.existsSync(dir)) {
    return items;
  }

  const dirs = fs.readdirSync(dir);

  for (const subdir of dirs) {
    if (subdir.startsWith('_') || subdir.startsWith('.')) continue;

    const metadataPath = path.join(dir, subdir, 'metadata.yaml');
    if (fs.existsSync(metadataPath)) {
      try {
        const content = fs.readFileSync(metadataPath, 'utf-8');
        const metadata = yaml.parse(content);
        items.push({
          ...metadata,
          _dir: subdir,
          _category: category,
          _basePath: category === 'resource' ? '../resources' : '../frameworks'
        });
      } catch (err) {
        console.warn(`警告: 解析 ${subdir}/metadata.yaml 失败:`, err.message);
      }
    }
  }

  return items;
}

function generateByTypeIndex(items) {
  const byType = {};

  for (const item of items) {
    const type = item.type || 'other';
    if (!byType[type]) byType[type] = [];
    byType[type].push(item);
  }

  let content = '# 按类型索引\n\n';
  content += '> 自动生成，请勿手动编辑\n\n';

  const typeLabels = {
    // resources 类型
    skill: 'Skills',
    hook: 'Hooks',
    command: 'Commands',
    agent: 'Agents',
    'mcp-server': 'MCP Servers',
    prompt: 'Prompts',
    plugin: 'Plugins',
    // frameworks 类型
    framework: 'Frameworks',
    methodology: 'Methodologies',
    toolkit: 'Toolkits',
    // 通用
    other: 'Other'
  };

  // 先显示 frameworks 类型
  const frameworkTypes = ['framework', 'methodology', 'toolkit'];
  const resourceTypes = ['skill', 'hook', 'command', 'agent', 'mcp-server', 'prompt', 'plugin', 'other'];

  // Frameworks 部分
  const hasFrameworks = frameworkTypes.some(t => byType[t]?.length > 0);
  if (hasFrameworks) {
    content += '# Frameworks\n\n';
    for (const type of frameworkTypes) {
      if (byType[type]?.length > 0) {
        content += `## ${typeLabels[type] || type}\n\n`;
        for (const item of byType[type]) {
          content += `- **[${item.name || item.id}](${item._basePath}/${item._dir}/)**`;
          if (item.description) {
            const desc = item.description.split('\n')[0].trim();
            content += ` - ${desc}`;
          }
          content += '\n';
        }
        content += '\n';
      }
    }
  }

  // Resources 部分
  const hasResources = resourceTypes.some(t => byType[t]?.length > 0);
  if (hasResources) {
    content += '# Resources\n\n';
    for (const type of resourceTypes) {
      if (byType[type]?.length > 0) {
        content += `## ${typeLabels[type] || type}\n\n`;
        for (const item of byType[type]) {
          content += `- **[${item.name || item.id}](${item._basePath}/${item._dir}/)**`;
          if (item.description) {
            const desc = item.description.split('\n')[0].trim();
            content += ` - ${desc}`;
          }
          content += '\n';
        }
        content += '\n';
      }
    }
  }

  fs.writeFileSync(path.join(INDEXES_DIR, 'by-type.md'), content);
  console.log('✓ by-type.md');
}

function generateByToolIndex(items) {
  const byTool = {};

  for (const item of items) {
    const tools = item.tools || ['other'];
    for (const tool of tools) {
      if (!byTool[tool]) byTool[tool] = [];
      byTool[tool].push(item);
    }
  }

  let content = '# 按工具索引\n\n';
  content += '> 自动生成，请勿手动编辑\n\n';

  const toolLabels = {
    'claude-code': 'Claude Code',
    cursor: 'Cursor',
    windsurf: 'Windsurf',
    copilot: 'GitHub Copilot',
    continue: 'Continue.dev',
    other: 'Other'
  };

  for (const [tool, toolItems] of Object.entries(byTool)) {
    content += `## ${toolLabels[tool] || tool}\n\n`;
    for (const item of toolItems) {
      const badge = item._category === 'framework' ? '📦' : '📄';
      content += `- ${badge} **[${item.name || item.id}](${item._basePath}/${item._dir}/)**`;
      if (item.type) content += ` (${item.type})`;
      content += '\n';
    }
    content += '\n';
  }

  fs.writeFileSync(path.join(INDEXES_DIR, 'by-tool.md'), content);
  console.log('✓ by-tool.md');
}

function generateBySourceIndex(items) {
  const bySource = {};

  for (const item of items) {
    const sourceType = item.source?.type || 'unknown';
    if (!bySource[sourceType]) bySource[sourceType] = [];
    bySource[sourceType].push(item);
  }

  let content = '# 按来源索引\n\n';
  content += '> 自动生成，请勿手动编辑\n\n';

  const sourceLabels = {
    github: 'GitHub',
    official: 'Official',
    blog: 'Blog/Article',
    other: 'Other',
    unknown: 'Unknown'
  };

  for (const [source, sourceItems] of Object.entries(bySource)) {
    content += `## ${sourceLabels[source] || source}\n\n`;
    for (const item of sourceItems) {
      const badge = item._category === 'framework' ? '📦' : '📄';
      content += `- ${badge} **[${item.name || item.id}](${item._basePath}/${item._dir}/)**`;
      if (item.source?.author) content += ` by ${item.source.author}`;
      if (item.source?.url) content += ` - [source](${item.source.url})`;
      content += '\n';
    }
    content += '\n';
  }

  fs.writeFileSync(path.join(INDEXES_DIR, 'by-source.md'), content);
  console.log('✓ by-source.md');
}

main().catch(console.error);
