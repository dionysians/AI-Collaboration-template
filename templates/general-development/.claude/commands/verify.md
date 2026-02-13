# 验证循环 (/verify)

调用 verifier sub-agent 执行验证流程，确保代码可交付。

## 使用方式

```
/verify          # 基础验证（8 阶段）
/verify --lite   # 轻量验证（Build + Types + Lint + Unit Tests）
/verify --full   # 扩展验证（基础 + Contract/Performance/Security/Bundle）
```

## 三种模式

| 模式 | 阶段数 | 用途 |
|------|--------|------|
| `--lite` | 4 项 | 快速迭代，Agile 模式最终验证 |
| 默认 | 8 阶段 | 标准验证，Full 模式最终验证 |
| `--full` | 8+4 阶段 | 发布前深度验证 |

## 执行流程

调用 `verifier` sub-agent，传入对应 mode 参数。

### --lite（4 项快速检查）
1. Build — 构建是否成功
2. Types — 类型检查是否通过
3. Lint — Lint 是否通过
4. Unit Tests — 单元测试 + 覆盖率（≥80%）

### 默认（8 阶段）
1. Build — 构建是否成功
2. Types — 类型检查是否通过
3. Lint — Lint 是否通过
4. Unit Tests — 单元测试 + 覆盖率（≥80%）
5. Integration — 集成测试（有脚本直接运行，无脚本降级验证）
6. E2E Core — E2E 测试（有脚本直接运行，无脚本烟雾测试）
7. Security — 密钥泄露 + 代码安全模式 + 依赖审计 + 调试语句
8. Diff — 变更文件审查

### --full（扩展验证）
- 基础 8 阶段 +
- Contract 测试
- 性能测试
- 依赖安全深度扫描
- Bundle 大小检查

## 输出

```
VERIFICATION REPORT          # 或 LITE VERIFICATION REPORT
==================
Build:        [PASS/FAIL]
Types:        [PASS/FAIL]
Lint:         [PASS/FAIL]
Unit Tests:   [PASS/FAIL] (X% coverage)
Integration:  [PASS/FAIL/WARN/N/A]    # --lite 时省略
E2E Core:     [PASS/FAIL/WARN/N/A]    # --lite 时省略
Security:     [PASS/FAIL]             # --lite 时省略
Diff:         [X files changed]       # --lite 时省略
Overall:      [READY/NOT READY] for PR
```

WARN = 有跨模块变更但无对应测试，N/A = 不涉及此场景。

## 使用时机

- `/feature` Phase 4 最终验证（Full 模式用默认，Agile 模式用 --lite）
- PR 前（建议 --full）
- 重大变更后
- 定期检查点
