# {flow-name}-flow

<!-- 存放位置: spec/3_flow/iteration_XX/{name}-flow.md -->
<!-- Flow MUST 按迭代新增，不覆盖历史版本 -->
<!-- Flow MUST 只描述场景，不定义新规则（规则属于 Domain Spec） -->

## Context

描述该流程的背景与触发条件。

## Preconditions (Given)

列出开始该流程前必须满足的条件：

- Given [前置条件 1]
- Given [前置条件 2]

## Action (When)

描述行为主体执行的动作：

- When [动作描述]

## Expected Outcome (Then)

逐条描述预期结果（AI 与测试框架将以此生成断言）：

- Then [预期结果 1]
- Then [预期结果 2]

## State Transitions

明确该流程对领域状态机的影响：

```
[状态A] → [状态B]
```

引用: `spec/1_domain/{domain}-domain.md` 的状态机定义

## Edge Cases

列出边缘场景：

- **[场景名]**: [描述] → 预期行为: [结果]
- **[场景名]**: [描述] → 预期行为: [结果]
