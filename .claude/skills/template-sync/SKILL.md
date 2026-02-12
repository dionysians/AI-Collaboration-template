---
name: template-sync
description: 模板维护工具。支持初始化新模板、同步文档、校验规范一致性。
argument-hint: "<action> [template-id]"
disable-model-invocation: true
allowed-tools: Bash(ls:*), Bash(mkdir:*), Read, Write, Glob, Grep
---

# 模板维护

初始化、同步和校验模板，确保模板结构符合 `templates/_spec.md` 规范。

## 参数

$ARGUMENTS - 格式: `<action> [template-id]`

- `action` - 操作类型（必需）：`init` | `sync` | `validate`
- `template-id` - 模板 ID（`init` 必需，`sync`/`validate` 可选）

## Action 说明

| Action | 说明 | template-id |
|--------|------|-------------|
| `init` | 从零初始化新模板目录结构 | 必需 |
| `sync` | 扫描实际文件 → 生成/更新 OVERVIEW.md + manifest.yaml | 可选，不传则扫描所有模板 |
| `validate` | 校验模板是否符合规范 | 可选，不传则校验所有模板 |

---

## 执行流程

### Action: init

从零初始化一个新模板的标准目录结构。

#### 1. 检查模板是否已存在

```bash
ls templates/{template-id}
```

如果已存在 → 报错并退出，建议使用 `sync`。

#### 2. 交互式收集信息

向用户询问：
- **name** — 显示名称
- **description** — 模板描述（一句话）
- **tools** — 支持的工具（claude-code, cursor, windsurf, copilot, continue）
- **tags** — 标签

#### 3. 创建目录结构

```bash
mkdir -p templates/{template-id}/.claude/rules
mkdir -p templates/{template-id}/.claude/skills
mkdir -p templates/{template-id}/.claude/commands
mkdir -p templates/{template-id}/.claude/agents
mkdir -p templates/{template-id}/docs/plans
```

#### 4. 生成 manifest.yaml

使用收集到的信息生成，包含：
- 基本信息（id, name, description, tools, tags）
- version: 0.1.0
- created_at 和 updated_at: 当天日期
- includes: 列出已创建的目录

#### 5. 生成 CLAUDE.md 骨架

从 `templates/_template/` 复制（如果存在），否则生成最小骨架：

```markdown
# Project Rules

## 项目概述

- **项目名称**: [项目名称]
- **描述**: [一句话描述]
- **技术栈**: [语言/框架/数据库/...]

## 当前注意事项

- [ ] [当前正在进行的工作]
```

#### 6. 生成 OVERVIEW.md 骨架

```markdown
# {name} — Overview

## Overview

{description}

## Composition

<!-- 添加组件后运行 /template-sync sync {id} 自动生成 -->

## Workflow

<!-- 人工编写：命令管线、场景工作流、组件协作关系 -->
```

#### 7. 输出结果

```
✓ 模板已初始化: templates/{template-id}/

已创建:
  ├── manifest.yaml
  ├── OVERVIEW.md
  ├── CLAUDE.md
  └── .claude/ (rules, skills, commands, agents)

下一步:
  1. 在 .claude/ 下添加 rules, skills, commands, agents
  2. 运行 /template-sync sync {id} 更新文档
  3. 编写 OVERVIEW.md 的 Workflow 章节
```

#### 8. 更新项目索引

初始化完成后，运行索引生成脚本将新模板注册到 CLAUDE.md：

```bash
node tools/gen-index.js
```

---

### Action: sync

扫描模板实际文件，生成/更新 OVERVIEW.md 和 manifest.yaml includes。

#### 1. 确定目标模板

- 传了 template-id → 只处理该模板
- 未传 → 扫描 `templates/` 下所有有 `manifest.yaml` 的目录（排除 `_template`、`_spec.md`）

#### 2. 扫描组件

对每个模板执行：

**Rules:**
```
Glob: templates/{id}/.claude/rules/*.md
```
读取每个文件的首行（H1 标题）获取描述。如果首行不是 H1，使用文件名作为名称。

**Skills:**
```
Glob: templates/{id}/.claude/skills/*/SKILL.md
```
读取每个文件的 YAML frontmatter，提取 `name` 和 `description`。

**Commands:**
```
Glob: templates/{id}/.claude/commands/*.md
```
读取每个文件的首行（H1 标题）获取描述。

**Agents:**
```
Glob: templates/{id}/.claude/agents/*.md
```
读取每个文件的 YAML frontmatter，提取 `name`、`description`。检查 frontmatter 中的 `model` 字段。

**Hooks:**
读取 `templates/{id}/.claude/settings.json`，解析 hooks 配置。

