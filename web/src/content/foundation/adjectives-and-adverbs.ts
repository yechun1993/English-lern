import { createFoundationQuestions } from './foundation-utils'

export const adjectivesAndAdverbs = createFoundationQuestions('形容词、副词及比较级', 101, [
  ['My new computer runs ___ than the old one.', ['faster', 'fastest', 'fast', 'more fast'], 'faster', '两台电脑比较，用比较级 faster。', 'fast 的比较级直接加 -er，不用 more fast。'],
  ['Please listen ___ so that you do not miss the instructions.', ['carefully', 'careful', 'carefulness', 'more careful'], 'carefully', 'listen 是动词，需要副词 carefully 修饰。', 'careful 是形容词，不能直接修饰 listen。'],
  ['This box is ___ heavy for me to carry alone.', ['too', 'very', 'so', 'such'], 'too', 'too + 形容词 + for sb. to do 表示“太……而不能……”。', 'very heavy 只表示程度高，不含不能完成的结果。'],
  ['Her answer was as ___ as mine.', ['clear', 'clearly', 'clearest', 'more clear'], 'clear', 'as...as 中间用形容词原级，修饰 answer。', 'clearly 是副词，不能直接作 answer 的表语。'],
  ['The new road is ___ crowded than the old one.', ['less', 'least', 'little', 'few'], 'less', '不可数或抽象程度的比较可用 less + 形容词，表示“较不拥挤”。', 'least 是最高级，不适用于两者比较。'],
  ['This is one of the ___ books I have ever read.', ['best', 'better', 'good', 'well'], 'best', 'one of the + 最高级 + 复数名词是固定结构。', 'better 是比较级，前面没有明确两者比较。'],
  ['The room is warm ___ for us to stay without a coat.', ['enough', 'too', 'very', 'so'], 'enough', '形容词后接 enough，warm enough 表示“足够暖”。', 'enough 的位置通常在形容词或副词之后。'],
  ['The film was ___ interesting that we watched it twice.', ['so', 'such', 'too', 'very'], 'so', 'so + 形容词 + that 从句，表示“如此……以至于……”。', 'such 后通常接名词短语，如 such an interesting film。'],
  ['It was ___ useful lesson that I wrote down every point.', ['such a', 'so', 'too', 'enough'], 'such a', 'such a + 形容词 + 单数可数名词是固定结构。', 'so 后不能直接接 a useful lesson。'],
  ['She speaks English very ___.', ['well', 'good', 'better', 'best'], 'well', 'speak 是动词，用副词 well 修饰。', 'good 是形容词，通常修饰名词或作表语。'],
  ['The professor is ___ respected by his students.', ['highly', 'high', 'higher', 'highest'], 'highly', 'highly respected 表示“受到高度尊敬”，highly 作副词修饰过去分词。', 'high 常表示具体高度，不能直接替代 highly。'],
  ['I could ___ hear the speaker because of the noise.', ['hardly', 'hard', 'harder', 'hardest'], 'hardly', 'hardly 表示“几乎不”，符合噪声导致听不清的语境。', 'hard 表示“努力地/艰难地”，不等于“几乎不”。'],
  ['I am very ___ in learning how to manage time.', ['interested', 'interesting', 'interest', 'interests'], 'interested', '人对某事感兴趣用 be interested in。', 'interesting 描述事物“有趣”，不描述人的感受。'],
  ['The lecture was so ___ that several students fell asleep.', ['boring', 'bored', 'bore', 'boringly'], 'boring', '事物令人厌烦用 boring；学生感到厌烦才用 bored。', '不要用 bored 描述 lecture 本身。'],
  ['Your idea is similar ___ mine.', ['to', 'with', 'for', 'at'], 'to', 'be similar to 是固定搭配。', '不要受 be different from 的影响而随意换介词。'],
  ['Her parents are proud ___ her progress.', ['of', 'for', 'with', 'at'], 'of', 'be proud of 表示“以……为骄傲”。', 'proud 后不能随意接 for 或 with。'],
  ['There is ___ traffic on the road today than usual.', ['less', 'fewer', 'few', 'little'], 'less', 'traffic 不可数，比较时用 less。', 'fewer 修饰可数名词复数。'],
  ['There are ___ mistakes in this version than in the first one.', ['fewer', 'less', 'little', 'least'], 'fewer', 'mistakes 是可数复数，比较数量用 fewer。', 'less 用于不可数名词或程度。'],
  ['The more you practice, the ___ you will become.', ['better', 'best', 'good', 'well'], 'better', 'the + 比较级，the + 比较级表示“越……越……”。', '该结构中两边都用比较级，不用最高级。'],
  ['This method is ___ than the one we used before.', ['more effective', 'most effective', 'effectively', 'the effective'], 'more effective', '两个方法相比用比较级 more effective。', 'effective 是多音节形容词，比较级通常在前面加 more。'],
])
