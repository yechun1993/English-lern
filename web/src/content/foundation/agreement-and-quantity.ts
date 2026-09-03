import { createFoundationQuestions } from './foundation-utils'

export const agreementAndQuantity = createFoundationQuestions('主谓一致与数量表达', 21, [
  ['Ten kilometers ___ a long distance to walk in this heat.', ['is', 'are', 'were', 'have'], 'is', '表示距离、时间、金钱等整体量时，Ten kilometers 常作单数整体看待。', '不要只看 kilometers 是复数形式。'],
  ['More than one student ___ this question already.', ['has asked', 'have asked', 'ask', 'are asking'], 'has asked', 'more than one + 单数名词作主语时，谓语通常用单数。', '形式上有 one，不能按 many students 处理。'],
  ['More than two students ___ for the bus outside.', ['are waiting', 'is waiting', 'waits', 'has waited'], 'are waiting', 'more than two students 是复数概念，谓语用 are waiting。', 'more than one 的特殊单数规则不能套到 two 以上。'],
  ['The quality of these products ___ greatly improved.', ['has', 'have', 'are', 'were'], 'has', '主语中心词是 quality，单数，故用 has。', 'of these products 只是后置修饰，不决定谓语。'],
  ['A pair of scissors ___ on the table.', ['is', 'are', 'be', 'have'], 'is', 'a pair of + 复数名词的中心词是 pair，谓语用单数。', 'scissors 本身常用复数，但有 a pair of 时看 pair。'],
  ['Mathematics ___ my favorite subject at school.', ['is', 'are', 'were', 'have'], 'is', 'mathematics 是学科名称，作单数。', '词尾 -s 不表示这里必须用复数。'],
  ['Bread and butter ___ a common breakfast in many homes.', ['is', 'are', 'were', 'have'], 'is', 'bread and butter 在此表示一种固定搭配的早餐整体，谓语用单数。', '并列名词不一定都表示两个独立事物。'],
  ['Tom, together with his friends, ___ arriving tonight.', ['is', 'are', 'be', 'were'], 'is', 'together with 引出的部分是附加成分，主语仍是 Tom。', '不要按 Tom and his friends 误用复数。'],
  ['The captain as well as the players ___ ready for the match.', ['was', 'were', 'have', 'are'], 'was', 'as well as 不改变主语人数，谓语与 captain 一致。', '它不像 and 那样把两个名词并列为复数主语。'],
  ['Either you or he ___ responsible for the report.', ['is', 'are', 'were', 'have'], 'is', 'either...or... 的谓语通常与靠近它的主语一致，he 是单数。', '要看离谓语最近的主语，而不是只看前一个 you。'],
  ['Either he or you ___ responsible for the report.', ['are', 'is', 'was', 'has'], 'are', '靠近谓语的是 you，因此用 are。', '同一结构中主语顺序变化会影响谓语形式。'],
  ['The committee ___ reached a final decision.', ['has', 'have', 'are', 'were'], 'has', 'committee 作为一个整体作出决定时，用单数 has。', '集合名词是否复数取决于是否强调成员分别行动。'],
  ['All of the water ___ polluted after the storm.', ['is', 'are', 'were', 'have'], 'is', 'water 不可数，all of the water 作单数概念。', 'all 不能自动决定谓语为复数。'],
  ['All of the books ___ on the top shelf.', ['are', 'is', 'was', 'has'], 'are', 'books 是可数复数，all of the books 用复数谓语。', '要看 all of 后面的名词性质。'],
  ['A large amount of money ___ spent on the project.', ['was', 'were', 'have', 'are'], 'was', 'amount 的中心概念为单数，a large amount of money 用单数谓语。', 'money 不可数，不要因为数量大而选复数。'],
  ['Large amounts of money ___ spent on the project.', ['were', 'was', 'has', 'is'], 'were', 'amounts 是复数，large amounts of 后面的谓语用复数。', 'a large amount 和 large amounts 的谓语不同。'],
  ['Five years ___ passed since we last met.', ['has', 'have', 'are', 'were'], 'has', '表示一段时间整体时，five years 可用单数谓语 has。', '不要只依据 years 的复数形式判断。'],
  ['The United States ___ a large country.', ['is', 'are', 'were', 'have'], 'is', 'The United States 是国名，通常按单数处理。', '名称虽然含 States，整体仍是一个国家。'],
  ['The family ___ planning its trip for the holiday.', ['is', 'are', 'were', 'have'], 'is', '这里强调整个家庭共同计划，用单数 is。', 'family 作集合名词时要结合语义判断。'],
  ['The number of visitors ___ increasing every year.', ['is', 'are', 'were', 'have'], 'is', 'the number of 表示“……的数量”，谓语用单数。', 'a number of 表示“许多”，才用复数。'],
])
