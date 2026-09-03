import { createFoundationQuestions } from './foundation-utils'

export const passiveVoice = createFoundationQuestions('被动语态', 61, [
  ['English ___ in many countries around the world.', ['is spoken', 'speaks', 'is speaking', 'has spoken'], 'is spoken', 'English 是被说的语言，表达一般事实用一般现在时被动语态 is spoken。', '不要把语言当作主动执行 speak 的主体。'],
  ['The bridge ___ in 2010 and is still in use.', ['was built', 'built', 'is built', 'has built'], 'was built', 'in 2010 是明确过去时间，桥是被建造的，用 was built。', 'built 单独不能作句子谓语。'],
  ['A meeting ___ in the meeting room tomorrow.', ['will be held', 'will hold', 'is holding', 'was held'], 'will be held', '会议是被举行的，tomorrow 要用将来时被动语态 will be held。', '主语 A meeting 不能主动 hold 自己。'],
  ['The room ___ by the cleaners now.', ['is being cleaned', 'is cleaned', 'was cleaned', 'has cleaned'], 'is being cleaned', 'now 表示正在发生，房间被打扫，用现在进行时被动语态。', 'is cleaned 表示经常被打扫，不强调此刻。'],
  ['The homework ___ already.', ['has been finished', 'has finished', 'was finishing', 'is finish'], 'has been finished', 'already 表示到现在已经完成，作业是被完成的，用现在完成时被动。', 'homework 不能主动 finish。'],
  ['The window ___ by the strong wind last night.', ['was broken', 'broke', 'is broken', 'has broken'], 'was broken', 'last night 指过去，窗户是被风弄坏的，用 was broken。', 'broke 表示窗户自己破了，题干给出 by the wind 时应优先用被动。'],
  ['More care should ___ when people cross the road.', ['be taken', 'take', 'be taking', 'taken'], 'be taken', 'should 后接动词原形；care 是被采取的，用 should be taken。', 'should 后不能直接接过去分词 taken。'],
  ['No decision ___ before the manager arrived.', ['had been made', 'has been made', 'was making', 'made'], 'had been made', '决定尚未作出发生在 arrived 之前，使用过去完成时被动。', 'has been made 的时间线延伸到现在，不合过去参照点。'],
  ['The letters ___ yesterday afternoon.', ['were sent', 'sent', 'are sent', 'have been sent'], 'were sent', 'yesterday afternoon 是过去时间，letters 是被寄出，故用 were sent。', '现在完成时不能和 yesterday 这类明确过去时间连用。'],
  ['This problem can ___ with a little patience.', ['be solved', 'solve', 'be solving', 'solved'], 'be solved', 'can 后接动词原形，问题是被解决的，所以是 can be solved。', '情态动词后不能直接接 solved。'],
  ['This book ___ in simple English for beginners.', ['is written', 'writes', 'is writing', 'has wrote'], 'is written', '书是被写成某种语言的，用一般现在时被动 is written。', 'write 的过去分词是 written，不是 wrote。'],
  ['Lunch ___ when I arrived at the restaurant.', ['was being prepared', 'prepared', 'has prepared', 'is preparing'], 'was being prepared', '我到达时午餐正在被准备，用过去进行时被动。', 'prepared 不能独立作谓语，也不表达进行。'],
  ['All the tickets ___ before the concert began.', ['had been sold', 'have sold', 'were selling', 'are sold'], 'had been sold', '售票完成早于过去的 began，用过去完成时被动 had been sold。', 'tickets 不能主动 sell。'],
  ['The work must ___ by Friday.', ['be completed', 'complete', 'be completing', 'completed'], 'be completed', 'must 后接动词原形，work 是被完成的，用 be completed。', 'must completed 缺少 be。'],
  ['The old building ___ next month.', ['will be pulled down', 'will pull down', 'is pulling down', 'pulled down'], 'will be pulled down', '建筑物是被拆除的，next month 提示将来被动。', 'building 不是 pull down 的主动执行者。'],
  ['The report ___ to the manager before noon.', ['was given', 'gave', 'has given', 'is giving'], 'was given', 'report 是被交给经理的，过去时间 before noon 用 was given。', 'gave 的主语应是交报告的人。'],
  ['All students ___ to bring their ID cards.', ['are asked', 'ask', 'are asking', 'have asked'], 'are asked', '学生是被要求带卡的，表达规定用一般现在时被动。', 'are asking 的意思变成“学生正在要求”。'],
  ['A new computer ___ for the office next week.', ['is going to be bought', 'is going to buy', 'will buying', 'bought'], 'is going to be bought', '电脑是被购买，be going to 的被动形式是 be going to be + 过去分词。', '不能漏掉第二个 be。'],
  ['The classroom needs ___ before the next class.', ['cleaning', 'to clean', 'cleaned', 'clean'], 'cleaning', 'need doing 表示“需要被……”，相当于 needs to be cleaned。', 'classroom 不是主动清扫者。'],
  ['The question ___ yet, so we need more information.', ['has not been answered', 'has not answered', 'was not answering', 'is not answer'], 'has not been answered', 'yet 常与现在完成时连用；问题是被回答的，用 has not been answered。', 'has not answered 会变成“问题没有回答别人”，主客关系错误。'],
])
