# AI Collaboration Template

AI 编程工具配置模板管理项目。

本项目有双重角色：
1. **工作台** - 收集、分析、比较各类 AI 编程工具资源
2. **模板仓库** - 输出成品项目模板供实际项目使用

## 目录结构

```
├── workspace/              # 🔧 工作台 - 收集和分析资源
│   ├── resources/          # 单个资源（细粒度）
│   ├── frameworks/         # 完整框架（粗粒度）
│   └── indexes/            # 自动生成的索引
│
├── templates/              # 📦 成品模板（各自独立完整）
│
├── cli/                    # 📦 CLI 工具（npm 包）
│
├── tools/                  # 🛠️ 辅助脚本
│
└── .claude/                # 本项目的 Claude 配置
```

## 快速开始

### 安装模板到项目

**当前推荐方式**（直接从 GitHub 拉取）：

```bash
# 在目标项目目录下执行
npx degit dionysians/AI-Collaboration-template/templates/general-development
```

这会将 `general-development` 模板的所有文件（`.claude/`、`CLAUDE.md`、`spec/`、`docs/`）安装到当前目录。

**原理**：`degit` 从 GitHub 仓库提取指定子目录的最新快照，不带 git 历史，直接铺到当前目录。

---

### 未来多模板方案

当模板数量增加（3+ 个）时，将启用 CLI 工具提供交互式体验：

```bash
# 交互式选择模板
npx ai-collab-template init

# 指定模板
npx ai-collab-template init --template general-development

# 列出可用模板
npx ai-collab-template list
```

CLI 工具代码已就绪（见 [cli/](cli/)），将在模板丰富后发布到 npm。

---

### 可用模板

| 模板 | 版本 | 说明 | 安装命令 |
|------|------|------|----------|
| [general-development](templates/general-development/) | v1.2.0 | 通用开发模板<br/>融合 everything-claude-code + Superpowers + BMAD-METHOD + Spec 体系 | `npx degit dionysians/AI-Collaboration-template/templates/general-development` |

详见 [templates/README.md](templates/README.md)

---

### 工作台使用

详见 [workspace/README.md](workspace/README.md)

---

## 工作台说明

工作台分为两个层级：

### resources/ - 细粒度资源

收集单个的 AI 编程工具配置文件：

| 类型 | 说明 |
|------|------|
| `skill` | Claude Code 技能 |
| `hook` | 生命周期钩子 |
| `command` | 斜杠命令 |
| `agent` | Agent 配置 |
| `mcp-server` | MCP 服务器 |
| `prompt` | 提示词/规则文件 |
| `plugin` | 完整插件包 |

```
resources/
└── [resource-id]/
    ├── files/           # 实际配置文件
    └── metadata.yaml    # 元数据
```

### frameworks/ - 粗粒度框架

收集完整的 AI 辅助开发框架（如 BMAD-METHOD）：

| 类型 | 说明 |
|------|------|
| `framework` | 集成化 AI 辅助开发框架 |
| `methodology` | 开发方法论 |
| `toolkit` | 工具集合 |

```
frameworks/
└── [framework-id]/
    ├── metadata.yaml    # 框架元数据
    ├── analysis.md      # 分析笔记
    └── extracted/       # 提取的有价值组件
```

**为什么分两层？**
- **resources/** 存放可以直接复用的单个组件
- **frameworks/** 存放需要整体理解和分析的完整框架，并从中提取有价值的组件

---

## 支持的 AI 工具

- Claude Code
- Cursor
- Windsurf
- GitHub Copilot
- Continue.dev

---

## 工作流程

```
收集资源/框架
     ↓
存放到 workspace/（resources 或 frameworks）
     ↓
填写 metadata.yaml，编写分析笔记
     ↓
运行 node tools/gen-index.js 更新索引
     ↓
分析对比，提取有价值的组件
     ↓
整合精炼到 templates/ 输出成品模板
```

---

## TODO

### 模板跨工具批量安装

当前模板只定义了配置内容，缺少向各 AI 编程工具批量分发的机制。

**现状问题：** 创建好的模板需要手动复制到每个工具的配置目录（`.claude/`、`.cursor/`、`.github/` 等），项目越多、工具越多，维护成本越高。

**参考方案：** [vercel-labs/skills](https://github.com/vercel-labs/skills) CLI 工具的安装机制：

- 使用 `.agents/skills/` 作为规范存储位置（单一源），各工具目录通过 symlink 指向它
- 支持 40+ AI agent（Claude Code、Cursor、Windsurf、Copilot、Cline 等）
- 支持项目级和全局（`-g`）安装
- 通过 lock 文件（`~/.agents/.skill-lock.json`）追踪已安装内容，支持 `update`/`check`/`remove`

**待办：**

- [ ] 调研 `npx skills` 是否可以直接用于分发本项目的模板（将 `templates/` 输出为符合 Agent Skills 规范的 SKILL.md 格式）
- [ ] 评估自建 CLI（`npx ai-collab-template init`）与直接适配 Agent Skills 规范的取舍
- [ ] 为 `templates/` 中的成品模板补充 SKILL.md frontmatter（`name` + `description`），使其兼容 `npx skills add`
- [ ] 设计多工具同步策略：模板更新后如何让已安装的项目获得更新
- [ ] 确定 symlink vs copy 在不同操作系统上的兼容性处理（Windows junction fallback）

### 其他待办

- [x] 输出第一个成品模板到 `templates/` — ✅ general-development v1.2.0 已完成
- [x] 实现 `cli/` 中的 CLI 工具 — ✅ 已实现，待模板丰富后发布 npm
- [ ] 完成 workspace 中已收集框架的组件提取（`extracted/` 目录均为空）
- [ ] 补充 Cursor、Windsurf 等工具的配置规范调研
- [ ] 创建更多领域专用模板（frontend-react、backend-node、fullstack 等）

---

## 相关文档

- [workspace/README.md](workspace/README.md) - 工作台详细说明
- [templates/README.md](templates/README.md) - 模板使用说明
- [templates/_spec.md](templates/_spec.md) - 模板规范定义
- [RESEARCH.md](RESEARCH.md) - AI 工具配置管理调研报告
