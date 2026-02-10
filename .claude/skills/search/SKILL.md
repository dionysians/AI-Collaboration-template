---
name: search
description: 搜索 workspace 中的资源和框架。支持按关键词、类型、工具、标签等条件搜索。
argument-hint: "<keyword> [--type=<type>] [--tool=<tool>]"
disable-model-invocation: true
allowed-tools: Bash(grep:*), Read, Glob, Grep
---

# 搜索资源

在 workspace 中搜索已收集的资源和框架。

## 参数

$ARGUMENTS - 搜索条件

支持的参数格式：
- `<keyword>` - 关键词搜索（搜索名称、描述、标签）
- `--type=<type>` - 按类型筛选
- `--tool=<tool>` - 按工具筛选
- `--tag=<tag>` - 按标签筛选

## 搜索范围

1. **Resources** (`workspace/resources/`)
   - metadata.yaml 中的 name, description, tags
   - files/ 中的文件内容

2. **Frameworks** (`workspace/frameworks/`)
   - metadata.yaml 中的 name, description, tags, features
   - analysis.md 中的内容

3. **索引文件** (`workspace/indexes/`)
   - by-type.md
   - by-tool.md
   - by-source.md

## 执行流程

### 1. 解析搜索参数

从参数中提取：
- 关键词
- 筛选条件（type, tool, tag）

### 2. 搜索 metadata.yaml 文件

```bash
# 搜索所有 metadata.yaml
grep -r "{keyword}" workspace/resources/*/metadata.yaml
grep -r "{keyword}" workspace/frameworks/*/metadata.yaml
```

### 3. 搜索 analysis.md 文件

```bash
grep -r "{keyword}" workspace/frameworks/*/analysis.md
```

### 4. 应用筛选条件

如果指定了筛选条件，过滤结果：

```yaml
# 按类型筛选
type: {type}

# 按工具筛选
tools:
  - {tool}

# 按标签筛选
tags:
  - {tag}
```

### 5. 格式化输出

按相关度排序，显示搜索结果：

```
搜索结果: "{keyword}"

## Frameworks (2)

1. **superpowers** - An agentic skills framework...
   - 类型: framework
   - 工具: claude-code
   - 匹配: skills, tdd, testing

2. **bmad-method** - Breakthrough Method for Agile...
   - 类型: framework
   - 工具: claude-code, cursor
   - 匹配: agents, workflows

## Resources (1)

1. **example-commit-skill** - 示例 commit skill
   - 类型: skill
   - 工具: claude-code
   - 匹配: git, commit

共找到 3 个结果
```

## 示例

```bash
/search tdd
# → 搜索包含 "tdd" 的所有资源

/search skill --type=skill
# → 搜索类型为 skill 的资源

/search --tool=cursor
# → 搜索支持 Cursor 的资源

/search agent --type=framework
# → 在框架中搜索包含 "agent" 的

/search security --tag=audit
# → 搜索带有 "audit" 标签且包含 "security" 的资源
```

## 快捷搜索

常用搜索的快捷方式：

| 命令 | 等价于 |
|------|--------|
| `/search --frameworks` | `/search --type=framework` |
| `/search --resources` | 只搜索 resources/ |
| `/search --claude` | `/search --tool=claude-code` |
| `/search --cursor` | `/search --tool=cursor` |

## 搜索技巧

1. **模糊搜索** - 关键词支持部分匹配
2. **多关键词** - 用空格分隔多个关键词（AND 关系）
3. **引号精确匹配** - `"exact phrase"` 精确匹配短语
4. **排除** - `-keyword` 排除包含该关键词的结果
