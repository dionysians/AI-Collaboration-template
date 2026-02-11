---
name: template-info
description: 渐进式查看模板信息。支持从概览到组件详情的多层级检索。
argument-hint: "<template-id> [focus]"
disable-model-invocation: true
allowed-tools: Read, Glob, Grep
---

# 模板信息查看

渐进式查看模板的结构、组件和工作流。从概览逐步深入到具体组件详情。

## 参数

$ARGUMENTS - 格式: `<template-id> [focus]`

- `template-id` - 模板 ID（必需），对应 `templates/` 下的目录名
- `focus` - 查看聚焦点（可选，默认 overview）

## Focus 选项

| Focus | 说明 | 数据来源 |
|-------|------|----------|
| （无/`overview`） | 快速概览：名称、版本、描述、组件数量 | manifest.yaml + Glob 计数 |
| `composition` | 所有组件清单 + 一行描述 | OVERVIEW.md `## Composition` |
| `workflow` | 命令管线 + 组件协作关系 | OVERVIEW.md `## Workflow` |
| `commands` | 所有命令清单 | OVERVIEW.md `### Commands` |
| `skills` | 所有技能清单 | OVERVIEW.md `### Skills` |
| `agents` | 所有 Agent 清单 | OVERVIEW.md `### Agents` |
| `rules` | 所有规则清单 | OVERVIEW.md `### Rules` |
| `hooks` | Hooks 配置 | OVERVIEW.md `### Hooks` |
| `spec` | Spec 体系 | OVERVIEW.md `### Spec System` |
| `commands/{name}` | 特定命令完整内容 | `.claude/commands/{name}.md` |
| `skills/{name}` | 特定技能完整内容 | `.claude/skills/{name}/SKILL.md` |
| `agents/{name}` | 特定 Agent 完整内容 | `.claude/agents/{name}.md` |
| `rules/{name}` | 特定规则完整内容 | `.claude/rules/{name}.md` |

不传 focus 参数时等同于 `overview`。

## 执行流程

### 1. 定位模板

```
Glob: templates/{template-id}/manifest.yaml
```

模板不存在 → 列出所有可用模板：

```
Glob: templates/*/manifest.yaml
```

输出可用模板列表（排除 `_template`），每个模板读取 manifest.yaml 的 id、name、version。

### 2. Focus = overview（默认）

读取 `templates/{id}/manifest.yaml`，提取元信息。

通过 Glob 扫描获取组件数量：
- Rules: `templates/{id}/.claude/rules/*.md`
- Skills: `templates/{id}/.claude/skills/*/SKILL.md`
- Commands: `templates/{id}/.claude/commands/*.md`
- Agents: `templates/{id}/.claude/agents/*.md`

输出：

```
模板: {name} ({id})
版本: {version}
更新: {updated_at}

{description}

工具: {tools}
标签: {tags}

组件概况:
  Rules:    N 个
  Skills:   N 个
  Commands: N 个
  Agents:   N 个
  Hooks:    [有/无]
  Spec:     [有/无]

来源: {sources 框架列表}

---
进一步查看:
  /template-info {id} composition   → 所有组件清单
  /template-info {id} workflow      → 工作流和管线
  /template-info {id} commands/{n}  → 特定命令详情
```

### 3. Focus = composition

读取 `templates/{id}/OVERVIEW.md`，提取 `## Composition` 章节（从 `## Composition` 到下一个 `## ` 之间的内容）并输出。

输出末尾附导航：

```
---
查看特定组件详情:
  /template-info {id} commands/{name}
  /template-info {id} skills/{name}
  /template-info {id} agents/{name}
  /template-info {id} rules/{name}
```

### 4. Focus = workflow

读取 `templates/{id}/OVERVIEW.md`，提取 `## Workflow` 章节并输出。

### 5. Focus = commands / skills / agents / rules / hooks / spec

读取 `templates/{id}/OVERVIEW.md`，提取 `## Composition` 下对应的 `### ` 子章节并输出。

匹配规则：
- `commands` → `### Commands`
- `skills` → `### Skills`
- `agents` → `### Agents`
- `rules` → `### Rules`
- `hooks` → `### Hooks`
- `spec` → `### Spec System`

### 6. Focus = {type}/{name}（具体组件）

根据类型前缀定位并读取实际文件：

| Focus 前缀 | 文件路径 |
|------------|----------|
| `commands/{name}` | `templates/{id}/.claude/commands/{name}.md` |
| `skills/{name}` | `templates/{id}/.claude/skills/{name}/SKILL.md` |
| `agents/{name}` | `templates/{id}/.claude/agents/{name}.md` |
| `rules/{name}` | `templates/{id}/.claude/rules/{name}.md` |

读取文件全文并输出。文件不存在 → 报错并列出同类型下可用的组件。

## 降级策略

当 OVERVIEW.md 不存在时：

| Focus | 降级方式 |
|-------|----------|
| `overview` | manifest.yaml + Glob 扫描（始终可用） |
| `composition` | Glob 扫描各组件目录 + 读取各文件首行或 YAML frontmatter |
| `workflow` | 读取 CLAUDE.md 中的命令表和管线图部分 |
| `commands` 等单类 | Glob 扫描对应目录 + 读取文件首行 |
| `commands/{name}` 等具体组件 | 直接读取文件（不依赖 OVERVIEW.md） |

降级时在输出开头附提示：

```
⚠ OVERVIEW.md 不存在，以下信息从文件扫描获取。
  建议运行 /template-sync sync {id} 生成标准化文档。
```

## 示例

```bash
/template-info general-development
# → 概览：名称、版本、描述、组件统计

/template-info general-development composition
# → 所有组件清单（rules, skills, commands, agents, hooks, spec）

/template-info general-development workflow
# → 命令管线、场景工作流、组件协作关系

/template-info general-development commands
# → 只看命令清单

/template-info general-development commands/feature
# → 读取 /feature 命令的完整内容

/template-info general-development skills/story-execution
# → 读取 story-execution skill 的完整内容

/template-info nonexistent
# → 列出所有可用模板
```
