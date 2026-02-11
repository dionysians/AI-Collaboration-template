# AI Collaboration Template

AI 编程工具配置模板管理项目。收集、分析各类 AI 编程框架和资源，输出可直接使用的项目模板。

## 项目结构

| 目录 | 用途 |
|------|------|
| `workspace/resources/` | 细粒度资源收集（skill、hook、command、agent 等单个配置） |
| `workspace/frameworks/` | 完整框架收集与分析（BMAD-METHOD、Superpowers 等） |
| `workspace/indexes/` | 自动生成的资源索引 |
| `templates/` | 成品模板输出（各自独立完整，可直接安装到项目） |
| `cli/` | CLI 工具（`npx ai-collab-template init`） |
| `tools/` | 辅助脚本（`gen-index.js` 等） |

## 工作流

```
收集资源/框架 → workspace/（resources 或 frameworks）
     ↓
分析对比，提取有价值的组件（extracted/）
     ↓
整合精炼 → templates/ 输出成品模板
```

## 已有模板

| 模板 | 版本 | 说明 |
|------|------|------|
| `general-development` | v1.2.0 | 通用开发模板，融合 everything-claude-code + Superpowers + BMAD-METHOD + Spec 体系 |

## Skills（本项目自用）

| Skill | 说明 |
|-------|------|
| `collect` | 收集新资源/框架到 workspace |
| `analyze` | 分析框架，编写分析笔记 |
| `extract` | 从框架中提取有价值的组件 |
| `compare` | 对比多个资源/框架的异同 |
| `search` | 搜索已收集的资源 |
| `gen-index` | 生成 workspace 索引 |
| `template-info` | 渐进式查看模板信息（overview → composition → workflow → 组件详情） |
| `template-sync` | 模板维护（init 脚手架 / sync 同步文档 / validate 校验规范） |

## 支持的 AI 工具

- Claude Code
- Cursor
- Windsurf
- GitHub Copilot
- Continue.dev

## 开发约定

- 模板之间互相独立，每个模板目录包含完整的配置文件
- 模板规范定义见 `templates/_spec.md`
- workspace 中的资源使用 `metadata.yaml` 记录元数据
- 索引通过 `node tools/gen-index.js` 自动生成
