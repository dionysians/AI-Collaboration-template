# Templates - 成品模板

精炼后的项目模板，可直接应用到新项目。

## 可用模板

| 模板 | 描述 |
|------|------|
| (待添加) | |

## 模板结构

每个模板是独立完整的，包含：

```
[template-name]/
├── manifest.yaml      # 模板元信息
├── .claude/           # Claude Code 配置
├── .cursor/           # Cursor 配置
├── .windsurf/         # Windsurf 配置
├── CLAUDE.md          # Claude Code 项目规则
└── ...                # 其他配置文件
```

## manifest.yaml 字段

```yaml
id: frontend-react
name: Frontend React
description: React 前端项目模板

tools:
  - claude-code
  - cursor

tags:
  - frontend
  - react
```

## 使用方法

```bash
npx ai-collab-template init --template [template-name]
```
