# Obsidian Skills 分析笔记

> 收集日期: 2026-02-02
> 来源: https://github.com/kepano/obsidian-skills

## 概述

Agent skills for use with Obsidian。遵循 [Agent Skills specification](https://agentskills.io/specification)，可被任何兼容 skills 的 agent 使用，包括 Claude Code 和 Codex CLI。提供创建和编辑 Obsidian 兼容纯文本文件的能力。

## 项目数据

- Stars: 8,904
- Forks: 482
- License: MIT
- Topics: claude, clawdbot, codex, molty, obsidian, skills
- 作者: kepano（Obsidian 创始人）

## 组件分析

### 仓库结构

```
obsidian-skills/
├── .claude-plugin/
│   ├── plugin.json          # 插件配置
│   └── marketplace.json     # 市场配置
├── skills/
│   ├── obsidian-markdown/
│   │   └── SKILL.md         # Obsidian Flavored Markdown 技能
│   ├── obsidian-bases/
│   │   └── SKILL.md         # Obsidian Bases 技能
│   └── json-canvas/
│       └── SKILL.md         # JSON Canvas 技能
├── README.md
└── LICENSE
```

### 三个核心 Skills

1. **obsidian-markdown** - Obsidian Flavored Markdown (.md) 文件创建与编辑
2. **obsidian-bases** - Obsidian Bases (.base) 文件处理
3. **json-canvas** - JSON Canvas (.canvas) 文件处理

## 优点

- 由 Obsidian 创始人维护，权威性高
- 遵循 Agent Skills 规范，具有跨工具兼容性
- 结构清晰简洁，每个 skill 一个 SKILL.md
- 支持通过 marketplace 安装，用户体验好
- MIT 许可，可自由使用和修改

## 不足

- 仅包含 3 个 skills，覆盖面有限
- 文档相对简洁，没有详细的使用示例
- 没有包含 Obsidian 的高级功能（如 Dataview、Templater 等插件的支持）

## 可借鉴的点

- Agent Skills 规范的实现方式值得参考
- `.claude-plugin` 目录结构和 marketplace 集成模式
- SKILL.md 作为 skill 定义文件的命名约定
- 作为 Claude Code plugin 的打包和分发方式

## 提取计划

- [ ] 分析每个 SKILL.md 的具体内容和 prompt 结构
- [ ] 提取 Obsidian Markdown skill 的格式规范定义
- [ ] 提取 JSON Canvas skill 的 schema 定义
- [ ] 研究 .claude-plugin 配置格式作为插件开发参考
