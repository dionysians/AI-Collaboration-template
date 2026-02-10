# 架构设计 (/architecture)

基于 PRD 交互式生成 Spec 四层级体系（Project / Domain / Contract / Flow）。

## 使用方式

```
/architecture
```

## 前置条件

- PRD 已生成（`docs/plans/prd-*.md`）
- 如果没有 PRD，建议先执行 `/clarify` 生成

## 执行流程

### Step 0: 环境初始化

检查 `spec/` 目录是否存在：
- **不存在** → 自动创建 Spec 目录结构（含模板文件）：

```
spec/
├── 0_project/         # Level 1: 顶层规格（世界观）
│   └── _template.md
├── 1_domain/          # Level 2: 领域规格（行为模型）
│   └── _template.md
├── 2_contract/        # Level 3: 契约（API / Event / Data）
│   ├── v1/
│   └── _template.yaml
├── 3_flow/            # Level 4: 流程规格（场景 / 测试）
│   ├── iteration_01/
│   └── _template.md
└── adr/               # 架构决策记录
    └── _template.md
```

- **已存在** → 读取现有 Spec，在此基础上更新

### Step 1: 上下文加载

读取以下信息建立理解：
- PRD 文档（`docs/plans/prd-*.md`）
- 现有代码结构（如有）
- 项目配置文件（package.json / Cargo.toml / pyproject.toml 等）
- 现有 Spec（如有）

向用户确认理解后进入下一步。

### Step 2: Project Spec — 系统边界与模块划分

以架构师角色与用户讨论：
- 系统边界（包含什么 / 不包含什么）
- 模块划分（Bounded Contexts）
- 全局规则与不可变约束
- 全局状态机
- C4 架构图（System Context + Container）

输出 → `spec/0_project/project-spec.md`

**等待用户确认后继续。**

### Step 3: Domain Specs — 领域行为建模

逐模块与用户讨论：
- 领域职责范围
- 状态机定义
- 业务规则（BR-NNN）
- 输入/输出语义
- 约束与不可变真理
- C4 组件图

对每个识别出的 Domain：
输出 → `spec/1_domain/{name}-domain.md`

**每个 Domain 完成后确认，再进入下一个。**

### Step 4: Contract Specs — 契约定义

基于 Domain Spec 定义对外契约：
- API 契约（HTTP / RPC）
- 事件契约（Domain Event / Integration Event）
- 数据 Schema

输出 → `spec/2_contract/v1/{name}.yaml`

**等待用户确认后继续。**

### Step 5: Flow Specs — 关键流程场景

基于 PRD + Domain Spec，定义关键场景：
- 使用 Given / When / Then 格式
- 标注状态变化
- 覆盖失败路径与边界情况

输出 → `spec/3_flow/iteration_01/{name}-flow.md`

**等待用户确认后继续。**

### Step 6: 验证一致性

检查所有 Spec 的一致性：
- 层级间不越权（Flow 不定义规则，Domain 不含 API 字段）
- 不重复定义（规则只在一处定义，其他层引用）
- 引用正确（Flow 引用的 Domain 规则存在）
- 模块边界清晰（不跨域引用）

输出验证报告。

## 核心原则

1. **协作式生成** — 每步与用户交互讨论，不是一键生成
2. **层级不越权** — Project 定义世界观，Domain 定义行为，Contract 定义契约，Flow 定义场景
3. **单一真理源** — 规则只在一处定义，其他层引用
4. **Spec 是行为事实** — 描述系统应当如何表现，不描述实现方式
5. **机器友好** — 结构化、简洁、可被 AI 工具解析

## Spec 更新原则

- Project / Domain: 原地更新，不创建版本
- Contract: Breaking change MUST 创建新版本（v2, v3）
- Flow: 按迭代新增（iteration_02, iteration_03），不覆盖历史
- Domain MUST 维护 Evolution Log
- Project MUST 维护 Evolution Timeline

## 完成后

提示用户下一步：
- 执行 `/plan` 基于 PRD + Spec 创建实现计划
- 或执行 `/decide` 记录关键架构决策
