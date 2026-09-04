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
  {
    id: 'cloze-passage-02',
    type: 'cloze',
    title: '校园学习：学会安排自己的时间',
    body: `When Lin began university, he was nervous during [1] first week. In high school, teachers often told him what to do. At university, professors expected students to [2] before class and ask questions when something was unclear. Lin soon found that listening alone was not [3].

He started to read course outlines [4] and made a simple plan each Sunday. He wrote down assignments and broke large tasks [5] smaller steps. This did not make the work easy, [6] it stopped him from forgetting important dates.

One science course was especially [7]. After getting a low quiz score, Lin asked his teacher for [8]. The teacher advised him [9] a study group. There, Lin could explain ideas to others and hear different ways of solving a problem. He [10] understood more of the course.

The group met twice a week. Members compared notes, explained new terms, and checked one another's work. These talks were more helpful [11] simply reading answers. Lin also began to feel more [12] when he spoke in class.

He still became tired near exam time, [13] he no longer worked alone in silence. He spoke [14] a tutor and learned that most students improved [15] small steps. Lin realized that a good student did not need to [16] everything immediately. He did need to [17] his time wisely. If he kept [18] small progress every week, his goal could be [19] at the end of the term. The experience taught him [20] steady effort matters more than last-minute worry.`,
  },
  {
    id: 'cloze-passage-03',
    type: 'cloze',
    title: '健康习惯：从小改变开始',
    body: `At the beginning of the term, the school nurse [1] that many students came to class tired. They often [2] late to watch videos or finish homework. She wanted to help them build healthier routines [3] of only giving advice.

The nurse invited ten students to keep a simple daily [4]. Each student chose two goals, such as getting [5] sleep and eating breakfast [6] school. The group also agreed to take some [7] every afternoon, [8] sitting at a desk for the whole day.

During the first week, the students found the plan hard. One student said he had little [9] in the morning. Another forgot to bring fruit for lunch. The nurse reminded them that small [10] need time. She asked them to write down how they felt [11] they followed their goals.

By the third week, several students could see a difference. They arrived at school [12] time and felt more [13] in class. [14] no one followed the plan perfectly, the group encouraged one another. They learned [15] their goals when a rule was too difficult.

At the end of the month, the nurse asked the students to look [16] their notes. Most of them had [17] changed their daily lives. They did not become perfect, but they had formed useful [18]. The students understood that health improves [19] of repeated choices, not one big decision. Their first month gave them confidence to continue, and that was already a [20].`,
  },
]

