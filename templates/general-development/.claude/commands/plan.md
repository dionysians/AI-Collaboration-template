# 规划 (/plan)

调用 planner agent 创建实现计划。自动判断 Quick/Full 模式。

## 使用方式

```
/plan [功能描述或需求]
```

## Phase 0: 上下文检查

### 0.1 检测现有计划文件

检查 `docs/plans/` 目录（排除 `prd-*` 和 `roadmap*`）：

**如果找到匹配的计划文件**：
1. 读取 frontmatter 获取 `status` 和 `phasesCompleted`
2. `status: complete` → 询问用户是否要基于此计划更新
3. `status: in-progress` → 进入 Resume 模式

**Resume 模式**：

```
找到未完成的计划: [文件名]
已完成阶段: [phasesCompleted]

[R] Resume — 从中断阶段继续（传入计划文件路径，agent 自动读取前序产出）
[S] Start Fresh — 备份旧计划，从头开始
[V] View — 查看当前计划内容后再决定
```

**如果没有计划文件** → 新建，进入 0.2。

### 0.2 输入可用性检查

检查可用输入并展示摘要：

- **PRD**: `docs/plans/prd-*.md` → [找到/未找到]
- **Spec**: `spec/` 目录 → [有内容/空/不存在]
- **Roadmap**: `docs/roadmap.md` → [找到/未找到]
- **代码库**: 技术栈、测试基础设施状态

未找到 PRD 时，建议先执行 `/clarify`（但不强制）。

### 0.3 Quick/Full 模式判断

**Quick 模式**（全部满足）：
- 小任务 / bug fix / 明确范围
- 单一模块改动
- 无新实体或架构变更
- 预计 ≤ 3 个 Story

**Full 模式**（满足任一）：
- 新功能开发
- 多模块协作
- 需求不够明确
- 架构变更
- PRD 存在
- 预计 > 3 个 Story

**如果不确定，默认 Full 模式。**

向用户展示判断结果和理由，用户可覆盖。

---

## 执行

### Quick 模式

调用 planner agent（`phase: quick`）。

Agent 直接返回分析结果（不写文件），展示给用户，等待确认。

### Full 模式

确定计划文件路径：`docs/plans/YYYY-MM-DD-<feature>.md`

调用 planner agent（`phase: full`），传入：
- 计划文件路径
- 用户需求描述
- Resume 时：传入中断的阶段信息

Agent 自主完成全部 4 个阶段（需求提取 → Epic 设计 → Story 生成 → 验证），结果写入计划文件。

Agent 返回后，展示摘要：

```
计划已生成: docs/plans/YYYY-MM-DD-<feature>.md

摘要:
- Epic: N 个
- Story: N 个（含 Story 0: [是/否]）
- AC 总数: N 个
- FR 覆盖: 100%
- 验证: [PASS / NEEDS WORK]

请查看计划文件确认。此计划不会自动执行。
```

**验证有 FAIL 项**：提示用户查看计划文件中的验证报告，讨论修复方案后可再次调用 agent。

---

## 等待用户确认 — 不自行执行

用户确认后可以：
- `/feature` — 进入完整开发流程（自动逐 Story 执行）
- 手动逐 Story 开发

## 前置条件

建议先执行 `/clarify` 生成 PRD，尤其是：
- 需求描述不够具体时
- 有多种可能的实现方向时
- 涉及多个利益相关者时

中大型项目建议在 `/clarify` 之后执行 `/architecture` 生成 Spec。