**Spec:**
检查 `templates/{id}/spec/` 目录是否存在。如果存在，检查各子目录。

#### 3. 读取现有 OVERVIEW.md（如果存在）

提取 `## Workflow` 章节的内容备用（sync 不覆盖此章节）。

#### 4. 生成 OVERVIEW.md

按 `templates/_spec.md` 中定义的格式生成：

**`## Overview`:**
从 `manifest.yaml` 的 `description` 字段生成。

**`## Composition`:**
按扫描结果生成各子章节表格。只生成实际存在的组件类型。表格格式严格遵循 _spec.md 规范：

- `### Rules (N)` — 表格列: 规则 | 文件 | 说明
- `### Skills (N)` — 表格列: 技能 | 目录 | 说明 | 触发方式
- `### Commands (N)` — 表格列: 命令 | 文件 | 场景 | 说明
- `### Agents (N)` — 表格列: Agent | 文件 | 说明 | 模型
- `### Hooks (N)` — 表格列: 触发时机 | 功能 | 依赖
- `### Spec System` — 表格列: 层级 | 目录 | 说明

**`## Workflow`:**
- 如果之前存在人工编写的内容 → 保留原内容
- 如果不存在 → 生成骨架：

```markdown
## Workflow

<!-- 人工编写：命令管线、场景工作流、组件协作关系 -->
<!-- 建议包含：-->
<!-- 1. 主管线图（ASCII art） -->
<!-- 2. 场景工作流表（场景 | 命令 | 流程） -->
<!-- 3. 组件协作关系（Commands → Skills → Agents） -->
```

#### 5. 更新 manifest.yaml includes

同步 includes 中各目录条目的 `items` 子字段：
- 扫描到的新组件 → 添加到 items
- 不再存在的组件 → 从 items 移除
- 保留 `path` 和 `description` 字段不变

如果 includes 中没有 OVERVIEW.md 条目 → 添加。

#### 6. 输出变更摘要

```
模板同步: {template-id}
=======================

OVERVIEW.md:
  ✓ 更新 Composition（Rules: 4, Skills: 3, Commands: 11, Agents: 2, Hooks: 5）
  ⚠ Workflow 章节保留（人工维护）

manifest.yaml:
  ✓ 更新 .claude/commands/ items（+1 新增: pivot）
  — 其余条目无变化

⚠ 提醒: 请检查 OVERVIEW.md 的 Workflow 章节是否需要更新
```

#### 7. 更新项目索引

同步完成后，运行索引生成脚本更新 CLAUDE.md 中的 AUTO 区块：

```bash
node tools/gen-index.js
```

---

### Action: validate

校验模板是否符合 `templates/_spec.md` 规范。

#### 1. 确定目标模板

- 传了 template-id → 只校验该模板
- 未传 → 扫描所有模板逐一校验

#### 2. 必需文件检查

- [ ] `manifest.yaml` 存在
- [ ] `manifest.yaml` 包含必填字段（id, name, description, tools）
- [ ] `id` 字段值与目录名一致

#### 3. 结构一致性检查

- [ ] manifest.yaml includes 中列出的路径都实际存在
- [ ] 实际存在的组件目录都在 includes 中有记录
- [ ] includes 中有 `items` 的条目，items 数量与实际文件数量一致

#### 4. OVERVIEW.md 检查（如果存在）

- [ ] 包含三个必需 H2 章节（`## Overview` / `## Composition` / `## Workflow`）
- [ ] Composition 中各 `### Type (N)` 的 N 与实际文件数量一致
- [ ] Composition 表格列数符合 _spec.md 规范

#### 5. 输出校验报告

```
模板校验: {template-id}
=======================

✓ manifest.yaml — 必填字段完整
✓ manifest.yaml — id 与目录名一致
✓ manifest.yaml — includes 路径全部存在
⚠ manifest.yaml — .claude/commands/ 缺少 items 明细
✓ OVERVIEW.md — 三个必需章节存在
✗ OVERVIEW.md — Commands 数量不一致（文档: 10, 实际: 11）
✓ OVERVIEW.md — 表格格式正确

结果: 1 错误, 1 警告
建议: 运行 /template-sync sync {id} 修复
```

符号说明：
- `✓` — 通过
- `✗` — 错误（必须修复）
- `⚠` — 警告（建议修复）

---

## 示例

```bash
/template-sync init frontend-react
# → 初始化新模板 templates/frontend-react/

/template-sync sync general-development
# → 扫描 general-development 实际文件，更新 OVERVIEW.md 和 manifest.yaml

/template-sync sync
# → 扫描所有模板并同步

/template-sync validate general-development
# → 校验 general-development 是否符合规范

/template-sync validate
# → 校验所有模板
```
