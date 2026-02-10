---
name: analyze
description: 聚焦分析已收集的框架或资源的特定方面。支持分析 agents、skills、workflows、hooks、testing 等不同维度。
argument-hint: "<id> [focus]"
disable-model-invocation: true
allowed-tools: Bash(ls:*), Bash(wc:*), Read, Write, Glob, Grep
---

# 聚焦分析

对已收集的框架或资源进行深度分析，聚焦于特定方面。

## 参数

$ARGUMENTS - 格式: `<id> [focus]`

- `id` - 框架或资源的 ID（必需）
- `focus` - 分析聚焦点（可选）

## 可用的 Focus 选项

| Focus | 说明 | 分析内容 |
|-------|------|----------|
| `agents` | Agent 设计 | 角色定义、persona、命令菜单、协作模式 |
| `skills` | Skill 设计 | 技能结构、触发条件、参数设计、最佳实践 |
| `workflows` | 工作流设计 | 流程步骤、状态管理、依赖关系 |
| `hooks` | Hook 机制 | 生命周期钩子、事件处理、配置方式 |
| `commands` | 命令设计 | 命令结构、参数处理、用户交互 |
| `testing` / `tdd` | 测试相关 | 测试策略、TDD 流程、测试工具 |
| `prompts` | 提示词设计 | 提示词结构、变量、模板 |
| `architecture` | 整体架构 | 目录结构、组件关系、设计模式 |

不传 focus 参数时，列出该框架/资源可分析的方面。

## 执行流程

### 1. 定位资源

查找资源位置：

```bash
# 检查是否是 framework
ls workspace/frameworks/{id}

# 检查是否是 resource
ls workspace/resources/{id}

# 检查 _repos/ 中是否有完整仓库
ls workspace/_repos/{id}
```

### 2. 无 focus 参数 - 列出可分析方面

扫描资源结构，列出包含的组件类型：

```
可分析的方面:

- agents (1 个)
- skills (14 个)
- commands (3 个)
- hooks (3 个)

使用 /analyze {id} <focus> 进行深度分析
```

### 3. 有 focus 参数 - 深度分析

根据 focus 类型执行不同的分析：

#### agents 分析

1. 列出所有 agent 文件
2. 读取每个 agent 的定义
3. 分析：
   - 角色和 persona 设计
   - 命令菜单结构
   - 专业领域和职责
   - 与其他 agent 的协作关系

#### skills 分析

1. 列出所有 skill 文件
2. 读取每个 skill 的内容
3. 分析：
   - 技能触发条件
   - 参数设计
   - 执行流程
   - 依赖关系
   - 设计模式

#### workflows 分析

1. 列出所有 workflow 文件
2. 分析：
   - 工作流步骤
   - 状态转换
   - 输入输出
   - 错误处理

#### testing/tdd 分析

1. 搜索测试相关文件和内容
2. 分析：
   - 测试框架和工具
   - TDD 流程定义
   - 测试策略
   - 最佳实践

### 4. 输出分析报告

生成结构化的分析报告，包含：
- 组件列表和统计
- 设计模式识别
- 关键代码片段
- 可借鉴的点
- 改进建议

### 5. 更新 analysis.md（可选）

询问用户是否要将分析结果追加到 `analysis.md` 文件中。

## 示例

```bash
/analyze superpowers
# → 列出 superpowers 可分析的方面

/analyze superpowers skills
# → 深入分析 superpowers 的 14 个 skills

/analyze superpowers tdd
# → 分析 superpowers 的 TDD 相关设计

/analyze bmad-method agents
# → 分析 BMAD-METHOD 的 10 个 agents 设计
```

## 输出格式

```markdown
# {id} - {focus} 分析

## 概览

- 组件数量: X
- 主要模式: ...

## 详细分析

### {component-1}

- 功能: ...
- 设计特点: ...
- 代码片段: ...

### {component-2}

...

## 设计模式

1. 模式一: ...
2. 模式二: ...

## 可借鉴的点

- ...
- ...

## 建议

- ...
```
