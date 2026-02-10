---
name: extract
description: 从已收集的框架中提取有价值的组件到 extracted/ 目录。支持提取 agents、skills、workflows、hooks 等组件。
argument-hint: "<framework-id> <component-path>"
disable-model-invocation: true
allowed-tools: Bash(cp:*), Bash(mkdir:*), Bash(ls:*), Read, Write, Glob
---

# 提取组件

从已收集的框架中提取有价值的组件，保存到框架的 `extracted/` 目录。

## 参数

$ARGUMENTS - 格式: `<framework-id> <component-path>`

- `framework-id` - 框架 ID（必需）
- `component-path` - 要提取的组件路径（必需）

## 执行流程

### 1. 验证框架存在

```bash
# 检查框架目录
ls workspace/frameworks/{framework-id}

# 检查源仓库
ls workspace/_repos/{framework-id}
```

### 2. 定位源组件

组件路径可以是：
- 相对于 `_repos/{framework-id}/` 的路径
- 组件类型 + 名称，如 `skills/tdd` 或 `agents/code-reviewer`

```bash
# 示例：定位 skill
ls workspace/_repos/{framework-id}/skills/{skill-name}

# 示例：定位 agent
ls workspace/_repos/{framework-id}/agents/{agent-name}.md
```

### 3. 确定目标位置

根据组件类型创建目标目录：

```bash
# 创建 extracted 子目录
mkdir -p workspace/frameworks/{framework-id}/extracted/{type}
```

目录结构：
```
frameworks/{framework-id}/extracted/
├── agents/
├── skills/
├── workflows/
├── hooks/
├── commands/
└── prompts/
```

### 4. 复制组件

```bash
# 复制文件或目录
cp -r workspace/_repos/{framework-id}/{component-path} \
      workspace/frameworks/{framework-id}/extracted/{type}/
```

### 5. 添加来源注释

在提取的文件开头添加来源信息：

```markdown
<!--
  来源: {framework-id}
  原始路径: {component-path}
  提取日期: {today}
  原始仓库: {source-url}
-->
```

### 6. 更新 metadata.yaml

在框架的 `metadata.yaml` 中记录提取的组件：

```yaml
extracted:
  - path: extracted/skills/tdd
    type: skill
    description: TDD 工作流技能
    extracted_at: 2026-01-26
```

### 7. 输出结果

显示提取结果：
- 源路径
- 目标路径
- 文件列表
- 提示用户检查和调整

## 示例

```bash
/extract superpowers skills/test-driven-development
# → 提取 TDD skill 到 extracted/skills/

/extract superpowers agents/code-reviewer.md
# → 提取 code-reviewer agent 到 extracted/agents/

/extract bmad-method workflows/create-prd
# → 提取 PRD 创建工作流到 extracted/workflows/
```

## 批量提取

如果需要提取多个组件，可以多次调用或使用通配符：

```bash
/extract superpowers skills/*
# → 提取所有 skills

/extract bmad-method agents/*.md
# → 提取所有 agents
```

## 提取后的操作

提取后可以：
1. 编辑组件，适配自己的项目
2. 使用 `/analyze` 深入分析提取的组件
3. 将组件整合到 `templates/` 中的项目模板
