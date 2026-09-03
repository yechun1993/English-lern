import { createAdvancedQuestions } from './advanced-utils'

export const clauses = createAdvancedQuestions('宾语从句、定语从句和状语从句', 221, [
  ['Could you tell me ___ the nearest subway station is?', ['what', 'where', 'which', 'that'], 'where', '宾语从句中缺少地点状语，用 where。', '从句语序要用陈述语序，不要倒装。'],
  ['The reason ___ he was late was ___ the bus broke down.', ['why; because', 'why; that', 'that; because', 'because; that'], 'why; that', 'the reason why ... is that ... 是常用结构。', '表语从句中通常不用 because 与 reason 连用。'],
  ['This is the book ___ I bought for my sister.', ['who', 'whose', 'which', 'where'], 'which', '先行词 book 是物，在从句中作 bought 的宾语。', 'who 只能指人。'],
  ['I still remember the town ___ I spent my childhood.', ['which', 'that', 'where', 'what'], 'where', '先行词表示地点，且在从句中作地点状语，用 where。', '若从句缺宾语才可用 which/that。'],
  ['The woman ___ lives next door is a doctor.', ['which', 'whose', 'who', 'where'], 'who', '先行词 woman 指人，且关系词在从句中作主语。', 'whose 表示所属关系。'],
  ['I do not know ___ he will come to the party or not.', ['that', 'if', 'whether', 'what'], 'whether', '与 or not 连用时通常用 whether。', 'if 后一般不直接跟 or not。'],
  ['We stayed at home ___ it was raining heavily.', ['because', 'because of', 'although', 'unless'], 'because', 'because 后接完整句子说明原因。', 'because of 后应接名词或名词短语。'],
  ['___ he was tired, he finished the work on time.', ['Because', 'Although', 'Since', 'If'], 'Although', '前后为让步关系：虽然累，仍完成了工作。', 'because 会使逻辑变成因果，不合句意。'],
  ['Speak slowly ___ everyone can understand you.', ['although', 'so that', 'unless', 'as if'], 'so that', 'so that 引导目的状语从句。', 'although 表让步，不能表达目的。'],
  ['I will call you ___ I arrive at the airport.', ['until', 'as soon as', 'since', 'while'], 'as soon as', 'as soon as 表示“一……就……”。', '主将从现：时间从句用一般现在时表将来。'],
  ['You will not improve ___ you practise regularly.', ['if', 'unless', 'because', 'when'], 'unless', 'unless = if not，表示“除非”。', 'if 放入后意思变为“如果练习就不会进步”。'],
  ['Not only Tom but also his classmates ___ interested in the project.', ['is', 'are', 'was', 'has'], 'are', 'not only ... but also ... 的谓语与靠近的 classmates 一致。', '不要只看前面的 Tom。'],
  ['It was ___ a useful lecture that everyone took notes.', ['so', 'such', 'too', 'very'], 'such', 'such + a/an + adjective + noun + that。', 'so 后通常接形容词/副词，不直接接 a useful lecture。'],
  ['The box was ___ heavy that I could not lift it.', ['such', 'so', 'too', 'enough'], 'so', 'so + adjective + that 引导结果从句。', 'such 后需要名词中心词。'],
  ['___ you choose, I will support your decision.', ['Whatever', 'However', 'Wherever', 'Whenever'], 'Whatever', 'choose 缺少宾语，whatever 在从句中作宾语。', 'however 表方式，不能作 choose 的宾语。'],
  ['It is said ___ the old bridge will be repaired next month.', ['what', 'which', 'that', 'whether'], 'that', 'It is said that ... 是固定报道结构。', 'that 在这里不作成分，只连接从句。'],
  ['___ difficult the task is, we should not give up.', ['What', 'How', 'No matter how', 'No matter what'], 'No matter how', '修饰形容词 difficult，用 no matter how。', 'no matter what 后应接名词。'],
  ['Please put the key back ___ you found it.', ['which', 'what', 'where', 'that'], 'where', 'where 引导地点状语从句，表示“在你找到它的地方”。', 'which 不能直接引导该地点状语从句。'],
  ['The new library, ___ opened last month, is popular with students.', ['that', 'what', 'which', 'where'], 'which', '非限制性定语从句用 which，前面有逗号。', 'that 不能用于非限制性定语从句。'],
  ['___ is known to all, regular exercise is good for health.', ['Which', 'That', 'As', 'What'], 'As', 'as 引导非限制性定语从句，可置于句首，意为“正如”。', 'what 不能直接指代整个后句并作该结构的关系词。'],
])
