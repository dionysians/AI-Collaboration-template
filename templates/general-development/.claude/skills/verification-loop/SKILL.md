---
name: verification-loop
description: 8 阶段验证循环（Build/Types/Lint/Unit/Integration/E2E/Security/Diff）。支持 --full 扩展验证。
triggers:
  - /verify
  - story-execution Step 4
  - PR 前
---

# 验证循环 (Verification Loop)

## 概述

在声称完成之前，必须有验证证据。"应该能行"不是验证。

**核心原则**：没有验证证据，就不能声称完成。

## 适用时机

- 完成一个功能或重大代码变更后
- 创建 PR 前
- 重构后
- 每个 Story 完成后

## 验证阶段

### 阶段 1：构建验证

```bash
# 检测项目构建方式并执行
# npm/pnpm/yarn
npm run build 2>&1 | tail -20

# cargo
cargo build 2>&1 | tail -20

# python
python -m py_compile main.py

# go
go build ./...
```

构建失败 → **停下来修复，不继续**。

### 阶段 2：类型检查

```bash
# TypeScript
npx tsc --noEmit 2>&1 | head -30

# Python (mypy/pyright)
mypy . 2>&1 | head -30

# 其他类型系统
# 根据项目配置选择工具
```

报告所有类型错误。修复关键错误后再继续。

### 阶段 3：Lint 检查

```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30

# Go
golangci-lint run 2>&1 | head -30

# Rust
cargo clippy 2>&1 | head -30
```

### 阶段 4：单元测试

```bash
# 运行测试 + 覆盖率
npm run test -- --coverage 2>&1 | tail -50

# 或根据项目
pytest --cov 2>&1 | tail -50
cargo test 2>&1 | tail -50
go test ./... -cover 2>&1 | tail -50
```

目标覆盖率：**≥ 80%**

### 阶段 5：集成测试

**有专用脚本时**：运行 `test:integration` / `pytest -m integration` 等。

**无专用脚本时（降级验证）**：
1. 搜索项目中的集成测试文件（`*.integration.test.*`、`test/integration/`、`tests/integration/`）
2. 找到 → 直接用测试框架运行这些文件
3. 未找到 → 检查本次变更是否涉及模块间交互（API 调用、数据库、外部服务）
   - 涉及 → 报告 `WARN: 有跨模块变更但无集成测试`
   - 不涉及 → 报告 `N/A`（纯内部逻辑，单元测试已覆盖）

### 阶段 6：E2E 测试（核心路径）

**有专用脚本时**：运行 `test:e2e` / Playwright / Cypress 等。

**无专用脚本时（降级验证）**：
1. 搜索 E2E 测试文件（`e2e/`、`*.e2e.test.*`、`cypress/`、`playwright/`）
2. 找到 → 直接运行
3. 未找到 → 对本次变更的核心路径做 **手动烟雾测试**：
   - 识别变更涉及的用户可见行为
   - 用 Bash 调用 API / CLI 验证核心路径可用
   - 纯库/工具类变更 → 报告 `N/A`

### 阶段 7：安全扫描

**7a. 密钥泄露检查**（用 Grep 工具扫描变更文件）：
- 硬编码密钥模式：`sk-`、`api_key`、`password\s*=`、`secret`、`token`（排除测试文件和 `.env.example`）
- `.env` 文件是否在 `.gitignore` 中

**7b. 代码安全模式检查**（针对本次变更的文件）：
- SQL 拼接（非参数化查询）
- 未转义的 HTML 输出（`v-html`、`dangerouslySetInnerHTML`、`innerHTML`）
- 不安全的反序列化（`eval`、`pickle.loads`、`yaml.load` 无 SafeLoader）

**7c. 依赖安全**（如有工具）：
- `npm audit` / `pip audit` / `cargo audit`
- 无审计工具 → 检查是否有新增依赖，提示手动审查

**7d. console.log / debug 遗留**：
- 扫描源码目录中的调试语句（`console.log`、`print(` 非日志、`debugger`）

### 阶段 8：Diff 审查

```bash
# 查看变更范围
git diff --stat
git diff HEAD~1 --name-only
```

审查每个变更文件：
- 有没有意外变更？
- 遗漏错误处理？
- 潜在边界情况？

## 扩展验证 (--full)

在基础 8 阶段之上，PR 前运行：

| 检查项 | 命令/方式 |
|--------|----------|
| Contract 测试 | `npm run test:contract`（如有） |
| 性能测试 | `npm run test:perf`（如有） |
| 安全依赖扫描 | `npm audit` / `pip audit` |
| Bundle 大小 | `npm run build && ls -la dist/` |

## 报告格式

```
VERIFICATION REPORT
==================

Build:        [PASS/FAIL]
Types:        [PASS/FAIL] (X errors)
Lint:         [PASS/FAIL] (X warnings)
Unit Tests:   [PASS/FAIL] (X/Y passed, Z% coverage)
Integration:  [PASS/FAIL/WARN/N/A]
E2E Core:     [PASS/FAIL/WARN/N/A]
Security:     [PASS/FAIL] (X issues)
Diff:         [X files changed]

Overall:      [READY/NOT READY] for PR

Issues to Fix:
1. ...
2. ...

Warnings:
1. ...
```

**状态说明**：
- `PASS` — 验证通过
- `FAIL` — 验证失败，必须修复
- `WARN` — 有跨模块变更但无对应测试覆盖，建议补充
- `N/A` — 本次变更不涉及此类验证场景

## 自动检测

验证循环会自动检测项目中可用的工具和脚本：
- 有 `package.json` → 检查 npm scripts
- 有 `Cargo.toml` → 使用 cargo 工具链
- 有 `pyproject.toml` / `setup.py` → 使用 Python 工具链
- 有 `go.mod` → 使用 Go 工具链

无专用脚本时自动降级：用 Claude 工具能力做替代验证（搜索测试文件、手动烟雾测试、Grep 安全扫描），不直接 SKIP。

## 持续模式

长时间工作时，在以下节点运行验证：
- 完成每个函数/组件后
- 完成每个 Story 后
- 切换到下一个任务前
