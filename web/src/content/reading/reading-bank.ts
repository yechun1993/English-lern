import type { Question } from '../../domain/question'
import type { Passage } from '../../domain/passage'

type ReadingEntry = readonly [
  topic: string,
  stem: string,
  options: readonly [string, string, string, string],
  answer: string,
  explanation: string,
  misconception: string,
  difficulty: Question['difficulty'],
]

function createReadingQuestions(
  passageId: string,
  startNumber: number,
  entries: readonly ReadingEntry[],
): Question[] {
  return entries.map(([topic, stem, options, answer, explanation, misconception, difficulty], index) => ({
    id: `reading-${String(startNumber + index).padStart(3, '0')}`,
    type: 'reading',
    topic,
    difficulty,
    stem,
    options: [...options],
    answer,
    explanation,
    misconception,
    version: 1,
    passageId,
  }))
}

export const readingPassages: Passage[] = [
  {
    id: 'reading-passage-01',
    type: 'reading',
    title: '社区图书馆：从借书处到共享空间',
    body: `Five years ago, the East Street Library was a quiet building with old shelves and few visitors after noon. Most residents thought of it only as a place to borrow books. They also wanted a warmer atmosphere. Then a new librarian, Ms. He, asked people what they wanted from the library. Parents hoped for a safe place for children after school. Older residents wanted help with mobile phones. Students asked for longer evening hours.

Ms. He did not try to make every change at once. First, she moved several bookcases and made a bright reading corner. Local shops donated chairs, lamps, and some new books. Later, volunteers began to teach simple classes on using phones, searching for jobs, and reading stories aloud to children.

The library soon became busier. On Wednesday evenings, students came to finish homework. On Saturday mornings, grandparents brought young children to a story activity. A small table near the door displayed notices about community events. Residents began to meet neighbors there, even if they did not borrow a book.

Ms. He says the most important change was listening. The library still lends books, but it now serves more of the community's daily needs. Its success has encouraged other public spaces in the area to ask a simple question: What can we do for the people who use this place?`,
  },
  {
    id: 'reading-passage-02',
    type: 'reading',
    title: '学习效率：为什么短暂休息能帮助专注',
    body: `Many people believe that studying longer always produces better results. Yet researchers who observe learning habits often find a different pattern. Attention is not an endless resource. After a period of focused work, the mind may begin to repeat words without understanding them. A short break can help attention recover, especially when the learner returns with a clear next task.

One university study asked students to read difficult material for two hours. One group worked without stopping. A second group studied for twenty-five minutes and then rested for five minutes. During the breaks, students did not use phones or discuss the text. They simply stood up, looked out of a window, or walked slowly nearby.

At the end, the second group remembered more key ideas and made fewer careless mistakes. The researchers did not say that every break is useful. A long break filled with videos or games can make it harder to return to work. The important point is to give the brain a brief change of activity, not a new source of strong distraction.

For everyday study, this suggests a simple method. Choose one small task, focus on it, and then take a planned break. Before resting, decide what you will do next. This makes it easier to begin again. Short breaks are not a way to avoid effort; they are a way to use effort more wisely.`,
  },
  {
    id: 'reading-passage-03',
    type: 'reading',
    title: '日常环保：从减少家庭食物浪费开始',
    body: `Food waste is often discussed as a problem for restaurants and supermarkets. However, many households also throw away food that was still safe to eat. This usually happens for ordinary reasons: people buy more than they need, forget what is in the refrigerator, or cook large meals without a plan.

One neighborhood group tried to understand this problem. For one month, volunteers asked fifty families to keep a simple record of food they threw away. The families wrote down the food, the reason, and whether it had been stored correctly. At the end of the month, vegetables and bread appeared most often on the lists.

The group did not tell people to stop buying fresh food. Instead, it suggested small changes. Families could check the refrigerator before shopping, make a list, and put older food where it could be seen first. They could also freeze extra bread or share a large meal with a neighbor.

Several families said the record changed their habits. They had not realized how often small amounts of food were being wasted. The purpose was not to make people feel guilty. It was to help them notice a pattern and use food with more care. Reducing waste can save money, but it also shows respect for the water, energy, and work that brought food to the table.`,
  },
  {
    id: 'reading-passage-04',
    type: 'reading',
    title: '工作管理：一次会议形式的小改变',
    body: `Rui started work at a small design company shortly after graduation. In her first month, she noticed that weekly meetings often lasted too long. People gave updates one by one, but they rarely made clear decisions. When the meeting ended, some employees were still unsure about what to do next.

Rui did not complain. She asked her manager if she could try a new format for one month. Before each meeting, everyone would write a short update: what they had finished, what problem they had, and what help they needed. During the meeting, the group would discuss only problems that required a decision.

At first, a few coworkers worried that writing updates would create more work. But after two weeks, most of them changed their minds. The meetings became shorter, and employees could read routine news before they entered the room. They had more time to talk about difficult tasks and customers' needs.

Rui also made a small list at the end of each meeting. It named the person responsible for each next step and the date to finish it. The list was sent to the group on the same day. As a result, fewer tasks were forgotten.

After the month ended, the manager kept the new format. Rui learned that improving a process does not always require a large plan. Sometimes it begins with asking what information people truly need and removing the rest.`,
  },
  {
    id: 'reading-passage-05',
    type: 'reading',
    title: '城市记忆：一座旧工厂的新故事',
    body: `Near the railway station in Yonghe City, there is an old brick factory that no longer makes anything. For many years, people passed it without looking at it. The windows were broken, the walls were covered with dust, and the land around it was empty. Some residents wanted the building removed so that new apartments could be built there.

However, a group of local teachers had another idea. They found old photographs showing that the factory had once employed hundreds of people. Former workers remembered the sound of machines in the morning and the small market that opened outside the gate at lunchtime. They spoke with great pride about their shared work. The teachers believed these stories were part of the city’s history.

With support from the local government, the building was cleaned and repaired. Today, one room displays workers’ tools and photographs. Another room is used for art classes and weekend talks. Schoolchildren can interview older visitors and write down what they learn. The area outside has become a small park where families rest in the evening.

The project did not try to make the old factory look new. Instead, it preserved important parts of the building and gave them a new purpose. More residents now visit the place, not because it is perfect, but because it helps them understand how their city has changed.`,
  },
  {
    id: 'reading-passage-06',
    type: 'reading',
    title: '健康科普：晚间光线与更好的睡眠',
    body: `Many people feel tired in the morning even after spending enough hours in bed. One possible reason is the light they see before sleeping. Our bodies use light as a signal. Bright light in the morning helps us become alert, while strong light late at night can make it harder for the body to prepare for sleep.

This does not mean that every lamp is harmful. The problem is usually a long period of bright light from a phone, computer, or television. When people keep checking messages or watching videos in bed, their minds may also remain active. They may be physically tired but still find it difficult to relax. The room should also feel calm and comfortable.

Sleep experts often suggest a simple routine. About half an hour before bed, lower the lights and stop using bright screens when possible. Some people choose to read a paper book, listen to quiet music, or prepare clothes for the next day. These activities give the mind a clear message that the busy part of the day is ending.

Good sleep habits do not require a perfect schedule. A person who has one late night does not need to worry. What matters more is a regular pattern over time. By paying attention to light and evening activities, people can make it easier for their bodies to rest.`,
  },
  {
    id: 'reading-passage-07',
    type: 'reading',
    title: '校园服务：一个自行车维修角的诞生',
    body: `At Lakeside College, many students used bicycles to travel between classrooms, dormitories, and shops. Yet broken bicycles often stayed near dormitory doors for weeks. A flat tire or a loose chain was a small problem, but students did not always know how to repair it. Taking a bicycle to a shop also cost money and time. The problem affected students every day.

Tim, a second-year student, noticed this during his first winter at college. He asked three friends if they would help him start a weekly repair corner. A local bicycle shop agreed to lend basic tools, and a retired mechanic offered to teach simple skills. The college gave the group a small covered space near the dining hall.

Every Sunday afternoon, students could bring bicycles to the corner. Volunteers showed them how to check tires, adjust brakes, and clean chains. They did not repair every problem for visitors. Instead, they explained each step and asked visitors to try it themselves. This made some students more confident about using tools.

After two months, the repair corner had fixed more than eighty bicycles. It also became a place where students met people from other departments. Tim says the most valuable result was not the number of repairs. It was seeing students help one another with a skill they had learned only a few weeks earlier.`,
  },
  {
    id: 'reading-passage-08',
    type: 'reading',
    title: '理性消费：二手物品为什么值得考虑',
    body: `Buying something new is often seen as the easiest choice. However, second-hand markets have become more popular in many cities. People sell books, furniture, clothes, and small electronic products that they no longer need. For buyers, the main attraction is often price. A useful item may cost much less than a similar new one.

Price is not the only reason to consider second-hand goods. Reusing an item can also reduce the amount of waste sent away. Making a new product usually requires materials, energy, and transport. When a product is used for a longer time, these resources may be used more effectively. Some local groups organize exchange days, where residents bring usable items and meet their neighbors. This can make reuse more social as well as practical.

Of course, buying second-hand requires care. A buyer should read the description closely, ask questions, and check the condition of the item. Some online platforms allow buyers and sellers to rate each other after a sale. These ratings can offer useful information, but they are not a complete guarantee. People still need to make their own decisions.

For many families, second-hand shopping is not about choosing the cheapest thing every time. It is about comparing value. An item that is affordable, useful, and in good condition may be a better choice than a new item that will soon be forgotten.`,
  },
]

