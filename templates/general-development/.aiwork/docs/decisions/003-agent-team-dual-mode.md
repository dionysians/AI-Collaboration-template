# 设计决策 003: Agent Team 双模式架构 + Full/Agile 执行强度

> 日期: 2026-02-13
> 状态: 已采纳
> 前置: 002-thin-command-fat-agent
> 参与者: 用户, Claude
> 触发: Claude Code Agent Teams 实验性功能发布 + /feature 流程执行强度过重

## 背景

### 问题 1: 串行执行限制

Decision 002 建立了「薄 Command + 胖 Agent」模式，但 `/feature` 流程仍然是严格串行的。多个独立 Story 本可以并行执行，却因架构限制必须逐个排队。

### 问题 2: Skill 在主上下文执行

Decision 002 只关注了 Command 层的胖瘦（clarify 739 行、architecture 352 行），忽略了 Skill 的问题：
- `story-execution` (155 行) 在主上下文执行 TDD 循环，运行时产生大量上下文（多 Story × 多 Task × 每轮 TDD 的工具调用和输出）
- `verification-loop` (202 行) 在主上下文执行 8 阶段检查

Skill 在主上下文执行跟胖 Command 本质上是同一个问题：**上下文污染**。

### 问题 3: 执行强度缺乏分级

每个 Story 都必须经过 code-review + verification，对于快速原型或探索迭代来说过于沉重。TDD 已经提供了单元级质量保障，很多场景下中间步骤可以简化。

### 新能力: Claude Code Agent Teams

Claude Code 推出了实验性 Agent Teams 功能：多个 Claude Code session 作为 Teammates 协作，支持并行执行、直接通信和共享任务列表。Decision 002 的「薄 Command + 胖 Agent」本质上就是 Agent Team 的单 session 实践。

## 决策

### 决策 1: 基础设施双模式

**Agent Team 模式** + **降级 Sub-agent 模式**，两者正交于执行强度。

```
Agent Team 模式 (CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1):
  /feature 作为 Team Lead (delegate mode)
  spawn Specialized Teammates → 并行执行 + 直接通信

降级模式 (无 Agent Team):
  /feature 串行编排
  调用 Sub-agents → 隔离上下文 + 返回结果
```

**关键原则：主上下文中不执行任何重型工作**。不论哪种模式，所有实质性工作都在隔离上下文完成。

### 决策 2: 执行强度双模式

| 阶段 | Full 模式 | Agile 模式 |
|------|----------|-----------|
| Phase 1-2 | 相同 | 相同 |
| Phase 3 每个 Story | TDD → AC 验证 → **code-review** → commit | TDD → AC 验证 → commit |
| Phase 4 最终验证 | 8 阶段完整验证 | Build + Types + Lint + Unit Tests |

Agile 模式的哲学：**TDD 已保证单元级质量，只需编译级兜底**。

### 决策 3: 交互式 Command 不拆 Sub-agent

| 组件 | 性质 | 能否隔离为 Sub-agent |
|------|------|---------------------|
| clarify | 苏格拉底式对话 | ❌ Sub-agent 无法与用户交互 |
| architecture | 技术决策逐项确认 | ❌ 同理 |
| plan | 自主分析 | ✅ 已有 planner sub-agent |
| story-execution | 自主 TDD | ✅ → developer sub-agent |
| review | 自主审查 | ✅ 已有 code-reviewer sub-agent |
| verify | 自主验证 | ✅ → verifier sub-agent |

**分类原则**：能否脱离用户独立完成？YES → 隔离执行。NO → 留在主上下文。

在 Agent Team 模式下，clarify 和 architecture 作为 Teammates 运行，用户直接与其交互（Teammates 是完整 session，支持对话）。在降级模式下保持胖 Command 不变。

## 影响

### 组件变化

| 类别 | 变更前 | 变更后 |
|------|--------|--------|
| Agents | 2 (planner, code-reviewer) | **4** (+developer, +verifier) |
| Skills (实质) | 3 (story-execution, verification-loop, systematic-debugging) | **1** (systematic-debugging) |
| Skills (redirect) | 0 | 2 (story-execution, verification-loop → 指向 agent) |
| Commands | 12 (不变) | 12 (feature.md 重写, verify.md 更新) |

### Verifier 三模式

| 模式 | 阶段 | 用途 |
|------|------|------|
| `--lite` | Build + Types + Lint + Unit Tests | Agile 最终验证 |
| 默认 | 8 阶段完整验证 | Full 最终验证 |
| `--full` | 8 阶段 + 扩展 | 发布前深度验证 |

### Skill 重新定位

Skill 不再承担重型执行工作。新定位：
- **Agent**: 隔离执行重型工作（TDD、验证、规划、审查）
- **Skill**: 轻量级主上下文行为模式（如 systematic-debugging — 反应式，需感知主上下文失败模式）

### File Ownership 并行策略

Planner 在 Story 的 Dev Notes 中标注涉及文件。Lead 分析后：
- 无依赖 + 无文件冲突 → 同批并行
- 有依赖或文件冲突 → 强制串行
- Developer agent 接收 `ownedFiles` 参数，不修改范围外文件

## 与 Decision 002 的关系

本决策是 002 的**自然升级**，而非替代：

| 维度 | Decision 002 | Decision 003 |
|------|-------------|-------------|
| 薄编排 + 胖执行 | ✅ 确立 | ✅ 保留并扩展 |
| 文档作为状态 | ✅ 确立 | ✅ 保留 |
| Skill 的问题 | ❌ 未识别 | ✅ 解决（→ Agent） |
| 并行执行 | ❌ 串行 | ✅ Agent Team |
| 执行强度 | ❌ 单一 | ✅ Full/Agile |

## 参考

- [Claude Code Agent Teams 文档](https://code.claude.com/docs/en/agent-teams)
- Decision 002: 薄 Command + 胖 Agent 架构
- Decision 001: 框架融合设计
