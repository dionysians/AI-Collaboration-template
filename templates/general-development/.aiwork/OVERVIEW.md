# General Development Template — Overview

## Overview

通用项目开发模板 (v1.3.0)，融合三大框架最佳实践：

- **结构**: BMAD-METHOD 的 Epic → Story → AC 分层规划
- **执行**: Superpowers 的 TDD 强制 + 系统调试 + 两阶段审查
- **配置**: everything-claude-code 的 agents/hooks/rules/skills 体系
- **规格**: 四层级 Spec 体系（Project/Domain/Contract/Flow）渐进式采用

设计理念：
- **Rules = 宪法**（always-on 硬约束，最小化上下文占用）
- **Agents = 隔离执行重型工作**（TDD、验证、规划、审查，独立上下文）
- **Skills = 轻量级行为模式**（反应式，需主上下文感知时使用）
- **Commands = 用户入口**（场景化命令，薄编排层）
- **知识单点原则** — 每个概念在且仅在一处详细定义
- **主上下文保护** — 所有重型工作都在隔离上下文（Agent/Sub-agent）执行

适用工具: Claude Code
适用场景: 通用项目开发，支持场景化工作流（/feature, /bugfix, /hotfix, /spike）和渐进式采用

## Composition

### Rules (4)

| 规则 | 文件 | 说明 |
|------|------|------|
| coding-style | `.claude/rules/coding-style.md` | 代码风格：不可变性、函数 ≤50 行、文件 ≤800 行、嵌套 ≤4 层、禁止 console.log |
| testing | `.claude/rules/testing.md` | 测试规范：TDD 强制（业务逻辑/算法）、覆盖率 ≥80%、场景化策略矩阵 |
| security | `.claude/rules/security.md` | 安全规范：无硬编码密钥、参数化 SQL、HTML 转义、输入验证 |
| git-workflow | `.claude/rules/git-workflow.md` | Git 约定：Commit 格式 `<type>: <desc>`、分支命名 feat/fix/hotfix |

### Skills (1)

| 技能 | 目录 | 说明 | 触发方式 |
|------|------|------|----------|
| systematic-debugging | `.claude/skills/systematic-debugging/` | 四阶段系统调试：根因调查 → 模式分析 → 假设验证 → 实施修复。≥3 次失败触发架构讨论 | /bugfix |

### Commands (12)

| 命令 | 文件 | 场景 | 说明 |
|------|------|------|------|
| /feature | `.claude/commands/feature.md` | 新功能 | 双模式编排：Full/Agile × Agent Team/Serial。clarify → architecture → plan → Story 执行 → verify → PR |
| /roadmap | `.claude/commands/roadmap.md` | 项目路线图 | Spec vs Code Gap Analysis → 生成/更新路线图，/plan 的上游 |
| /clarify | `.claude/commands/clarify.md` | 需求澄清 | 苏格拉底式提问 → PRD，含复杂度评估 |
| /architecture | `.claude/commands/architecture.md` | 架构设计 | 交互式生成 Spec 四层级体系（含技术决策、实现约定、架构验证） |
| /plan | `.claude/commands/plan.md` | 规划 | 结构化规划（4 阶段 BMAD 流程），Quick/Full 双模式，Spec 感知 |
| /review | `.claude/commands/review.md` | 代码审查 | 调用 code-reviewer agent，两阶段（规格合规 + 代码质量） |
| /verify | `.claude/commands/verify.md` | 验证 | 调用 verifier agent（`--lite` 4 项 / 默认 8 阶段 / `--full` 扩展） |
| /bugfix | `.claude/commands/bugfix.md` | Bug 修复 | 复现 → systematic-debugging → 回归测试 → verify |
| /hotfix | `.claude/commands/hotfix.md` | 紧急修复 | 直接修复 → 补测试 → verify → 立即提交 |
| /spike | `.claude/commands/spike.md` | 探索验证 | 自由探索（无 TDD 要求）→ 可行性报告 |
| /decide | `.claude/commands/decide.md` | 架构决策 | 交互式生成 ADR → spec/adr/ |
| /pivot | `.claude/commands/pivot.md` | 方向调整 | 三种场景：全部重来 / 部分调整 / 技术选型更换 |

### Agents (4)

| Agent | 文件 | 说明 | 模型 |
|-------|------|------|------|
| planner | `.claude/agents/planner.md` | 规划专家：BMAD 4 阶段（需求提取→Epic 设计→Story 生成→验证），Spec 感知 | opus |
| developer | `.claude/agents/developer.md` | Story 执行引擎：TDD 实现，支持 Full/Agile reviewMode + File Ownership 并行安全 | opus |
| code-reviewer | `.claude/agents/code-reviewer.md` | 代码审查：两阶段（规格合规 + 代码质量 CRITICAL/HIGH/MEDIUM/LOW） | - |
| verifier | `.claude/agents/verifier.md` | 验证专家：三级验证（`--lite` 4 项 / 默认 8 阶段 / `--full` 扩展），自动检测技术栈 | - |

