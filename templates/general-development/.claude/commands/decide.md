# 架构决策记录 (/decide)

记录重要的技术决策为 ADR（Architecture Decision Record）。ADR 存在于 Spec 体系内。

## 使用方式

```
/decide [决策主题]
```

## 前置条件

- `spec/adr/` 目录必须存在
- 如果不存在 → 提醒用户先执行 `/architecture` 初始化 Spec 体系

## 使用场景

不是所有决策都需要 ADR。记录以下决策：
- 影响多个模块或团队的
- 难以撤销的
- 有多个合理选项的
- 未来可能被质疑的

例如：
- 技术选型（框架、库、工具）
- 架构模式选择（单体 vs 微服务、REST vs GraphQL）
- 重大设计变更
- API 版本升级决策

## 执行流程

### Step 1: 收集决策上下文

以架构师角色，**逐项**向用户提问（一次一个问题，偏好提供选项）：

1. **标题** — 这个决策的简短描述是什么？（例如："使用 PostgreSQL 作为订单服务数据库"）
2. **状态** — Proposed / Accepted / Deprecated / Superseded？
3. **背景** — 为什么需要做这个决策？当前的问题或需求是什么？
4. **决策** — 选择了什么方案？
5. **替代方案** — 考虑了哪些其他选项？为什么被否决？
6. **后果** — 这个决策的正面和负面影响是什么？

### Step 2: 生成 ADR 文件

基于收集的信息创建 ADR：

1. **自动编号**: 扫描 `spec/adr/` 下的现有文件，取最大编号 +1
2. **文件名**: `spec/adr/NNNN-{title}.md`（标题小写、连字符分隔）
3. **模板**: 使用 `.aiwork/templates/spec/adr/_template.md`

向用户展示生成的 ADR 内容，确认后写入文件。
用户确认后将状态标记为 Accepted。

### Step 3: 关联提醒

如果此决策改变了系统行为或边界，提醒用户更新对应 Spec：

- **改变系统边界/模块划分** → 更新 Project Spec（`spec/0_project/`）
- **改变领域行为/规则** → 更新 Domain Spec（`spec/1_domain/`）
- **改变 API 契约** → 更新/新增 Contract Spec（`spec/2_contract/`）
- **新增行为场景** → 新增 Flow Spec（`spec/3_flow/`）
- **影响实现计划** → 更新 Plan（`docs/plans/`）

也可以直接执行 `/architecture` 来更新 Spec 体系。

## ADR 与 Spec 的关系

- **ADR = 决策原因**（Why）— 为什么做这个选择
- **Spec = 决策结果**（What）— 具体的规则是什么

两者相互补充但不重叠。ADR 记录决策过程，Spec 记录决策产出的规则。
