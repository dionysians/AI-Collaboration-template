# Everything Claude Code 分析笔记

> 收集日期: 2026-01-26
> 来源: https://github.com/affaan-m/everything-claude-code

## 概述

Anthropic Hackathon 冠军的完整 Claude Code 配置集合。包含 agents、skills、hooks、commands、rules、MCP 配置等，经过 10+ 个月实际产品开发验证的生产级配置。

## 项目数据

- Stars: 29,959
- Forks: 3,590
- License: 未指定（README 显示 MIT badge）

## 仓库结构

```
everything-claude-code/
├── .claude-plugin/       # Claude Code 插件配置
│   ├── plugin.json       # 插件元数据
│   └── marketplace.json  # Marketplace 目录
├── .claude/              # Claude 配置
├── agents/               # 10 个专业化子代理
│   ├── architect.md      # 系统设计
│   ├── planner.md        # 功能规划
│   ├── tdd-guide.md      # TDD 开发
│   ├── code-reviewer.md  # 代码审查
│   ├── security-reviewer.md  # 安全审查
│   ├── database-reviewer.md  # 数据库审查
│   ├── build-error-resolver.md  # 构建错误解决
│   ├── doc-updater.md    # 文档更新
│   ├── e2e-runner.md     # E2E 测试
│   └── refactor-cleaner.md  # 重构清理
├── commands/             # 15 个命令
│   ├── plan.md           # 规划命令
│   ├── tdd.md            # TDD 命令
│   ├── e2e.md            # E2E 测试命令
│   ├── code-review.md    # 代码审查
│   ├── checkpoint.md     # 检查点
│   └── ...
├── skills/               # 14 个技能目录
│   ├── continuous-learning/     # 持续学习
│   ├── continuous-learning-v2/  # 持续学习 v2
│   ├── verification-loop/       # 验证循环
│   ├── strategic-compact/       # 策略性压缩
│   ├── iterative-retrieval/     # 迭代检索
│   ├── tdd-workflow/            # TDD 工作流
│   ├── security-review/         # 安全审查
│   ├── eval-harness/            # 评估框架
│   └── ...
├── rules/                # 8 个规则文件
│   ├── coding-style.md   # 编码风格
│   ├── testing.md        # 测试规则
│   ├── security.md       # 安全规则
│   ├── performance.md    # 性能规则
│   ├── git-workflow.md   # Git 工作流
│   └── ...
├── hooks/                # Hook 配置
│   └── hooks.json        # Hook 定义
├── mcp-configs/          # MCP 服务器配置
├── contexts/             # 上下文配置
├── examples/             # 示例
├── plugins/              # 插件说明
├── scripts/              # 辅助脚本
└── tests/                # 测试
```

## 核心组件分析

### Agents (10 个)

| Agent | 用途 | 大小 |
|-------|------|------|
| architect.md | 系统架构设计决策 | 6KB |
| planner.md | 功能实现规划 | 3KB |
| tdd-guide.md | 测试驱动开发指导 | 7KB |
| code-reviewer.md | 代码质量和安全审查 | 3KB |
| security-reviewer.md | 漏洞分析 | 14KB |
| database-reviewer.md | 数据库审查 | 18KB |
| build-error-resolver.md | 构建错误解决 | 12KB |
| doc-updater.md | 文档更新 | 11KB |
| e2e-runner.md | E2E 测试运行 | 23KB |
| refactor-cleaner.md | 代码重构清理 | 8KB |

### Skills (14 个)

重点关注：
- **continuous-learning** / **continuous-learning-v2**: 自动从会话中提取模式
- **verification-loop**: 检查点 vs 持续评估
- **strategic-compact**: Token 优化策略
- **iterative-retrieval**: 迭代检索模式
- **eval-harness**: 评估框架

### Commands (15 个)

开发流程命令：
- `/plan` - 功能规划
- `/tdd` - TDD 开发
- `/e2e` - E2E 测试
- `/code-review` - 代码审查
- `/checkpoint` - 保存检查点
- `/verify` - 验证
- `/orchestrate` - 编排子代理

### Rules (8 个)

