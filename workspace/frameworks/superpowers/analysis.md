# Superpowers 分析笔记

> 收集日期: 2026-01-26
> 来源: https://github.com/obra/superpowers
> 作者: obra (Jesse Vincent)

## 概述

Superpowers 是一个完整的软件开发工作流框架，为编程 agent 构建，基于一组可组合的 "skills" 和初始指令。核心理念是**"技能自动触发"** - agent 在执行任何任务前都会检查相关技能，这些是强制性工作流而非建议。

**项目数据**：
- Stars: 36,224 | Forks: 2,766
- License: MIT
- 支持平台: Claude Code (Plugin), Codex, OpenCode

---

## 核心理念

1. **Test-Driven Development** - 测试先行，始终如此
2. **Systematic over ad-hoc** - 流程优于猜测
3. **Complexity reduction** - 简单性是首要目标
4. **Evidence over claims** - 验证优于声明

---

## 组件分析

### Skills (14个)

按类别分类：

| 类别 | Skill | 说明 |
|------|-------|------|
| **测试** | test-driven-development | RED-GREEN-REFACTOR 循环 |
| **调试** | systematic-debugging | 4 阶段根因分析流程 |
| **调试** | verification-before-completion | 确保问题真正修复 |
| **协作** | brainstorming | 苏格拉底式设计精炼 |
| **协作** | writing-plans | 详细实现计划 |
| **协作** | executing-plans | 批量执行带检查点 |
| **协作** | dispatching-parallel-agents | 并发 subagent 工作流 |
| **协作** | requesting-code-review | 代码审查前检查清单 |
| **协作** | receiving-code-review | 响应代码审查反馈 |
| **协作** | using-git-worktrees | 并行开发分支 |
| **协作** | finishing-a-development-branch | 合并/PR 决策工作流 |
| **协作** | subagent-driven-development | 两阶段审查的快速迭代 |
| **元** | writing-skills | 创建新技能的最佳实践 |
| **元** | using-superpowers | 技能系统介绍 |

### Commands (3个)

| Command | 说明 |
|---------|------|
| brainstorm | 交互式设计精炼 |
| write-plan | 创建实现计划 |
| execute-plan | 批量执行计划 |

### Agents (1个)

| Agent | 说明 |
|-------|------|
| code-reviewer | 代码审查 agent |

### Hooks (3个)

- hooks.json - 钩子配置
- session-start.sh - 会话启动钩子
- run-hook.cmd - Windows 钩子运行器

---

## 基本工作流

```
1. brainstorming (自动激活)
   ↓ 在写代码前激活，通过问题精炼想法
2. using-git-worktrees
   ↓ 设计批准后，创建隔离工作空间
3. writing-plans
   ↓ 将工作分解为小任务（每个 2-5 分钟）
4. subagent-driven-development / executing-plans
   ↓ 每个任务派发新 subagent，两阶段审查
5. test-driven-development
   ↓ 实现时强制 RED-GREEN-REFACTOR
6. requesting-code-review
   ↓ 任务间审查，严重问题阻止进度
7. finishing-a-development-branch
   验证测试，提供选项（合并/PR/保留/丢弃）
```

---

## 优点

1. **自动化工作流** - 技能自动触发，无需手动调用
2. **TDD 强制** - 真正的红绿重构循环
3. **两阶段审查** - 规格合规 + 代码质量
4. **并行开发** - 支持 git worktree 和并行 agent
5. **清晰的任务分解** - 每个任务 2-5 分钟，有明确验证步骤
6. **多平台支持** - Claude Code, Codex, OpenCode

## 不足

1. **学习曲线** - 需要理解整套工作流
2. **强制性流程** - 对小任务可能过于繁琐
3. **Claude Code 依赖** - 主要为 Claude Code 设计

---

## 可借鉴的点

### 1. 技能自动触发机制
- 技能根据上下文自动激活
- 不需要用户显式调用

### 2. TDD 工作流
- 强制 RED-GREEN-REFACTOR
- 删除测试前写的代码

### 3. 两阶段代码审查
- 第一阶段：规格合规性
- 第二阶段：代码质量

### 4. Subagent 驱动开发
- 每个任务派发新 subagent
- 保持上下文清洁

### 5. Git Worktree 集成
- 并行开发分支
- 隔离工作空间

---

## 提取计划

考虑从该框架中提取以下组件：

- [ ] test-driven-development skill - TDD 工作流
- [ ] systematic-debugging skill - 系统调试流程
- [ ] code-reviewer agent - 代码审查 agent
- [ ] writing-plans skill - 计划编写技能

---

## 参考资料

- [GitHub 仓库](https://github.com/obra/superpowers)
- [作者博客文章](https://blog.fsck.com/2025/10/09/superpowers/)
- [插件市场](https://github.com/obra/superpowers-marketplace)
