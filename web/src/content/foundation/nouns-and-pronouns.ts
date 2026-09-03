import { createFoundationQuestions } from './foundation-utils'

export const nounsAndPronouns = createFoundationQuestions('名词、代词与可数/不可数', 1, [
  ['There are ___ on the desk.', ['two notebooks', 'two notebook', 'two notebookses', 'two notebookes'], 'two notebooks', 'two 后接可数名词复数 notebooks。', '不要把单数 notebook 直接放在 two 后。'],
  ['I need ___ to write the report.', ['some information', 'many informations', 'an information', 'a few information'], 'some information', 'information 是不可数名词，前面可用 some。', 'information 不加 s，也不能直接用 a/an。'],
  ['Each student should bring ___ own notebook.', ['his or her', 'they', 'them', 'theirs'], 'his or her', 'each student 是单数概念，正式表达可用 his or her own notebook。', 'them 是宾格，theirs 后面不能再接 own notebook。'],
  ['The furniture in this room ___ very old.', ['is', 'are', 'be', 'were'], 'is', 'furniture 是不可数名词，作主语时谓语用单数。', '不要因 room 里有许多家具就把 furniture 当复数。'],
  ['Neither of the answers ___ correct.', ['is', 'are', 'be', 'have'], 'is', 'neither 作主语通常按单数处理，谓语用 is。', 'answers 是复数，但真正的中心词是 neither。'],
  ['Please give me ___ about the meeting.', ['some advice', 'some advices', 'an advice', 'many advice'], 'some advice', 'advice 是不可数名词，some advice 表示“一些建议”。', 'advice 不能直接变复数；一条建议说 a piece of advice。'],
  ['My brother and I often help ___ with homework.', ['each other', 'ourselves', 'us', 'one'], 'each other', '两个人互相帮助用 each other。', 'ourselves 表示“我们自己”，不表示相互关系。'],
  ['This is the student ___ father works in the hospital.', ['whose', 'who', 'whom', 'which'], 'whose', 'whose 表示所属关系，修饰 father。', 'who/whom 指人本身，不能直接表示“他的父亲”。'],
  ['I have two sisters. ___ are teachers.', ['Both', 'All', 'Either', 'Neither'], 'Both', '两者都用 both。', 'all 用于三者或以上；either/neither 表示两者中的任一或两者都不。'],
  ['The news ___ surprising.', ['is', 'are', 'were', 'have'], 'is', 'news 词尾虽有 s，但作单数名词使用。', '不要看到 s 就机械选复数谓语。'],
  ['There is not ___ milk left in the fridge.', ['much', 'many', 'a few', 'few'], 'much', 'milk 是不可数名词，否定句中用 much。', 'many、a few、few 都修饰可数名词复数。'],
  ['A number of students ___ absent today.', ['are', 'is', 'was', 'has'], 'are', 'a number of 表示“许多”，后接复数名词，谓语用复数。', '不要和 the number of 混淆；the number of 才用单数谓语。'],
  ['The pair of shoes ___ under the bed.', ['is', 'are', 'be', 'have'], 'is', '主语中心词是 pair，故用单数 is。', 'of shoes 不决定谓语单复数。'],
  ['One of my friends ___ English well.', ['speaks', 'speak', 'speaking', 'have spoken'], 'speaks', 'one 是主语中心词，谓语用第三人称单数 speaks。', 'friends 虽然是复数，但它在 of 短语中。'],
  ['I prefer tea to ___.', ['coffee', 'coffees', 'a coffee', 'many coffee'], 'coffee', 'tea 和 coffee 都可作泛指饮料的不可数名词。', '这里不是点一杯具体咖啡，不需要 a coffee。'],
  ['The children enjoyed ___ at the party.', ['themselves', 'their', 'them', 'they'], 'themselves', 'enjoy oneself 表示“玩得开心”，children 对应 themselves。', 'their 是形容词性物主代词，后面还需要名词。'],
  ['I lost my pen. Could I borrow ___?', ['yours', 'your', 'you', 'yourself'], 'yours', 'yours 是名词性物主代词，代替 your pen。', 'your 后面必须再接名词，不能单独作宾语。'],
  ['The police ___ looking for the witness.', ['are', 'is', 'was', 'has'], 'are', 'police 表示警方人员时通常作复数，谓语用 are。', '不要把 police 当作单数的 a police。'],
  ['I bought ___ at the market this morning.', ['some fruit', 'a fruit', 'many fruit', 'few fruits'], 'some fruit', 'fruit 泛指水果时通常作不可数名词，用 some fruit。', 'many 和 few 后需要可数名词复数。'],
  ['The teacher gave ___ a homework assignment.', ['each of us', 'we each', 'our each', 'us every'], 'each of us', 'give each of us sth. 表示“给我们每个人某物”。', 'we 是主格，不能直接作 give 的宾语。'],
])
