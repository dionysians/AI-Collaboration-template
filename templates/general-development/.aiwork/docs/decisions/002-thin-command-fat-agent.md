# 设计决策 002: 薄 Command + 胖 Agent 架构

> 日期: 2026-02-13
> 状态: 已采纳
> 参与者: 用户, Claude
> 触发: /plan 增强过程中发现上下文爆炸问题

## 背景

在增强 `/plan` 命令（BMAD 4 阶段规划流程）时，发现一个架构问题：

- 增强后的 plan.md 约 500 行，调用 planner agent 约 160 行
- 两者上下文同时加载到主流程，大量规则重复
- `/feature` 全流程会依次加载 `/clarify`(739 行) + `/plan`(500 行) + story-execution(155 行) + ...，主流程上下文不断膨胀

核心矛盾：**主流程应该做编排，不应该做具体工作。具体工作的上下文不应该污染主流程。**

## 决策

**薄 Command 编排 + 胖 Agent/Skill 执行 + 文档作为状态媒介**

```
Command (薄编排层)           Agent/Skill (胖执行层)
─────────────────           ─────────────────────
上下文检查                    从文档读取输入
模式判断                      执行具体工作
调用 Agent/Skill              写入文档输出
展示摘要给用户                 返回摘要给 Command
等待用户确认

        ↕ 文档（状态媒介）↕
  PRD / Plan / Spec / Code
```

### 三层职责

| 层 | 职责 | 上下文生命周期 | 示例 |
|----|------|--------------|------|
| **Command（薄）** | 流程编排、上下文检查、用户交互 | 常驻主流程（尽量小） | plan.md (120 行) |
| **Agent/Skill（胖）** | 具体工作执行 | 独立上下文，用完即弃 | planner.md (630 行) |
| **文档（状态媒介）** | 阶段间状态传递、会话恢复 | 持久化到文件系统 | docs/plans/*.md |

### 关键原则

1. **Command 不做具体工作** — 只做：检测上下文 → 判断模式 → 调用执行层 → 展示结果 → 等待确认
2. **执行层从文档读取输入** — 不依赖主流程上下文，每次独立读取 PRD/Spec/Plan 等文档
3. **执行层将结果写入文档** — 输出持久化为文件，支持中断恢复和跨 session 协作
4. **文档带 frontmatter 状态** — 记录进度（phasesCompleted）、元数据（inputDocuments）、验证结果（validation）

## 理由

### 为什么不把所有内容放在 Command 中

以 `/plan` 增强为例，如果把 BMAD 4 阶段逻辑（~500 行）放在 command 中：

- `/feature` 执行到 Phase 2 时，主流程已累积：feature.md(67) + clarify 对话 + plan.md(500) = 大量上下文
- 继续到 Phase 3（story-execution），上下文继续膨胀
- 上下文越大 → 模型注意力越分散 → 质量越差 → 成本越高

### 为什么 Agent 更适合做具体工作

| 维度 | Command（主流程） | Agent（子进程） |
|------|-----------------|----------------|
| 上下文 | 累积不释放 | 独立窗口，用完即弃 |
| 模型 | 用户选择的模型 | 可强制 opus |
| 工具 | 全部工具 | 可限制（只读等） |
| 交互 | 可与用户对话 | 自主执行，返回结果 |
| 适合 | 编排、判断、交互 | 重分析、大文档处理 |

### 文档作为状态媒介的优势

- **中断恢复**：frontmatter 记录 phasesCompleted，下次 Resume 从中断处继续
- **跨 session**：关闭对话后重新打开，文档仍在
- **可审查**：用户直接打开文件查看全部计划，不需要翻对话历史
- **可编辑**：用户可以手动修改计划文件，Agent 下次读取时自动采纳

## /feature 全流程现状审计

| Phase | Command | 行数 | 当前模式 | 执行层 | 行数 | 状态媒介 |
|-------|---------|------|---------|--------|------|---------|
| 编排 | feature.md | 67 | **薄编排** ✅ | - | - | - |
| Phase 1 | clarify.md | 739 | **胖 Command** ❌ | 无 Agent | - | PRD 文件 (有 frontmatter) |
| Phase 1.5 | architecture.md | 351 | **胖 Command** ❌ | 无 Agent | - | Spec 文件 + .arch-progress.md |
| Phase 2 | plan.md | 120 | **薄编排** ✅ | planner agent | 630 | Plan 文件 (有 frontmatter) |
| Phase 3 | (story-execution) | - | skill 直接执行 | story-execution | 155 | Git commits + TodoWrite |
| Phase 3 内 | review.md | 46 | **薄编排** ✅ | code-reviewer agent | 126 | Git diff → 审查报告 |
| Phase 4 | verify.md | 54 | **薄编排** ✅ | verification-loop | 202 | 验证报告 |

### 已符合模式 ✅

- **plan.md + planner agent** — 刚完成重构，薄 Command + 胖 Agent
- **review.md + code-reviewer agent** — 天然薄 Command，Agent 做审查
- **verify.md + verification-loop skill** — 天然薄 Command，Skill 做验证
- **feature.md** — 纯编排器

### 需要重构 ❌

- **clarify.md（739 行）** — 全部逻辑在 Command 中，无 Agent。应拆为薄 Command + clarify agent
- **architecture.md（351 行）** — 全部逻辑在 Command 中，无 Agent。应拆为薄 Command + architect agent

### 可优化 ⚠️

- **story-execution（155 行）** — 作为 Skill 直接在主流程执行。行数不大，暂可接受。但如果后续增强到 300+ 行，应考虑拆为薄 Skill + executor agent
- **code-reviewer（126 行）** — Agent 行数适中，暂可接受

## TODO — 按此模式重构

> **注**: 以下项目由 [Decision 003](003-agent-team-dual-mode.md) 统一处理。

### 高优先级

- [x] **clarify / architecture** — Decision 003 决定：交互式 Command 不拆 sub-agent（sub-agent 无法对话）。Agent Team 模式下作为 Teammate 运行实现上下文隔离。降级模式下保持胖 Command。
- [x] **story-execution → developer agent** — 由 Decision 003 实现。Skill 转为 redirect stub，实际工作由 developer sub-agent 在隔离上下文执行。
- [x] **verification-loop → verifier agent** — 由 Decision 003 实现。同上。

### 低优先级

- [x] **feature.md 升级** — 由 Decision 003 重写为双模式编排器（Agent Team/Serial × Full/Agile）。

## 影响

1. 新增 2 个 Agent: clarify agent、architect agent（agents 从 2 → 4）
2. clarify.md 和 architecture.md 大幅瘦身（739→~80, 351→~80）
3. 主流程上下文占用显著降低
4. 所有 /feature 阶段统一为"薄 Command + 胖执行层 + 文档状态"模式

## 参考

- `/plan` 增强实践（Phase 11，本决策的触发点）
- BMAD-METHOD 的 micro-file step 架构（启发了阶段分离思想）
- 001-framework-fusion.md 中的 Subagent 隔离设计
