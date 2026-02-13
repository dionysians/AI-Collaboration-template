# 架构设计 (/architecture)

基于 PRD 交互式生成 Spec 四层级体系（Project / Domain / Contract / Flow），含技术决策、实现约定和架构验证。

## 使用方式

```
/architecture
```

## 前置条件

- PRD 已生成（`docs/plans/prd-*.md`）— 推荐但非强制
- 如果没有 PRD，建议先执行 `/clarify` 生成

## 执行流程

### Step 0: 环境与模式检测

**检查恢复**: 查看 `spec/.arch-progress.md` 是否存在：
- **存在且有未完成步骤** → 展示进度摘要，询问用户：从 Step N 恢复 / 从某步重新开始 / 全部重来
- **不存在** → 进入模式检测

**检测模式**:
- `spec/` 不存在 → **Create 模式**（全新项目）
- `spec/` 已有内容 → **Update 模式**（现有项目）

**Create 模式**:
- 自动创建 Spec 目录结构：

```
spec/
├── 0_project/         # Level 1: 顶层规格（世界观）
├── 1_domain/          # Level 2: 领域规格（行为模型）
├── 2_contract/        # Level 3: 契约（API / Event / Data）
│   └── v1/
├── 3_flow/            # Level 4: 流程规格（场景 / 测试）
│   └── iteration_01/
└── adr/               # 架构决策记录
```

- 读取 `.aiwork/templates/spec/` 模板作为格式参考
- 创建 `spec/.arch-progress.md` 记录进度

**Update 模式**:
- 读取现有 Spec，汇总当前状态
- 询问用户本次更新的动机（新需求 / 技术变更 / 补充缺失 Spec / 重构）
- 创建 `spec/.arch-progress.md` 记录进度

**加载 PRD**（如有）：读取 `docs/plans/prd-*.md`。如无 PRD，提示建议但允许继续。

**向用户确认模式后进入下一步。**

---

### Step 1: 深度上下文分析

全面分析项目上下文，在动笔写 Spec 之前建立共同理解。

**1a. 需求分析**（来源：PRD + 用户对话）:
- **功能需求 (FR)**: 按功能领域枚举核心能力
- **非功能需求 (NFR)**: 性能目标、可扩展性、安全/合规、可用性、UX 响应性
- **技术约束**: 已锁定的平台/语言、必须保留的集成、部署目标
- **UX 需求**: 实时交互（WebSocket/SSE）、离线支持、多端适配、无障碍

**1b. 复杂度评估**:

| 维度 | Small | Medium | Large |
|------|-------|--------|-------|
| 模块数 (Bounded Contexts) | 1-2 | 3-5 | 6+ |
| 外部依赖 (第三方 API/服务) | 0-1 | 2-4 | 5+ |
| 状态管理 | 简单 CRUD | 有状态机 | 多步工作流/Saga |
| API 端点 | 0-3 | 4-10 | 10+ |
| 数据模型 | 1-5 实体 | 6-15 实体 | 15+ 实体 |

根据评估推荐 Small / Medium / Large 级别，决定后续哪些步骤为必需/可选。

**1c. 现有代码分析**（Update 模式）:
- 当前目录结构和已有架构模式
- 已使用的技术栈（读取 package.json / Cargo.toml / pyproject.toml / go.mod 等）
- 测试基础设施状态
- 依赖及版本

**1d. 风险与不确定性**:
- 高不确定性领域（可能需要 `/spike` 先行探索）
- 已知技术风险
- 需要调研后才能决策的领域

**向用户展示完整分析，确认准确性和复杂度级别后继续。**

---

### Step 2: 技术决策

在定义架构之前，系统性地确定技术选型。避免 AI agent 在实现阶段临时做出不一致的技术决定。

- **Create 模式**: 完整走一遍决策流程
- **Update 模式**: 总结现有技术栈，仅讨论需要变更的部分

**按类别逐项决策**（仅涉及与项目相关的类别）:

| 类别 | 示例选项 | 何时需要 |
|------|---------|---------|
| 语言 & 运行时 | TypeScript/Python/Go/Rust | 始终 |
| 框架 | Express/FastAPI/Gin/Next.js | 需要服务端或 UI |
| 数据存储 | PostgreSQL/MongoDB/SQLite/Redis | 需要持久化 |
| 认证 | Auth0/Supabase Auth/自建 JWT | 需要认证 |
| API 风格 | REST/GraphQL/gRPC/tRPC | 构建 API |
| 前端 | React/Vue/Svelte/HTMX | 构建 UI |
| 状态管理 | Zustand/Redux/Pinia | 复杂客户端状态 |
| 测试 | Vitest/Jest/Pytest/cargo test | 始终 |
| 基础设施 | Vercel/AWS/Docker/fly.io | 需要部署 |
| CI/CD | GitHub Actions/GitLab CI | 需要自动化 |

