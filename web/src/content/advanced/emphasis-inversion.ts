import { createAdvancedQuestions } from './advanced-utils'

export const emphasisInversion = createAdvancedQuestions('强调句、倒装句与省略', 261, [
  ['It was in the library ___ I found the old photograph.', ['which', 'where', 'that', 'what'], 'that', '强调句基本结构是 It is/was + 被强调部分 + that/who + 其余。', '去掉 It was 和 that 后，句子仍完整。'],
  ['___ Mary who helped me solve the problem.', ['It was', 'There was', 'That was', 'What was'], 'It was', '强调人且主句为过去时，用 It was ... who ...。', 'There was 表示存在，不构成强调句。'],
  ['I do ___ you to check the address before sending the letter.', ['hope', 'hoped', 'hoping', 'to hope'], 'hope', 'do + 动词原形可加强肯定语气。', 'do 后必须接原形。'],
  ['Not until the rain stopped ___ the game begin.', ['did', 'was', 'had', 'has'], 'did', 'Not until 位于句首时，主句部分倒装；begin 用原形。', '倒装的是主句，不是 until 从句。'],
  ['Only when the lights went out ___ that something was wrong.', ['we realized', 'did we realize', 'we did realize', 'had we realized'], 'did we realize', 'Only + 状语位于句首时，主句要部分倒装。', '不能保留普通语序 we realized。'],
  ['Never ___ such a beautiful view before.', ['I saw', 'have I seen', 'I have seen', 'did I saw'], 'have I seen', '否定副词 Never 置首，助动词提前；before 常配现在完成时。', 'did 后应接 see，不能接 saw。'],
  ['Hardly had I sat down ___ the phone rang.', ['than', 'when', 'then', 'while'], 'when', 'Hardly ... when ... 表示“刚……就……”。', 'no sooner 才通常与 than 搭配。'],
  ['So tired ___ after the long walk that she fell asleep quickly.', ['was she', 'she was', 'did she', 'she did'], 'was she', 'So + adjective 位于句首时，用表语前置倒装。', 'be 动词需提前到主语前。'],
  ['I cannot swim, and neither ___ my brother.', ['can', 'cannot', 'does', 'is'], 'can', 'neither + 助动词 + 主语，表示“……也不”。', '后面的助动词与前句 can 对应。'],
  ['Tom likes classical music, and so ___ I.', ['do', 'am', 'have', 'will'], 'do', 'so + 助动词 + 主语表示“……也是如此”。', 'like 是一般现在时实义动词，用 do。'],
  ['If ___, please leave your name and number after the beep.', ['call', 'calling', 'called', 'to call'], 'called', 'If called = if you are called，是条件从句的省略。', '省略时保留与主语的被动关系。'],
  ['Though ___, the idea is still worth trying.', ['it is simple', 'simple', 'is simple', 'it simple'], 'simple', 'though 后可省略“主语 + be”，保留表语。', '不能同时保留 is 而省掉主语。'],
  ['Not only ___ late, but he also forgot the documents.', ['he arrived', 'did he arrive', 'he did arrive', 'had he arrived'], 'did he arrive', 'Not only 位于句首时，前半句部分倒装。', 'but also 后通常保持正常语序。'],
  ['Little ___ that the small decision would change her life.', ['she knew', 'did she know', 'she did know', 'had she known'], 'did she know', 'Little 表否定意义置首，用 did + 主语 + 原形 know。', '不能写 did she knew。'],
  ['At the end of the street ___ a small coffee shop.', ['is', 'are', 'it is', 'there is'], 'is', '地点状语置首，主语是单数名词 shop 时可用完全倒装。', '谓语要与后面的真正主语 shop 一致。'],
  ['There ___ a book and two pens on the desk.', ['is', 'are', 'have', 'were'], 'is', 'there be 常按最靠近的名词 a book 决定单复数。', '不要只看后面的 two pens。'],
  ['The more carefully you plan, the ___ mistakes you will make.', ['few', 'fewer', 'less', 'least'], 'fewer', '可数名词 mistakes 用 fewer；the more ..., the fewer ...。', 'less 修饰不可数名词。'],
  ['What he needs most ___ enough rest.', ['are', 'were', 'is', 'have'], 'is', '主语从句 What he needs most 整体看作单数。', '不要被 rest 或 needs 的形式干扰。'],
  ['It was not until midnight ___ he returned home.', ['when', 'that', 'which', 'what'], 'that', 'not until 的强调句仍用 that 连接其余部分。', 'when 不能构成该强调句框架。'],
  ['—I have never visited Shenzhen. —___, but I hope to go there soon.', ['So have I', 'Neither have I', 'Neither do I', 'So do I'], 'Neither have I', '对现在完成时的否定陈述，答语用 Neither have I。', '助动词要与 have visited 一致。'],
])
