# Workspace - 工作台

收集、分析、比较各类 AI 编程工具资源的地方。

## 目录结构

```
workspace/
├── resources/              # 单个资源（细粒度）
│   └── [resource-id]/
│       ├── files/          # 配置文件
│       └── metadata.yaml
│
├── frameworks/             # 完整框架（粗粒度）
│   └── [framework-id]/
│       ├── metadata.yaml   # 框架元数据
│       ├── analysis.md     # 分析笔记
│       └── extracted/      # 提取的精选组件
│
├── _repos/                 # 克隆的完整仓库（用于分析和提取）
│   └── [repo-name]/        # 如 BMAD-METHOD
│
└── indexes/                # 索引视图（自动生成）
    ├── by-type.md
    ├── by-tool.md
    └── by-source.md
```

---

## resources/ - 细粒度资源

存放可以直接复用的单个 AI 工具配置。

### 添加新资源

1. 创建目录：`resources/[resource-id]/`
2. 将文件放入 `files/` 子目录
3. 创建 `metadata.yaml`（参考 `_template/metadata.yaml`）
4. 运行 `node tools/gen-index.js` 更新索引

### 资源类型

| type | 说明 |
|------|------|
| `skill` | Claude Code 技能 |
| `hook` | 生命周期钩子 |
| `command` | 斜杠命令 |
| `agent` | Agent 配置 |
| `mcp-server` | MCP 服务器 |
| `prompt` | 提示词/规则文件 |
| `plugin` | 完整插件包 |

---

## frameworks/ - 粗粒度框架

存放需要整体分析的完整 AI 辅助开发框架。

### 添加新框架

1. 创建目录：`frameworks/[framework-id]/`
2. 创建 `metadata.yaml`（参考 `_template/metadata.yaml`）
3. 创建 `analysis.md` 编写分析笔记
4. 在 `extracted/` 中放入提取的有价值组件
5. 运行 `node tools/gen-index.js` 更新索引

### 框架类型

| type | 说明 |
|------|------|
| `framework` | 集成化 AI 辅助开发框架 |
| `methodology` | 开发方法论 |
| `toolkit` | 工具集合 |

### 什么时候用 frameworks/？

当遇到这类项目时：
- 包含多种组件类型（agents + workflows + prompts 等）
- 有完整的方法论或开发流程
- 需要整体理解才能评估其价值
- 例如：BMAD-METHOD、cursor-rules 集合等

---

## metadata.yaml 示例

### resources 资源

```yaml
id: example-skill
name: Example Skill
description: 技能描述

type: skill
tools:
  - claude-code

source:
  type: github
  url: https://github.com/xxx/xxx
  author: Author Name
  collected_at: 2026-01-26

tags:
  - example
```

### frameworks 框架

```yaml
id: example-framework
name: Example Framework
description: 框架描述

type: framework
tools:
  - claude-code
  - cursor

source:
  type: github
  url: https://github.com/xxx/xxx
  author: Author Name
  collected_at: 2026-01-26

components:
  agents: 5
  workflows: 10
  prompts: 3

tags:
  - agile
  - methodology
```

---

## _repos/ - 克隆的仓库

存放完整克隆的 GitHub 仓库，用于深入分析和提取组件。

### 为什么需要 _repos/？

- **深入分析** - 需要查看完整源码才能理解框架设计
- **组件提取** - 从中挑选有价值的部分放到 `extracted/`
- **保持分离** - 原始仓库和精选组件分开存放

### 使用方式

```bash
# 克隆仓库（推荐浅克隆）
cd workspace/_repos
git clone --depth 1 https://github.com/xxx/xxx.git

# 分析后，将有价值的组件复制到对应 framework 的 extracted/ 目录
```

### 已克隆的仓库

| 仓库 | 说明 |
|------|------|
| [BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | AI 驱动敏捷开发框架 |

---

## 模板位置

- 资源模板：[resources/_template/](resources/_template/)
- 框架模板：[frameworks/_template/](frameworks/_template/)
