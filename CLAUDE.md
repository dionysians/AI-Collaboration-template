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

<!-- AUTO:templates -->
| 模板 | 版本 | 说明 |
|------|------|------|
| `example-minimal` | v1.0.0 | 示例：最小化的 Claude Code 配置模板 |
| `general-development` | v1.2.0 | 通用项目开发模板，融合了三大框架的最佳实践 |
<!-- /AUTO:templates -->

### general-development 组件清单

<!-- AUTO:template-components:general-development -->
| 层 | 路径 | 组件 |
|----|------|------|
| 项目规则主文件（唯一必读） | `CLAUDE.md` | - |
| 模板结构化概览（/template-info 数据源） | `.aiwork/OVERVIEW.md` | - |
| Spec 模板文件（/architecture 按需创建 spec/ 时的格式参考） | `.aiwork/templates/spec/` | - |
| 模板设计决策文档 | `.aiwork/docs/decisions/` | - |
| Hooks 配置（5 hooks） | `.claude/settings.json` | - |
| 基础规范（4 rules） | `.claude/rules/` | coding-style, testing, security, git-workflow |
| 工作流引擎（3 skills） | `.claude/skills/` | story-execution, systematic-debugging, verification-loop |
| 用户命令（11 commands） | `.claude/commands/` | feature, clarify, architecture, plan, review, verify, bugfix, hotfix, spike, decide, pivot |
| 专业化 Agent（2 agents） | `.claude/agents/` | planner, code-reviewer |
<!-- /AUTO:template-components:general-development -->

### general-development 设计来源

<!-- AUTO:template-sources:general-development -->
| 来源 | 借鉴内容 |
|------|----------|
| everything-claude-code | agents/hooks/rules/skills 配置体系, Hooks 内联 Node.js 模式, 代码审查分级 (CRITICAL/HIGH/MEDIUM/LOW) |
| superpowers | Iron Laws (测试先行/根因调查/验证后声称), TDD 强制 (RED-GREEN-REFACTOR), 系统化调试四阶段, 两阶段审查 (规格合规 + 代码质量) |
| bmad-method | Epic → Story → AC 结构化规划, Story 验收标准 (Given/When/Then), Story 执行引擎 (dev-story workflow), Definition of Done |
| spec-doc-guideline | 四层级 Spec 体系 (Project/Domain/Contract/Flow), Spec 更新原则 (原地更新/版本化/按迭代新增), ADR 与 Spec 集成, Evolution Log / Timeline |
<!-- /AUTO:template-sources:general-development -->

## Workspace 框架概览

<!-- AUTO:workspace-summary -->
| 框架 | 类型 | 核心价值 | Stars | 用于模板 |
|------|------|---------|-------|----------|
| Agent Browser | Toolkit | Headless browser automation CLI for AI agents | 10.6k | - |
| BMAD-METHOD | Framework | Breakthrough Method for Agile AI Driven… | 31.8k | general-development |
| Everything Claude Code | Framework | Complete Claude Code configuration collection -… | 30k | general-development |
| Lenny Skills | Toolkit | 86 个产品管理技能集合，提取自 Lenny's Podcast 297 期节目 | 39 | - |
| Obsidian Skills | Toolkit | Agent skills for use with Obsidian. Follows the… | 8.9k | - |
| Superpowers | Framework | An agentic skills framework & software development… | 36.2k | general-development |
<!-- /AUTO:workspace-summary -->

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
