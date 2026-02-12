# Spec 四层级体系

可选的规格文档体系，为 AI Coding 提供稳定的"世界模型（World Model）"。Spec 定义系统的"行为事实"，是所有代码与自动化流程的唯一真理源（Single Source of Truth）。

## 启用方式

执行 `/architecture` 命令，会读取本目录（`.aiwork/templates/spec/`）的模板，在项目根目录创建 `spec/` 结构并交互式生成 Spec。

## 四层级定义

```
Level 1 — Project Spec      → 定义世界观（World Model）
Level 2 — Domain Spec       → 定义行为（Behavior Model）
Level 3 — Contract Spec     → 定义契约（API / Event / Data Contract）
Level 4 — Flow Spec         → 定义流程（Scenario / Story / Test Driver）
```

| 层级 | 内容 | AI 用途 | 输出物 |
|------|------|---------|--------|
| Project Spec | 系统边界、模块划分、全局规则 | 理解系统结构 | 架构 scaffolding、目录结构 |
| Domain Spec | 状态机、业务规则、约束 | 理解行为规则 | service/domain 逻辑、校验 |
| Contract Spec | API / Event / Schema 契约 | 技术契约 | controller、router、SDK |
| Flow Spec | Given/When/Then 场景 | 场景、状态变化 | 自动化测试、E2E 流程 |

## 目录结构

模板文件（位于 `.aiwork/templates/spec/`）：
```
.aiwork/templates/spec/
├── 0_project/_template.md     # Project Spec 模板
├── 1_domain/_template.md      # Domain Spec 模板
├── 2_contract/_template.yaml  # Contract Spec 模板
├── 3_flow/_template.md        # Flow Spec 模板
├── adr/_template.md           # ADR 模板
└── README.md                  # 本文件
```

运行时目录（由 `/architecture` 按需创建）：
```
spec/
├── 0_project/              # Level 1: 顶层规格（世界观）
│   └── project-spec.md     # 项目规格
│
├── 1_domain/               # Level 2: 领域规格（行为模型）
│   ├── user-domain.md      # 示例
│   └── order-domain.md     # 示例
│
├── 2_contract/             # Level 3: 契约（API / Event / Data）
│   ├── v1/                 # 版本 1
│   │   └── api-{name}.yaml
│   ├── v2/                 # 版本 2（breaking change 时创建）
│   └── events/             # 事件契约
│
├── 3_flow/                 # Level 4: 流程规格（场景 / 测试）
│   ├── iteration_01/       # 第 1 次迭代
│   │   └── {name}-flow.md
│   └── iteration_02/       # 第 2 次迭代（新增，不覆盖）
│
└── adr/                    # 架构决策记录
    └── NNNN-{title}.md     # ADR 文件
```

## 层级规则

1. **层级不越权** — Flow 不定义规则，Domain 不含 API 字段
2. **上层为下层提供语义基础** — 下层必须符合上层规则
3. **单一真理源** — 规则只在一处定义，其他层引用
4. **Spec 是行为事实** — 描述系统应当如何表现，不描述实现方式

## 更新原则

| 层级 | 更新方式 | 说明 |
|------|----------|------|
| Project Spec | 原地更新 | 不创建版本，维护 Evolution Timeline |
| Domain Spec | 原地更新 | 不创建版本，维护 Evolution Log |
| Contract Spec | 版本化 | Breaking change MUST 创建 v2/v3，旧版本不可修改 |
| Flow Spec | 按迭代新增 | iteration_01, iteration_02...，不覆盖历史 |

## 命名规范

- 文件名 MUST 小写 + 连字符 `-`
- Domain 文件以 `-domain` 结尾
- Flow 文件以 `-flow` 结尾
- API 契约 MUST 使用 `.yaml`
- Contract 版本目录: `v1`, `v2`, `v3`（无 patch 号）
- Flow 迭代目录: `iteration_XX`（两位数字）

## 与工作流的集成

| 命令 | Spec 关系 |
|------|-----------|
| `/clarify` | 输出 PRD，评估是否需要 Spec 体系 |
| `/architecture` | 交互式生成/更新 Spec（含目录初始化） |
| `/plan` | 读取 Spec 作为唯一真理源 |
| `/review` | Spec-aware 审查（检查实现与 Spec 一致性） |
| `/decide` | ADR 存放在 `spec/adr/`，提醒更新 Spec |

## 何时启用 Spec

Spec 体系是**渐进式**的，不是强制要求：

| 场景 | 建议 |
|------|------|
| 小项目（1-2 模块） | 不需要 Spec |
| 中型项目（3-5 模块） | 建议 Project + Domain Spec |
| 大型项目（6+ 模块） | 完整四层级 Spec |
| 有外部 API | 必须有 Contract Spec |
| 多人协作 | 必须有 Spec |

## ADR 与 Spec 的关系

- **ADR = 决策原因**（Why）— 记录为什么做某个决策
- **Spec = 决策结果**（What）— 记录具体的规则是什么
- ADR 存放在 `spec/adr/`，通过 `/decide` 创建
