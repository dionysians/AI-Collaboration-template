---
name: collect
description: 智能收集 AI 编程工具资源。自动判断 URL 类型（framework 或 resource），获取元数据，创建对应目录结构，生成 metadata.yaml。
argument-hint: "<github-url>"
disable-model-invocation: true
allowed-tools: Bash(gh:*), Bash(git:*), Bash(mkdir:*), Bash(ls:*), Read, Write, Glob, WebFetch
---

# 收集资源

从给定的 URL 收集 AI 编程工具资源。

## 参数

$ARGUMENTS - GitHub 仓库 URL 或文件 URL

## 执行流程

### 1. 解析 URL

从参数中提取：
- `owner` - 仓库所有者
- `repo` - 仓库名称
- `file_path` - 如果是文件链接，提取文件路径

### 2. 获取仓库元数据

使用 `gh api` 获取仓库信息：

```bash
gh api repos/{owner}/{repo} --jq '{
  name: .name,
  description: .description,
  stars: .stargazers_count,
  forks: .forks_count,
  license: .license.spdx_id,
  topics: .topics,
  default_branch: .default_branch
}'
```

### 3. 判断类型

检查仓库结构来判断是 framework 还是 resource：

**Framework 特征**（满足任意两个即为 framework）：
- 包含 `agents/` 或 `personas/` 目录
- 包含 `workflows/` 或 `tasks/` 目录
- 包含 `prompts/` 或 `rules/` 目录
- 包含 `commands/` 或 `skills/` 目录
- 包含 `.claude/` 或 `.cursor/` 目录
- Stars > 100
- 有详细的 README 文档

**Resource 特征**：
- 单个文件或少量文件
- 没有复杂的目录结构
- 专注于单一功能

### 4. 检查是否已存在

检查仓库是否已经收集过：

```bash
# 检查 _repos/ 中是否存在
ls workspace/_repos/{repo}

# 检查 frameworks/ 或 resources/ 中是否存在
ls workspace/frameworks/{id} || ls workspace/resources/{id}
```

**如果已存在**：执行更新流程
**如果不存在**：执行新收集流程

### 5. 执行收集（新仓库）

#### 如果是 Framework：

1. 生成 ID：将仓库名转为小写，用连字符替换特殊字符
   ```
   id = repo.toLowerCase().replace(/[^a-z0-9]/g, '-')
   ```

2. 克隆仓库到 `workspace/_repos/`：
   ```bash
   cd workspace/_repos
   git clone --depth 1 https://github.com/{owner}/{repo}.git
   ```

3. 创建框架目录：
   ```bash
   mkdir -p workspace/frameworks/{id}/extracted
   ```

4. 生成 `metadata.yaml`（参考 `workspace/frameworks/_template/metadata.yaml`）

5. 生成 `analysis.md` 模板：
   ```markdown
   # {name} 分析笔记

   > 收集日期: {today}
   > 来源: {url}

   ## 概述

   {description}

   ## 项目数据

   - Stars: {stars}
   - License: {license}

   ## 组件分析

   TODO: 分析仓库结构，识别关键组件

   ## 优点

   TODO

   ## 不足

   TODO

   ## 可借鉴的点

   TODO

   ## 提取计划

   - [ ] 待分析
   ```

#### 如果是 Resource：

1. 生成 ID：从仓库名或文件名生成
2. 创建资源目录：
   ```bash
   mkdir -p workspace/resources/{id}/files
   ```
3. 下载文件到 `files/` 目录
4. 生成 `metadata.yaml`（参考 `workspace/resources/_template/metadata.yaml`）

### 6. 执行更新（已存在的仓库）

当仓库已经存在于 `_repos/` 时：

1. 进入仓库目录，拉取最新代码：
   ```bash
   cd workspace/_repos/{repo}
   git pull
   ```

2. 检查是否有变更：
   ```bash
   git log --oneline -5  # 查看最近提交
   ```

3. 更新 `metadata.yaml` 中的信息：
   - 更新 stars 数量
   - 更新组件统计
   - 更新 `collected_at` 日期

4. 询问用户是否要重新生成 `analysis.md`：
   - 如果用户确认，重新分析并生成
   - 如果用户拒绝，保留现有分析

### 7. 更新索引

运行索引生成脚本：
```bash
node tools/gen-index.js
```

### 8. 输出结果

显示收集结果摘要：
- 类型（framework/resource）
- 创建的目录路径
- 生成的文件列表
- 提示用户补充评估信息

## 示例

```bash
/collect https://github.com/obra/superpowers
# → 识别为 framework
# → 克隆到 workspace/_repos/superpowers
# → 创建 workspace/frameworks/superpowers/
# → 生成 metadata.yaml + analysis.md
# → 更新索引
```

```bash
/collect https://github.com/user/repo/blob/main/skill.md
# → 识别为 resource
# → 下载到 workspace/resources/{id}/files/
# → 生成 metadata.yaml
# → 更新索引
```
