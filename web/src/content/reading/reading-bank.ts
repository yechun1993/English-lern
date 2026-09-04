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
]