export const readingQuestions = [
  ...createReadingQuestions('reading-passage-01', 1, [
    ['细节定位', 'What did local shops give to the library?', ['Computers and printers.', 'Chairs, lamps, and new books.', 'Free bus tickets.', 'Sports equipment.'], 'Chairs, lamps, and new books.', '第二段明确写到当地商店捐赠了椅子、灯和一些新书。', '不要把志愿者开设的课程误认为商店提供的物品。', 'foundation'],
    ['词义猜测', 'What does “bright” most likely mean in “a bright reading corner”?', ['Well-lit and pleasant.', 'Very expensive.', 'Far from the windows.', 'Only for adults.'], 'Well-lit and pleasant.', 'bright 在此修饰阅读角，结合灯具和舒适环境，表示明亮宜人。', '不要只按“聪明”这一常见义项理解 bright。', 'foundation'],
    ['推断判断', 'What can be inferred from residents meeting neighbors without borrowing books?', ['The library has stopped lending books.', 'The library is serving a social purpose as well.', 'Residents no longer like reading.', 'The library charges visitors money.'], 'The library is serving a social purpose as well.', '人们即使不借书也去相见，说明图书馆已成为社区交流空间。', '原文说图书馆仍然借书，不能选“停止借书”。', 'standard'],
    ['主旨概括', 'What is the main idea of the passage?', ['Libraries should only lend books.', 'A library became more useful by listening to community needs.', 'Students need more evening homework time.', 'Mobile phones have changed public spaces.'], 'A library became more useful by listening to community needs.', '全文围绕图书馆倾听居民需求后逐步改变服务展开。', '不要把某一类活动或某一群人当成全文主旨。', 'standard'],
  ]),
  ...createReadingQuestions('reading-passage-02', 5, [
    ['细节定位', 'What did students in the second group do during breaks?', ['They watched short videos.', 'They discussed the text.', 'They looked outside or walked slowly.', 'They read a different book.'], 'They looked outside or walked slowly.', '第二段说明学生没有用手机或讨论文本，而是站起来、看窗外或慢走。', '不要把文中被否定的 phones 或 videos 当作正确行为。', 'foundation'],
    ['词义猜测', 'What does “recover” most nearly mean in the first paragraph?', ['Regain its ability.', 'Become more expensive.', 'Move to another place.', 'Forget everything.'], 'Regain its ability.', 'attention recover 表示注意力在休息后恢复、重新能够集中。', '不要把 recover 只理解为“找到丢失物品”。', 'foundation'],
    ['推断判断', 'Why does the passage advise deciding the next task before resting?', ['It makes the break longer.', 'It helps the learner restart more easily.', 'It removes the need for effort.', 'It guarantees perfect results.'], 'It helps the learner restart more easily.', '末段直接说明预先决定下一步会使再次开始更容易。', '不要把“更容易开始”夸大为“不必努力”或“保证满分”。', 'standard'],
    ['主旨概括', 'Which statement best summarizes the passage?', ['Any break will improve study results.', 'Long study sessions are always harmful.', 'Short, planned, low-distraction breaks can support focused study.', 'Students should study only twenty-five minutes a day.'], 'Short, planned, low-distraction breaks can support focused study.', '文章强调的是有计划、低干扰的短休息有助于保持专注。', '不要忽略“有计划、低干扰”的限定，把结论扩大为任何休息都有效。', 'standard'],
  ]),
  ...createReadingQuestions('reading-passage-03', 9, [
    ['细节定位', 'What did the fifty families record for one month?', ['Their shopping costs only.', 'Food they threw away and the reasons for it.', 'The names of local restaurants.', 'Their favorite fresh foods.'], 'Food they threw away and the reasons for it.', '第二段说明家庭记录了丢弃的食物、原因以及储存情况。', '不要把“购买清单”误认为本次记录的内容。', 'foundation'],
    ['词义猜测', 'What does “guilty” most nearly mean in the passage?', ['Responsible for doing something wrong.', 'Ready to buy more food.', 'Unable to remember a list.', 'Interested in cooking.'], 'Responsible for doing something wrong.', 'feel guilty 表示因做错事而感到内疚。', '不要把“避免内疚”误解为“鼓励继续浪费”。', 'foundation'],
    ['推断判断', 'Why does the group suggest putting older food where it can be seen first?', ['To make the refrigerator look larger.', 'To help families use it before it is wasted.', 'To keep it colder than new food.', 'To make shopping take longer.'], 'To help families use it before it is wasted.', '把旧食物放在显眼处，是为了优先使用，减少被遗忘和浪费。', '不要把储存位置的建议理解成改变温度。', 'standard'],
    ['主旨概括', 'What is the main purpose of the passage?', ['To criticize families for buying fresh food.', 'To show how small household habits can reduce food waste.', 'To compare restaurants with supermarkets.', 'To explain how to grow vegetables.'], 'To show how small household habits can reduce food waste.', '全文通过社区记录和小建议说明日常习惯可以减少家庭食物浪费。', '文章不是要求不买新鲜食物，而是提倡更有计划地使用。', 'standard'],
  ]),
  ...createReadingQuestions('reading-passage-04', 13, [
    ['细节定位', 'What did employees write before each meeting in Rui’s new format?', ['A short update about work and needed help.', 'A full report for customers.', 'A list of every future meeting.', 'A personal plan for weekends.'], 'A short update about work and needed help.', '第二段明确列出：已完成事项、遇到的问题和需要的帮助。', '不要把会后责任清单误认为会前更新内容。', 'foundation'],
    ['词义猜测', 'What does “routine” most nearly mean in “routine news”?', ['Regular and ordinary.', 'Secret and private.', 'Difficult to understand.', 'Related to customers only.'], 'Regular and ordinary.', 'routine 指日常、常规的信息，不必占用会议时间逐一说明。', '不要把 routine 理解为“机密”或“复杂”。', 'foundation'],
    ['推断判断', 'Why did most coworkers change their minds after two weeks?', ['They no longer had to attend meetings.', 'They saw that the new format saved time and improved discussion.', 'The manager stopped asking for updates.', 'They received more money for their work.'], 'They saw that the new format saved time and improved discussion.', '会议变短且可集中讨论难题，说明新方式带来了实际好处。', '原文没有说取消会议或增加薪水。', 'standard'],
    ['主旨概括', 'What lesson did Rui learn from the experience?', ['Every company needs a large management plan.', 'A small change can improve a process when it focuses on useful information.', 'Employees should avoid writing updates.', 'Meetings should never include difficult questions.'], 'A small change can improve a process when it focuses on useful information.', '末段点明：改进流程不一定需要大计划，关键是保留真正需要的信息。', '不要把“减少无用信息”误解为“完全不讨论难题”。', 'standard'],
  ]),
  ...createReadingQuestions('reading-passage-05', 17, [
    ['细节定位', 'What can visitors see in one room of the repaired factory?', ['New apartments for workers.', 'Workers’ tools and photographs.', 'A railway station office.', 'A large food market.'], 'Workers’ tools and photographs.', '第三段明确说明一个房间展示工人的工具和照片。', '不要把工厂过去门外的午间市场当成如今的展览内容。', 'foundation'],
    ['词义猜测', 'What does “preserved” most nearly mean in the last paragraph?', ['Protected and kept.', 'Sold at a high price.', 'Painted in bright colors.', 'Moved to another city.'], 'Protected and kept.', 'preserve important parts 表示保护并保留建筑的重要部分。', '不要把“赋予新用途”误解为推倒或搬走建筑。', 'foundation'],
    ['推断判断', 'Why did the teachers collect former workers’ stories?', ['They wanted to open a new market.', 'They believed the stories were valuable to the city’s history.', 'They needed workers to repair the building.', 'They planned to build apartments.'], 'They believed the stories were valuable to the city’s history.', '第二段直接说明教师认为这些故事属于城市历史的一部分。', '不要把“收集故事”误解为寻找维修工人。', 'standard'],
    ['主旨概括', 'What is the main idea of the passage?', ['Old factories should always become apartments.', 'A city reused an old factory to connect people with local history.', 'Schoolchildren should learn to repair machines.', 'Railway stations need more parks.'], 'A city reused an old factory to connect people with local history.', '全文讲述旧工厂被保护、再利用，并帮助居民理解城市变化。', '不要只抓住艺术课或公园等某一个细节。', 'standard'],
  ]),
  ...createReadingQuestions('reading-passage-06', 21, [
    ['细节定位', 'What do sleep experts suggest doing before bed?', ['Using bright screens for thirty minutes.', 'Lowering lights and reducing screen use.', 'Doing difficult work in bed.', 'Checking messages more often.'], 'Lowering lights and reducing screen use.', '第三段建议睡前调暗灯光，并尽量停止使用明亮屏幕。', '不要选择文中描述为问题行为的选项。', 'foundation'],
    ['词义猜测', 'What does “signal” most nearly mean in the first paragraph?', ['A message that gives information.', 'A type of comfortable bed.', 'A loud sound from a machine.', 'A short period of sleep.'], 'A message that gives information.', '身体把光线当作提示信息，以判断该保持清醒还是准备休息。', '不要把 signal 只理解为交通信号灯。', 'foundation'],
    ['推断判断', 'Why might reading a paper book help before sleep?', ['It gives the mind a calmer activity without bright screens.', 'It makes people sleep fewer hours.', 'It is more exciting than watching videos.', 'It replaces the need for a regular routine.'], 'It gives the mind a calmer activity without bright screens.', '纸质阅读是第三段列出的安静替代活动，传达一天即将结束的信息。', '文章没有说纸质书可取代规律作息。', 'standard'],
    ['主旨概括', 'What is the main point of the passage?', ['All lamps should be removed from bedrooms.', 'Evening light and activities can affect sleep, so simple habits may help.', 'People need exactly eight hours of sleep every night.', 'Television is the only cause of poor sleep.'], 'Evening light and activities can affect sleep, so simple habits may help.', '文章说明晚间强光和活动会影响入睡，并给出可执行的小建议。', '不要把建议绝对化为“所有灯都不能用”或“唯一原因”。', 'standard'],
  ]),
  ...createReadingQuestions('reading-passage-07', 25, [
    ['细节定位', 'Who offered to teach simple repair skills?', ['A dining hall worker.', 'A retired mechanic.', 'The college president.', 'A bicycle shop owner.'], 'A retired mechanic.', '第二段说明一位退休机械师愿意教授基本技能。', '自行车店借出了工具，但教授技能的是退休机械师。', 'foundation'],
    ['词义猜测', 'What does “adjust” most nearly mean in “adjust brakes”?', ['Make small changes to improve them.', 'Buy new brakes immediately.', 'Remove the brakes completely.', 'Paint the brakes a new color.'], 'Make small changes to improve them.', 'adjust 表示作小幅调整，使刹车处于合适状态。', '不要把调整误解为必须更换或拆除。', 'foundation'],
    ['推断判断', 'Why did volunteers ask visitors to try each repair step themselves?', ['To finish repairs more slowly.', 'To help visitors gain repair confidence and skills.', 'To avoid using any tools.', 'To charge visitors for lessons.'], 'To help visitors gain repair confidence and skills.', '第三段说志愿者解释步骤并让来访者亲自尝试，结果是学生更有信心使用工具。', '文章没有提到收费或故意拖慢维修。', 'standard'],
    ['主旨概括', 'What is the main idea of the passage?', ['A student group created a repair corner that taught skills and built community.', 'Bicycle shops should repair every bicycle for free.', 'Students should stop using bicycles in winter.', 'College dormitories need larger doors.'], 'A student group created a repair corner that taught skills and built community.', '全文讲述学生建立维修角，既解决实际问题又促成互助交流。', '不要把“修了八十辆车”这个细节当成全文唯一重点。', 'standard'],
  ]),
  ...createReadingQuestions('reading-passage-08', 29, [
    ['细节定位', 'What can ratings on some online platforms provide?', ['A complete guarantee for every sale.', 'Useful information about buyers and sellers.', 'Free transport for all products.', 'A new product for each buyer.'], 'Useful information about buyers and sellers.', '第三段说明评价可提供有用信息，但并非完整保证。', '不要忽略原文的限定，把 ratings 理解成绝对保证。', 'foundation'],
    ['词义猜测', 'What does “affordable” most nearly mean in the last paragraph?', ['Not too expensive for a buyer.', 'Very difficult to find.', 'Completely new and unused.', 'Made in another country.'], 'Not too expensive for a buyer.', 'affordable 表示价格在购买者能够负担的范围内。', '不要把 affordable 误解为“一定最便宜”。', 'foundation'],
    ['推断判断', 'Why does the passage advise buyers to check an item carefully?', ['Second-hand items can vary in condition and need personal judgment.', 'Online platforms never show descriptions.', 'New items are always of low quality.', 'Second-hand goods cannot be useful.'], 'Second-hand items can vary in condition and need personal judgment.', '文章强调看说明、提问、检查状况，并说明评价不是完全保证。', '不要把谨慎购买理解为否定二手物品的价值。', 'standard'],
    ['主旨概括', 'Which statement best summarizes the passage?', ['Second-hand shopping can offer value and reduce waste when people buy carefully.', 'People should always buy the cheapest product.', 'Only books should be bought second-hand.', 'Making new products never uses energy.'], 'Second-hand shopping can offer value and reduce waste when people buy carefully.', '文章从价格、环保和谨慎检查三方面说明理性购买二手物品的价值。', '不要遗漏“谨慎检查”这一重要条件。', 'standard'],
  ]),
]
