# 完整功能开发 (/feature)

端到端的功能开发编排，从需求澄清到 PR。支持 Agent Team 并行执行和 Full/Agile 执行强度。

## 使用方式

```
/feature [功能描述]
```

---

## Phase 0: 上下文检查与模式选择

### 0.1 项目状态检查

检测当前项目状态，决定从哪个 Phase 开始：

- **PRD**: `docs/plans/prd-*.md` → [存在/不存在]
- **Spec**: `spec/` 目录 → [有内容/不存在]
- **Plan**: `docs/plans/` 中非 prd/roadmap 文件 → [存在/不存在]
- **Feature Branch**: 是否在 feat/ 分支上

展示检测结果，建议从对应 Phase 开始（已有 PRD → 跳过 Phase 1，已有 Plan → 跳过到 Phase 3）。

### 0.2 执行强度选择

```
选择执行强度:
[F] Full  — 完整流程（每 Story code-review + 完整 verify）
[A] Agile — 快速迭代（只 TDD + 轻量 verify）
```

**推荐规则**:
- 正式功能开发 / 版本发布 / 团队协作 → **Full**
- 快速原型 / 探索迭代 / 个人项目 / 内部工具 → **Agile**

### 0.3 基础设施模式检测

检测环境变量或 settings.json 中 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`:

**可用时**：
```
Agent Team 模式可用。
[T] Team   — 并行执行，Teammates 独立工作（推荐多 Story 场景）
[S] Serial — 串行执行，Sub-agent 逐个调用
```

**不可用时**：自动进入 Serial 模式（降级）。

---

## Agent Team 模式

以 Team Lead (delegate mode) 运行。不直接实现，只做编排。

### Team Phase 1: 需求澄清 → PRD

**如无 PRD**：
- spawn "Clarifier" teammate，prompt 包含：
  - 功能描述
  - 指令：执行 `/clarify` 流程，与用户对话产出 PRD
  - 输出路径：`docs/plans/prd-<feature>.md`
- 用户直接与 Clarifier teammate 交互
- Clarifier 完成后通知 Lead

**如有 PRD** → 跳过。

### Team Phase 1.5: 架构设计 → Spec（可选）

**如无 Spec 且复杂度 ≥ Medium**：
- spawn "Architect" teammate，prompt 包含：
  - PRD 路径
  - 指令：执行 `/architecture` 流程
  - 输出路径：`spec/`
- 用户直接与 Architect teammate 交互
- Architect 完成后通知 Lead

**如有 Spec 或小型项目** → 跳过。

### Team Phase 2: 规划

- spawn "Planner" teammate，prompt 包含：

  - PRD 路径 + Spec 路径（如有）
  - 功能描述
  - 指令：执行 `/plan` Full 模式
  - 输出路径：`docs/plans/YYYY-MM-DD-<feature>.md`
- Planner 自主完成，返回 Plan 摘要给 Lead
- Lead 展示摘要 → **等待用户查看计划文件确认后再继续**

### Team Phase 3: 并行 Story 执行

1. **读取 Plan** → 提取 Story 列表、依赖关系、涉及文件（Dev Notes）
2. **分析并行批次**：
   - 提取每个 Story 的依赖（`depends_on` 字段）和涉及文件
   - 无依赖 + 无文件冲突 → 归为同一批并行
   - 有依赖 → 等待前序 Story 完成
   - 文件冲突（两个 Story 涉及同一文件）→ 强制串行
3. **执行每个批次**：
   - spawn N 个 "Developer" teammates（每个 Story 一个），prompt 包含：
     - Plan 文件路径、Story 标识
     - `reviewMode`: full / agile（来自 0.2 选择）
     - `ownedFiles`: 该 Story 允许修改的文件列表
   - **[Full 模式]** 同时 spawn 1 个 "Reviewer" teammate：
     - 监听 Developer 完成通知
     - 对每个完成的 Story 执行两阶段代码审查
     - 审查不通过 → 直接发消息给对应 Developer 修复
   - **[Agile 模式]** 不 spawn Reviewer，Developer 完成即 commit
   - 等待批次内全部 Developer（和 Reviewer）完成
4. 进入下一批次，直到所有 Story 完成

### Team Phase 4: 验证 + 交付

- spawn "Verifier" teammate，prompt 包含：
  - **[Full]** `mode: default`（8 阶段完整验证）
  - **[Agile]** `mode: lite`（Build + Types + Lint + Unit Tests）
- Verifier 返回验证报告
- **验证通过** → 创建 PR → 清理 Team
- **验证失败** → 展示失败项，讨论修复方案

---

## 降级模式（Serial）

无 Agent Team 时的串行 Sub-agent 管道。

### Serial Phase 1: 需求澄清 → PRD

**如无 PRD**：
- 直接在主上下文执行 `/clarify`（交互式，与用户对话）
- 输出 PRD 到 `docs/plans/prd-<feature>.md`

**如有 PRD** → 跳过。

### Serial Phase 1.5: 架构设计 → Spec（可选）

**如无 Spec 且复杂度 ≥ Medium**：
- 直接在主上下文执行 `/architecture`（交互式）
- 输出 Spec 到 `spec/`

**如有 Spec 或小型项目** → 跳过。

### Serial Phase 2: 规划

- 执行 `/plan`（薄 Command → planner sub-agent）
- 展示 Plan 摘要 → **等待用户确认**

### Serial Phase 3: 逐 Story 串行执行

对 Plan 中每个 Story，按顺序：

1. 调用 `developer` sub-agent，传入：
   - `planFile`: Plan 文件路径
   - `storyId`: Story 标识
   - `reviewMode`: full / agile
2. Developer sub-agent 在隔离上下文完成 TDD 实现
   - **[Full]** developer 内部调用 `code-reviewer` sub-agent 审查
   - **[Agile]** 跳过审查，直接 commit
3. 展示 Story 完成摘要，进入下一个 Story

### Serial Phase 4: 验证 + 交付

- 调用 `verifier` sub-agent：
  - **[Full]** 默认模式（8 阶段）
  - **[Agile]** `--lite` 模式（4 项快速检查）
- **验证通过** → 创建 PR
- **验证失败** → 展示失败项，讨论修复

---

## 全流程交互

- 每个 Phase 开始前会提示当前阶段和模式（Full/Agile × Team/Serial）
- 用户可以跳过已完成的阶段
- 用户可以随时暂停（进度通过 git commit 和 Plan frontmatter 恢复）
- 发现方向错误可执行 `/pivot`

## Full vs Agile 对比

| 阶段 | Full 模式 | Agile 模式 |
|------|----------|-----------|
| Phase 1-2 | 相同 | 相同 |
| Phase 3 每个 Story | TDD → AC 验证 → **code-review** → commit | TDD → AC 验证 → commit |
| Phase 4 最终验证 | 8 阶段完整验证 | Build + Types + Lint + Unit Tests |

## 前置条件

- 建议先创建功能分支：`git checkout -b feat/<name>`
