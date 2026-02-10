# BMAD-METHOD 分析笔记

> 收集日期: 2026-01-26
> 来源: https://github.com/bmad-code-org/BMAD-METHOD
> 版本: v6.0.0-alpha.23

## 概述

BMAD-METHOD (Breakthrough Method for Agile AI Driven Development) 是一个成熟的 AI 驱动敏捷开发框架。核心理念是**"人类放大，不是替代"** - AI 充当专业合作伙伴，通过结构化流程引导最佳思考，而不是替用户做决定。

**项目数据**：
- Stars: 31,836 | Forks: 4,172
- Contributors: 103+
- License: MIT（完全免费开源）

---

## 核心特点

1. **专业化智能体** - 10 个角色化 agents，各有独特视角和专业知识
2. **结构化工作流** - 31 个精心设计的 workflows，step-file 架构确保纪律化执行
3. **规模自适应** - 根据项目复杂度自动调整规划深度
4. **双路径选择** - 快速流程(3步) vs 完整规划(6+阶段)
5. **Party Mode** - 多智能体协作会议

---

## Agents 分析

### 完整列表 (10个)

| Agent | 角色 | 职责 | 主要命令 |
|-------|------|------|---------|
| **John** (PM) | 产品经理 | PRD创建、需求验证、Epics/Stories | CP, VP, EP, CE, IR, CC |
| **Winston** (Architect) | 系统架构师 | 技术决策、系统设计 | CA, IR |
| **Amelia** (Developer) | 高级开发工程师 | 代码实现、单元测试 | DS, CR |
| **Mary** (Analyst) | 战略分析师 | 市场研究、竞争分析 | BP, RS, CB, DP |
| **Bob** (Scrum Master) | 技术 SM | Sprint规划、变更管理 | SP, CS, ER, CC |
| **Sally** (UX Designer) | UX/UI 设计师 | 用户研究、交互设计 | CU |
| **Murat** (TEA) | 测试架构师 | 测试框架、自动化、CI/CD | TF, AT, TA, TD, TR, NR, CI, RV |
| **Barry** (Quick Flow) | 全栈快速开发 | 快速规范、端到端开发 | TS, QD, CR |
| **Paige** (Tech Writer) | 技术文档专家 | 文档编写、知识管理 | - |
| **BMad Master** | 主控执行器 | 任务编排、工作流协调 | - |

### Agent 设计亮点

1. **角色化人设** - 每个 agent 有明确的 persona、identity、communication_style
2. **命令菜单** - 每个 agent 有专属命令，支持 fuzzy match
3. **Sidecar 支持** - 部分 agent 有子菜单扩展

### Agent 定义格式 (YAML)

```yaml
agent:
  metadata:
    id: "_bmad/bmm/agents/[name].md"
    name: [名称]
    title: [职位]
    icon: [Emoji]

  persona:
    role: [角色描述]
    identity: [背景身份]
    communication_style: [沟通风格]
    principles: [核心原则]

  menu:
    - trigger: [命令缩写]
      exec/workflow: [工作流路径]
      description: "[命令描述]"
```

---

## Workflows 分析

### 按阶段分类 (31个)

#### 1. 分析阶段 (2个)
| Workflow | 用途 |
|----------|------|
| create-product-brief | 将模糊想法转化为执行摘要 |
| research | 市场/竞争/技术研究 |

#### 2. 规划阶段 (2个)
| Workflow | 用途 |
|----------|------|
| create-prd | PRD 创建/验证/编辑 |
| create-ux-design | 14步引导式 UX 设计 |

#### 3. 解决方案设计 (3个)
| Workflow | 用途 |
|----------|------|
| create-architecture | 技术决策、系统设计 |
| create-epics-and-stories | PRD 分解为 Epics/Stories |
| check-implementation-readiness | 实现就绪检查 |

#### 4. 实现阶段 (7个)
| Workflow | 用途 |
|----------|------|
| sprint-planning | Sprint 初始化 |
| create-story | 生成实现就绪的 Story |
| dev-story | Story 实现 |
| code-review | 代码质量审查 |
| sprint-status | 进度追踪 |
| retrospective | Epic 回顾 |
| correct-course | 变更管理 |

#### 5. 快速流程 (2个)
| Workflow | 用途 |
|----------|------|
| quick-spec | 快速技术规范 |
| quick-dev | 端到端快速实现 |

#### 6. 测试架构 (8个)
| Workflow | 用途 |
|----------|------|
| framework | 测试框架设置 |
| atdd | ATDD 测试设计 |
| automate | 测试自动化 |
| test-design | 测试用例设计 |
| trace | 需求追踪 |
| nfr-assess | 非功能需求评估 |
| ci | CI/CD 配置 |
| test-review | 测试质量审查 |

#### 7. 其他 (7个)
- document-project (文档化)
- create-diagram/wireframe/flowchart/dataflow (可视化)
- brainstorming, party-mode, advanced-elicitation (核心)

### Workflow 设计亮点

1. **Step-File 架构** - 每个 workflow 分解为独立的 step-*.md 文件
2. **严格执行顺序** - 不允许跳过或优化
3. **Just-In-Time 加载** - 一次只加载当前步骤
4. **状态追踪** - stepsCompleted 数组追踪进度

---

## 两条开发路径

### 快速路径 (Quick Flow)

适用：Bug 修复、小功能、清晰范围

```
/quick-spec → /dev-story (重复) → /code-review
```

主要 Agent：Barry (全栈快速开发)

### 完整路径 (Full Planning)

适用：产品、平台、复杂功能

```
/product-brief → /create-prd → /create-architecture
→ /create-epics-and-stories → /sprint-planning
→ (/create-story → /dev-story → /code-review) × N
→ /retrospective
```

涉及全部 Agents 协作

---

## 优点

1. **成熟完善** - 31K+ stars，活跃社区，持续更新
2. **理念先进** - "人类放大"而非替代，强调人机协作
3. **覆盖完整** - 从想法到部署的全生命周期
4. **灵活可选** - 快速和详细两条路径
5. **文档优秀** - Astro/Starlight 文档网站，Diataxis 框架
6. **多工具支持** - Claude Code, Cursor, Windsurf, Roo Code

## 不足

1. **学习曲线** - 10 个 agents + 31 个 workflows 需要时间熟悉
2. **相对重量级** - 对于简单项目可能过于复杂
3. **依赖 Node.js** - 需要 v20+ 环境

---

## 可借鉴的点

### 1. Agent 设计模式
- 角色化人设（persona + identity + principles）
- 命令菜单系统
- 专业化分工

### 2. Workflow 架构
- Step-file 分解模式
- 严格执行顺序
- 状态追踪机制

### 3. 双路径设计
- 快速流程 vs 完整流程
- 根据项目规模自适应

### 4. Party Mode
- 多智能体协作会议
- 不同视角的碰撞

### 5. 文档组织
- Diataxis 框架（教程/How-To/解释/参考）
- LLM 友好的文档（llms.txt）

---

## 提取计划

考虑从该框架中提取以下设计模式作为参考：

- [ ] Agent 定义格式模板
- [ ] Step-file workflow 架构模式
- [ ] 双路径选择机制设计
- [ ] Party Mode 多智能体协作设计

---

## 参考资料

- [GitHub 仓库](https://github.com/bmad-code-org/BMAD-METHOD)
- [官方文档](https://docs.bmad-method.org)
- [Discord 社区](https://discord.gg/gk8jAdXWmj)