**每个类别的讨论方式**:
1. 展示当前状态（已有项目）或需求推导（新项目）
2. 提供 2-3 个选项及简要对比（优劣势、与 NFR 的适配度）
3. 用户确认选择
4. **重大决策**（难以撤销、影响多模块、有多个合理替代方案）→ 标记需生成 ADR

**生成 ADR**: 对标记为重大的决策，使用 `.aiwork/templates/spec/adr/_template.md` 格式，写入 `spec/adr/NNNN-{title}.md`。简单/显然的选择不需要 ADR。

**产出**: 技术栈汇总表（用于 Step 3 写入 Project Spec）+ ADR 文件（0~N 个）

**等待用户确认完整技术栈后继续。**

---

### Step 3: Project Spec — 系统架构

以架构师角色与用户讨论并生成 Project Spec。在原有内容基础上，新增技术栈、项目结构、实现约定三个 section。

**讨论内容** — 按 section 顺序：

1. **Overview** — 系统目标、作用域、核心概念
2. **System Boundary** — 包含什么 / 不包含什么
3. **Bounded Contexts** — 模块划分及职责
4. **Technology Stack** ★ — Step 2 的技术栈汇总表，关联 ADR
5. **Architecture Diagrams (C4)** — System Context + Container 图
6. **Domain Model** — 高层领域对象及关系
7. **Project Structure** ★ — 基于技术栈和 Bounded Contexts 的具体目录树 + 结构规则
8. **Implementation Patterns** ★ — 命名约定、结构约定、通信约定、反模式
9. **Global Rules & Invariants** — 系统全局不可变规则
10. **Global State Machine** — 核心状态流
11. **Evolution Timeline** — 演化事件记录

★ = 新增 section，内容参见 `.aiwork/templates/spec/0_project/_template.md`。

输出 → `spec/0_project/project-spec.md`

**等待用户确认后继续。**

---

### Step 4: Domain Specs — 领域行为建模

逐模块与用户讨论：
- 领域职责范围
- C4 组件图
- 状态机定义
- 业务规则（BR-NNN）
- 输入/输出语义
- 约束与不可变真理
- 模块依赖
- **Domain-Specific Patterns**（可选）— 超出全局约定的领域特有规范（如 ID 格式、金额表示、状态转换唯一入口）

对每个 Domain：
输出 → `spec/1_domain/{name}-domain.md`

**自适应**: Small 项目如果只有 1 个模块，可将 Domain 内容精简或合并到 Project Spec。

**每个 Domain 完成后确认，再进入下一个。**

---

### Step 5: Contract Specs — 契约定义

基于 Domain Spec 定义对外契约：
- API 契约（HTTP / RPC）
- 事件契约（Domain Event / Integration Event）
- 数据 Schema

输出 → `spec/2_contract/v1/{name}.yaml`

**自适应**: Small 项目无外部 API 时可跳过。用户确认是否需要。

**等待用户确认后继续。**

---

### Step 6: Flow Specs — 关键流程场景

基于 PRD + Domain Spec，定义关键场景：
- 使用 Given / When / Then 格式
- 标注状态变化（交叉引用 Domain Spec 状态机）
- 覆盖失败路径与边界情况

输出 → `spec/3_flow/iteration_01/{name}-flow.md`

**自适应**:
- Small: 2-3 个核心流程即可
- Medium: 核心 happy path + 关键失败路径
- Large: 全面覆盖主要用户旅程

**等待用户确认后继续。**

---

### Step 7: 架构验证

对所有 Spec 产物进行多维度验证。输出验证报告，有问题则回到对应步骤修复。

#### 7a. 一致性验证

| 检查项 | 说明 |
|--------|------|
| Domain 映射 | 每个 Bounded Context 都有对应的 Domain Spec 文件 |
| 依赖有效性 | Domain 的 Dependencies 引用的目标 Domain 确实存在 |
| Contract-Domain 对齐 | Contract Spec 引用的 Domain 有效 |
| Flow-Domain 对齐 | Flow Spec 引用的业务规则（BR-NNN）和状态存在 |
| 无孤立文件 | 不存在无人引用的 Spec 文件 |
| 约定-技术栈一致 | Implementation Patterns 与技术栈匹配（如 Python 项目不用 camelCase 文件名） |
| 层级不越权 | Flow 不定义规则，Domain 不含 API 字段，Contract 不含业务逻辑 |
| 单一真理源 | 每条规则只在一处定义 |

#### 7b. 覆盖率验证

