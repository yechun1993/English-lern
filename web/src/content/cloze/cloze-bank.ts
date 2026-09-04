import type { Question } from '../../domain/question'
import type { Passage } from '../../domain/passage'

type ClozeEntry = readonly [
  topic: string,
  options: readonly [string, string, string],
  answer: string,
  explanation: string,
  misconception: string,
]

function createClozeQuestions(
  passageId: string,
  startNumber: number,
  entries: readonly ClozeEntry[],
): Question[] {
  return entries.map(([topic, options, answer, explanation, misconception], index) => ({
    id: `cloze-${String(startNumber + index).padStart(3, '0')}`,
    type: 'cloze',
    topic,
    difficulty: index < 8 ? 'foundation' : index < 18 ? 'standard' : 'challenge',
    stem: '请选择文中最合适的词。',
    options: [...options],
    answer,
    explanation,
    misconception,
    version: 1,
    passageId,
    blankIndex: index + 1,
  }))
}

export const clozePassages: Passage[] = [
  {
    id: 'cloze-passage-01',
    type: 'cloze',
    title: '家庭沟通：一顿不看手机的晚餐',
    body: `The Chen family used to eat dinner in a hurry. Each person returned at a [1] time and looked at a screen. Mr. Chen wanted the family to [2] time together. He made a rule: at dinner, all phones were turned [3], and everyone told one story.

At first, the children [4] to complain. Their mother, [5], asked them to try the plan for one week. She said a meal was a chance to show [6] in one another's lives. A person could mention a success or a worry.

After several days, the family noticed a change. The children asked more questions instead of leaving the table [7] dinner. Mr. Chen learned why his son was worried [8] a project, and his daughter spoke openly about her [9]. The parents did not try to solve everything. They first learned [10] carefully.

The habit made disagreements easier. When people had different ideas, they said, “I understand” and “Could you explain that [11]?” This made arguments less likely. Listening was often as [12] as giving advice.

A month later, everyone agreed to [13] the rule. They still used phones after dinner, but the meal was protected time. Although the change was small, it helped the family feel [14]. The children invited their grandparents on Sundays, [15] they could share stories from the past. The family had built a better way to communicate [16] a simple habit. On busy evenings they chose a shorter meal, [17] they did not cancel it. They learned that communication did not have to be perfect; it only needed [18]. Every family member had a voice [19] deserved attention. The Chens now treat dinner as a time [20] they can be present for one another.`,
  },
]

export const clozeQuestions = createClozeQuestions('cloze-passage-01', 1, [
  ['语境词义', ['different', 'same', 'quiet'], 'different', '后文说每个人各看屏幕，说明回家时间不同。', '不要只因文中有 common 就选 same。'],
  ['动词搭配', ['spend', 'avoid', 'supply'], 'spend', 'spend time together 表示“一起度过时间”。', 'avoid 表“避免”，不合家庭团聚语境。'],
  ['动词短语', ['off', 'on', 'back'], 'off', 'turn off 表示“关掉”。', 'turn on 表示打开，与不看手机的规则相反。'],
  ['固定搭配', ['began', 'forgot', 'decided'], 'began', 'begin to complain 表示“开始抱怨”。', 'complain 后不需要被动形式。'],
  ['逻辑连接', ['however', 'therefore', 'unless'], 'however', '孩子抱怨，但母亲仍要求尝试，前后是转折。', 'therefore 表结果，不能表现转折。'],
  ['介词搭配', ['interest', 'danger', 'need'], 'interest', 'show interest in 表示“对……表现出兴趣”。', 'show danger in 不是自然搭配。'],
  ['介词辨析', ['before', 'after', 'during'], 'before', '离开餐桌发生在用餐结束前，因此用 before dinner。', 'after dinner 表示饭后离开，不合原意。'],
  ['介词搭配', ['about', 'for', 'to'], 'about', 'be worried about 表示“担心……”。', 'worried for 的搭配和语义不同。'],
  ['语境词义', ['feelings', 'tickets', 'methods'], 'feelings', 'spoke openly about her feelings 表示坦率谈感受。', '其他选项与家庭沟通主题不连贯。'],
  ['非谓语', ['to listen', 'listening', 'listen'], 'to listen', 'learn to do 表示“学会做某事”。', 'learn 后直接接动词原形不正确。'],
  ['副词用法', ['again', 'too', 'already'], 'again', '请对方再解释一次，用 again。', 'too 表“也/太”，不能修饰 explain 的重复。'],
  ['比较结构', ['useful', 'expensive', 'sudden'], 'useful', 'as useful as 表示“和……一样有用”。', 'listening 与 expensive/sudden 语义不合。'],
  ['动词搭配', ['continue', 'forget', 'stop'], 'continue', 'agree to continue the rule 表示同意继续这项规则。', 'agree 后接不定式，语义也需连贯。'],
  ['比较级', ['closer', 'longer', 'older'], 'closer', 'feel closer 表示关系更亲近。', 'longer/older 不能描述家庭成员间的关系。'],
  ['逻辑连接', ['so', 'but', 'because'], 'so', '邀请祖父母的目的，是能分享过去的故事，用 so。', 'but 表转折，与目的关系不符。'],
  ['介词搭配', ['through', 'without', 'except'], 'through', 'through a habit 表示“通过一种习惯/方式”。', 'without 与后文建立沟通方式相反。'],
  ['逻辑连接', ['but', 'so', 'or'], 'but', '晚餐变短，但没有取消，是转折关系。', 'so 表结果，不能表达让步后的对比。'],
  ['非谓语', ['to continue', 'continued', 'continuing'], 'to continue', 'need to do 表示“需要继续做”。', 'need 后不能直接接过去式或动名词表达此义。'],
  ['定语从句', ['that', 'where', 'when'], 'that', 'voice 后的从句缺主语，that 指代 voice 并作主语。', 'where/when 分别表示地点和时间，不能作从句主语。'],
  ['关系副词', ['when', 'where', 'why'], 'when', 'time 是时间先行词，在从句中作时间状语，用 when。', 'where 用于地点先行词。'],
])
