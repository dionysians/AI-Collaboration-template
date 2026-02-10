---
name: gen-index
description: 更新 workspace 索引文件。扫描 resources/ 和 frameworks/ 目录，生成 by-type.md、by-tool.md、by-source.md 索引。
disable-model-invocation: true
allowed-tools: Bash(node:*)
---

# 更新 Workspace 索引

运行索引生成脚本，更新 `workspace/indexes/` 目录下的索引文件。

## 执行步骤

1. 运行 `node tools/gen-index.js`
2. 显示生成结果

## 输出文件

- `workspace/indexes/by-type.md` - 按类型索引
- `workspace/indexes/by-tool.md` - 按工具索引
- `workspace/indexes/by-source.md` - 按来源索引
