# 模板规范

## 模板目录结构

每个模板必须包含 `manifest.yaml`，其余文件按需添加：

```
[template-id]/
├── manifest.yaml        # 必须：模板元信息
├── OVERVIEW.md          # 推荐：结构化概览（/template-sync 生成维护）
├── CLAUDE.md            # 推荐：项目规则主文件（用户安装后的入口）
├── .claude/
│   ├── settings.json    # 可选：Hooks 配置
│   ├── rules/           # 可选：*.md 规则文件
│   ├── skills/          # 可选：*/SKILL.md 技能文件
│   ├── commands/        # 可选：*.md 命令文件
│   └── agents/          # 可选：*.md Agent 文件
├── spec/                # 可选：Spec 体系
│   ├── README.md
│   ├── 0_project/
│   ├── 1_domain/
│   ├── 2_contract/
│   ├── 3_flow/
│   └── adr/
└── docs/                # 可选：文档输出目录
```

## manifest.yaml 必填字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 模板唯一标识，与目录名一致 |
| `name` | string | 显示名称 |
| `description` | string | 模板描述 |
| `tools` | string[] | 包含哪些工具的配置 |

## manifest.yaml 可选字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `tags` | string[] | 标签 |
| `version` | string | 版本号 |
| `created_at` | string | 创建日期 |
| `updated_at` | string | 更新日期 |
| `sources` | object[] | 设计来源（借鉴的框架/方法） |
| `includes` | object[] | 包含内容说明（见下方详细格式） |

### includes 字段格式

每个 include 条目：

| 字段 | 类型 | 必须 | 说明 |
|------|------|------|------|
| `path` | string | 是 | 文件或目录路径 |
| `description` | string | 是 | 一行说明 |
| `items` | object[] | 否 | 目录下各组件明细 |

`items` 中每个条目：

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 组件名称（不含扩展名） |
| `description` | string | 一行说明 |

示例：

```yaml
includes:
  - path: .claude/commands/
    description: 用户命令（11 commands）
    items:
      - name: feature
        description: 完整功能开发（全管线编排器）
      - name: clarify
        description: 需求澄清 → PRD
```

## 支持的工具配置

| 工具 | 配置位置 |
|------|----------|
| Claude Code | `.claude/`, `CLAUDE.md` |
| Cursor | `.cursor/`, `.cursorrules` |
| Windsurf | `.windsurf/` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Continue | `.continue/` |

## 命名约定

- 模板 ID 使用 kebab-case：`frontend-react`, `backend-node`
- 配置文件保持各工具的标准命名

---

## OVERVIEW.md 规范

每个模板应包含 `OVERVIEW.md`，作为模板的结构化概览文档。
它是 `/template-info` skill 的主要数据源，也是人类快速了解模板的入口。
通过 `/template-sync sync` 自动生成和维护。

### 设计原则

1. **索引而非副本** — 只包含一行描述和路径引用，不复制组件文件内容
2. **结构化** — 使用固定的 markdown 章节和表格，便于解析
3. **完整** — 覆盖模板中所有已存在的组件类型
4. **模板无关** — 格式规范适用于所有模板

### 必需章节

| 章节 | H2 标题 | 内容 |
|------|---------|------|
| 概览 | `## Overview` | 模板的设计理念、目标和适用场景（2-5 句） |
| 组件 | `## Composition` | 每类组件一个 H3 子章节，内含 markdown 表格 |
| 工作流 | `## Workflow` | 命令管线图、场景工作流、组件协作关系 |

### Composition 子章节格式

只包含模板中实际存在的组件类型。每类组件使用 `### Type (N)` 格式的 H3 标题，N 为组件数量。

| 组件类型 | H3 标题格式 | 表格列 |
|----------|------------|--------|
| Rules | `### Rules (N)` | 规则 \| 文件 \| 说明 |
| Skills | `### Skills (N)` | 技能 \| 目录 \| 说明 \| 触发方式 |
| Commands | `### Commands (N)` | 命令 \| 文件 \| 场景 \| 说明 |
| Agents | `### Agents (N)` | Agent \| 文件 \| 说明 \| 模型 |
| Hooks | `### Hooks (N)` | 触发时机 \| 功能 \| 依赖 |
| Spec | `### Spec System` | 层级 \| 目录 \| 说明 |

### Workflow 章节格式

Workflow 涉及管线设计和组件协作关系，需要人工编写（`/template-sync sync` 首次只生成骨架）。

建议包含：
1. 主管线图（ASCII art）
2. 各场景工作流（表格：场景 | 命令 | 流程）
3. 组件协作关系（Commands → Skills → Agents 的调用关系）

### 自动生成与人工维护的边界

| 章节 | `/template-sync sync` 行为 |
|------|---------------------------|
| `## Overview` | 从 manifest.yaml description 自动生成，可人工补充 |
| `## Composition` | 从实际文件扫描自动生成，每次 sync 覆盖更新 |
| `## Workflow` | 首次生成骨架，此后保留人工编写内容不覆盖 |
