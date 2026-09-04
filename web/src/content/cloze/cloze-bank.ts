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
  {
    id: 'cloze-passage-04',
    type: 'cloze',
    title: '志愿服务：让社区花园重新开花',
    body: `A community center [1] a weekend event to repair its small garden. The garden had been empty for months, and the center hoped students would help [2] rubbish, paint old boxes, and plant flowers.

At first, only twelve students signed up. The organizer was disappointed; [3], more students [4] after they saw photos of the garden online. On Saturday morning, everyone received a job. Some were responsible [5] cleaning paths, while others chose seeds [6].

The work was harder than many students expected. Heavy bags had to be moved, and old tools [7] to the group by a neighbor. People helped one another [8] they wanted to finish before it rained. No one complained about the [9]. Instead, the students worked [10] and shared simple ideas.

At noon, a local shop sent sandwiches and fruit. For many volunteers, this was [11] small reward, but it meant more [12] the food itself. They could see that their effort had changed a public place. Some students gained [13] after speaking with older residents.

[14] the garden was not perfect, it looked brighter by the afternoon. The volunteers promised [15] the next month and water the plants. They also posted pictures [16] the school website. The event taught them that a few hours can be [17] when people care about the same place. They learned [18] a neighborhood improves [19] shared action, not waiting for someone else. For them, the garden became a lesson in [20].`,
  },
  {
    id: 'cloze-passage-05',
    type: 'cloze',
    title: '工作选择：先了解自己，再选择方向',
    body: `When Mei was close to graduation, she found it hard to [1] what kind of work she wanted. Her family gave many suggestions, but Mei knew that a job should match her own [2] and strengths. She wrote a short list of questions for herself.

She did not choose a position quickly. [3], she spent several weeks gathering [4]. She read about different industries and talked [5] people who were already working. One manager invited her [6] with a small team for an afternoon.

Mei was surprised by how [7] the jobs were from one another. Some workers spent more time solving problems [8] speaking with customers. Others needed technical [9], while some needed to organize meetings. Mei began to understand [10] better.

She learned that every job has difficult parts. [11] a job may look interesting, it also requires people to be [12] and ready [13] new tasks. Mei decided that work experience was more useful than guessing. She applied for a short internship to gain [14].

During the internship, she [15] learned what she enjoyed. She liked working with people and finding practical answers. She also discovered that she still had much [16]. At the end, Mei did not believe there was one perfect job. She believed that [17] interest and effort matter. A person can grow [18] he or she keeps learning. Mei felt calmer about her [19], because she had made it after careful thought. That was a good first [20].`,
  },
  {
    id: 'cloze-passage-06',
    type: 'cloze',
    title: '网络使用：让手机服务于你的生活',
    body: `Many students use the internet every day. It helps them [1] information, communicate with friends, and finish school tasks. Yet a phone can also take [2] more time than people expect, especially when short videos appear one after another. For this reason, students need a simple plan before they go online.

Li Wen noticed this problem during a busy month. He opened an app to check one message, [3] he stayed online for almost an hour. After that, he decided to keep his phone [4] while studying. He placed it in a drawer and turned off its sound.

At first, Li Wen worried that he might miss something important. To feel safer, he set a [5] for twenty minutes and promised [6] when it rang. [7] the alarm rang, he [8] by how much reading he [9] without looking at a screen. His homework took [10] time than before.

Li Wen did not give up the internet. [11] checking it again and again, he chose a few [12] times for messages and entertainment. [13] this habit was [14] in the first week, it [15] became easier. He slept [16] and talked with his family more often.

His classmates later tried the same idea. They learned that technology can be helpful when people use it [17] a clear purpose. Li Wen now believes that a balanced online life is more important [18] being connected every minute. He also understood [19] self-control makes free time [20].`,
  },
  {
    id: 'cloze-passage-07',
    type: 'cloze',
    title: '环境保护：从一次河边清理开始',
    body: `On the first Saturday of spring, a school [1] a clean-up day near a small river. Teachers invited students [2] and asked them to arrive [3]. At the meeting point, groups [4] gloves, bags, and a map of the area.

Some students picked up plastic bottles. Others sorted paper and cans [5] different bags. Several students also wrote down the kinds of rubbish they found, so the school could discuss how to prevent the same problem later. They soon discovered that wet rubbish was much [6] than they had imagined. One student said [7] he had never noticed so much waste before.

The work continued for two hours. Everyone was tired, but no one left early [8] the river was a place they used every week. The teachers reminded students to work [9] near the water and to help each other. By noon, the riverbank looked cleaner [10] it had in months.

After the activity, a local volunteer gave a short talk [11] recycling. She explained that [12] small habit, such as carrying a bottle, can reduce waste. The students [13] surprised to learn how many plastic cups are thrown away each day.

[14] one clean-up could not solve every problem, it changed the way they looked at daily choices. Many students felt [15] of their work and agreed [16] single-use products. They knew that using [17] plastic would matter [18] they continued the habit. The event showed that environmental protection begins [19] ordinary [20].`,
  },
  {
    id: 'cloze-passage-08',
    type: 'cloze',
    title: '城市生活：从陌生到熟悉',
    body: `Zhao Ming moved to a new city for work last year. At first, he felt [1] because he did not know anyone. The streets were busy, and even simple tasks, such as finding a market, seemed [2].

Instead of staying at home every weekend, Zhao decided [3] the city on foot. He bought a small map and visited one neighborhood [4] another. He soon found a library near his apartment, [5] he could read and join free activities.

One Saturday, he saw a notice about a local walking group. Although he was [6] about meeting strangers, he went there. The group members were friendly and asked him [7] their next walk. During the walk, they talked about food, transport, and places [8] visiting.

Zhao learned that city life becomes easier when people pay attention [9] their surroundings. He began to remember bus routes and to greet shop owners. He also discovered that a city offers more choices [10] a person is willing to try something new.

After several months, Zhao no longer felt like a visitor. He had made friends and become more [11]. He knew [12] he could ask for help when needed. [13] his work was sometimes tiring, he still made time [14] the people around him. His new home did not become familiar [15]; it became familiar through many small experiences. Zhao now thinks that moving to a city is not only about finding a job. It is also a chance to learn how to live [16], listen to others, and build [17]. He tells new coworkers that they should not be afraid [18] take the first step. A smile or a short conversation can [19] a big difference. For Zhao, the city finally felt like [20].`,
  },
  {
    id: 'cloze-passage-09',
    type: 'cloze',
    title: '时间管理：把重要的事排在前面',
    body: `Chen Yu worked part-time while taking classes. This made her feel [1], because she often forgot [2] a report or reply to an email.

Her teacher suggested that she make a weekly [3]. Chen Yu wrote down classes and other plans. Then she divided large tasks [4] smaller steps. She put the most important task at the [5] of each day.

At first, following the plan was not easy. Friends sometimes invited her out, and unexpected work appeared. [6], she learned to leave some empty time in her schedule. If a task took longer [7] expected, she could move a smaller task to the next day.

Chen Yu also stopped trying to do several things at once. When she studied, she turned [8] messages for thirty minutes. This helped her finish work more [9] and make fewer mistakes. She took a short break [10] completing each important step.

After a month, Chen Yu had more control over her time. She was [11] worried at night, because she knew what to do. She understood that a plan does not have to be [12]. It only needs to be [13] enough to guide action.

Her classmates noticed the change and asked for her advice. Chen Yu told them to begin [14] one small habit, writing tomorrow's list before bed. She also said they should be kind to [15] when a plan failed. Good time management means choosing what matters most, not filling every minute [16] work. People can make progress [17] they review their plans and change them when necessary. Chen Yu has busy days, but she now feels [18] of her choices. Her rule is simple: do one important thing, then do the next. This rule gives her a sense of [19] and helps her use each day more [20].`,
  },
  {
    id: 'cloze-passage-10',
    type: 'cloze',
    title: '旅行体验：一个人出发，也学会与人交流',
    body: `Last summer, Wang Lei took his first trip alone. He had always traveled with family members, so he was excited but [1]. Before leaving, he checked the weather, booked a room, and made a list [2] things to carry.

On the train, he met a woman visiting the same town. She gave him some [3] about local food and showed him [4] to reach the old street from the station. Wang Lei wrote the information down [5] he would not forget it.

He woke up early and walked around the town. He saw small shops, old bridges, and people [6] breakfast outside. Although it started to rain, he did not return to the hotel [7]. He bought an umbrella and continued [8].

At noon, he chose a restaurant. The menu was only in Chinese, but the owner was patient and [9] him choose a simple meal. Wang Lei found that talking with local people was more [10] than following a guidebook.

Later he got lost while looking for the bus stop. Instead of feeling angry, he asked a student for [11]. The student walked with him and pointed [12] the right road. Wang Lei thanked her and learned that asking questions is sometimes the [13] way to solve a problem.

When the trip ended, Wang Lei had taken many photos, but his best memories were not only about places. He had become more [14] and willing [15] new situations. He knew that travel can teach people [16] themselves and other cultures. His parents were surprised [17] how much he had changed in a few days. Wang Lei is now planning another trip, [18] he will prepare more carefully. He believes that a good traveler should respect local rules, keep public places [19], and be open [20] new experiences.`,
  },
  {
    id: 'cloze-passage-11',
    type: 'cloze',
    title: '科学常识：从观察和记录中寻找答案',
    body: `At a school science fair, Mr. Gao's class [1] a simple experiment about plants. The students wanted [2] why some seeds grew faster than others. They placed the same kind of seeds in three boxes and gave each box a different amount of light.

Before the experiment began, the students made a [3]. Some thought the seeds near the window would grow [4]. Others believed that water was more important [5] light. Mr. Gao told them not to guess without keeping records.

Every day, one student measured the plants and wrote the results [6] a notebook. Another student checked [7] the soil was too dry. After two weeks, the group had enough information [8] the three boxes.

The seeds with regular light and enough water grew [9] than the others. The students were surprised because one box had received [10] water but almost no light. They learned that a plant needs several conditions to grow [11].

Mr. Gao then asked the class [12] their findings. Each group made a poster and explained what had happened. [13] some results were different from their first ideas, nobody thought the experiment had failed. Instead, the students saw mistakes as [14] to ask better questions.

At the end of the fair, several parents visited their posters. One parent asked [15] the students had enjoyed most. A girl answered that science was not only about finding the right answer. It was also about being [16], working with others, and checking facts. The class understood that science can be part of [17] life. They promised to look more [18] at the world around them and to test ideas [19] accepting them. For the students, the experiment was a small but important [20].`,
  },
  {
    id: 'cloze-passage-12',
    type: 'cloze',
    title: '成长故事：从不敢开口到勇敢表达',
    body: `Two years ago, Liu Na was afraid of speaking English in class. She knew many words, but she worried [1] making mistakes. When asked a question, Liu Na often looked [2] her book.

One day, the teacher put students into small groups and asked them [3] a short story. Her friends encouraged her, and she finally agreed [4] the task.

At first, her voice was quiet. She forgot one sentence and wanted to stop. [5], her group members smiled and waited for her. Liu Na took a deep breath and continued. When she finished, the teacher said that she had done [6] job.

After that day, Liu Na made a plan. She would speak English for five minutes every morning and record [7]. She listened to the recordings and tried [8] her weak points.

Progress did not come [9]. Some days she still felt nervous. But each time she spoke, she became a little more [10]. She learned that confidence grows [11] people practice, not when they wait until they feel perfect.

Liu Na gave a talk to the class. Her classmates were surprised [12] her clear voice. She was not the best speaker, [13] she was much braver than before. A mistake can be a chance [14] more.

Liu Na now helps younger students who have the same fear. She tells them that they do not need to change [15] one day. They only need to take one small step [16] a time. Her own story has made her more patient [17] others and more willing to try new things. She believes that growth begins [18] accepting what you cannot do yet. Then, little by little, you can turn [19] into a skill. For Liu Na, courage became a habit, not a special [20].`,
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
  ...createClozeQuestions('cloze-passage-04', 61, [
    ['动词词义', ['planned', 'forgot', 'borrowed'], 'planned', 'center planned an event 表示中心策划活动。', 'forgot/borrowed 不符合主办活动。'],
    ['非谓语', ['to collect', 'collecting', 'collected'], 'to collect', 'help to do 表示帮助做某事。', 'help 后不接过去分词表达主动。'],
    ['逻辑连接', ['however', 'therefore', 'unless'], 'however', '开始人数少，后来增加，前后为转折。', 'therefore 表因果，不合语气。'],
    ['动词辨析', ['joined', 'left', 'waited'], 'joined', '更多学生加入活动，用 joined。', 'left 表离开，与人数增加相反。'],
    ['介词搭配', ['for', 'with', 'at'], 'for', 'be responsible for 表示对某项工作负责。', 'responsible 后不接 with。'],
    ['副词用法', ['carefully', 'quietly', 'suddenly'], 'carefully', '选择种子需要仔细判断，用 carefully。', 'quietly/suddenly 不说明选择方式。'],
    ['被动语态', ['were given', 'gave', 'giving'], 'were given', 'tools 是被邻居给到的，用被动。', '主语 tools 不能主动 give。'],
    ['原因连词', ['because', 'although', 'until'], 'because', '大家互助的原因是想在下雨前完成。', 'although 表让步，不表达原因。'],
    ['名词词义', ['work', 'weather', 'lesson'], 'work', 'complain about the work 表示抱怨劳动。', 'weather/lesson 与前文劳动不对应。'],
    ['副词搭配', ['together', 'alone', 'early'], 'together', '志愿者合作完成任务，用 work together。', 'alone 与互相帮助矛盾。'],
    ['冠词', ['a', 'an', 'the'], 'a', 'reward 是单数可数名词，small 以辅音音素开头。', 'an 应用于元音音素开头的词。'],
    ['比较结构', ['than', 'as', 'for'], 'than', 'more ... than ... 表示不止于食物本身。', 'more 后比较结构用 than。'],
    ['名词搭配', ['confidence', 'silence', 'space'], 'confidence', 'gain confidence 表示获得信心。', 'silence/space 不合交流语境。'],
    ['让步连词', ['Although', 'Because', 'So'], 'Although', '花园不完美但更明亮，表示让步。', 'because/so 不构成这种对比。'],
    ['非谓语', ['to return', 'returning', 'returned'], 'to return', 'promise to do 表示承诺做某事。', 'promise 后通常接不定式。'],
    ['介词搭配', ['on', 'at', 'by'], 'on', 'post pictures on a website 是常用表达。', 'at/by 不表示网站平台。'],
    ['形容词词义', ['useful', 'empty', 'noisy'], 'useful', '几个小时也能有用，说明志愿服务价值。', 'empty/noisy 不描述时间价值。'],
    ['宾语从句', ['that', 'what', 'whether'], 'that', 'learned that 后接完整陈述内容。', 'what 在从句中需担任成分。'],
    ['介词搭配', ['through', 'without', 'under'], 'through', 'improve through shared action 表示通过共同行动改善。', 'without 与共同参与含义相反。'],
    ['名词搭配', ['service', 'travel', 'business'], 'service', 'community service 是社区服务的常用表达。', 'travel/business 不对应志愿主题。'],
  ]),
  ...createClozeQuestions('cloze-passage-05', 81, [
    ['动词词义', ['decide', 'forget', 'repeat'], 'decide', 'decide what kind of work 表示决定职业方向。', 'forget/repeat 不合毕业选择语境。'],
    ['名词词义', ['interests', 'tickets', 'accidents'], 'interests', '工作应匹配个人兴趣和优势。', 'ticket/accident 不可与 strengths 并列。'],
    ['逻辑连接', ['Instead', 'Therefore', 'Otherwise'], 'Instead', '没有仓促选择，转而收集信息。', 'therefore 不表示替代做法。'],
    ['名词搭配', ['information', 'exercise', 'trouble'], 'information', 'gather information 表示搜集信息。', 'gather exercise/trouble 不合搭配。'],
    ['介词搭配', ['with', 'to', 'from'], 'with', 'talk with people 表示与人交流。', 'talk to 也可用，但此处与交流语境优先用 with。'],
    ['非谓语', ['to talk', 'talking', 'talked'], 'to talk', 'invite somebody to do 表示邀请某人做事。', 'invite 后接人作宾语时用不定式。'],
    ['形容词词义', ['different', 'similar', 'quiet'], 'different', '后文列举不同工作特点，说明工作差异大。', 'similar 与后文对比矛盾。'],
    ['比较结构', ['than', 'as', 'for'], 'than', 'more ... than ... 表示更多做前者而非后者。', '比较级后用 than。'],
    ['名词搭配', ['skills', 'colors', 'seasons'], 'skills', 'technical skills 表示技术技能。', 'colors/seasons 不可完成工作要求。'],
    ['反身代词', ['herself', 'himself', 'themselves'], 'herself', 'Mei 指女性单数，understand herself。', 'themselves 与单数主语不一致。'],
    ['让步连词', ['Although', 'Because', 'Unless'], 'Although', '看起来有趣但仍有困难，表示让步。', 'because/unless 不表达转折。'],
    ['形容词搭配', ['responsible', 'popular', 'careless'], 'responsible', 'be responsible 表示有责任心。', 'careless 与工作要求相反。'],
    ['介词搭配', ['for', 'at', 'with'], 'for', 'be ready for new tasks 表示准备好面对新任务。', 'ready 后常接 for。'],
    ['名词词义', ['experience', 'silence', 'luck'], 'experience', 'gain experience 表示获得经验。', 'silence/luck 不来自实习。'],
    ['副词用法', ['gradually', 'rarely', 'suddenly'], 'gradually', '实习中对喜好的认识是逐渐形成的。', 'suddenly 不符合学习过程。'],
    ['非谓语', ['to learn', 'learning', 'learned'], 'to learn', 'have much to learn 表示还有很多要学。', 'much 后的具体内容用不定式说明。'],
    ['代词搭配', ['both', 'either', 'neither'], 'both', 'interest and effort 两者都重要，用 both。', 'either 指两者之一，语义不足。'],
    ['条件连词', ['if', 'though', 'because'], 'if', '只要持续学习就能成长，表示条件。', 'though 表让步，不表达条件。'],
    ['名词词义', ['future', 'holiday', 'mistake'], 'future', '毕业生对未来感到平静。', 'holiday/mistake 不合职业选择语境。'],
    ['名词搭配', ['choice', 'meeting', 'rule'], 'choice', 'a good first choice 表示一个好的初步选择。', 'meeting/rule 不对应职业决定。'],
  ]),
  ...createClozeQuestions('cloze-passage-06', 101, [
    ['动词词义', ['find', 'hide', 'carry'], 'find', 'find information 表示查找信息。', 'hide/carry 不符合互联网的主要用途。'],
    ['动词短语', ['up', 'off', 'away'], 'up', 'take up time 表示占用时间。', 'take off 表示起飞或脱下，与时间无关。'],
    ['逻辑连接', ['but', 'so', 'because'], 'but', '本想看一条消息，却上网近一小时，前后转折。', 'so/because 不表达出乎意料的结果。'],
    ['形容词用法', ['away', 'ready', 'open'], 'away', 'keep a phone away 表示把手机放到一边。', 'ready/open 不能表示减少干扰。'],
    ['名词词义', ['timer', 'ticket', 'lesson'], 'timer', 'set a timer 表示设置计时器。', 'ticket/lesson 不能在二十分钟后响。'],
    ['非谓语', ['to stop', 'stopping', 'stopped'], 'to stop', 'promise to do 表示承诺做某事。', 'promise 后常接不定式。'],
    ['时间连词', ['When', 'Unless', 'Because'], 'When', '闹钟响时他发现阅读进展，用 When 引导时间状语。', 'unless 表条件，语义不合。'],
    ['形容词搭配', ['was surprised', 'was quiet', 'was ready'], 'was surprised', 'be surprised by 表示对某事感到惊讶。', 'quiet/ready 不能与 by 构成该语义。'],
    ['过去完成时', ['had completed', 'has completed', 'will complete'], 'had completed', '闹钟响前已完成阅读，过去的过去用 had completed。', 'has/will 与过去叙事时间不一致。'],
    ['比较结构', ['less', 'more', 'little'], 'less', '比以前花的时间少，用 less time than。', 'time 不可数，little 不构成此比较。'],
    ['介词短语', ['Instead of', 'Because of', 'Apart from'], 'Instead of', 'instead of 后接动名词，表示不再反复查看。', 'because of 表原因，不表示替代。'],
    ['形容词词义', ['fixed', 'empty', 'nervous'], 'fixed', 'fixed times 表示固定的查看时间，有助于管理网络使用。', 'empty/nervous 不修饰 times 的计划性。'],
    ['让步连词', ['Although', 'Therefore', 'So'], 'Although', '第一周有难度，后来变容易，前后为让步。', 'therefore/so 不能引导让步从句。'],
    ['形容词词义', ['difficult', 'expensive', 'natural'], 'difficult', '新习惯在开始时有困难，语义最连贯。', 'expensive/natural 不描述执行难度。'],
    ['副词用法', ['gradually', 'suddenly', 'hardly'], 'gradually', '习惯是逐渐变容易的，用 gradually。', 'suddenly 表突然，不合过程。'],
    ['比较级', ['better', 'best', 'well'], 'better', 'sleep 后接副词比较级，表示睡得更好。', 'best 需最高级语境。'],
    ['介词搭配', ['with', 'from', 'under'], 'with', 'use something with a clear purpose 表示带着明确目的使用。', 'from/under 不合搭配。'],
    ['比较结构', ['than', 'as', 'for'], 'than', 'more important than 表示比……更重要。', '比较级后用 than。'],
    ['宾语从句', ['that', 'what', 'whether'], 'that', 'understood that 后接完整陈述从句。', 'what 在从句中需充当成分。'],
    ['形容词词义', ['meaningful', 'empty', 'dangerous'], 'meaningful', '有自控力能让自由时间更有意义。', 'empty/dangerous 与积极语境不符。'],
  ]),
  ...createClozeQuestions('cloze-passage-07', 121, [
    ['动词词义', ['planned', 'missed', 'sold'], 'planned', '学校策划清理日，用 planned。', 'missed/sold 不符合组织活动的语境。'],
    ['非谓语', ['to join', 'joining', 'joined'], 'to join', 'invite somebody to do 表示邀请某人做事。', 'invite 后接人时用不定式。'],
    ['副词用法', ['early', 'quietly', 'slowly'], 'early', '活动集合通常要求早到，用 arrive early。', 'quietly/slowly 不说明到达时间。'],
    ['被动语态', ['were given', 'gave', 'giving'], 'were given', '手套等物品被发给各组，用被动。', 'groups 不能主动 give 这些物品。'],
    ['介词搭配', ['into', 'from', 'with'], 'into', 'sort ... into different bags 表示分类放入不同袋子。', 'sort from 不是该搭配。'],
    ['形容词比较级', ['heavier', 'heavy', 'heavily'], 'heavier', 'much 修饰比较级，wet rubbish 更重。', 'heavy 不能跟在 much 后构成比较。'],
    ['宾语从句', ['that', 'what', 'whether'], 'that', 'said that 后接完整内容。', 'what 在从句中需要充当成分。'],
    ['原因连词', ['because', 'although', 'until'], 'because', '没人早退的原因是河流与大家生活有关。', 'although 表让步，不表示原因。'],
    ['副词用法', ['carefully', 'suddenly', 'nearly'], 'carefully', '水边工作需要小心，用 carefully。', 'suddenly/nearly 不表示做事方式。'],
    ['比较结构', ['than', 'as', 'for'], 'than', 'cleaner than it had been 表示比过去更干净。', '比较级后用 than。'],
    ['介词搭配', ['on', 'at', 'for'], 'on', 'give a talk on recycling 表示作关于回收的演讲。', 'at/for 不表示话题。'],
    ['冠词', ['a', 'an', 'the'], 'a', 'habit 是单数可数名词，small 以辅音音素开头。', 'an 应用于元音音素开头的词。'],
    ['被动语态', ['were', 'are', 'have'], 'were', '学生当时感到惊讶，用过去时 be surprised。', 'are 与过去活动时间不一致。'],
    ['让步连词', ['Although', 'Because', 'Unless'], 'Although', '一次清理无法解决所有问题，但能改变看法，前后让步。', 'because/unless 不表达这种对比。'],
    ['形容词搭配', ['proud', 'afraid', 'tired'], 'proud', 'feel proud of 表示为自己的工作感到自豪。', 'afraid/tired 与后文积极行动不符。'],
    ['非谓语', ['to reduce', 'reducing', 'reduced'], 'to reduce', 'agree to do 表示同意做某事。', 'agree 后通常接不定式。'],
    ['比较级', ['less', 'few', 'little'], 'less', 'plastic 不可数，用 less plastic。', 'few 修饰可数名词复数。'],
    ['条件连词', ['if', 'though', 'because'], 'if', '持续保持习惯是产生影响的条件。', 'though 表让步，不能表达条件。'],
    ['介词搭配', ['with', 'without', 'beside'], 'with', 'begin with ordinary action 表示从日常行动开始。', 'without 与行动的含义相反。'],
    ['名词搭配', ['action', 'weather', 'information'], 'action', 'ordinary action 表示日常行动。', 'weather/information 不符合环保主题。'],
  ]),
  ...createClozeQuestions('cloze-passage-08', 141, [
    ['形容词词义', ['lonely', 'ready', 'busy'], 'lonely', '初到新城不认识任何人，会感到孤单。', 'ready/busy 不表达缺少社交联系。'],
    ['形容词词义', ['difficult', 'cheap', 'clean'], 'difficult', '找市场等简单事看起来困难，符合陌生环境语境。', 'cheap/clean 不说明做事难度。'],
    ['非谓语', ['to explore', 'exploring', 'explored'], 'to explore', 'decide to do 表示决定做某事。', 'decide 后通常接不定式。'],
    ['介词搭配', ['after', 'before', 'under'], 'after', 'one ... after another 表示一个接一个。', 'before/under 不构成该固定表达。'],
    ['关系副词', ['where', 'when', 'why'], 'where', 'library 是地点，后面表示在图书馆能做什么，用 where。', 'when/why 不指代地点。'],
    ['形容词搭配', ['nervous', 'proud', 'famous'], 'nervous', 'be nervous about 表示对见陌生人感到紧张。', 'proud/famous 不合初次见面的心理。'],
    ['非谓语', ['to join', 'joining', 'joined'], 'to join', 'ask somebody to do 表示要求或邀请某人做事。', 'ask 后接人时用不定式。'],
    ['形容词搭配', ['worth', 'ready', 'able'], 'worth', 'places worth visiting 表示值得游览的地方。', 'ready/able 后不能直接接 visiting。'],
    ['介词搭配', ['to', 'for', 'with'], 'to', 'pay attention to 表示注意、留意。', 'pay attention 后固定接 to。'],
    ['条件连词', ['if', 'though', 'because'], 'if', '愿意尝试是获得更多选择的条件。', 'though 表让步，不表达条件。'],
    ['形容词比较级', ['confident', 'silent', 'angry'], 'confident', '交到朋友后会更自信，用 become more confident。', 'silent/angry 不符合积极变化。'],
    ['宾语从句', ['that', 'what', 'whether'], 'that', 'knew that 后接完整的陈述内容。', 'what 在从句中需充当成分。'],
    ['让步连词', ['Although', 'Because', 'Unless'], 'Although', '工作累但仍留出时间社交，前后为让步。', 'because/unless 不表达转折。'],
    ['介词搭配', ['for', 'with', 'at'], 'for', 'make time for somebody 表示为某人留出时间。', 'make time 后固定用 for。'],
    ['副词用法', ['quickly', 'quietly', 'nearly'], 'quickly', '后文说靠许多小经历才熟悉，说明不是很快熟悉。', 'quietly/nearly 不说明熟悉的速度。'],
    ['副词用法', ['well', 'early', 'away'], 'well', 'live well 表示好好生活。', 'early/away 不能修饰 live 表示生活状态。'],
    ['名词词义', ['relationships', 'tickets', 'messages'], 'relationships', '与人交流并建立关系，用 build relationships。', 'tickets/messages 不可被建立。'],
    ['介词搭配', ['to', 'from', 'with'], 'to', 'be afraid to do 表示害怕做某事。', 'afraid 后接不定式表达不敢行动。'],
    ['动词搭配', ['make', 'take', 'have'], 'make', 'make a difference 表示产生影响。', 'take/have 不构成该固定搭配。'],
    ['名词词义', ['home', 'school', 'office'], 'home', '城市最终让他有家的感觉，用 feel like home。', 'school/office 不符合全文情感落点。'],
  ]),
  ...createClozeQuestions('cloze-passage-09', 161, [
    ['形容词词义', ['stressed', 'quiet', 'free'], 'stressed', '记不住任务会让人感到压力大。', 'quiet/free 与遗忘任务的后果不符。'],
    ['非谓语', ['to finish', 'finishing', 'finished'], 'to finish', 'forget to do 表示忘记去做某事。', 'forget doing 表示忘记做过某事，含义不同。'],
    ['名词词义', ['schedule', 'ticket', 'message'], 'schedule', 'weekly schedule 表示每周日程表。', 'ticket/message 不能安排任务。'],
    ['介词搭配', ['into', 'from', 'with'], 'into', 'divide ... into smaller steps 表示拆分成小步骤。', 'divide from 不是该搭配。'],
    ['名词搭配', ['beginning', 'middle', 'end'], 'beginning', '把重要任务放在一天开始时完成，符合时间管理策略。', 'middle/end 不体现优先处理。'],
    ['逻辑连接', ['However', 'Therefore', 'Besides'], 'However', '计划会被意外打乱，但她学会留空档，前后转折。', 'therefore/besides 不表示转折。'],
    ['比较结构', ['than', 'as', 'for'], 'than', 'longer than expected 表示比预期更久。', '比较级后用 than。'],
    ['动词短语', ['off', 'up', 'on'], 'off', 'turn off messages 表示关闭消息提醒。', 'turn on 与减少干扰的目的相反。'],
    ['副词用法', ['carefully', 'suddenly', 'nearly'], 'carefully', '专心后能更仔细完成工作并减少错误。', 'suddenly/nearly 不说明完成方式。'],
    ['介词搭配', ['after', 'before', 'during'], 'after', '完成一个重要步骤后休息，用 after completing。', 'before 会变成未完成就休息。'],
    ['比较级', ['less', 'more', 'little'], 'less', '有计划后夜间担忧更少，用 less worried。', 'little 不能修饰 worried。'],
    ['形容词词义', ['perfect', 'expensive', 'late'], 'perfect', '计划不必完美，强调可执行性。', 'expensive/late 不合计划质量语境。'],
    ['形容词词义', ['clear', 'empty', 'private'], 'clear', '清晰的计划才能指导行动。', 'empty/private 不说明计划的作用。'],
    ['介词搭配', ['with', 'from', 'under'], 'with', 'begin with one small habit 表示从一个小习惯开始。', 'from/under 不构成该搭配。'],
    ['反身代词', ['themselves', 'herself', 'ourselves'], 'themselves', 'they 指同学们，反身代词用 themselves。', 'herself 与复数 they 不一致。'],
    ['介词搭配', ['with', 'for', 'at'], 'with', 'fill every minute with work 表示让每一分钟都充满工作。', 'for/at 不合搭配。'],
    ['条件连词', ['if', 'though', 'because'], 'if', '复盘并调整是进步的条件。', 'though 表让步，不能表达条件。'],
    ['形容词搭配', ['sure', 'afraid', 'tired'], 'sure', 'feel sure of one\'s choices 表示对选择有把握。', 'afraid/tired 不符合积极变化。'],
    ['名词搭配', ['control', 'weather', 'silence'], 'control', 'a sense of control 表示掌控感。', 'weather/silence 不合时间管理语境。'],
    ['副词用法', ['wisely', 'slowly', 'quietly'], 'wisely', 'use each day wisely 表示明智地利用每一天。', 'slowly/quietly 不表示有效利用时间。'],
  ]),
  ...createClozeQuestions('cloze-passage-10', 181, [
    ['形容词词义', ['nervous', 'hungry', 'late'], 'nervous', '第一次独自旅行，兴奋同时也会紧张。', 'hungry/late 不与 excited 形成心理状态对比。'],
    ['介词搭配', ['of', 'with', 'for'], 'of', 'a list of things 表示物品清单。', 'list 后常用 of 引出内容。'],
    ['名词搭配', ['advice', 'weather', 'practice'], 'advice', 'give somebody advice about 表示就某事给建议。', 'weather/practice 不可与 local food 搭配。'],
    ['疑问词加不定式', ['how', 'where', 'when'], 'how', 'show somebody how to do 表示告诉某人如何做。', '这里强调到达方式，不是地点或时间。'],
    ['目的连词', ['so', 'but', 'unless'], 'so', '记下信息的目的是不忘记，用 so 表结果或目的。', 'but/unless 不表达这种关系。'],
    ['非谓语', ['eating', 'eat', 'ate'], 'eating', 'see somebody doing 表示看见某人正在做。', '这里描述街头正在吃早餐的人。'],
    ['副词用法', ['immediately', 'quietly', 'nearly'], 'immediately', '下雨后他没有立刻回酒店，而是继续游览。', 'quietly/nearly 不表示时间先后。'],
    ['非谓语', ['walking', 'walk', 'walked'], 'walking', 'continue doing 表示继续做某事。', 'continue 后用动名词表示持续动作。'],
    ['动词搭配', ['helped', 'forced', 'watched'], 'helped', 'help somebody do 表示帮助某人做事。', 'force/watch 不符合友善服务语境。'],
    ['形容词词义', ['useful', 'expensive', 'quiet'], 'useful', '与当地人交流比只看指南更有用。', 'expensive/quiet 不表示信息价值。'],
    ['名词搭配', ['help', 'work', 'money'], 'help', 'ask somebody for help 表示向某人求助。', 'work/money 不适合迷路求助。'],
    ['动词短语', ['out', 'away', 'down'], 'out', 'point out 表示指出。', 'point away/down 不能表示指出正确道路。'],
    ['形容词最高级', ['best', 'first', 'last'], 'best', 'the best way 表示最好的办法。', 'first/last 不表示解决问题的效果。'],
    ['形容词词义', ['independent', 'silent', 'famous'], 'independent', '独自完成旅行后会更独立。', 'silent/famous 不表示成长变化。'],
    ['非谓语', ['to face', 'facing', 'faced'], 'to face', 'be willing to do 表示愿意做某事。', 'willing 后通常接不定式。'],
    ['介词搭配', ['about', 'from', 'under'], 'about', 'teach people about 表示教给人们有关……的知识。', 'from/under 不表示话题内容。'],
    ['形容词搭配', ['at', 'with', 'for'], 'at', 'be surprised at 表示对某事感到惊讶。', 'with/for 不构成该搭配。'],
    ['逻辑连接', ['but', 'so', 'because'], 'but', '要再旅行，但会准备得更充分，前后带有转折补充。', 'so/because 不表达这种语气。'],
    ['形容词词义', ['clean', 'open', 'quiet'], 'clean', '旅行者应保持公共场所干净。', 'open/quiet 不与 keep public places 搭配。'],
    ['介词搭配', ['to', 'with', 'from'], 'to', 'be open to new experiences 表示乐于接受新体验。', 'open 后固定接 to。'],
  ]),
  ...createClozeQuestions('cloze-passage-11', 201, [
    ['动词词义', ['prepared', 'forgot', 'missed'], 'prepared', '班级为科学展准备实验，用 prepared。', 'forgot/missed 不符合组织实验。'],
    ['非谓语', ['to find out', 'finding out', 'found out'], 'to find out', 'want to do 表示想要做某事。', 'want 后通常接不定式。'],
    ['名词词义', ['prediction', 'ticket', 'holiday'], 'prediction', '实验前对结果作出的猜测是 prediction。', 'ticket/holiday 与科学实验无关。'],
    ['副词比较级', ['faster', 'fast', 'fastest'], 'faster', '种子之间作比较，用比较级 faster。', 'fastest 需要三者中最高级的明确语境。'],
    ['比较结构', ['than', 'as', 'for'], 'than', 'more important than 表示比……更重要。', '比较级后接 than。'],
    ['介词搭配', ['in', 'on', 'at'], 'in', 'write results in a notebook 表示把结果记在笔记本里。', 'on/at 不表示记录载体。'],
    ['宾语从句', ['whether', 'that', 'what'], 'whether', 'check whether 表示检查是否。', 'that 不表达是否这一不确定性。'],
    ['非谓语', ['to compare', 'comparing', 'compared'], 'to compare', 'enough information to do 表示有足够信息去做某事。', 'information 后用不定式说明用途。'],
    ['副词比较级', ['better', 'best', 'well'], 'better', '与其他种子比较，长得更好用 better。', 'best 需最高级语境。'],
    ['比较级', ['more', 'much', 'most'], 'more', '与前文不同，第三盒得到更多水，用 more water。', 'much 不能表达比较。'],
    ['副词用法', ['well', 'good', 'better'], 'well', 'grow well 表示长得好，grow 后用副词。', 'good 是形容词，不能修饰 grow。'],
    ['非谓语', ['to share', 'sharing', 'shared'], 'to share', 'ask somebody to do 表示要求某人做事。', 'ask 后接人时用不定式。'],
    ['让步连词', ['Although', 'Because', 'So'], 'Although', '结果和原先想法不同，但实验没有失败，表示让步。', 'because/so 不表达这种对比。'],
    ['名词词义', ['chances', 'rules', 'roads'], 'chances', 'mistakes as chances to ask 表示把错误看成提问的机会。', 'rules/roads 不符合学习语境。'],
    ['宾语从句', ['what', 'that', 'whether'], 'what', 'asked what ... enjoyed most，what 作 enjoyed 的宾语。', 'that/whether 不能同时承担该成分。'],
    ['形容词词义', ['curious', 'careless', 'empty'], 'curious', '科学需要好奇心，用 being curious。', 'careless 与检查事实的要求相反。'],
    ['形容词词义', ['daily', 'private', 'ancient'], 'daily', 'science can be part of daily life 表示科学与日常生活相关。', 'private/ancient 不合语境。'],
    ['副词用法', ['carefully', 'suddenly', 'nearly'], 'carefully', '观察世界需要仔细，用 look carefully at。', 'suddenly/nearly 不说明观察方式。'],
    ['介词搭配', ['before', 'after', 'during'], 'before', '先检验想法再接受，用 before accepting。', 'after 会颠倒科学探究顺序。'],
    ['名词词义', ['lesson', 'station', 'chance'], 'lesson', '一次实验带来重要的学习收获，是 a lesson。', 'station/chance 不概括实验意义。'],
  ]),
  ...createClozeQuestions('cloze-passage-12', 221, [
    ['介词搭配', ['about', 'for', 'with'], 'about', 'worry about doing 表示担心做某事。', 'worry 后固定搭配 about。'],
    ['介词搭配', ['at', 'for', 'with'], 'at', 'look at a book 表示看着书本。', 'look for 表示寻找。'],
    ['非谓语', ['to prepare', 'preparing', 'prepared'], 'to prepare', 'ask somebody to do 表示要求某人做事。', 'ask 后接人时用不定式。'],
    ['非谓语', ['to take', 'taking', 'took'], 'to take', 'agree to do 表示同意做某事。', 'agree 后通常接不定式。'],
    ['逻辑连接', ['However', 'Therefore', 'Besides'], 'However', '她想停下，但组员鼓励等待，前后转折。', 'therefore/besides 不表达转折。'],
    ['冠词', ['a', 'an', 'the'], 'a', 'job 是单数可数名词，good 以辅音音素开头。', 'an 应用于元音音素开头的词。'],
    ['反身代词', ['herself', 'himself', 'themselves'], 'herself', 'Liu Na 指女性单数，record herself。', 'himself/themselves 与主语不一致。'],
    ['非谓语', ['to improve', 'improving', 'improved'], 'to improve', 'try to do 表示努力去做某事。', 'try 后接不定式表达尝试改进。'],
    ['副词用法', ['quickly', 'quietly', 'nearly'], 'quickly', '进步没有很快到来，用 quickly。', 'quietly/nearly 不说明速度。'],
    ['形容词比较级', ['confident', 'silent', 'afraid'], 'confident', '每次开口都会更自信，用 more confident。', 'silent/afraid 不符合练习后的变化。'],
    ['时间连词', ['when', 'unless', 'because'], 'when', '信心在人们练习时增长，用 when 引导时间状语。', 'unless/because 不说明练习发生的时间。'],
    ['介词搭配', ['by', 'with', 'for'], 'by', 'be surprised by 表示被某事所惊讶。', 'with/for 不构成该搭配。'],
    ['逻辑连接', ['but', 'so', 'because'], 'but', '不是最好的演讲者，但比以前勇敢，表示转折。', 'so/because 不表达对比。'],
    ['非谓语', ['to learn', 'learning', 'learned'], 'to learn', 'a chance to do 表示做某事的机会。', 'chance 后用不定式说明机会内容。'],
    ['介词搭配', ['in', 'at', 'on'], 'in', 'change in one day 表示在一天内改变。', 'at/on 不表示时间范围。'],
    ['介词搭配', ['at', 'in', 'for'], 'at', 'one step at a time 表示一次迈出一小步。', 'in/for 不构成该固定表达。'],
    ['介词搭配', ['with', 'for', 'to'], 'with', 'be patient with somebody 表示对某人有耐心。', 'patient 后固定搭配 with。'],
    ['介词搭配', ['with', 'from', 'under'], 'with', 'begin with doing 表示从做某事开始。', 'from/under 不构成该表达。'],
    ['名词词义', ['weakness', 'ticket', 'silence'], 'weakness', 'turn weakness into a skill 表示把弱点转化为技能。', 'ticket/silence 不可转化为技能。'],
    ['名词词义', ['moment', 'project', 'reason'], 'moment', 'courage became a habit, not a special moment 表示勇气成为日常习惯。', 'project/reason 不对应勇气出现的时刻。'],
  ]),
]