涵盖：coding-style, testing, security, performance, git-workflow, patterns, hooks, agents

## 作者使用指南

> 来源: [The Shorthand Guide to Everything Claude Code](https://x.com/affaanmustafa/status/2012378465664745795) (2026-01-17, 2.5M views, 7K likes)

### 安装方式

**方式 1: 插件安装（推荐）**

```bash
# 添加 marketplace
/plugin marketplace add affaan-m/everything-claude-code

# 安装插件
/plugin install everything-claude-code@everything-claude-code
```

或直接编辑 `~/.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "everything-claude-code": {
      "source": { "source": "github", "repo": "affaan-m/everything-claude-code" }
    }
  },
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**方式 2: 手动安装**

```bash
git clone https://github.com/affaan-m/everything-claude-code.git
cp everything-claude-code/agents/*.md ~/.claude/agents/
cp everything-claude-code/rules/*.md ~/.claude/rules/
cp everything-claude-code/commands/*.md ~/.claude/commands/
cp -r everything-claude-code/skills/* ~/.claude/skills/
```

Hooks 需手动复制 `hooks/hooks.json` 到 `~/.claude/settings.json`。
MCP 配置从 `mcp-configs/mcp-servers.json` 复制到 `~/.claude.json`。

### 使用方式

#### Skills & Commands

Skills 和 Commands 是工作流的快捷入口，可以链式调用：

- `/refactor-clean` - 清理死代码和无用 .md 文件
- `/tdd` - 测试驱动开发
- `/e2e` - E2E 测试
- `/test-coverage` - 测试覆盖率
- `/plan` - 功能规划
- `/code-review` - 代码审查
- `/learn` - 会话中提取模式（高级）
- `/checkpoint` - 保存验证状态（高级）
- `/verify` - 运行验证循环（高级）

**存储位置**:
- Skills: `~/.claude/skills/` - 更广的工作流定义
- Commands: `~/.claude/commands/` - 快速可执行的提示

#### Hooks

Hook 类型:
- `PreToolUse` - 工具执行前（验证、提醒）
- `PostToolUse` - 工具执行后（格式化、反馈循环）
- `UserPromptSubmit` - 用户发送消息时
- `Stop` - Claude 完成响应时
- `PreCompact` - 上下文压缩前
- `Notification` - 权限请求

作者的关键 Hook 配置:

| 触发时机 | 匹配条件 | 动作 |
|----------|---------|------|
| PreToolUse | npm/pnpm/yarn/cargo/pytest | tmux 提醒 |
| PreToolUse | Write && .md 文件 | 阻止非 README/CLAUDE 的 .md 创建 |
| PreToolUse | git push | 打开编辑器审查 |
| PostToolUse | Edit && .ts/.tsx/.js/.jsx | Prettier 自动格式化 |
| PostToolUse | Edit && .ts/.tsx | tsc --noEmit 类型检查 |
| PostToolUse | Edit | console.log 警告 |
| Stop | * | 审计修改文件中的 console.log |

提示: 使用 `hookify` 插件可以对话式创建 hooks，运行 `/hookify` 描述需求即可。

#### Subagents

每个子代理有限定的工具和职责范围：

```
~/.claude/agents/
  planner.md           # 分解功能需求
  architect.md         # 系统设计决策
  tdd-guide.md         # 编写测试优先
  code-reviewer.md     # 代码质量审查
  security-reviewer.md # 漏洞扫描
  build-error-resolver.md  # 构建错误解决
  e2e-runner.md        # Playwright 测试
  refactor-cleaner.md  # 死代码清除
  doc-updater.md       # 文档同步
```

Subagents 配合 Skills 使用效果更好 - 子代理可以自主执行指定的 skills。

### 关键最佳实践

#### Context Window 管理（关键！）

> 200k 的上下文窗口，开启过多 MCP 后可能只剩 70k。

- 配置 20-30 个 MCP，但每个项目只启用 5-6 个（< 10 个）
- 保持活跃工具数 < 80
- 使用 `disabledMcpServers` 按项目禁用不需要的 MCP
- 插件同样需要注意，通常只启用 4-5 个

#### 并行工作流

- `/fork` - 分叉对话，做不重叠的并行任务
- **Git Worktrees** - 处理有重叠的并行 Claude，每个 worktree 独立 checkout
- **tmux** - 管理长时间运行的命令

```bash
git worktree add ../feature-branch feature-branch
# 在每个 worktree 中运行独立的 Claude 实例
```

#### 编辑器选择

作者推荐 **Zed**（Rust 编写，轻量快速）:
- Agent Panel 集成：实时追踪 Claude 的文件变更
- CMD+Shift+R：快速访问自定义命令
- Ctrl+G：快速打开 Claude 正在编辑的文件
- 资源占用小，不与 Claude 竞争系统资源

VSCode/Cursor 也可以，支持 `\ide` 启用 LSP 或使用扩展集成。

### 作者的实际配置

**启用的插件（通常只保持 4-5 个）:**
- typescript-lsp / pyright-lsp（LSP 插件）
- hookify（对话式创建 hooks）
- mgrep（优于 ripgrep 的搜索）
- context7（实时文档）
- commit-commands（Git 工作流）

**MCP 配置**: 14 个 MCP 配置，每项目只启用 ~5-6 个:
- github, supabase, memory, sequential-thinking, vercel
- 按需启用: firecrawl, railway, cloudflare-*, clickhouse 等

### Key Takeaways (作者原话)

1. **Don't overcomplicate** - 配置如同微调，而非架构设计
2. **Context window is precious** - 禁用未使用的 MCP 和插件
3. **Parallel execution** - fork 对话，使用 git worktrees
4. **Automate the repetitive** - 用 hooks 处理格式化、lint、提醒
5. **Scope your subagents** - 工具越少 = 执行越专注

## 核心理念

从 README 和指南中提取的核心概念：

1. **Token 优化**: 模型选择、系统提示精简、后台进程
2. **记忆持久化**: Hooks 自动保存/加载跨会话上下文
3. **持续学习**: 自动从会话中提取模式到可复用技能
4. **验证循环**: Checkpoint vs 持续评估、grader 类型、pass@k 指标
5. **并行化**: Git worktrees、cascade 方法、实例扩展
6. **子代理编排**: 上下文问题、迭代检索模式

## 优点

1. **经过实战验证**: 10+ 个月实际产品开发经验
2. **组件齐全**: 覆盖完整开发流程
3. **跨平台**: 所有 hooks 和脚本用 Node.js 重写
4. **高级功能**: 持续学习、记忆持久化等创新功能
5. **社区认可**: Anthropic Hackathon 冠军、近 3 万 stars
6. **文档完善**: 有配套的 Shorthand 和 Longform 指南

## 不足

1. **无明确 License**: README 标注 MIT 但仓库未设置 license 文件
2. **依赖外部指南**: 高级功能需要阅读 X/Twitter 上的 Longform Guide
3. **组件较多**: 新手建议从 skills + commands 开始，逐步启用其他组件

## 可借鉴的点

1. **Continuous Learning 机制**: 自动从会话中提取模式
2. **Strategic Compact**: Token 优化策略
3. **Verification Loop**: 评估和验证机制
4. **Subagent Orchestration**: 子代理编排模式
5. **Hook 设计**: 记忆持久化的 hook 实现、PostToolUse 自动格式化
6. **完整的 Agent 体系**: 10 个专业化代理的设计
7. **Context Window 管理**: 按项目禁用 MCP 的策略
8. **hookify 模式**: 对话式创建 hooks 的插件设计

## 提取计划

- [ ] 提取 continuous-learning skill 分析其实现
- [ ] 提取 strategic-compact 了解 token 优化策略
- [ ] 提取 verification-loop 学习评估机制
- [ ] 提取核心 agents（architect, planner, tdd-guide）
- [ ] 分析 hooks.json 的设计模式
- [ ] 提取 orchestrate command 学习子代理编排
- [ ] 分析作者 Hook 配置模式（PreToolUse 阻止 + PostToolUse 自动化）
- [ ] 研究 Context Window 管理策略的实现
