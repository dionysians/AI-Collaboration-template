# 代码审查 (/review)

触发两阶段代码审查流程。

## 使用方式

```
/review
```

## 执行流程

调用 `code-reviewer` agent：

### 阶段 1：规格合规

**有 AC 时执行**（Story 执行后的审查）：
- 逐条核对 AC（如果有 Story 上下文）
- 检查范围：有没有漏做/多做
- 无 AC 上下文时跳过此阶段

**有 Spec 时增加 Spec 维度**：
- 如果有 Domain Spec → 检查实现是否符合行为规则和状态机定义
- 如果有 Contract Spec → 检查 API 是否符合契约（字段、类型、错误码）
- 如果有 Flow Spec → 检查实现是否覆盖了相关场景
- 如果有 Project Spec → 检查是否有跨模块边界的越权

### 阶段 2：代码质量

- CRITICAL — 安全漏洞（阻塞）
- HIGH — 代码质量问题（阻塞）
- MEDIUM — 性能和最佳实践（建议修复）
- LOW — 可选优化

## 审批标准

- ✅ 通过：无 CRITICAL/HIGH，AC 全部满足（如有），Spec 合规（如有）
- ⚠️ 有条件通过：仅 MEDIUM 问题
- ❌ 不通过：有 CRITICAL/HIGH，或 AC/Spec 不合规

## 使用时机

- 每个 Story 完成后（在 /feature 流程中自动触发）
- PR 前
- 重大重构后
- 任何时候想检查代码质量
