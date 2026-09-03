import { createAdvancedQuestions } from './advanced-utils'

export const referenceLogic = createAdvancedQuestions('指代、替代与逻辑连接', 341, [
  ['I do not like this pen. Could I try another ___?', ['one', 'ones', 'it', 'that'], 'one', 'one 代替同类可数名词单数 pen。', 'it 指同一支笔，不符合“另一支”。'],
  ['These shoes are cheaper than the ___ in that store.', ['one', 'ones', 'it', 'that'], 'ones', 'ones 代替同类可数名词复数 shoes。', 'one 只能代替单数名词。'],
  ['The weather in Shenzhen is warmer than ___ in many northern cities.', ['one', 'ones', 'that', 'those'], 'that', 'that 可代替前面的不可数名词 weather，避免重复。', 'it 指同一份天气，比较对象应是不同地方的天气。'],
  ['The books in this library are newer than ___ in our school library.', ['one', 'ones', 'that', 'those'], 'those', 'those 代替复数可数名词 books。', 'that 代替单数或不可数名词。'],
  ['___ takes time to form a good habit.', ['That', 'It', 'What', 'There'], 'It', 'It 作形式主语，真正主语是不定式 to form a good habit。', 'There 表存在，不能替代形式主语。'],
  ['I find ___ useful to review new words before sleep.', ['this', 'that', 'it', 'there'], 'it', 'find it + adjective + to do 中 it 是形式宾语。', '真正宾语是后面的不定式。'],
  ['Some students like reading novels; ___ prefer history books.', ['another', 'other', 'others', 'the other'], 'others', 'others = other students，后面不再接名词。', 'other 后必须接复数名词。'],
  ['Would you like tea or coffee? ___ is fine with me.', ['Both', 'Either', 'Neither', 'All'], 'Either', '两者任一都可以，用 either。', 'both 表“两者都”，不能与 is fine 单数搭配。'],
  ['___ of the two answers is correct.', ['Both', 'Either', 'Neither', 'All'], 'Neither', 'neither of the two 表示“两者都不”。', 'both 表示两者都，语义相反。'],
  ['___ student in the class has a chance to speak.', ['Each', 'Many', 'Few', 'Several'], 'Each', 'each 强调逐个个体，后接单数名词。', 'many/few/several 后接复数名词。'],
  ['___ of the information is useful, so keep the report.', ['Many', 'Few', 'Much', 'Several'], 'Much', 'information 不可数，much 可修饰不可数名词。', 'many/few/several 修饰可数复数名词。'],
  ['There are ___ apples left, so we need to buy more.', ['little', 'a little', 'few', 'a few'], 'few', 'apples 可数复数；few 表“几乎没有”。', 'little 修饰不可数名词。'],
  ['We have ___ time before the bus leaves, so hurry up.', ['few', 'a few', 'little', 'a little'], 'little', 'time 不可数，little 表“几乎没有”。', 'a little 表有一点，语气不符合 hurry up。'],
  ['I have two sisters. One is a nurse and ___ is a teacher.', ['another', 'other', 'the other', 'others'], 'the other', 'one ... the other ... 指两者中的另一个。', 'another 用于不确定的另一个。'],
  ['The road was blocked by snow; ___, we had to take a longer route.', ['however', 'therefore', 'although', 'besides'], 'therefore', '前因后果：道路被堵，因此改走远路。', 'however 表转折，不表示因果结果。'],
  ['The task was difficult. ___, everyone kept working until it was finished.', ['Therefore', 'However', 'Because', 'So'], 'However', '前后是转折：困难，但仍坚持。', 'therefore/so 表结果，不合逻辑。'],
  ['Besides English, she can also speak Japanese.', ['Except for', 'In addition to', 'Instead of', 'Because of'], 'In addition to', 'in addition to = besides，表示“除……之外还”。', 'except for 表排除，不表示“还会”。'],
  ['___ he had little experience, he handled the problem calmly.', ['Because', 'Although', 'Therefore', 'So'], 'Although', '缺少经验与冷静处理形成让步转折。', 'because 会把后句当作原因，逻辑不通。'],
  ['My brother likes outdoor sports, ___ I prefer reading at home.', ['because', 'so', 'whereas', 'therefore'], 'whereas', 'whereas 用于对比两个不同情况。', 'so/therefore 表因果，不是对比。'],
  ['The website was easy to use. ___, it provided clear examples for beginners.', ['As a result', 'In addition', 'Instead', 'Otherwise'], 'In addition', '后一分句是补充优点，用 In addition。', 'as a result 需要前因后果关系。'],
])
