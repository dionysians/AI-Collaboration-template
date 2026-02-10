---
name: compare
description: 对比多个框架或资源，生成对比表格和分析报告。帮助选择最适合的方案。
argument-hint: "<id1> <id2> [id3...]"
disable-model-invocation: true
allowed-tools: Read, Glob, Grep
---

# 对比资源

对比多个框架或资源，生成对比表格和分析报告。

## 参数

$ARGUMENTS - 要对比的资源 ID 列表（至少 2 个）

格式: `<id1> <id2> [id3...]`

## 执行流程

### 1. 验证资源存在

检查所有指定的资源是否存在：

```bash
# 检查每个 ID
ls workspace/frameworks/{id} || ls workspace/resources/{id}
```

### 2. 读取元数据

从每个资源的 `metadata.yaml` 中读取信息：
- 基本信息（name, description, type）
- 组件统计（components）
- 评估信息（evaluation）
- 支持的工具（tools）
- 标签（tags）
- 特性（features）

### 3. 生成对比表格

#### 基本信息对比

| 属性 | {id1} | {id2} | {id3} |
|------|-------|-------|-------|
| 名称 | ... | ... | ... |
| 类型 | framework | framework | resource |
| Stars | 36,224 | 31,836 | 500 |
| License | MIT | MIT | Apache-2.0 |

#### 组件对比（仅 frameworks）

| 组件 | {id1} | {id2} |
|------|-------|-------|
| Agents | 1 | 10 |
| Skills | 14 | 0 |
| Workflows | 0 | 31 |
| Commands | 3 | 0 |
| Hooks | 3 | 0 |

#### 工具支持对比

| 工具 | {id1} | {id2} |
|------|-------|-------|
| Claude Code | ✅ | ✅ |
| Cursor | ❌ | ✅ |
| Windsurf | ❌ | ✅ |

#### 评估对比

| 评估项 | {id1} | {id2} |
|--------|-------|-------|
| 质量 | high | high |
| 成熟度 | production | production |
| 文档 | high | high |

### 4. 特性对比分析

列出每个资源的独特特性：

```markdown
## 特性对比

### superpowers 独特特性
- Skill-Driven Development
- TDD 强制执行
- Subagent 驱动开发
- Git Worktree 支持

### bmad-method 独特特性
- 10 个专业化 Agents
- 31 个结构化 Workflows
- Party Mode 多智能体协作
- 双路径选择（快速/完整）

### 共同特性
- 代码审查工作流
- 计划驱动开发
```

### 5. 生成建议

根据对比结果生成选择建议：

```markdown
## 选择建议

### 选择 superpowers 如果你...
- 主要使用 Claude Code
- 偏好 TDD 开发方式
- 需要轻量级的技能系统
- 喜欢 subagent 并行工作

### 选择 bmad-method 如果你...
- 需要多工具支持（Cursor, Windsurf）
- 偏好结构化的多阶段工作流
- 需要专业化的角色分工
- 项目规模较大，需要完整的生命周期管理
```

### 6. 输出报告

完整的对比报告格式：

```markdown
# 资源对比: {id1} vs {id2}

## 基本信息
[表格]

## 组件统计
[表格]

## 工具支持
[表格]

## 评估信息
[表格]

## 特性对比
[详细分析]

## 选择建议
[建议内容]

---
生成时间: {timestamp}
```

## 示例

```bash
/compare superpowers bmad-method
# → 对比两个框架

/compare superpowers bmad-method cursor-rules
# → 对比三个资源

/compare example-commit-skill another-skill
# → 对比两个 resources
```

## 对比维度

可以关注的对比维度：

1. **规模** - 组件数量、代码量
2. **成熟度** - Stars、社区活跃度、更新频率
3. **覆盖面** - 支持的工具、场景
4. **复杂度** - 学习曲线、上手难度
5. **理念** - 设计哲学、方法论
6. **实用性** - 是否符合你的工作流

## 输出选项

对比报告可以：
1. 直接显示在终端
2. 保存到文件：`/compare id1 id2 > comparison.md`
3. 追加到 analysis.md 中
