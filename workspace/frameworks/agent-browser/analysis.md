# Agent Browser 分析笔记

> 收集日期: 2026-01-26
> 来源: https://github.com/vercel-labs/agent-browser

## 概述

Headless browser automation CLI for AI agents. Fast Rust CLI with Node.js fallback.
由 Vercel 开发的专为 AI Agent 设计的浏览器自动化命令行工具。

## 项目数据

- Stars: 10,632
- Forks: 581
- License: Apache-2.0
- 主要语言: TypeScript, Rust

## 仓库结构

```
agent-browser/
├── .claude-plugin/          # Claude Code 插件配置
│   └── marketplace.json
├── skills/                   # 技能定义
│   └── agent-browser/
│       ├── SKILL.md         # 技能文档
│       ├── references/      # 参考文档
│       └── templates/       # 模板文件
├── src/                      # 核心源码
│   ├── actions.ts           # 浏览器操作实现
│   ├── browser.ts           # 浏览器管理
│   ├── daemon.ts            # 守护进程
│   ├── protocol.ts          # 通信协议
│   ├── snapshot.ts          # 页面快照
│   └── types.ts             # 类型定义
├── cli/                      # CLI 实现
├── bin/                      # 可执行文件
├── docs/                     # 文档
└── test/                     # 测试文件
```

## 核心功能

### 浏览器操作命令

- `open <url>` - 导航到 URL
- `click <sel>` - 点击元素
- `fill <sel> <text>` - 填充表单
- `type <sel> <text>` - 输入文本
- `press <key>` - 按键操作
- `scroll` - 滚动页面
- `screenshot` - 截图
- `snapshot` - 获取可访问性树（AI 最佳选择）

### 选择器支持

- 引用选择器: `@e2`（来自 snapshot 的元素引用）
- CSS 选择器: `#submit`, `.button`
- 角色选择器: `role button --name "Submit"`

### 状态检查

- `get text/html/value/attr` - 获取元素信息
- `wait visible/hidden/text` - 等待条件
- `check <sel>` - 检查状态

## 技术特点

1. **双引擎架构**: Rust CLI 优先，Node.js 作为后备
2. **基于 Playwright**: 使用 Playwright 的 Chromium
3. **守护进程模式**: 保持浏览器会话
4. **Snapshot 功能**: 生成可访问性树，便于 AI 理解页面结构

## 优点

- Vercel 官方维护，质量有保障
- Rust 实现提供高性能
- 专为 AI Agent 优化的 snapshot 功能
- 完整的 CLI 命令集
- 支持 Claude Code 插件集成
- 文档完善

## 不足

- 依赖 Chromium，体积较大
- 需要安装系统依赖（Linux）
- 目前仅支持 Chromium

## 可借鉴的点

1. **Snapshot 设计**: 将页面转换为可访问性树，便于 AI 理解
2. **引用选择器**: `@e1` 风格的简洁选择器
3. **Claude Code 插件结构**: `.claude-plugin/` 目录组织方式
4. **Skill 文档结构**: `skills/` 目录下的 SKILL.md 格式

## 提取计划

- [ ] 提取 SKILL.md 作为 skill 编写参考
- [ ] 提取 .claude-plugin 结构作为插件开发参考
- [ ] 分析 snapshot 功能的实现思路
