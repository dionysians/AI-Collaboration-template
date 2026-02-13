# General Development Template — Overview

## Overview

通用项目开发模板 (v1.2.0)，融合三大框架最佳实践：

- **结构**: BMAD-METHOD 的 Epic → Story → AC 分层规划
- **执行**: Superpowers 的 TDD 强制 + 系统调试 + 两阶段审查
- **配置**: everything-claude-code 的 agents/hooks/rules/skills 体系
- **规格**: 四层级 Spec 体系（Project/Domain/Contract/Flow）渐进式采用

设计理念：
- **Rules = 宪法**（always-on 硬约束，最小化上下文占用）
- **Skills = 详细工作流**（on-demand 触发，详尽执行步骤）
- **Commands = 用户入口**（场景化命令，编排 skills 和 agents）
- **知识单点原则** — 每个概念在且仅在一处详细定义

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

### Skills (3)

| 技能 | 目录 | 说明 | 触发方式 |
|------|------|------|----------|
| story-execution | `.claude/skills/story-execution/` | Story 执行引擎：加载 AC → 动态 Task 拆解 → 逐 Task TDD → Story 审查 → 提交 | /feature Phase 3 |
| systematic-debugging | `.claude/skills/systematic-debugging/` | 四阶段系统调试：根因调查 → 模式分析 → 假设验证 → 实施修复。≥3 次失败触发架构讨论 | /bugfix |
| verification-loop | `.claude/skills/verification-loop/` | 8 阶段验证：Build → Types → Lint → Unit → Integration → E2E → Security → Diff。支持 --full 扩展 | /verify |

### Commands (12)

| 命令 | 文件 | 场景 | 说明 |
|------|------|------|------|
| /feature | `.claude/commands/feature.md` | 新功能 | 全管线编排：clarify → architecture → plan → 逐 Story TDD → verify → PR |
| /roadmap | `.claude/commands/roadmap.md` | 项目路线图 | Spec vs Code Gap Analysis → 生成/更新路线图，/plan 的上游 |
| /clarify | `.claude/commands/clarify.md` | 需求澄清 | 苏格拉底式提问 → PRD，含复杂度评估 |
| /architecture | `.claude/commands/architecture.md` | 架构设计 | 交互式生成 Spec 四层级体系（含技术决策、实现约定、架构验证） |
| /plan | `.claude/commands/plan.md` | 规划 | 调用 planner agent，Quick/Full 双模式，Spec 感知 |
| /review | `.claude/commands/review.md` | 代码审查 | 调用 code-reviewer agent，两阶段（规格合规 + 代码质量） |
| /verify | `.claude/commands/verify.md` | 验证 | 触发 verification-loop skill，8 阶段验证 |
| /bugfix | `.claude/commands/bugfix.md` | Bug 修复 | 复现 → systematic-debugging → 回归测试 → verify |
| /hotfix | `.claude/commands/hotfix.md` | 紧急修复 | 直接修复 → 补测试 → verify → 立即提交 |
| /spike | `.claude/commands/spike.md` | 探索验证 | 自由探索（无 TDD 要求）→ 可行性报告 |
| /decide | `.claude/commands/decide.md` | 架构决策 | 交互式生成 ADR → spec/adr/ |
| /pivot | `.claude/commands/pivot.md` | 方向调整 | 三种场景：全部重来 / 部分调整 / 技术选型更换 |

### Agents (2)

| Agent | 文件 | 说明 | 模型 |
|-------|------|------|------|
| planner | `.claude/agents/planner.md` | 规划专家：Quick/Full 双模式，Spec 感知，输出 Epic → Story(AC) | opus |
| code-reviewer | `.claude/agents/code-reviewer.md` | 代码审查：两阶段（规格合规 + 代码质量 CRITICAL/HIGH/MEDIUM/LOW） | - |

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

### 主管线: /feature（全管线编排器）

```
/feature [功能描述]
  │
  ├─ Phase 0:   /roadmap        → 路线图（可选，跨迭代规划）
  ├─ Phase 1:   /clarify        → PRD（可跳过）
  ├─ Phase 1.5: /architecture   → Spec 四层级（可选，中大型项目）
  ├─ Phase 2:   /plan           → Epic → Story(AC)（planner agent）
  ├─ Phase 3:   story-execution → 逐 Story TDD
  │               ├─ 动态 Task 拆解
  │               ├─ RED → GREEN → REFACTOR
  │               ├─ Story 验证（AC 逐条核对）
  │               ├─ /review（code-reviewer agent）
  │               └─ git commit
  └─ Phase 4:   /verify + PR
```

### 场景工作流

| 场景 | 命令 | 流程 |
|------|------|------|
| 新功能 | /feature | clarify → (architecture) → plan → 逐 Story TDD → review → verify → PR |
| Bug 修复 | /bugfix | 复现 → systematic-debugging → 回归测试 → verify |
| 紧急修复 | /hotfix | 直接修复 → 补测试 → verify → 立即提交 |
| 探索验证 | /spike | 明确目标 → 自由探索（无 TDD）→ 可行性报告 |

### 组件协作关系

```
Commands (用户入口)          Skills (执行引擎)           Agents (专业角色)
───────────────────         ─────────────────           ─────────────────
/feature ──────────────────→ story-execution ─────────→ code-reviewer
  ├── /clarify                                          (两阶段审查)
  ├── /architecture
  └── /plan ───────────────────────────────────────────→ planner
                                                         (Quick/Full 规划)
/bugfix ──────────────────→ systematic-debugging
/verify ──────────────────→ verification-loop
/review ──────────────────────────────────────────────→ code-reviewer
/roadmap                    (独立命令，/plan 上游)
/decide                     (独立命令)
/pivot                      (独立命令)
/spike                      (独立命令)
/hotfix                     (独立命令，轻量流程)
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
- **planner** — 以 Spec 为唯一真理源进行规划
- **code-reviewer** — 增加 Domain/Contract/Flow Spec 合规检查
- **story-execution** — AC 与 Spec 规则一致性验证
- **/architecture** — 生成/更新 Spec 四层级体系
- **/decide** — ADR 存放在 spec/adr/，提醒更新 Spec