export const clozeQuestions = [
  ...createClozeQuestions('cloze-passage-01', 1, [
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
  ]),
  ...createClozeQuestions('cloze-passage-02', 21, [
    ['代词指代', ['his', 'her', 'their'], 'his', 'Lin 是男性单数，修饰 first week 用 his。', 'their 与单数 Lin 不一致。'],
    ['动词搭配', ['prepare', 'wait', 'return'], 'prepare', 'prepare before class 表示“课前准备”。', 'wait/return 不能说明课前学习。'],
    ['语境词义', ['enough', 'usual', 'possible'], 'enough', '听课之外还需预习和提问，alone was not enough。', 'usual 不能表示“足够”。'],
    ['副词用法', ['carefully', 'suddenly', 'nearly'], 'carefully', '仔细阅读课程提纲才能安排学习。', 'suddenly/nearly 与计划行为不合。'],
    ['介词搭配', ['into', 'from', 'with'], 'into', 'break a task into smaller steps 表示“拆分成更小步骤”。', 'break ... from 不是该搭配。'],
    ['逻辑连接', ['but', 'so', 'because'], 'but', '工作并未变容易，但能避免遗忘日期，前后转折。', 'so/because 不能体现让步关系。'],
    ['语境词义', ['difficult', 'popular', 'short'], 'difficult', '低测验分数和寻求帮助说明课程难。', 'popular 不能推出需要额外帮助。'],
    ['固定搭配', ['advice', 'news', 'information'], 'advice', 'ask somebody for advice 表示“向某人征求建议”。', 'advice 不可数，前面不加 a。'],
    ['非谓语', ['to join', 'joining', 'join'], 'to join', 'advise somebody to do 表示建议某人去做。', 'advise 后接人作宾语时，后面用不定式。'],
    ['副词用法', ['gradually', 'possibly', 'already'], 'gradually', '理解是逐步增加的，用 gradually。', 'already 表已经，不说明变化过程。'],
    ['比较结构', ['than', 'as', 'for'], 'than', 'more helpful than 表示“比……更有帮助”。', '比较级后不用 as。'],
    ['形容词搭配', ['confident', 'careful', 'silent'], 'confident', 'feel confident when speaking 表示发言更有信心。', 'careful/silent 不表达信心。'],
    ['逻辑连接', ['although', 'because', 'unless'], 'although', '虽临近考试疲惫，却不再独自学习，形成让步。', 'because 表原因，逻辑不通。'],
    ['介词搭配', ['with', 'at', 'for'], 'with', 'speak with somebody 表示“与某人交谈”。', 'speak at 不表示交谈对象。'],
    ['介词搭配', ['in', 'by', 'on'], 'in', 'improve in small steps 表示在小步骤中逐步提升。', 'by small steps 可表方式，但此处固定表达优先用 in。'],
    ['情态动词后动词', ['know', 'knowing', 'known'], 'know', 'need to 后接动词原形 know。', 'knowing/known 不能直接跟在 need to 后。'],
    ['动词搭配', ['use', 'lose', 'change'], 'use', 'use time wisely 表示“明智地利用时间”。', 'lose time 与 wisely 语义冲突。'],
    ['非谓语', ['making', 'make', 'made'], 'making', 'keep doing 表示持续做某事。', 'keep 后不能直接接动词原形表示持续。'],
    ['被动语态', ['reached', 'reaching', 'reach'], 'reached', 'goal 与 reach 是被动关系：goal could be reached。', 'could be 后必须接过去分词。'],
    ['宾语从句', ['that', 'what', 'whether'], 'that', 'taught him that ... 中 that 连接完整陈述从句。', 'what 在从句中需充当成分。'],
  ]),
  ...createClozeQuestions('cloze-passage-03', 41, [
    ['动词辨析', ['noticed', 'forgot', 'promised'], 'noticed', 'nurse noticed that 表示护士注意到一个事实。', 'forgot/promise 与后面的事实从句不合。'],
    ['动词短语', ['stayed up', 'gave up', 'put up'], 'stayed up', 'stay up late 表示“熬夜”。', 'give up 表放弃，语义不合。'],
    ['固定搭配', ['instead', 'again', 'still'], 'instead', 'instead of 后接动名词，表示“而不是”。', 'again/still 不能构成 instead of 结构。'],
    ['名词词义', ['schedule', 'ticket', 'message'], 'schedule', 'daily schedule 表示“每日安排”。', 'ticket/message 不能记录生活习惯。'],
    ['形容词搭配', ['enough', 'little', 'few'], 'enough', 'get enough sleep 表示获得足够睡眠。', 'sleep 不可数，few 不能修饰。'],
    ['介词辨析', ['before', 'after', 'during'], 'before', '上学前吃早餐，用 before school。', 'after school 会变成放学后。'],
    ['名词搭配', ['exercise', 'noise', 'weather'], 'exercise', 'take some exercise 表示进行锻炼。', 'take noise/weather 不合搭配。'],
    ['逻辑连接', ['rather than', 'because of', 'as well as'], 'rather than', 'rather than 表示“而不是久坐”。', 'as well as 表“也”，不表示替代。'],
    ['语境词义', ['energy', 'money', 'space'], 'energy', '早晨没精神，常说 have little energy。', 'money/space 与疲倦无关。'],
    ['名词辨析', ['changes', 'meetings', 'reasons'], 'changes', '生活方式改变需要时间，用 small changes。', 'meetings/reasons 不符合上下文。'],
    ['时间连词', ['when', 'unless', 'because'], 'when', '记录感受发生在完成目标的时候，用 when。', 'unless 表条件，不合句意。'],
    ['介词搭配', ['on', 'at', 'in'], 'on', 'arrive on time 表示“准时到达”。', 'in time 表及时赶上，语义不同。'],
    ['形容词比较级', ['healthier', 'health', 'healthily'], 'healthier', 'feel more + 形容词，用 healthier。', 'health 是名词，healthily 是副词。'],
    ['让步连词', ['Although', 'Because', 'So'], 'Although', '虽然没人完全做到，但大家相互鼓励，前后让步。', 'because/so 不表示转折。'],
    ['非谓语', ['to follow', 'following', 'followed'], 'to follow', 'learn to do 表示“学会做某事”。', 'learn 后不能直接接过去分词。'],
    ['介词搭配', ['at', 'for', 'with'], 'at', 'look at notes 表示查看笔记。', 'look for 表示寻找。'],
    ['副词用法', ['gradually', 'nearly', 'hardly'], 'gradually', '生活变化是逐渐发生的，用 gradually。', 'nearly/hardly 不说明过程。'],
    ['名词搭配', ['habits', 'projects', 'objects'], 'habits', 'form useful habits 表示形成有用习惯。', 'project/object 不合健康主题。'],
    ['介词搭配', ['because', 'because of', 'despite'], 'because', '空后已有 of，因此填 because 构成 because of + 名词短语。', '填 because of 会与后面的 of 重复。'],
    ['语境词义', ['success', 'mistake', 'question'], 'success', '获得继续的信心本身就是一种成功。', 'mistake/question 与积极结果相反。'],
  ]),
]