| 检查项 | 说明 |
|--------|------|
| Domain 覆盖 | 每个 Bounded Context 至少有一个 Domain Spec |
| Contract 覆盖 | 有外部接口的 Domain 有对应 Contract |
| FR 覆盖 | PRD 的功能需求在 Spec 中有对应落地（Domain 规则 / Contract 端点 / Flow 场景） |
| NFR 覆盖 | Step 1 的关键 NFR 在 Spec 中有体现（性能约束→Domain 规则，安全→Global Rules 等） |
| ADR 覆盖 | Step 2 标记的重大决策都有 ADR |
| 约定覆盖 | Naming Conventions 表覆盖了技术栈相关的所有元素类型 |

#### 7c. 冲突预防验证

| 检查项 | 说明 |
|--------|------|
| 模块边界清晰度 | 边界足够明确，两个 AI agent 并行开发不会冲突 |
| 共享资源归属 | 数据库表、配置 key、API 路由前缀、环境变量有明确的归属 Domain |
| 无歧义归属 | 没有实体或概念被多个 Domain 同时声称拥有 |
| 约定具体性 | Implementation Patterns 足够具体，AI agent 无需猜测约定 |
| 接口完整性 | 模块间通信接口完整定义，模块 A 的实现者知道模块 B 暴露什么 |

#### 7d. 实现就绪度

| 检查项 | 说明 |
|--------|------|
| 无占位符 | Spec 中不残留 `[TBD]`、`[TODO]`、模板占位文本 |
| Spike 处理 | Step 1 标记的高不确定性领域已解决或已明确标注为"延迟决策" |
| Story 0 可行 | 技术栈 + 项目结构足以定义工程基础设施 Story |

**验证报告格式**:

```
ARCHITECTURE VALIDATION
=======================
7a. 一致性:      [PASS/FAIL] — [详情]
7b. 覆盖率:      [PASS/WARN] — [详情]
7c. 冲突预防:    [PASS/WARN] — [详情]
7d. 实现就绪度:  [PASS/WARN] — [详情]

结论: [READY / NEEDS WORK]

必须修复:
1. [issue]

建议修复:
1. [warning]

可延迟:
1. [deferred + 理由]
```

**FAIL 项必须修复后才能继续。WARN 项由用户决定是否修复。**

---

### Step 8: 完成与交接

**产物汇总**:

```
ARCHITECTURE COMPLETE
=====================
模式: Create / Update
复杂度: Small / Medium / Large

产物:
  Project Spec:    spec/0_project/project-spec.md
  Domain Specs:    N 个 — [列出名称]
  Contract Specs:  N 个 — [列出名称]
  Flow Specs:      N 个 — [列出名称]
  ADRs:            N 个 — [列出标题]

技术栈: [一句话摘要]
模块: [列出 Bounded Contexts]
```

**清理**: 删除 `spec/.arch-progress.md`。

**下一步建议**（根据上下文）:

| 条件 | 建议 |
|------|------|
| 无实现计划 | 执行 `/plan` 基于 Spec 创建实现计划 |
| 有待探索的 Spike | 执行 `/spike` 探索 [具体领域] |
| ADR 仍为 Proposed | 执行 `/decide` 确定待定的架构决策 |
| Update 模式 | 检查现有 `docs/plans/` 与 Spec 变更的兼容性 |
| 来自 `/feature` 管线 | 返回 `/feature`，进入 Phase 2（/plan） |

---

## 核心原则

1. **协作式生成** — 每步与用户交互讨论，不是一键生成
2. **层级不越权** — Project 定义世界观，Domain 定义行为，Contract 定义契约，Flow 定义场景
3. **单一真理源** — 规则只在一处定义，其他层引用
4. **Spec 是行为事实** — 描述系统应当如何表现，不描述实现方式
5. **机器友好** — 结构化、简洁、可被 AI 工具解析
6. **冲突预防** — 明确的边界和约定防止多 agent 并行实现时产生冲突

## Spec 更新原则

- Project / Domain: 原地更新，不创建版本
- Contract: Breaking change MUST 创建新版本（v2, v3）
- Flow: 按迭代新增（iteration_02, iteration_03），不覆盖历史
- Domain MUST 维护 Evolution Log
- Project MUST 维护 Evolution Timeline

## 自适应深度

根据 Step 1 复杂度评估自动调整（用户有最终决定权）：

| 复杂度 | 必需步骤 | 可选步骤 |
|--------|---------|---------|
| Small (1-2 模块) | 0, 1, 2, 3, 4, 7, 8 | 5 (Contract), 6 (Flow) |
| Medium (3-5 模块) | 0, 1, 2, 3, 4, 5, 7, 8 | 6 (Flow 可精简) |
| Large (6+ 模块) | 全部 0-8 | 无 |

可选步骤不会静默跳过——向用户说明推荐并征求确认。

## 继续/恢复机制

`spec/.arch-progress.md` 用于追踪进度：
- Step 0 创建
- 每步完成后更新
- Step 8 完成后删除
- 格式：YAML frontmatter（started, mode, complexity, last_step）+ 步骤 checklist
