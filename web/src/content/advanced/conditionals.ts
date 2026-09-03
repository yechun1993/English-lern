import { createAdvancedQuestions } from './advanced-utils'

export const conditionals = createAdvancedQuestions('条件句与虚拟语气', 241, [
  ['If I ___ you, I would take the job.', ['am', 'was', 'were', 'had been'], 'were', '与现在事实相反的条件句常用 If I were you。', '正式英语中第一人称单数也用 were。'],
  ['If she ___ harder, she would pass the exam.', ['studies', 'studied', 'had studied', 'will study'], 'studied', '与现在或将来事实相反：if 从句用过去式，主句 would do。', '不要在虚拟条件从句中用 will。'],
  ['If we had left earlier, we ___ the train.', ['would catch', 'would have caught', 'caught', 'had caught'], 'would have caught', '与过去事实相反：if had done，主句 would have done。', '过去虚拟主句不能只用 would catch。'],
  ['Had I known the truth, I ___ you at once.', ['will tell', 'would tell', 'would have told', 'told'], 'would have told', 'Had I known = If I had known，是过去虚拟的倒装。', '省略 if 后，主句时态规则不变。'],
  ['If it ___ tomorrow, we will stay at home.', ['rains', 'will rain', 'rained', 'had rained'], 'rains', '真实条件句中主将从现：if 从句用一般现在时。', '不是所有 if 从句都用过去式。'],
  ['I wish I ___ how to repair the computer.', ['know', 'knew', 'had known', 'will know'], 'knew', 'wish 后对现在的愿望常用过去式。', 'know 表示现实，不能表达遗憾愿望。'],
  ['She wishes she ___ more carefully before making that choice.', ['thinks', 'thought', 'had thought', 'will think'], 'had thought', 'wish 后对过去的遗憾用 had + 过去分词。', 'thought 只表示对现在的虚拟。'],
  ['The doctor suggested that he ___ smoking.', ['gives up', 'gave up', 'give up', 'will give up'], 'give up', 'suggest 表“建议”时，其从句用 should + 原形，should 可省略。', '不要因主句过去式而把从句也改为 gave up。'],
  ['It is high time we ___ action to protect the river.', ['take', 'took', 'have taken', 'will take'], 'took', 'It is high time 后常用过去式，表示“早该……了”。', '句意虽指现在，形式用 took。'],
  ['I would rather you ___ me before you visit next time.', ['call', 'called', 'had called', 'will call'], 'called', 'would rather 后接从句，对将来/现在愿望用过去式。', 'would rather 后不是直接用 will。'],
  ['But for your help, I ___ the work on time.', ['cannot finish', 'could not finish', 'could not have finished', 'did not finish'], 'could not have finished', 'but for 表示“要不是”，这里指过去得到的帮助。', '完成时线索是 on time 的已完成工作。'],
  ['Without the map, we ___ our way in the mountains yesterday.', ['lose', 'would lose', 'would have lost', 'lost'], 'would have lost', 'without 引出的假设对应过去结果，用 would have done。', 'yesterday 提示过去虚拟。'],
  ['He talks as if he ___ everything about the matter.', ['knows', 'knew', 'had known', 'will know'], 'knew', 'as if 表示与现在事实不符时用过去式。', '若为真实可能，才可用 knows。'],
  ['I missed the bus; otherwise, I ___ on time.', ['arrive', 'would arrive', 'would have arrived', 'arrived'], 'would have arrived', 'otherwise 暗含过去条件，结果用 would have done。', '前句 missed 表明结果已在过去。'],
  ['If it had not been for the rain, the match ___.', ['will continue', 'would continue', 'would have continued', 'continued'], 'would have continued', 'If it had not been for 表示过去的假设原因。', '主句需对应过去完成的结果。'],
  ['Should you ___ any questions, please contact us.', ['have', 'had', 'having', 'to have'], 'have', 'Should you have ... 是 If you should have ... 的倒装。', 'should 后接动词原形。'],
  ['We can finish the project on Friday ___ everyone works together.', ['unless', 'provided that', 'although', 'because of'], 'provided that', 'provided that 表示“只要/条件是”。', 'unless 意为“除非”，会改变句意。'],
  ['If only I ___ more time to prepare for the interview!', ['have', 'had', 'will have', 'have had'], 'had', 'If only 表强烈愿望，对现在用过去式。', 'have 只陈述事实，不表达遗憾。'],
  ['It is essential that every applicant ___ the form honestly.', ['fills', 'filled', 'fill', 'will fill'], 'fill', 'essential 后的 that 从句常用 should + 动词原形，should 可省。', '不要受 every applicant 单数影响而选 fills。'],
  ['The teacher spoke slowly in case the students ___ the key point.', ['miss', 'missed', 'would miss', 'had missed'], 'missed', 'in case 表“以防”，过去主句下从句可用过去式表达预防。', '这里不是虚拟条件结果句，不用 would miss。'],
])
