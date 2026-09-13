# Task 2 实现报告：冻结单词学习批次

## 实现

- 将候选筛选逻辑提取为公开的 `getWordCandidates`，不再受 `limit` 限制；`selectWords` 与 `countAvailableWords` 继续校验正整数 limit，并保持 mastered 模式返回完整队列的既有契约。
- 新增 `WordBatchRule`、`WordStudyBatch`、`createWordStudyBatch`、`completeWordInBatch` 与 `selectBatchWords`。
- 创建批次时按规则冻结候选 ID；`actualSize` 使用实际选中数，完成单词只从冻结的剩余 ID 中移除，不会补入新候选。

## 测试与验证

- RED：`npx vitest run src/domain/word-selection.test.ts src/domain/word-study-batch.test.ts --reporter=dot --pool=threads --maxWorkers=1 --no-file-parallelism` 首次运行因缺少 `word-study-batch.ts` 与 `getWordCandidates` 导出失败（既有测试 9/9 通过，新断言按预期失败）。
- GREEN/聚焦：同命令在实现后通过，2 个测试文件、14 个测试全部通过。
- Lint：`npm run lint` 通过。
- 完整套件：`npm run test:run -- --pool=threads --maxWorkers=1 --no-file-parallelism --reporter=verbose` 通过，27 个测试文件、92 个测试全部通过，退出码 0。

## 变更文件

- `web/src/domain/word-selection.ts`
- `web/src/domain/word-selection.test.ts`
- `web/src/domain/word-study-batch.ts`
- `web/src/domain/word-study-batch.test.ts`

## 自审

- 批次仅保存并操作 `wordIds`/`remainingWordIds`，完成后不会从全量单词列表重新补充。
- 初始字母校验保持单个大写 A-Z；随机规则复用既有确定性 `shuffleWords`。
- 查询仅在冻结批次的剩余单词上执行，且同时匹配英文词与中文释义。

## 风险

- Vitest 默认 worker 配置在本 Windows 工作树中未能在执行器 30 秒窗口内返回摘要；使用单 worker 参数可稳定完成，结果如上。该环境现象不影响测试结论。

## 审查修复追加

- 修复 Important：为 `WordBatchRule`、`WordStudyBatch` 及创建结果声明 readonly；为 `createWordStudyBatch` 添加显式返回类型；输出时复制规则，并为 `wordIds` 与 `remainingWordIds` 创建独立数组快照。
- 补充回归覆盖：mastered limit=1 返回全部匹配项、随机候选确定性与非法 seed、重复完成、词表缺失冻结 ID、完成后搜索排除已完成单词，以及 readonly 类型断言。
- 修复 RED：`npm run test:run -- src/domain/word-selection.test.ts src/domain/word-study-batch.test.ts --reporter=dot --pool=threads --maxWorkers=1 --no-file-parallelism` 失败于快照数组同一引用（1 failed, 18 passed）。
- 修复 GREEN/聚焦：同命令通过，2 个测试文件、19 个测试全部通过。
- 修复 lint：`npm run lint` 通过。
- 修复完整套件：`npm run test:run -- --pool=threads --maxWorkers=1 --no-file-parallelism --reporter=dot` 通过，27 个测试文件、97 个测试全部通过，退出码 0。
