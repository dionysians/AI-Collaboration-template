# 验证循环 (/verify)

触发完整验证流程，确保代码可发布。

## 使用方式

```
/verify          # 基础验证（8 阶段）
/verify --full   # 扩展验证（基础 + Contract/Performance/Security）
```

## 执行流程

触发 `verification-loop` skill：

### 基础验证（8 阶段）
1. Build — 构建是否成功
2. Types — 类型检查是否通过
3. Lint — Lint 是否通过
4. Unit Tests — 单元测试 + 覆盖率（≥80%）
5. Integration — 集成测试（有脚本直接运行，无脚本降级验证）
6. E2E Core — E2E 测试（有脚本直接运行，无脚本烟雾测试）
7. Security — 密钥泄露 + 代码安全模式 + 依赖审计 + 调试语句
8. Diff — 变更文件审查

### 扩展验证 (--full)
- Contract 测试
- 性能测试
- 依赖安全扫描
- Bundle 大小检查

## 输出

```
VERIFICATION REPORT
==================
Build:        [PASS/FAIL]
Types:        [PASS/FAIL]
Unit Tests:   [PASS/FAIL] (X% coverage)
Integration:  [PASS/FAIL/WARN/N/A]
E2E Core:     [PASS/FAIL/WARN/N/A]
Security:     [PASS/FAIL]
Diff:         [X files changed]
Overall:      [READY/NOT READY] for PR
```

WARN = 有跨模块变更但无对应测试，N/A = 不涉及此场景。

## 使用时机

- 每个 Story 完成后
- PR 前（建议 --full）
- 重大变更后
- 定期检查点
