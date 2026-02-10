# Lenny Skills 分析笔记

> 收集日期: 2026-02-02
> 来源: https://github.com/RefoundAI/lenny-skills
> 官网: https://refoundai.com/lenny-skills/

## 概述

Lenny Skills 是一个从 Lenny's Podcast（产品管理领域最受欢迎的播客之一）297 期节目中提取的 86 个产品管理技能集合。由 RefoundAI 开发，将行业领袖（来自 Stripe、Airbnb、Figma 等公司）的洞察转化为可安装到 AI 编程助手中的 agent skills。

## 核心特点

- 内容驱动的技能库，非代码框架，而是产品管理知识的结构化呈现
- 每个技能包含 SKILL.md 和 references/ 目录，引用多位专家观点
- 通过 `npx skills add` CLI 工具安装，支持全量或按需安装
- 涵盖产品管理全周期：用户研究、PRD 编写、增长策略、团队管理等

## 项目数据

- Stars: 39
- Forks: 10
- License: MIT

## 组件分析

### Skills (86 个)

11 个类别覆盖：

| 类别 | 描述 |
|------|------|
| Product Management | PRD 编写、产品愿景、路线图等核心 PM 技能 |
| Leadership | 领导力、教练、委派等管理技能 |
| Hiring & Teams | 招聘、面试、团队文化建设 |
| Growth | 增长循环设计、留存优化、定价策略 |
| AI & Technology | AI 产品策略、LLM 构建、技术评估 |
| User Research | 用户访谈、反馈分析、调研设计 |
| Design | 设计系统、行为设计、设计工程 |
| Marketing | 内容营销、品牌故事、社区建设 |
| Sales | 销售团队建设、企业销售 |
| Strategy | 竞品分析、权衡评估、市场定位 |
| Career | 职业转型、晋升、能量管理 |

### Playbooks (4 个)

| Playbook | 目标角色 |
|----------|----------|
| Startup Founder | 创业者 |
| First-Time Manager | 新任管理者 |
| Product Manager | 产品经理 |
| Growth Leader | 增长负责人 |

### Skill 文件结构

```
skills/{skill-name}/
  SKILL.md          # 技能描述和指导
  references/       # 专家观点引用
```

## 优点

- 内容质量高：基于真实行业专家的深度访谈，非泛泛而谈
- 覆盖面广：86 个技能涵盖产品管理的方方面面
- 结构清晰：每个技能独立目录，易于浏览和选择
- 安装便捷：CLI 工具支持灵活安装
- 开源许可：MIT 许可证，可自由使用和修改

## 不足

- Stars 较少（39），社区影响力有限
- 技能内容偏向"软技能"和方法论，非直接的代码/工具辅助
- 作为 AI agent skill 的实际效果需要验证
- 缺少中文内容

## 合理使用场景

### 适合的场景

**1. 产品经理与 AI 协作思考**

这是最核心的场景。这些 skill 本质上是给 AI 注入产品管理领域知识的 prompt 库，让它从"通用助手"变成"懂行的产品顾问"。例如：
- 写 PRD 时让 AI 用 PR/FAQ 框架审查和补充
- 做竞品分析时按专家框架组织信息
- 做技术方案取舍时用 evaluating-trade-offs 的加权矩阵框架

**2. 新手 PM / 创业者的"专家陪练"**

每个 skill 包含 5-10 条来自 Stripe、Airbnb、Figma 等公司建设者的具体原则，附带诊断性问题和常见错误清单。对于缺乏经验的人，相当于随时有一个"知道正确方向"的教练。

**3. 团队决策前的结构化思考**

例如 designing-growth-loops 中给出了"一个主导增长循环最重要""40-50% 有机流量是健康比例"这类具体判断标准，适合在团队讨论前用 AI 做预分析。

### 不适合的场景

**1. 作为编程辅助的 skill**

这些 skill 与代码编写几乎无关。安装到 Claude Code 中，如果日常工作是写代码，它们不会被触发，也不会有帮助。它们是产品管理知识，不是工程工具。

**2. 期望得到完整执行方案**

每个 skill 约 70-130 行，教的是 WHAT（做什么）和 WHY（为什么），不教完整的 HOW（怎么一步步做）。如果需要详细的用户访谈脚本、完整的 PRD 模板、或增长实验的具体 SQL 查询，这些 skill 不够。

**3. 需要实时数据或行业特定知识**

这些 skill 提供的是通用框架和原则，不包含特定行业的市场数据或最新趋势。

## 可借鉴的点

1. **内容型技能库模式**：将领域知识结构化为 AI skills 的思路值得借鉴
2. **Playbook 机制**：按角色组织技能组合，提供针对性指导
3. **references 模式**：每个技能附带多位专家的观点参考，增强可信度
4. **npx skills CLI**：技能安装工具的设计思路

## 提取计划

- [ ] 待分析：评估哪些技能对 AI 辅助开发最有价值
- [ ] 研究 SKILL.md 的格式规范，借鉴其技能描述结构
- [ ] 了解 npx skills CLI 的工作原理

## 参考资料

- [GitHub 仓库](https://github.com/RefoundAI/lenny-skills)
- [官网 Skill 浏览器](https://refoundai.com/lenny-skills/)
- [Lenny's Podcast](https://www.lennyspodcast.com/)
