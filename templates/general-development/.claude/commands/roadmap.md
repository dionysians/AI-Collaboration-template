# 项目路线图 (/roadmap)

分析目标态（Spec/PRD）与现状（代码）的差距，生成或更新项目路线图。

## 使用方式

```
/roadmap [create|update]
```

不传参数时自动检测模式。

## 模式自动检测

- `docs/roadmap.md` **不存在** → Create 模式
- `docs/roadmap.md` **已存在** → Update 模式
- 传入参数时强制指定模式

---

## Create 模式

### 1. 目标态加载

按优先级查找目标态输入：

1. `spec/`（Spec 四层级体系 — 最完整的目标态）
2. `docs/plans/prd-*.md`（PRD — 需求级目标态）
3. `README.md`（项目描述 — 最小目标态）
4. 用户描述（对话输入）

如果以上均不存在，提示用户先执行 `/clarify` 或 `/architecture`。

### 2. Gap Analysis

比较目标态与 `src/` 现状：

- **缺失功能**: 目标态定义了但代码中不存在的功能/模块
- **不完整实现**: 代码存在但未达到目标态要求
- **Research & Spikes**: 高不确定性领域，需要技术调研后才能规划

### 3. 阶段划分

将 Gap 结构化为逻辑阶段（Phase）：

- **分阶段**: 按依赖关系和业务价值排序（如 Phase 1: 核心基础, Phase 2: 高级功能）
- **定里程碑**: 每阶段的明确成功标准
- **理依赖**: 确保基础模块优先构建

### 4. 生成文件

输出到 `docs/roadmap.md`，格式：

1. **Header**: 标题 + 最后更新日期
2. **当前系统状态**: Markdown 表格 `| 模块 | 组件 | 状态 | 负责人 | 备注 |`
3. **演进路线图**: Mermaid Gantt 图展示阶段和时间线
4. **Gap Analysis**: Markdown 表格 `| 功能领域 | 现状 | 目标态（Spec） | Gap / Action Item |`
5. **Research & Spikes**: Checklist（`- [ ]`）列出需调研的探索性任务

**展示给用户确认后再写入文件。**

---

## Update 模式

### 1. 进度检查

读取 `docs/roadmap.md` 和当前代码：

- 哪些 Roadmap 中的项目已在代码中实现？→ 标记完成
- 哪些正在进行中？→ 更新状态

### 2. 新 Gap 识别

读取 `docs/roadmap.md` 和最新的 `spec/`（或 PRD）：

- Spec/PRD 中是否有新增内容不在 Roadmap 中？→ 添加到对应 Phase
- 是否有新的不确定性或 Spike？→ 添加到 Research & Spikes

### 3. 更新文件

保持现有格式不变，更新内容：

1. **状态表**: 更新状态列（`✅ Done`, `🚧 In Progress`, `📋 Planned`）
2. **Gantt 图**: 更新 Mermaid block
3. **Gap Analysis**: 添加新行、更新已有行状态
4. **Research & Spikes**: 更新 checklist 状态

**展示变更摘要给用户确认后再写入文件。**

---

## Spec 感知

当 `spec/` 存在时：

- **Spec 是唯一真理源** — 目标态以 Spec 为准，不自行发明
- **引用 Project Spec** 的模块边界划分阶段
- **引用 Domain Spec** 的业务规则评估完成度
- **引用 Contract Spec** 的 API 契约判断实现状态

当 `spec/` 不存在时，按 PRD/README/用户描述作为目标态。

## 与其他命令的关系

```
/roadmap  → 战略层：项目整体要做什么、分几个阶段
    ↓
/clarify  → 需求层：某个功能的详细 PRD
    ↓
/plan     → 执行层：PRD 拆解为 Epic → Story(AC)
```

路线图是 `/plan` 的上游——先看 roadmap 决定做什么，再用 `/plan` 拆解怎么做。
