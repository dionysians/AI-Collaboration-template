---
name: story-execution
description: Story 级执行引擎。接收 Plan 的 Story（含 AC），动态拆解 Task，逐 Task TDD 实现，审查后提交。
triggers:
  - /feature Phase 3
  - 手动逐 Story 开发
---

# Story 执行引擎 (Story Execution)

## 概述

Story 级别的执行引擎，负责"怎么做"。接收 Plan 的 Story（含 AC 和 Dev Notes），动态拆解 Task 并逐个 TDD 实现。

**核心原则**：
- AC 是唯一的完成标准（不多做、不漏做）
- Task 是执行时动态拆解的，不是规划阶段预设的
- 每个 Story 完成后可独立交付/审查

## 执行流程

### Step 1：加载 Story

1. 从 Plan 文件读取当前 Story
2. 提取：Story 描述、AC 列表、Dev Notes
3. 确认理解后开始

### Step 2：动态拆解 Task

根据 AC 和当前代码状态，拆解为具体的 Task：

```
输入：
  - Story 的 AC 列表（Given/When/Then）
  - Dev Notes（架构约束、涉及文件、依赖关系）
  - 当前代码库状态（现有文件、模块、接口）

输出：
  - 2-5 分钟粒度的 Task 列表
  - 每个 Task 对应一个或多个 AC
  - Task 有明确的完成标准
```

**拆解原则**：
- 从 AC 反推需要做什么
- 检查现有代码，确定实际需要的改动
- 每个 Task 可独立实现和验证
- 按依赖关系排序

### Step 3：逐 Task TDD 实现

对每个 Task 执行 RED-GREEN-REFACTOR 循环：

1. **RED** — 根据 Task 对应的 AC，写一个最小的失败测试
   - 一个测试只验证一个行为
   - 名字描述行为，不描述实现
   - 运行测试，**确认失败且原因是功能缺失**
   - 测试直接通过？说明测试有误，修改测试

2. **GREEN** — 写最少代码让测试通过
   - 不加额外功能、不重构别的代码
   - 运行测试，确认通过且无回归

3. **REFACTOR** — 在 GREEN 之后整理代码
   - 消除重复、改善命名、提取辅助函数
   - 保持测试全绿，不加新行为

4. **标记 Task 完成**，进入下一个 Task

**关键规则**：
- **没有失败的测试，就不写生产代码**
- 先写了代码再补测试？删掉它，从测试开始重来
- 严格按 Task 顺序执行，当前 Task 未完成不能进入下一个
- 每个 Task 完成后运行全部测试确保无回归
- 3 次实现失败 → 停下来请求指导

### Step 4：Story 级验证

所有 Task 完成后：

1. **AC 逐条验证**
   ```
   AC 1: Given [X] When [Y] Then [Z]
   → 有对应测试？ [YES/NO]
   → 测试通过？   [YES/NO]
   → 手动验证？   [PASS/FAIL/N/A]
   ```

2. **运行相关测试**
   - 本 Story 新增的所有测试
   - 涉及模块的已有测试
   - 全量回归测试

### Step 5：Story 级审查

调用 `code-reviewer` agent 执行两阶段审查：

**阶段 1：规格合规**
- 所有 AC 都满足了吗？
- 有没有漏做的？多做的？
- 有 Spec 时：检查 Domain/Contract/Flow Spec 合规

**阶段 2：代码质量**
- CRITICAL/HIGH/MEDIUM/LOW 分级
- CRITICAL 或 HIGH → 必须修复

**审查不通过** → 修复后重新审查
**发现方向错误** → 触发 `/pivot`

### Step 6：Story 完成

1. Git commit（commit message 包含 Story 标识）
2. 输出 Story 摘要：
   ```
   STORY COMPLETE
   ==============
   Story: [标题]
   AC 满足: X/X
   新增测试: X
   变更文件: X
   覆盖率: X%
   ```
3. 进入下一个 Story

## 多 Story 编排

当 Plan 包含多个 Story 时：

```
Story 1 → Task拆解 → TDD实现 → 验证 → 审查 → commit
  ↓
Story 2 → Task拆解 → TDD实现 → 验证 → 审查 → commit
  ↓
...
  ↓
全部完成 → 最终验证 → PR
```

**每个 Story 独立完成、独立提交**。不要把多个 Story 的改动混在一个 commit 里。

## 中断与恢复

如果执行中断（session 结束、用户暂停）：
- 通过 git log 和代码状态推断当前进度
- 通过 TodoWrite 记录当前 Story 和 Task 进度
- 恢复时从未完成的 Task 继续

## HALT 条件

以下情况立即停止，请求用户指导：
- AC 描述不明确，无法拆解 Task
- 需要超出 Story 范围的依赖变更
- 3 次实现尝试失败
- 发现 Story 之间有未预见的冲突
- 架构层面的根本性问题