### Hooks (5)

| 触发时机 | 功能 | 依赖 |
|----------|------|------|
| PreToolUse (git push) | 推送前提醒：建议先运行 /verify | - |
| PostToolUse (Edit .ts/.tsx/.js/.jsx) | Prettier 自动格式化 | prettier |
| PostToolUse (Edit .ts/.tsx) | TypeScript 类型检查 | tsconfig.json |
| PostToolUse (Edit .ts/.tsx/.js/.jsx) | console.log 警告 | - |
| Stop (*) | 审计变更文件中的 console.log | - |

> 配置文件: `.claude/settings.json`。当前为 JS/TS 项目配置，其他语言需自行修改。

### Spec System

四层级规格文档体系（可选，通过 `/architecture` 启用）：

| 层级 | 目录 | 说明 |
|------|------|------|
| Project Spec | `spec/0_project/` | 系统边界、模块划分、技术栈、项目结构、实现约定、全局规则 |
| Domain Spec | `spec/1_domain/` | 状态机、业务规则、约束 |
| Contract Spec | `spec/2_contract/` | API / Event / Schema 契约 |
| Flow Spec | `spec/3_flow/` | Given/When/Then 场景 |
| ADR | `spec/adr/` | 架构决策记录 |

模板文件位于 `.aiwork/templates/spec/`，`spec/` 目录由 `/architecture` 按需创建。详见 `.aiwork/templates/spec/README.md`。

## Workflow

### 主管线: /feature（双模式编排器）

支持 **Full/Agile** 执行强度和 **Agent Team/Serial** 基础设施模式。

```
/feature [功能描述]
  │
  ├─ Phase 0:   上下文检查 + Full/Agile 选择 + Agent Team 检测
  ├─ Phase 1:   /clarify        → PRD（可跳过）
  ├─ Phase 1.5: /architecture   → Spec 四层级（可选，中大型项目）
  ├─ Phase 2:   /plan           → Epic → Story(AC)（planner agent）
  ├─ Phase 3:   developer agent → 逐 Story TDD（Agent Team 时可并行）
  │               ├─ 动态 Task 拆解
  │               ├─ RED → GREEN → REFACTOR
  │               ├─ Story 验证（AC 逐条核对）
  │               ├─ [Full] code-reviewer agent 审查
  │               ├─ [Agile] 跳过审查
  │               └─ git commit
  └─ Phase 4:   verifier agent（Full: 8 阶段 / Agile: --lite 4 项）→ PR
```

Full vs Agile:
| | Full | Agile |
|---|---|---|
| Phase 3 | TDD → review → commit | TDD → commit |
| Phase 4 | 8 阶段验证 | Build+Types+Lint+UnitTests |

### 场景工作流

| 场景 | 命令 | 流程 |
|------|------|------|
| 新功能 | /feature | Full/Agile 模式。clarify → (architecture) → plan → Story 执行 → verify → PR |
| Bug 修复 | /bugfix | 复现 → systematic-debugging → 回归测试 → verify |
| 紧急修复 | /hotfix | 直接修复 → 补测试 → verify → 立即提交 |
| 探索验证 | /spike | 明确目标 → 自由探索（无 TDD）→ 可行性报告 |

### 组件协作关系

```
Commands (薄编排)            Agents (隔离执行)           Skills (主上下文)
───────────────────         ─────────────────           ─────────────────
/feature (Lead) ──────────→ developer (per Story)       systematic-debugging
  ├── /clarify               ├── code-reviewer           (反应式调试)
  ├── /architecture          │   (Full 模式审查)
  ├── /plan ────────────────→ planner
  └── /verify ──────────────→ verifier

/bugfix ──────────────────────────────────────────────→ systematic-debugging
/review ────────────────────→ code-reviewer
/roadmap, /decide, /pivot, /spike, /hotfix — 独立命令

Agent Team 模式时: /feature 作为 Team Lead，spawn Teammates 并行
降级模式时:       /feature 串行调用 Sub-agents
```

### Rules 作用范围

Rules 是 always-on 的硬约束，始终生效：
- `coding-style` — 所有代码编辑
- `testing` — 所有涉及测试的操作（story-execution, bugfix, verify）
- `security` — 所有提交前检查（review, verify）
- `git-workflow` — 所有 git 操作

### Spec 集成点

当 `spec/` 目录存在时，以下组件变为 Spec-aware：
- **/roadmap** — 以 Spec 为 Target State 进行 Gap Analysis
- **planner** — 以 Spec 为唯一真理源，BMAD 4 阶段结构化规划
- **code-reviewer** — 增加 Domain/Contract/Flow Spec 合规检查
- **developer agent** — AC 与 Spec 规则一致性验证
- **/architecture** — 生成/更新 Spec 四层级体系
- **/decide** — ADR 存放在 spec/adr/，提醒更新 Spec
