#!/usr/bin/env node

/**
 * 索引生成脚本
 * 1. 从 workspace/ 读取 metadata.yaml，生成 workspace/indexes/ 索引文件
 * 2. 从 templates/ 读取 manifest.yaml，生成 CLAUDE.md 中的 AUTO 区块
 */

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const RESOURCES_DIR = path.resolve(ROOT_DIR, 'workspace/resources');
const FRAMEWORKS_DIR = path.resolve(ROOT_DIR, 'workspace/frameworks');
const TEMPLATES_DIR = path.resolve(ROOT_DIR, 'templates');
const INDEXES_DIR = path.resolve(ROOT_DIR, 'workspace/indexes');
const CLAUDE_MD = path.resolve(ROOT_DIR, 'CLAUDE.md');

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

  // 生成 workspace 索引
  generateByTypeIndex(allItems);
  generateByToolIndex(allItems);
  generateBySourceIndex(allItems);

  // 读取模板 manifest，生成 CLAUDE.md AUTO 区块
  const manifests = readTemplateManifests();
  console.log(`\n找到 ${manifests.length} 个模板`);

  const autoBlocks = generateAutoBlocks(allItems, manifests);
  injectIntoCLAUDEmd(autoBlocks);

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

// ============ CLAUDE.md AUTO 区块 ============

function readTemplateManifests() {
  const manifests = [];

  if (!fs.existsSync(TEMPLATES_DIR)) return manifests;

  const dirs = fs.readdirSync(TEMPLATES_DIR);
  for (const subdir of dirs) {
    if (subdir.startsWith('_') || subdir.startsWith('.')) continue;

    const manifestPath = path.join(TEMPLATES_DIR, subdir, 'manifest.yaml');
    if (fs.existsSync(manifestPath)) {
      try {
        const content = fs.readFileSync(manifestPath, 'utf-8');
        const manifest = yaml.parse(content);
        manifests.push({ ...manifest, _dir: subdir });
      } catch (err) {
        console.warn(`警告: 解析 ${subdir}/manifest.yaml 失败:`, err.message);
      }
    }
  }

  return manifests;
}

function generateAutoBlocks(allItems, manifests) {
  const blocks = {};

  // --- templates 总表 ---
  let tpl = '| 模板 | 版本 | 说明 |\n';
  tpl += '|------|------|------|\n';
  for (const m of manifests) {
    const desc = firstLine(m.description);
    tpl += `| \`${m.id}\` | v${m.version} | ${desc} |\n`;
  }
  blocks['templates'] = tpl;

  // --- 每个模板的 components 和 sources ---
  for (const m of manifests) {
    // 组件清单
    blocks[`template-components:${m.id}`] = generateComponentsTable(m);
    // 设计来源
    blocks[`template-sources:${m.id}`] = generateSourcesTable(m);
  }

  // --- workspace-summary ---
  // 收集所有模板引用的框架 id
  const usedByTemplate = {};
  for (const m of manifests) {
    for (const src of (m.sources || [])) {
      const fwId = src.framework || src.reference;
      if (fwId) {
        if (!usedByTemplate[fwId]) usedByTemplate[fwId] = [];
        usedByTemplate[fwId].push(m.id);
      }
    }
  }

  let ws = '| 框架 | 类型 | 核心价值 | Stars | 用于模板 |\n';
  ws += '|------|------|---------|-------|----------|\n';

  // 只处理 framework 类型的 items
  const frameworkItems = allItems.filter(i => i._category === 'framework');
  for (const item of frameworkItems) {
    const name = item.name || item.id;
    const type = capitalize(item.type || 'other');
    const shortDesc = truncate(firstLine(item.description), 50);
    const stars = item.evaluation?.popularity
      ? formatNumber(item.evaluation.popularity)
      : '-';
    const usedIn = usedByTemplate[item.id]
      ? usedByTemplate[item.id].join(', ')
      : '-';
    ws += `| ${name} | ${type} | ${shortDesc} | ${stars} | ${usedIn} |\n`;
  }
  blocks['workspace-summary'] = ws;

  return blocks;
}

function generateComponentsTable(manifest) {
  const includes = manifest.includes || [];
  let table = '| 层 | 路径 | 组件 |\n';
  table += '|----|------|------|\n';

  for (const inc of includes) {
    const p = `\`${inc.path}\``;
    if (inc.items && inc.items.length > 0) {
      const names = inc.items.map(i => i.name).join(', ');
      table += `| ${inc.description} | ${p} | ${names} |\n`;
    } else {
      table += `| ${inc.description} | ${p} | - |\n`;
    }
  }

  return table;
}

function generateSourcesTable(manifest) {
  const sources = manifest.sources || [];
  if (sources.length === 0) return '*无设计来源信息*\n';

  let table = '| 来源 | 借鉴内容 |\n';
  table += '|------|----------|\n';

  for (const src of sources) {
    const name = src.framework || src.reference || 'unknown';
    const borrowed = (src.borrowed || []).join(', ');
    table += `| ${name} | ${borrowed} |\n`;
  }

  return table;
}

function injectIntoCLAUDEmd(blocks) {
  if (!fs.existsSync(CLAUDE_MD)) {
    console.warn('警告: CLAUDE.md 不存在，跳过 AUTO 区块注入');
    return;
  }

  let content = fs.readFileSync(CLAUDE_MD, 'utf-8');
  let injected = 0;

  for (const [id, blockContent] of Object.entries(blocks)) {
    // 匹配 <!-- AUTO:{id} --> ... <!-- /AUTO:{id} -->
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(<!-- AUTO:${escaped} -->)\\n[\\s\\S]*?(<!-- /AUTO:${escaped} -->)`,
      'g'
    );

    if (regex.test(content)) {
      content = content.replace(
        new RegExp(
          `(<!-- AUTO:${escaped} -->)\\n[\\s\\S]*?(<!-- /AUTO:${escaped} -->)`,
          'g'
        ),
        `$1\n${blockContent}$2`
      );
      injected++;
    } else {
      console.warn(`警告: CLAUDE.md 中未找到 AUTO:${id} 区块`);
    }
  }

  fs.writeFileSync(CLAUDE_MD, content);
  console.log(`✓ CLAUDE.md（注入 ${injected} 个 AUTO 区块）`);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(num);
}

/** 取 description 第一行，清理末尾标点 */
function firstLine(desc) {
  return (desc || '').split('\n')[0].trim().replace(/[，,：:；;。.、]$/, '');
}

/** 截断到 maxLen，在单词/标点边界截断 */
function truncate(str, maxLen) {
  if (str.length <= maxLen) return str;
  // 尝试在最近的空格或标点处截断
  const cut = str.lastIndexOf(' ', maxLen);
  const pos = cut > maxLen * 0.6 ? cut : maxLen;
  return str.substring(0, pos) + '…';
}

main().catch(console.error);
