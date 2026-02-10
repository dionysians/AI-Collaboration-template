# AI 编程工具配置管理调研报告

## 一、核心发现

社区已经形成了多种 AI 编程工具配置管理的模式，主要分为以下几类：

### 1. Awesome 列表模式
纯粹的资源收集和索引，不涉及实际配置管理。

| 仓库 | 特点 | Stars |
|------|------|-------|
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | 8大分类，涵盖 Skills/Hooks/Commands 等 | 21.8k |
| [ccplugins/awesome-claude-code-plugins](https://github.com/ccplugins/awesome-claude-code-plugins) | 13个分类，100+ 插件，支持 marketplace.json | - |
| [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) | 12个主分类，按框架/语言组织 | - |
| [wong2/awesome-mcp-servers](https://github.com/wong2/awesome-mcp-servers) | MCP 服务器集合 | - |
| [appcypher/awesome-mcp-servers](https://github.com/appcypher/awesome-mcp-servers) | 生产级 MCP 服务器列表 | - |

### 2. 配置同步工具模式
专门的 CLI 工具来管理多项目间的配置同步。

| 工具 | 特点 |
|------|------|
| [dotgh](https://github.com/openjny/dotgh) | Go 编写，支持 Git 风格的 push/pull 同步，管理 AGENTS.md、copilot-instructions 等 |
| [ai-dotfiles](https://github.com/alepeh/ai-dotfiles) | Python 编写，"一次定义，多处生成"理念，支持 Claude Code/Cursor/Continue.dev |

### 3. Dotfiles 模式
将 AI 工具配置视为传统 dotfiles 的一部分。

| 项目 | 特点 |
|------|------|
| [atxtechbro/dotfiles](https://github.com/atxtechbro/dotfiles) | 单一 `.agent-config.yml` 跨工具复用 |
| [claudefiles.dev](https://claudefiles.dev/) | 社区配置分享平台，类似 dotfiles 的理念 |

---

## 二、各工具的配置组织方式

### Claude Code 生态

```
项目根目录/
├── CLAUDE.md                 # 项目上下文和规则
├── .claude/
│   ├── settings.json         # 本地设置
│   ├── commands/             # 自定义斜杠命令
│   │   └── my-command.md
│   └── .mcp.json             # MCP 服务器配置
└── .claude-plugin/           # 插件目录 (如果是插件项目)
    ├── plugin.json
    ├── agents/
    ├── skills/
    └── hooks/
```

**资源类型：**
- **Skills** - 模型控制的专业化任务配置
- **Hooks** - 生命周期钩子 (PreToolUse/PostToolUse/Stop 等)
- **Slash Commands** - 用户触发的自定义命令
- **Agents/Subagents** - 子代理配置
- **MCP Servers** - 外部工具集成

### Cursor 生态

```
项目根目录/
├── .cursorrules              # 传统规则文件
├── .cursor/
│   └── rules/
│       └── *.mdc             # MDC 格式规则文件
└── .cursorignore             # 忽略文件
```

**组织方式：**
- 按框架分类: `nextjs-`, `react-`, `vue-`
- 按语言分类: `python-`, `typescript-`, `go-`
- 按功能分类: `testing-`, `api-`, `database-`

### MCP 生态

```
~/.config/
└── claude/
    └── claude_desktop_config.json   # MCP 服务器配置

# 或项目级
项目根目录/
└── .vscode/
    └── mcp.json
```

---

## 三、值得借鉴的设计理念

### 1. ai-dotfiles 的"一次定义，多处生成"

```yaml
# 通用服务定义
services:
  obsidian:
    vault_path: ~/Notes
  github:
    token: ${GITHUB_TOKEN}

# 工具适配器自动生成对应配置
adapters:
  - claude-code
  - cursor
  - continue
```

**优点：** 避免重复维护，统一管理
**适用场景：** 需要在多个 AI 工具间保持一致配置

### 2. dotgh 的模板管理

```bash
dotgh push my-react-template    # 保存当前配置为模板
dotgh pull my-react-template    # 应用模板到新项目
dotgh diff my-react-template    # 查看差异
dotgh sync push/pull            # 远程同步
```

**优点：** Git 风格操作，直观易用
**适用场景：** 跨项目复用配置模板

### 3. ccplugins 的 Marketplace 机制

```json
// .claude-plugin/marketplace.json
{
  "name": "my-marketplace",
  "plugins": [
    {
      "name": "pr-review-toolkit",
      "version": "1.0.0",
      "path": "./plugins/pr-review-toolkit"
    }
  ]
}
```

**优点：** 可分享、可发现、模块化
**适用场景：** 构建插件生态

### 4. hesreallyhim/awesome-claude-code 的分类体系

| 分类 | 描述 |
|------|------|
| Agent Skills 🤖 | 模型控制的专业技能 |
| Workflows 🧠 | 完整工作流程配置 |
| Tooling 🧰 | 基于 Claude Code 构建的工具 |
| Hooks 🪝 | 生命周期钩子 |
| Slash-Commands 🔪 | 自定义命令 |
| CLAUDE.md 📂 | 项目配置文件 |
| Status Lines 📊 | 终端状态栏 |
| Alternative Clients 📱 | 替代客户端 |

---

## 四、对我们项目的建议

### 工作台区域 (workspace/)

建议采用**双维度分类**：

```
workspace/
├── by-type/                    # 按资源类型
│   ├── skills/
│   ├── hooks/
│   ├── commands/
│   ├── agents/
│   ├── mcp-servers/
│   └── prompts/
│
├── by-tool/                    # 按工具平台
│   ├── claude-code/
│   ├── cursor/
│   ├── windsurf/
│   └── copilot/
│
└── by-source/                  # 按来源追踪
    ├── awesome-lists/          # 从 awesome 列表收集
    ├── official/               # 官方资源
    └── community/              # 社区贡献
```

### 模板区域 (templates/)

借鉴 **ai-dotfiles** 的理念，支持跨工具生成：

```
templates/
├── _base/                      # 基础配置（所有模板继承）
│   ├── shared/                 # 通用定义
│   │   └── services.yaml       # 服务配置
│   └── adapters/               # 工具适配器
│       ├── claude-code/
│       ├── cursor/
│       └── windsurf/
│
├── frontend/
│   ├── manifest.yaml           # 模板清单
│   ├── shared/                 # 本模板的通用定义
│   └── output/                 # 生成的配置文件
│       ├── .claude/
│       ├── .cursor/
│       └── CLAUDE.md
│
└── backend/
    └── ...
```

### 工具脚本 (tools/)

```
tools/
├── collect.sh                  # 从 awesome 列表批量收集
├── compare.py                  # 对比分析工具
├── generate.py                 # 从模板生成配置
└── install.sh                  # 安装到目标项目
```

---

## 五、推荐关注的优质资源

### Claude Code

| 资源 | 类型 | 特点 |
|------|------|------|
| Trail of Bits Security Skills | Skills | 专业安全审计，12+ 技能 |
| Context Engineering Kit | Skills | 高级上下文工程技巧 |
| Compound Engineering Plugin | Plugin | 错误驱动改进的代理集 |
| claude-plugins-official | Plugin | Anthropic 官方插件目录 |

### Cursor

| 资源 | 特点 |
|------|------|
| blefnk/awesome-cursor-rules | 优化现代前端开发 (Next.js 15, React 19, Tailwind 4) |
| sparesparrow/cursor-rules | AI 驱动应用开发，认知架构 |

### MCP

| 资源 | 特点 |
|------|------|
| modelcontextprotocol/servers | 官方参考实现 |
| IBM/mcp | IBM 产品集成 |

---

## 六、参考链接

### Awesome 列表
- https://github.com/hesreallyhim/awesome-claude-code
- https://github.com/ccplugins/awesome-claude-code-plugins
- https://github.com/jqueryscript/awesome-claude-code
- https://github.com/PatrickJS/awesome-cursorrules
- https://github.com/wong2/awesome-mcp-servers
- https://github.com/appcypher/awesome-mcp-servers

### 配置管理工具
- https://github.com/openjny/dotgh
- https://github.com/alepeh/ai-dotfiles
- https://claudefiles.dev/

### 最佳实践文章
- https://engineersmeetai.substack.com/p/a-practical-guide-to-ai-dotfiles
- https://cutler.sg/blog/2025-08-dotfiles-ai-coding-productivity-revolution
