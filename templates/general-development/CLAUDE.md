# Project Rules

<!--
  这是 Claude Code 的项目规则文件。
  使用 general-development 模板生成。
  根据你的项目需求修改下面的占位符内容。
-->

## 项目概述

<!-- 替换为你的项目信息 -->
- **项目名称**: [项目名称]
- **描述**: [一句话描述]
- **技术栈**: [语言/框架/数据库/...]
- **包管理器**: [npm/pnpm/yarn/cargo/pip/...]

## 场景化命令

| 命令 | 场景 | 说明 |
|------|------|------|
| `/feature` | 新功能 | clarify(PRD) → architecture(可选) → plan → 逐 Story TDD → review → verify → PR |
| `/bugfix` | Bug 修复 | 复现 → 系统调试 → 回归测试 → 修复 → verify |
| `/hotfix` | 紧急修复 | 直接修复 → 补测试 → verify → 立即提交 |
| `/spike` | 探索验证 | 自由探索 → 可行性报告（无测试要求） |

## 辅助命令

| 命令 | 说明 |
|------|------|
| `/roadmap` | Spec vs Code Gap Analysis → 生成/更新项目路线图 |
| `/clarify` | 需求澄清 → 输出 PRD（苏格拉底式提问） |
| `/architecture` | 交互式生成 Spec 四层级体系（含技术决策、实现约定、架构验证） |
| `/plan` | 调用 planner 创建实现计划（PRD + Spec 感知） |
| `/review` | 两阶段代码审查（Spec-aware） |
| `/verify` | 完整验证循环（8 阶段） |
| `/decide` | 记录架构决策 ADR（存放在 spec/adr/） |
| `/pivot` | 方向调整 |

## 规划管线

`/feature` 是全管线编排器，内部阶段：

```
/feature
  Phase 0:   /roadmap → 路线图（可选，跨迭代规划）
  Phase 1:   /clarify → PRD（可跳过，如已有 PRD）
  Phase 1.5: /architecture → Spec（可选，中大型项目）
  Phase 2:   /plan → Epic/Story/AC
  Phase 3:   逐 Story TDD 执行
  Phase 4:   PR
```

各命令（`/clarify`, `/architecture`, `/plan`）也可独立使用。

## Spec 体系（可选）

四层级规格文档体系，通过 `/architecture` 启用：

| 层级 | 位置 | 说明 |
|------|------|------|
| Project Spec | `spec/0_project/` | 系统边界、模块划分、技术栈、项目结构、实现约定、全局规则 |
| Domain Spec | `spec/1_domain/` | 状态机、业务规则、约束 |
| Contract Spec | `spec/2_contract/v1/` | API / Event / Schema 契约 |
| Flow Spec | `spec/3_flow/iteration_01/` | Given/When/Then 场景 |
| ADR | `spec/adr/` | 架构决策记录 |

`spec/` 目录由 `/architecture` 按需创建。模板文件位于 `.aiwork/templates/spec/`，详见 `.aiwork/templates/spec/README.md`。

## 核心原则

1. **测试先行** — 没有失败的测试，就不写生产代码（业务逻辑/算法场景）
2. **系统调试** — 没有根因调查，就不能提出修复方案
3. **验证后声称** — 没有验证证据，就不能声称完成
4. **不可变性** — 创建新对象，不直接修改
5. **小文件原则** — 200-400 行典型，800 行上限
6. **Spec 优先** — 有 Spec 时，Spec 是唯一真理源，不自行发明规则

## 测试策略

- **覆盖率目标**: ≥ 80%
- **TDD 强制**: 业务逻辑、算法、Bug 修复
- **TDD 例外**: 探索性原型、UI 组件（用 Visual/E2E）、纯集成代码
- 详见 `.claude/rules/testing.md`

## Git 约定

- **Commit 格式**: `<type>: <description>`（feat/fix/refactor/docs/test/chore/perf/ci）
- **分支命名**: `feat/<name>`, `fix/<name>`, `hotfix/<name>`
- **提交前**: 所有测试通过 + 类型检查 + Lint + 无 console.log

## Agents

| Agent | 说明 | 模型 |
|-------|------|------|
| planner | 规划专家（只读，双模式，Spec 感知） | opus |
| code-reviewer | 两阶段代码审查（Spec-aware） | - |

## Hooks（自动触发）

| 触发时机 | 功能 | 依赖 |
|----------|------|------|
| PostToolUse (Edit .ts/.tsx/.js/.jsx) | Prettier 自动格式化 | prettier |
| PostToolUse (Edit .ts/.tsx) | TypeScript 类型检查 | tsconfig.json |
| PostToolUse (Edit .ts/.tsx/.js/.jsx) | console.log 警告 | - |
| PreToolUse (git push) | 推送前提醒 | - |
| Stop | 审计变更文件中的 console.log | - |

> Hooks 依赖 Node.js（内联脚本）。Prettier 和 tsc 需要项目中安装对应依赖。
> 当前 Hooks 为 JS/TS 项目配置。Python/Go/Rust 等项目需自行修改 `.claude/settings.json` 中的 matcher 和 command。

## 当前注意事项

<!-- 在这里记录当前工作的上下文信息，帮助新 session 快速恢复 -->
- [ ] [当前正在进行的工作]
- [ ] [已知问题]
- [ ] [临时约定]
