# 规划 (/plan)

调用 planner agent 创建实现计划。自动判断 Quick/Full 模式。

## 使用方式

```
/plan [功能描述或需求]
```

## 执行流程

### 1. 输入加载

优先查找已有的规划产物：

- **PRD**: 检查 `docs/plans/prd-*.md`，如找到则作为规划输入
- **Spec**: 检查 `spec/` 目录是否存在且有内容

### 2. 调用 planner agent（只读，opus 模型）

### 3. 自动判断模式

- **Quick**：小任务、明确范围、单模块 → 直接输出实现要点
- **Full**：新功能、多模块、需求不明确 → Epic → Story(AC) 结构

### 4. 输出计划

- Quick → 直接在对话中展示
- Full → 写入 `docs/plans/YYYY-MM-DD-<feature>.md`

### 5. 等待用户确认 — 不自行执行

## Spec 感知规划

当 `spec/` 目录存在且有内容时，planner MUST：

- **引用 Project Spec** 的模块边界 — 不跨域规划
- **引用 Domain Spec** 的行为规则 — Story AC 必须与 Domain 规则一致
- **引用 Contract Spec** 的 API 契约 — 涉及接口的 Story 必须遵守契约
- **遵循 Flow Spec** 的已有场景 — 不与已定义的流程矛盾
- **不自行发明规则** — 如果需要新规则，在计划中标注"需先更新 Spec"

当 `spec/` 不存在时，按正常模式规划（当前行为不变）。

## 重要规则

- 规划止于 Story 层级（含 AC），不包含 Task
- Task 在执行阶段由 story-execution skill 动态拆解
- 每个 Story 必须有 Given/When/Then 验收标准
- 每个 Story 必须有 Dev Notes（涉及文件、架构约束、依赖）
- Epic 按用户价值组织，不按技术层
- **Story 0**：如果项目缺少测试框架/脚本/Lint 配置，第一个 Story 必须是搭建工程基础设施（测试框架、脚本入口、覆盖率工具）

## 前置条件

建议先执行 `/clarify` 生成 PRD，尤其是：
- 需求描述不够具体时
- 有多种可能的实现方向时
- 涉及多个利益相关者时

中大型项目建议在 `/clarify` 之后执行 `/architecture` 生成 Spec。

## 确认后

用户确认计划后，可以执行：
- `/feature` — 进入完整开发流程（自动逐 Story 执行）
- 手动逐 Story 开发
