# 模板规范

## 模板目录结构

每个模板必须包含：

```
[template-id]/
├── manifest.yaml      # 必须：模板元信息
└── ...                # 实际配置文件
```

## manifest.yaml 必填字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 模板唯一标识，与目录名一致 |
| `name` | string | 显示名称 |
| `description` | string | 模板描述 |
| `tools` | string[] | 包含哪些工具的配置 |

## manifest.yaml 可选字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `tags` | string[] | 标签 |
| `version` | string | 版本号 |
| `updated_at` | string | 更新日期 |
| `includes` | object[] | 包含内容说明 |

## 支持的工具配置

| 工具 | 配置位置 |
|------|----------|
| Claude Code | `.claude/`, `CLAUDE.md` |
| Cursor | `.cursor/`, `.cursorrules` |
| Windsurf | `.windsurf/` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Continue | `.continue/` |

## 命名约定

- 模板 ID 使用 kebab-case：`frontend-react`, `backend-node`
- 配置文件保持各工具的标准命名
