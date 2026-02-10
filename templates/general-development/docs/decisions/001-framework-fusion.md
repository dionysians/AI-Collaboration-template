# 设计决策 001: 框架融合方案

> 日期: 2026-01-26
> 状态: 已采纳
> 参与者: 用户, Claude

## 背景

在分析了两个主流 AI 编程框架后，我们需要决定模板的核心架构：

- **BMAD-METHOD** (31K+ stars): 结构化的敏捷开发框架
- **Superpowers** (36K+ stars): 技能驱动的开发工作流

## 决策

**采用 BMAD 的项目结构 + Superpowers 的执行机制**

```
BMAD 结构           +    Superpowers 执行
─────────────────        ──────────────────
Epic
  └── Story
        └── Task    →    Subagent 执行
                         TDD 强制
                         两阶段审查
```

## 理由

### 为什么用 BMAD 的结构

Epic → Story → Task 三级结构更适合实际项目：

| 层级 | 作用 | 对应实际项目 |
|------|------|-------------|
| **Epic** | 大功能模块 | 一个完整的业务能力（如"用户认证系统"） |
| **Story** | 用户价值单元 | 一个可交付的功能点（如"用户登录"） |
| **Task** | 实现步骤 | 具体的开发任务（如"编写登录 API"） |

**Superpowers 的问题**：
- 直接从设计跳到 Task 级别
- 没有中间的 Story 层来组织相关任务
- 对于稍大的项目，Task 列表会变得很长且缺乏结构

**BMAD 的优势**：
- Sprint 可以包含多个 Story
- 每个 Story 有独立的验收标准
- Story 完成后可以独立交付/审查
- 更容易追踪进度和管理范围

### 为什么用 Superpowers 的执行机制

#### 1. Subagent 隔离解决了上下文污染问题

**BMAD 的问题**：
- 单 Agent 持续执行整个 Story
- 上下文越来越长，容易遗忘或混淆
- 后期任务质量可能下降

**Superpowers 的方案**：
- 每个 Task 派发新 Subagent
- 上下文干净，只包含当前任务需要的信息
- 任务质量一致

#### 2. 两阶段审查更严格

| 审查 | 问题 | 时机 |
|------|------|------|
| **规格审查** | 做的对不对？有没有漏？有没有多做？ | 实现后立即 |
| **质量审查** | 做的好不好？代码质量如何？ | 规格通过后 |

BMAD 只有最后的 Definition of Done 检查，问题发现得太晚。

#### 3. TDD 强制 vs TDD 建议

**Superpowers**：
- 必须先写失败测试
- 必须看到测试失败
- 才能写实现

**BMAD**：
- 说要 red-green-refactor
- 但没有强制机制
- 容易偷懒跳过

## 对比总结

### 总体架构对比

| 维度 | Superpowers | BMAD-METHOD | 我们的选择 |
|------|-------------|-------------|-----------|
| **项目结构** | 扁平 (Design → Task) | 层级 (Epic → Story → Task) | BMAD ✓ |
| **触发方式** | 自动触发 | 显式调用 | 混合 |
| **执行模型** | Subagent 隔离 | 单 Agent 持续 | Superpowers ✓ |
| **TDD 执行** | 强制 | 建议 | Superpowers ✓ |
| **审查机制** | 两阶段 | 单次 DoD | Superpowers ✓ |
| **状态追踪** | TodoWrite + Git | Sprint Status | BMAD ✓ |

### 从各框架借鉴的具体内容

**从 BMAD-METHOD 借鉴**：
- Epic → Story → Task 三级结构
- Story 验收标准 (Acceptance Criteria)
- Sprint Status 追踪机制
- Definition of Done 检查表
- Agent 角色化设计（可选）

**从 Superpowers 借鉴**：
- Subagent 驱动执行（每 Task 新上下文）
- TDD 强制执行（RED-GREEN-REFACTOR）
- 两阶段审查（规格合规 + 代码质量）
- 任务粒度控制（2-5 分钟/Task）
- Skill 自动触发机制

## 影响

1. 需要设计新的 Story 文件格式，融合两个框架的优点
2. 需要实现 Subagent 执行的 Skill
3. 需要实现两阶段审查的 Skill
4. 需要设计 Sprint Status 追踪机制

## 参考资料

- [Superpowers GitHub](https://github.com/obra/superpowers)
- [BMAD-METHOD GitHub](https://github.com/bmad-code-org/BMAD-METHOD)
- [workspace/frameworks/superpowers/analysis.md](../../../workspace/frameworks/superpowers/analysis.md)
- [workspace/frameworks/bmad-method/analysis.md](../../../workspace/frameworks/bmad-method/analysis.md)
