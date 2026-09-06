import { createFoundationQuestions } from './foundation-utils'

export const basicTenses = createFoundationQuestions('一般时、进行时、完成时', 41, [
  ['My father usually ___ to work by bus.', ['goes', 'go', 'is going', 'has gone'], 'goes', 'usually 表示习惯性动作，用一般现在时；第三人称单数后用 goes。', '不要把习惯动作误用为现在进行时。'],
  ['Look! The students ___ basketball on the playground.', ['are playing', 'play', 'played', 'have played'], 'are playing', 'Look! 提示正在发生的动作，用现在进行时。', '一般现在时表示常态，不表示眼前正在进行。'],
  ['She ___ in Shenzhen since 2022.', ['has lived', 'lived', 'is living', 'will live'], 'has lived', 'since + 过去时间点常与现在完成时连用，表示持续到现在。', 'lived 只说明过去发生，不能体现持续到现在。'],
  ['We ___ the museum yesterday afternoon.', ['visited', 'have visited', 'visit', 'are visiting'], 'visited', 'yesterday afternoon 是明确过去时间，用一般过去时 visited。', '现在完成时通常不和明确的过去时间状语连用。'],
  ['When I called her, she ___ dinner.', ['was cooking', 'cooked', 'has cooked', 'will cook'], 'was cooking', '一个过去动作发生时，另一个动作正在进行，用过去进行时 was cooking。', 'called 是短暂动作，不表示做饭已完成。'],
  ['They ___ the work before the manager arrived.', ['had finished', 'have finished', 'finish', 'are finishing'], 'had finished', '完成早于过去的 arrived，需用过去完成时 had finished。', '现在完成时不能表示相对于另一过去动作的先后。'],
  ['I ___ this book twice, so I know the story well.', ['have read', 'read', 'am reading', 'had read'], 'have read', '次数经历与现在认识有关，用现在完成时 have read。', 'read 过去式不能突出“至今已有两次”的经历。'],
  ['The train ___ at 7:30 tomorrow morning.', ['leaves', 'left', 'is leaving', 'has left'], 'leaves', '时刻表、课程表等固定安排可用一般现在时表示将来。', '不要认为所有将来情况都必须用 will。'],
  ['By this time next week, I ___ my final project.', ['will have finished', 'will finish', 'finished', 'have finished'], 'will have finished', 'by + 将来时间点表示到那时已完成，用将来完成时。', 'will finish 没有突出“到那时之前完成”。'],
  ['He ___ TV when his mother came home.', ['was watching', 'watched', 'has watched', 'will watch'], 'was watching', 'came home 发生时他正在看电视，用过去进行时。', '过去进行时强调被打断时正在进行的背景动作。'],
  ['I ___ my keys, so I cannot open the door.', ['have lost', 'lost', 'lose', 'had lost'], 'have lost', '丢钥匙的结果影响现在，使用现在完成时。', '一般过去时只叙述过去事实，语气上不突出现在结果。'],
  ['The teacher ___ us a new word every day.', ['teaches', 'is teaching', 'taught', 'has taught'], 'teaches', 'every day 表示规律性动作，用一般现在时。', 'is teaching 更强调此刻或阶段性，和 every day 的习惯语境不合。'],
  ['At this time tomorrow, we ___ for the exam.', ['will be preparing', 'prepare', 'prepared', 'have prepared'], 'will be preparing', 'at this time tomorrow 表示将来某时正在进行，用将来进行时。', 'will prepare 只表示将做，不表示那个时刻正在做。'],
  ['She ___ never ___ to Beijing before last summer.', ['had, been', 'has, been', 'did, go', 'was, going'], 'had, been', 'before last summer 是过去参照点，之前的经历用过去完成时 had been。', 'has been 的参照点是现在，不适合本题。'],
  ['I ___ the email as soon as I get to the office.', ['will send', 'sent', 'have sent', 'was sending'], 'will send', '主句表示将来动作；as soon as 从句虽用一般现在时，主句仍用 will send。', '不要把 get 的现在时错误地套到主句。'],
  ['The shop ___ at nine every morning.', ['opens', 'is opening', 'opened', 'has opened'], 'opens', '营业时间属于固定事实，用一般现在时 opens。', '现在进行时不用于长期固定安排。'],
  ['They ___ for an hour when the bus finally came.', ['had been waiting', 'have waited', 'wait', 'will wait'], 'had been waiting', '等待持续到过去的 came 发生前，用过去完成进行时 had been waiting 突出过程和时长。', 'have waited 的时间线延伸到现在，和 came 不一致。'],
  ['I cannot answer the phone because I ___ a shower.', ['am taking', 'take', 'took', 'have taken'], 'am taking', 'cannot now 与正在洗澡的当前动作对应，使用现在进行时。', '一般现在时不能说明此刻无法接电话的原因。'],
  ['After she ___ the letter, she went to bed.', ['had written', 'has written', 'writes', 'will write'], 'had written', '写信完成在 went to bed 之前，过去完成时可清楚表示先后。', 'has written 不能与 went 的过去时间线搭配。'],
  ['We ___ dinner when the lights suddenly went out.', ['were having', 'had', 'have had', 'will have'], 'were having', '灯熄灭时晚餐正在进行，用过去进行时 were having。', 'had dinner 更像完成动作，缺少“当时正在”的含义。'],
])
