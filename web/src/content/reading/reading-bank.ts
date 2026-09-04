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
  {
    id: 'reading-passage-09',
    type: 'reading',
    title: '旅行体验：一张手绘地图带来的发现',
    body: `During a four-day visit to a coastal city, Mei chose a small family hotel instead of a large chain hotel. On her first evening, the owner gave her a hand-drawn map. It marked a bus stop, several low-cost restaurants, a quiet beach, and a hill where local people watched the sunset. Mei had already saved many online recommendations, but she put the map in her bag as well.

The next morning, Mei planned to visit a famous museum. On the way there, heavy rain began. The museum was still open, but the streets around it were crowded with visitors trying to stay dry. Mei remembered the map and decided to take a bus to a neighborhood farther from the center.

There she found a covered market, a small history room, and a bakery run by two sisters. The sisters told her how the neighborhood had changed after a new bridge was built. Mei spent most of the afternoon there. She did not see the museum that day, but she felt that she understood the city better.

When Mei returned to the hotel, she thanked the owner for the map. The owner smiled and said that visitors often want to see the famous places first. Those places are important, but a city also lives in the streets where local people shop, work, and talk. Mei kept the map after the trip because it reminded her to leave room for unexpected discoveries.`,
  },
  {
    id: 'reading-passage-10',
    type: 'reading',
    title: '科学参与：普通人也能帮助观察城市鸟类',
    body: `Scientists who study birds need information from many places and many seasons. It would be impossible for a small research team to watch every park, lake, and street tree in a large city. For this reason, some projects invite ordinary residents to record the birds they see. This kind of work is often called citizen science.

Participants do not need to know every bird at the beginning. They can use a guide or a phone application to compare colors, size, and sounds. Most projects ask people to record the date, the place, the number of birds, and what the birds were doing. Some volunteers choose the same route each week, which makes comparisons clearer. Others visit areas that have not been reported often. A clear photograph can also help experts check a report later.

One observation may not mean much by itself. However, thousands of observations collected over several years can show useful patterns. For example, they may show that a certain bird arrives earlier in spring or is becoming less common in one area. Researchers can then ask further questions about food, weather, buildings, or water quality.

Citizen science does not replace professional research. Instead, it gives scientists more information and gives residents a closer look at nature around them. People who take part often say that they notice parks and streets differently after they begin watching carefully.`,
  },
  {
    id: 'reading-passage-11',
    type: 'reading',
    title: '终身学习：重新走进晚间课堂',
    body: `At the age of forty-seven, Han Mei decided to take an evening class in digital skills. She had worked in a food company for more than twenty years and knew her job well. However, more orders and records were moving online. Han Mei could use a phone for messages, but she felt nervous when she had to create a document or join an online meeting.

The class met twice a week at a local learning center. On the first evening, Han Mei worried that the younger students would learn much faster. She was also afraid of pressing the wrong button. The teacher told the class that making mistakes was part of learning and asked everyone to help a partner when possible.

Han Mei began to practice for fifteen minutes after dinner each day. She wrote short notes, sent files to herself, and tried simple tables. Two classmates became her friends. When one of them understood a new task quickly, that person explained it in different words until the others understood too.

After three months, Han Mei was not an expert, but she no longer avoided technology. At work, she showed a coworker how to organize a shared file. She says the class taught her more than computer skills. It reminded her that learning can begin again whenever a person is willing to take a small first step.`,
  },
  {
    id: 'reading-passage-12',
    type: 'reading',
    title: '网络信息：分享前先花一分钟核查',
    body: `Online information can travel from one person to thousands of people in a very short time. This makes it easy to learn about useful events, new ideas, and important news. It also makes it easy for an unclear or false message to spread. A surprising headline may make people want to share it before they have asked whether it is true.

One simple habit can reduce this problem: pause before sharing. First, look at the source. Is the message from an organization, a known news service, or an individual account with no clear background? Next, check the date. An old story may be true but no longer useful in a new situation.

It is also helpful to look for evidence. Does the message explain where its facts came from? Can the same information be found on more than one reliable website? A photograph or a short video can be powerful, but it may not show the whole situation. Images can be old, edited, or taken in a different place. Before sharing, people can also ask whether the message uses strong emotional words without giving clear facts. This is a reason to slow down, not a reason to argue.

Checking information does not mean that people must become professional reporters. It means they should be careful with what they pass to friends and family. A short pause can prevent confusion and help online conversations become more useful.`,
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
  ...createReadingQuestions('reading-passage-09', 33, [
    ['细节定位', 'What was marked on the hotel owner’s map?', ['A new bridge and a large museum only.', 'A bus stop, restaurants, a beach, and a hill.', 'Every hotel in the coastal city.', 'The exact route to Mei’s home.'], 'A bus stop, restaurants, a beach, and a hill.', '第一段列出手绘地图标注的地点，包括车站、餐馆、海滩和山丘。', '不要把后来出现的市场和历史室误认为地图最初标注内容。', 'foundation'],
    ['词义猜测', 'What does “recommendations” most nearly mean in the passage?', ['Suggestions about what to do or see.', 'Tickets for public transport.', 'Rules for hotel workers.', 'Maps drawn by local people.'], 'Suggestions about what to do or see.', 'online recommendations 指网上给出的游览建议。', '不要把建议本身误解成门票或地图。', 'foundation'],
    ['推断判断', 'Why did Mei feel that she understood the city better after visiting the neighborhood?', ['She bought more expensive food there.', 'She learned about local life and changes from residents.', 'The neighborhood had the city’s largest museum.', 'She avoided speaking to local people.'], 'She learned about local life and changes from residents.', '两位店主讲述了桥建成后社区的变化，体现了当地人的生活视角。', '文章没有说她花钱更多或参观了最大博物馆。', 'standard'],
    ['主旨概括', 'What is the main message of the passage?', ['Famous museums should be avoided in bad weather.', 'Travel can become richer when people remain open to local and unexpected experiences.', 'Online maps are always less useful than paper maps.', 'Family hotels are cheaper than all chain hotels.'], 'Travel can become richer when people remain open to local and unexpected experiences.', '文章通过手绘地图和临时改变路线，强调旅行中保持开放能发现更多当地生活。', '不要把“手绘地图”这一工具误当成全文唯一结论。', 'standard'],
  ]),
  ...createReadingQuestions('reading-passage-10', 37, [
    ['细节定位', 'What information do most bird projects ask participants to record?', ['The price of the phone application.', 'The date, place, number, and bird activity.', 'Only the names of local parks.', 'The weather in other countries.'], 'The date, place, number, and bird activity.', '第二段明确列出日期、地点、鸟的数量和活动情况。', '不要遗漏“鸟在做什么”这一记录内容。', 'foundation'],
    ['词义猜测', 'What does “patterns” most nearly mean in the third paragraph?', ['Repeated changes or regular trends.', 'Pictures of different birds.', 'Rules for using a park.', 'Personal opinions about science.'], 'Repeated changes or regular trends.', '多年大量观测可显示鸟类到达时间或数量变化的规律。', '不要把 patterns 仅理解为衣服图案。', 'foundation'],
    ['推断判断', 'Why are thousands of observations more useful than one observation?', ['They can reveal changes that are hard to see from a single report.', 'They make professional research unnecessary.', 'They guarantee every bird is correctly named.', 'They stop birds from moving to new places.'], 'They can reveal changes that are hard to see from a single report.', '第三段说明长期大量数据能够呈现季节和区域变化的模式。', '文章强调 citizen science 补充而非取代专业研究。', 'standard'],
    ['主旨概括', 'What is the main idea of the passage?', ['Only scientists can observe birds correctly.', 'Citizen science lets residents contribute useful bird observations while learning about nature.', 'Phone applications are more important than parks.', 'Birds should be kept away from cities.'], 'Citizen science lets residents contribute useful bird observations while learning about nature.', '全文说明居民记录鸟类既能为研究提供信息，也能增进对身边自然的观察。', '不要忽略普通居民参与和科学家复核之间的合作关系。', 'standard'],
  ]),
  ...createReadingQuestions('reading-passage-11', 41, [
    ['细节定位', 'What did Han Mei practice after dinner each day?', ['Writing notes, sending files, and making simple tables.', 'Cooking new meals for classmates.', 'Repairing food company machines.', 'Teaching evening classes.'], 'Writing notes, sending files, and making simple tables.', '第三段列出她每天练习的三项数字技能。', '不要把她在食品公司的工作内容当成课后练习。', 'foundation'],
    ['词义猜测', 'What does “avoided” most nearly mean in the last paragraph?', ['Tried to stay away from.', 'Learned very quickly.', 'Paid money for.', 'Explained to others.'], 'Tried to stay away from.', 'no longer avoided technology 表示她不再回避或躲开技术问题。', '不要把 avoid 理解为“熟练使用”。', 'foundation'],
    ['推断判断', 'Why did Han Mei become more confident in the class?', ['She was the youngest student there.', 'She practiced regularly and received support from classmates.', 'The teacher completed every task for her.', 'Her company stopped using online records.'], 'She practiced regularly and received support from classmates.', '她每天练习，且同学会换种说法解释新任务，这些都帮助她进步。', '文章没有说老师替她完成任务或公司停止线上工作。', 'standard'],
    ['主旨概括', 'What is the main message of the passage?', ['Learning new skills is possible at different ages when people take small steps.', 'Only young people should learn digital skills.', 'Online meetings are easier than documents.', 'Food companies should offer free phones.'], 'Learning new skills is possible at different ages when people take small steps.', '末段点明终身学习的核心：愿意迈出小的第一步，就能重新开始学习。', '不要把数字技能这一具体例子误当成唯一主题。', 'standard'],
  ]),
  ...createReadingQuestions('reading-passage-12', 45, [
    ['细节定位', 'What does the passage suggest checking after looking at the source?', ['The date of the message.', 'The price of a phone.', 'The number of followers only.', 'The writer’s favorite event.'], 'The date of the message.', '第二段建议先看来源，接着检查信息日期。', '不要把未被建议的关注者数量当作核查步骤。', 'foundation'],
    ['词义猜测', 'What does “source” most nearly mean in the passage?', ['Where information comes from.', 'A type of online picture.', 'The final result of a search.', 'A person who shares every message.'], 'Where information comes from.', 'source 指消息来自哪个机构、媒体或个人账号。', '不要把 source 只理解为“搜索结果”。', 'foundation'],
    ['推断判断', 'Why does the passage advise finding the same information on more than one reliable website?', ['It can provide stronger support for a claim.', 'It makes a headline more surprising.', 'It guarantees that all images are new.', 'It removes the need to check dates.'], 'It can provide stronger support for a claim.', '多个可靠来源的一致信息能为消息提供更强的证据。', '多来源核对也不能替代检查日期和图片背景。', 'standard'],
    ['主旨概括', 'What is the main purpose of the passage?', ['To teach people to pause and check online information before sharing it.', 'To stop people from using online news services.', 'To explain how to become a professional reporter.', 'To show that all online photographs are false.'], 'To teach people to pause and check online information before sharing it.', '全文围绕“分享前暂停、核查来源日期和证据”的实用习惯展开。', '不要把“保持谨慎”扩大成“完全不相信网络信息”。', 'standard'],
  ]),
]
