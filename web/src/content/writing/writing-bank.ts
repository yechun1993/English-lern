import type { Question } from '../../domain/question'

interface WritingEntry {
  topic: string
  prompt: string
  outline: [string, string, string]
  referenceAnswer: string
  explanation: string
  misconception: string
  difficulty: Question['difficulty']
}

const writingChecklist = [
  '范文或我的作文是否控制在约 120–150 个英文词？',
  '第一段是否有清楚的主题句，直接回应题目？',
  '段落之间是否使用了自然的连接词？',
  '是否检查了时态、单复数、拼写和标点？',
  '结尾是否回扣主题并给出明确态度或建议？',
]

function createWritingQuestion(entry: WritingEntry, index: number): Question {
  return {
    id: `writing-${String(index + 1).padStart(3, '0')}`,
    type: 'writing',
    topic: entry.topic,
    difficulty: entry.difficulty,
    stem: `${entry.prompt}\n1. ${entry.outline[0]}\n2. ${entry.outline[1]}\n3. ${entry.outline[2]}`,
    options: [],
    answer: entry.referenceAnswer,
    referenceAnswer: entry.referenceAnswer,
    checklist: writingChecklist,
    explanation: entry.explanation,
    misconception: entry.misconception,
    version: 1,
  }
}

const writingEntries: WritingEntry[] = [
  {
    topic: '网络使用与自律',
    prompt: 'Directions: Write a composition on the topic “Using the Internet Wisely”.',
    outline: ['说明网络给学习和生活带来的便利', '分析过度使用网络可能带来的问题', '提出自己的合理使用建议'],
    referenceAnswer: `The Internet has become an important part of daily life. It helps us find information, communicate with friends, and learn new skills. For students, a short online lesson or a useful article can make learning more efficient.

However, using the Internet without control can cause problems. Some people spend too much time watching short videos or checking messages. As a result, they sleep late, lose attention in class, and have less time for exercise or family talks.

In my opinion, we should use the Internet as a helpful tool instead of letting it control us. We can set a time limit for entertainment, turn off unnecessary notifications, and choose reliable learning materials. With self-control, the Internet can make our lives richer and more useful.`,
    explanation: '采用“便利—问题—建议”的三段结构。第二段用 As a result 说明后果，结尾回到 self-control。',
    misconception: '不要只罗列手机坏处而不回应“如何明智使用”的题目。',
    difficulty: 'foundation',
  },
  {
    topic: '学习习惯',
    prompt: 'Directions: Write a composition on the topic “A Good Study Habit”.',
    outline: ['介绍你认为最重要的一种学习习惯', '说明它如何帮助学习', '谈谈你准备如何坚持这种习惯'],
    referenceAnswer: `A good study habit can make a big difference in learning. In my view, planning each day before studying is one of the most useful habits. A simple plan tells us what to do first and prevents us from wasting time.

For example, I usually list two important tasks and one small task before I begin. I start with the most difficult task when my mind is fresh. After finishing it, I take a short break and check my progress. This method makes me feel less worried and more confident.

Of course, a plan is useful only when we follow it. I will keep my phone away while studying and review my plan every evening. By making small plans and carrying them out, I believe I can study more steadily.`,
    explanation: '首段明确习惯，第二段给出具体做法，第三段说明如何坚持，适合基础写作模仿。',
    misconception: '不要把 habit 写成抽象口号；至少给出一个自己的可执行例子。',
    difficulty: 'foundation',
  },
  {
    topic: '健康生活',
    prompt: 'Directions: Write a composition on the topic “How to Keep Healthy”.',
    outline: ['说明健康的重要性', '列举两三种保持健康的方法', '表达自己坚持健康生活的态度'],
    referenceAnswer: `Good health is the basis of a happy and productive life. When we feel well, we can study, work, and enjoy time with our families. Therefore, it is important to build healthy habits before small problems become serious.

First, we should eat regular meals and include more fruit and vegetables in our diet. Second, exercise does not have to be difficult. Walking, cycling, or playing ball for thirty minutes can improve both body and mood. Finally, enough sleep helps us recover and think clearly the next day.

I know that healthy habits need patience. Instead of making an unrealistic promise, I will make small changes, such as going to bed earlier and taking a walk after dinner. Step by step, these choices can lead to a healthier life.`,
    explanation: '用 First、Second、Finally 组织建议；结尾用 step by step 体现可持续的态度。',
    misconception: '不要把 health 当作可数名词写成 a healthy，注意 healthy 是形容词。',
    difficulty: 'foundation',
  },
  {
    topic: '志愿服务',
    prompt: 'Directions: Write a composition on the topic “The Value of Volunteering”.',
    outline: ['介绍你所了解的一项志愿服务', '说明志愿服务对他人和自己的意义', '表达是否愿意参加及原因'],
    referenceAnswer: `Volunteering is a simple way to make a community a warmer place. In my neighborhood, some young people visit older residents on weekends. They help with small jobs, listen to stories, and teach them how to use a smartphone.

This work is helpful to older people because it gives them practical support and company. At the same time, volunteers learn to be patient and responsible. They also understand that a few hours of help can mean a lot to someone who lives alone.

I would like to take part in this kind of activity. I may not be able to solve every problem, but I can offer my time and attention. If more people are willing to help in small ways, our community will become friendlier and stronger.`,
    explanation: '先写具体服务场景，再分别写对他人与自身的意义，最后表达个人选择。',
    misconception: '不要把 volunteer 只当名词；take part in volunteer activities 更自然。',
    difficulty: 'standard',
  },
  {
    topic: '阅读习惯',
    prompt: 'Directions: Write a composition on the topic “Reading Every Day”.',
    outline: ['说明每天阅读的好处', '介绍你喜欢的阅读方式或内容', '提出坚持阅读的建议'],
    referenceAnswer: `Reading every day is a quiet but powerful habit. It can give us knowledge, improve our language, and help us understand people with different experiences. Even ten or fifteen minutes of reading can make a day more meaningful.

I enjoy reading short articles and simple biographies before going to bed. They are easier to finish than a long book, and they often give me one new idea to think about. Sometimes I write down a useful sentence or share an interesting story with a friend.

To keep this habit, we do not need to read difficult books at the beginning. We can choose a topic that truly interests us and set aside a fixed time each day. When reading becomes part of our routine, it will bring benefits for a long time.`,
    explanation: '通过“好处—个人方式—建议”展开，内容具体而不需要使用生僻词。',
    misconception: '不要把 read books every day 和 reading every day 混用后导致主谓不一致。',
    difficulty: 'foundation',
  },
  {
    topic: '旅行体验',
    prompt: 'Directions: Write a composition on the topic “A Meaningful Trip”.',
    outline: ['介绍一次令你印象深刻的旅行', '说明这次旅行中学到了什么', '谈谈旅行前应做哪些准备'],
    referenceAnswer: `A meaningful trip does more than give us photos. Last spring, I visited a small town with two friends. We walked along the old streets, talked with local shop owners, and tried food that we had never tasted before.

The trip taught me to slow down and pay attention to ordinary life. Instead of rushing from one famous place to another, we spent time observing the town and listening to its stories. I also learned that traveling with friends requires patience, because people may have different plans and interests.

Before a trip, it is wise to make simple preparations. We should check the weather, book a safe place to stay, and learn some local rules. Good preparation gives us more freedom to enjoy the journey and deal with unexpected changes calmly.`,
    explanation: '过去经历使用一般过去时；第三段从经历自然过渡到旅行建议。',
    misconception: '不要把 travel 当作可数名词直接写 a travel，谈一次旅行可用 a trip。',
    difficulty: 'standard',
  },
  {
    topic: '环境保护',
    prompt: 'Directions: Write a composition on the topic “Small Actions for the Environment”.',
    outline: ['说明环境保护与日常生活的关系', '列举可在生活中做到的行动', '呼吁大家从小事做起'],
    referenceAnswer: `Environmental protection is closely connected with our daily choices. We may think that one person cannot change much, but many small actions together can make a real difference. Saving resources is not only a public duty but also a good habit.

There are several things we can do easily. We can carry a reusable bottle, sort household waste, and turn off lights when leaving a room. When possible, we can walk, ride a bike, or use public transport instead of taking a private car for every short trip.

These actions may seem small, but they reduce waste and remind us to respect nature. I believe that people will protect the environment better when they see it as part of everyday life. Let us begin with one simple action today and continue tomorrow.`,
    explanation: '围绕 small actions 展开，列举动作用 can，结尾用号召句收束。',
    misconception: '不要写 protect the environment more better；better 已是比较级。',
    difficulty: 'foundation',
  },
  {
    topic: '终身学习',
    prompt: 'Directions: Write a composition on the topic “Learning Never Ends”.',
    outline: ['解释为什么学习不只发生在学校', '说明成年人还能学习什么', '谈谈自己想学习的一项技能'],
    referenceAnswer: `Many people connect learning only with classrooms and exams. In fact, learning never ends after we leave school. New technology, changing jobs, and daily life problems all require us to keep gaining knowledge and skills.

Adults can learn in many practical ways. They may improve computer skills, learn a new language, study health information, or take a course related to their work. Learning does not always need a formal teacher. A good book, an online lesson, or an experienced friend can also be helpful.

Personally, I would like to learn more about public speaking. It can help me express ideas clearly and communicate with confidence. If I practise a little every week and accept useful advice, I will improve gradually. Continuous learning can keep life active and interesting.`,
    explanation: '第一段解释观点，第二段列举，第三段用个人学习计划落地，结构完整。',
    misconception: '不要把 learn 后的技能直接套用 learn about 与 learn to；根据对象选择搭配。',
    difficulty: 'standard',
  },
  {
    topic: '工作与生活平衡',
    prompt: 'Directions: Write a composition on the topic “Work-Life Balance”.',
    outline: ['说明工作努力的重要性', '分析忽视生活可能带来的问题', '提出平衡工作和生活的方法'],
    referenceAnswer: `Working hard is important, especially when we want to improve our skills or support a family. However, life should not contain only work. If people are always busy, they may become tired, lose interest in friends and hobbies, and even have health problems.

A better balance does not mean doing less work without responsibility. It means using time wisely. For example, we can make a clear list of tasks, finish important work first, and avoid checking work messages during every break. Regular exercise and enough sleep can also improve work efficiency.

In my opinion, everyone needs time to rest and connect with other people. A short walk, a meal with family, or a quiet evening can give us new energy. When work and life support each other, we can live more steadily and happily.`,
    explanation: '用 However 提出转折，再用 For example 给出具体方法，避免空泛说教。',
    misconception: '不要把 balance 当动词时遗漏宾语；本题中 work-life balance 作名词短语。',
    difficulty: 'standard',
  },
  {
    topic: '运动习惯',
    prompt: 'Directions: Write a composition on the topic “Exercise in Daily Life”.',
    outline: ['说明运动给身体和情绪带来的益处', '介绍适合日常坚持的一种运动', '提出让运动成为习惯的方法'],
    referenceAnswer: `Exercise is useful not only for our bodies but also for our minds. After sitting for a long time, a little movement can reduce stress and help us feel more awake. Regular exercise may also improve sleep and make us more energetic during the day.

Walking is my favorite form of exercise because it is simple and does not cost much. I can walk in a park, around my neighborhood, or even get off the bus one stop early. When the weather is pleasant, I enjoy walking with a family member and talking about the day.

The key is to choose an activity that fits our lives. We can begin with ten minutes a day and slowly increase the time. By putting exercise into a daily schedule, we are more likely to keep doing it.`,
    explanation: '使用 not only... but also... 和 because 组织原因，内容贴近日常，易于模仿。',
    misconception: '不要把 exercise 一律当复数；泛指锻炼时 exercise 可作不可数名词。',
    difficulty: 'foundation',
  },
  {
    topic: '友谊',
    prompt: 'Directions: Write a composition on the topic “What Makes a Good Friend”.',
    outline: ['说明你认为好朋友应具备的品质', '举例说明朋友如何互相帮助', '谈谈如何维护友谊'],
    referenceAnswer: `A good friend is someone who brings trust and support into our lives. In my opinion, honesty is one of the most important qualities. A true friend can tell us the truth kindly, even when the truth is not easy to hear.

Good friends also help each other in difficult times. For example, when I felt nervous before an important task, a friend listened to me and helped me make a simple plan. Her support did not solve everything, but it made me feel less alone and more confident.

Friendship needs care from both sides. We should keep our promises, respect different opinions, and make time to communicate. Small actions, such as sending a message or remembering an important day, can show that we value the relationship. With trust and understanding, friendship can last for years.`,
    explanation: '用定义式开头，随后给例子，最后给维护建议，适合人物与关系类话题。',
    misconception: '不要把 friend 的品质只堆成单词列表，要用一个事例支持观点。',
    difficulty: 'standard',
  },
  {
    topic: '城市变化',
    prompt: 'Directions: Write a composition on the topic “Changes in My City”.',
    outline: ['描述城市近年的一个积极变化', '说明变化给居民带来的影响', '提出仍可改进的地方'],
    referenceAnswer: `My city has changed a lot in recent years. One change that I notice clearly is the improvement of public transport. More bus routes and cleaner stations have made it easier for people to travel without using a private car.

This change benefits many residents. Older people can reach hospitals more conveniently, while students and workers can save time on their daily trips. It also helps reduce traffic pressure and air pollution. When public transport is reliable, people have more choices in their lives.

Of course, there is still room for improvement. Some areas need better connections in the evening, and clear signs would help new visitors. I hope the city will continue to listen to residents and make transport safer and more comfortable for everyone.`,
    explanation: '现在完成时概括变化，第二段说明影响，第三段保留理性建议，使文章更有层次。',
    misconception: '不要在描述近年变化时只用过去时而忽略与现在的联系。',
    difficulty: 'standard',
  },
  {
    topic: '网络信息辨别',
    prompt: 'Directions: Write a composition on the topic “Checking Online Information”.',
    outline: ['说明网络信息传播快的特点', '分析轻信信息的风险', '提出核实信息的方法'],
    referenceAnswer: `Online information travels very quickly. A message can reach thousands of people in a few minutes, which is useful when we need news or practical advice. However, speed does not always mean that the information is correct.

If we believe and share false information, we may cause worry or make a poor decision. For example, an untrue health message may lead people to use an unsafe product. Therefore, it is important to pause before forwarding something that seems surprising or emotional.

There are several simple ways to check information. We can look for the original source, compare reports from reliable organizations, and check the date of the message. When we are not sure, it is better to wait than to spread a possible mistake.`,
    explanation: '围绕“快—风险—核实方法”展开；使用 if 和 therefore 明确逻辑关系。',
    misconception: '不要把 information 写成 informations，它通常是不可数名词。',
    difficulty: 'standard',
  },
  {
    topic: '兼职工作',
    prompt: 'Directions: Write a composition on the topic “Part-Time Work for Students”.',
    outline: ['说明学生做兼职可能带来的收获', '分析兼职可能影响学习的情况', '表达你的观点和建议'],
    referenceAnswer: `Part-time work can be a useful experience for students. It gives them a chance to understand real workplaces, communicate with different people, and learn the value of money. A small job may also help a student become more responsible and confident.

However, part-time work should not take the place of study. If students work too many hours, they may feel tired in class or have little time to finish assignments. The problem is not the job itself, but the lack of a reasonable plan.

I think students can take a part-time job when their study schedule allows it. They should choose safe work, limit the hours, and ask for help if schoolwork becomes difficult. With good time management, part-time work can become a helpful lesson outside the classroom.`,
    explanation: '采用“收获—风险—观点”的平衡结构，体现不是非黑即白的思考。',
    misconception: '不要把 part-time 写成 part time work，复合形容词需用连字符。',
    difficulty: 'standard',
  },
  {
    topic: '科技与生活',
    prompt: 'Directions: Write a composition on the topic “Technology in Daily Life”.',
    outline: ['举例说明科技给生活带来的便利', '分析使用科技时应注意的问题', '表达自己合理使用科技的态度'],
    referenceAnswer: `Technology has changed daily life in many positive ways. With a smartphone, people can pay for a bus ride, make a medical appointment, or talk with family members who live far away. These tools save time and make many tasks more convenient.

At the same time, technology should be used carefully. Personal information can be shared too easily, and some people depend on devices for every small task. We should learn basic safety rules, protect our passwords, and remember that face-to-face communication is still valuable.

For me, the best use of technology is to solve real problems and support human connection. I will use useful apps to organize my work, but I will also put my phone away during meals and conversations. In this way, technology can serve life instead of replacing it.`,
    explanation: '第一段列举具体便利，第二段提出风险，第三段形成自己的使用原则。',
    misconception: '不要把 technology 当成只指电脑；可用具体智能设备举例。',
    difficulty: 'foundation',
  },
  {
    topic: '社区服务',
    prompt: 'Directions: Write a composition on the topic “Making My Community Better”.',
    outline: ['说明一个社区中需要改善的方面', '提出一两项可行的建议', '表达居民共同参与的重要性'],
    referenceAnswer: `A better community can make daily life safer and more pleasant. In my area, one problem is that some public spaces are not used well. There are benches and small gardens, but they need more care and more activities for residents of different ages.

One possible solution is to organize a monthly clean-up day. Families, students, and local shops could work together to pick up litter and plant flowers. The community could also hold simple reading or exercise activities in the garden. These events would give neighbors more chances to meet each other.

In my opinion, a community cannot improve only through rules from others. Residents need to take responsibility for the place where they live. If everyone offers a little time or one useful idea, the neighborhood can become cleaner, friendlier, and more lively.`,
    explanation: '按“问题—方案—共同责任”写作，建议具体、可操作，符合学位英语常见社区主题。',
    misconception: '不要让建议脱离社区规模；用简单可执行的活动比宏大口号更有说服力。',
    difficulty: 'standard',
  },
]

export const writingQuestions = writingEntries.map(createWritingQuestion)
