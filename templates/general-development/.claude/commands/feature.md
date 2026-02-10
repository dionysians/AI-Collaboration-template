# 完整功能开发 (/feature)

端到端的功能开发编排，从需求澄清到 PR。

## 使用方式

```
/feature [功能描述]
```

## 执行流程

```
Phase 1:   需求    → /clarify → PRD（可跳过）
Phase 1.5: 架构    → /architecture → Spec 体系（可选，中大型项目）
Phase 2:   规划    → /plan (Full 模式，Spec 感知)
Phase 3:   执行    → 逐 Story 开发
Phase 4:   交付    → PR
```

### Phase 1: 需求澄清 → PRD

- 执行 `/clarify` 流程，输出 PRD 到 `docs/plans/prd-<feature>.md`
- 如果需求已经很明确，可以跳过
- 评估复杂度，如果是中大型项目 → 建议 Phase 1.5

### Phase 1.5: 架构设计 → Spec（可选）

- 适用于中大型项目或复杂功能
- 执行 `/architecture` 生成/更新 Spec 四层级体系
- 如果项目已有 Spec，此步骤可跳过
- 用户可以选择跳过

### Phase 2: 规划

- 调用 planner agent（Full 模式）
- 自动读取 PRD + Spec（如有），以 Spec 为唯一真理源
- 输出 Epic → Story(AC) 结构
- 写入 `docs/plans/YYYY-MM-DD-<feature>.md`
- **等待用户确认后再继续**

### Phase 3: 逐 Story 执行

- 触发 `story-execution` skill
- 对每个 Story：
  1. 动态拆解 Task（基于 AC 和代码状态）
  2. 逐 Task TDD 实现（RED → GREEN → REFACTOR）
  3. Story 级验证（AC 逐条核对）
  4. Story 级审查（规格合规 + 代码质量，Spec-aware）
  5. Git commit（每个 Story 独立提交）

### Phase 4: 交付

- 全部 Story 完成后
- 执行 `/verify` 最终验证
- 创建 PR

## 每个阶段可交互

- 每个 Phase 开始前会提示当前阶段
- 用户可以跳过已完成的阶段
- 用户可以随时暂停（进度通过 git 和 todo 恢复）
- 发现方向错误可执行 `/pivot`

## 前置条件

- 建议先创建功能分支：`git checkout -b feat/<name>`
