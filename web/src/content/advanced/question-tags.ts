import { createAdvancedQuestions } from './advanced-utils'

export const questionTags = createAdvancedQuestions('反意疑问句和祈使句附加问句', 281, [
  ['You are new here, ___?', ['are you', 'aren’t you', 'do you', 'don’t you'], 'aren’t you', '前句肯定且含 be 动词 are，反意部分用否定的 aren’t you。', '反意疑问句遵循“前肯后否”。'],
  ['They did not finish the work, ___?', ['did they', 'didn’t they', 'do they', 'haven’t they'], 'did they', '前句含 did not，附加问句用肯定 did they。', '时态要与 did not 对应。'],
  ['Let’s meet at the gate at eight, ___?', ['will we', 'shall we', 'do we', 'aren’t we'], 'shall we', 'Let’s ... 的附加问句固定常用 shall we。', '不要按普通陈述句机械改为 will we。'],
  ['Please close the door, ___?', ['do you', 'will you', 'shall you', 'don’t you'], 'will you', '肯定祈使句常用 will you 作礼貌附加问句。', '祈使句没有明确主语，不用 do you。'],
  ['Don’t make so much noise, ___?', ['will you', 'do you', 'shall we', 'won’t you'], 'will you', '否定祈使句后也常用 will you。', '附加问句不必再改成否定。'],
  ['Nothing is impossible if you keep trying, ___?', ['is it', 'isn’t it', 'does it', 'doesn’t it'], 'is it', 'nothing 含否定意义，附加问句用肯定 is it。', '不要只看谓语 is 而忽略 nothing。'],
  ['Everyone enjoyed the trip, ___?', ['did he', 'did they', 'didn’t he', 'didn’t they'], 'didn’t they', 'everyone 作主语时，附加问句常用 they 指代。', '前句肯定，因此用 didn’t they。'],
  ['I am late again, ___?', ['am I', 'aren’t I', 'don’t I', 'isn’t I'], 'aren’t I', 'I am 的反意疑问句固定用 aren’t I。', '英语中没有 isn’t I。'],
  ['He used to live near the station, ___?', ['used he', 'didn’t he', 'wasn’t he', 'hasn’t he'], 'didn’t he', 'used to 表过去习惯，附加问句通常借助 did。', 'used 在这里不是普通实义动词。'],
  ['You needn’t wait for me, ___?', ['need you', 'needn’t you', 'do you', 'don’t you'], 'need you', 'needn’t 作情态动词否定，附加问句用 need you。', '不要把 needn’t 当一般动词加 do。'],
  ['She seldom goes out at night, ___?', ['does she', 'doesn’t she', 'is she', 'isn’t she'], 'does she', 'seldom 含否定意义，所以附加问句用肯定 does she。', '有否定副词时仍是“前否后肯”。'],
  ['You have never been abroad, ___?', ['have you', 'haven’t you', 'do you', 'did you'], 'have you', 'never 表否定，且前句为现在完成时，用 have you。', '助动词要跟 have been 对应。'],
  ['There is little time left, ___?', ['is there', 'isn’t there', 'does there', 'doesn’t there'], 'is there', 'there be 句型附加问句仍用 there；little 表否定。', '不能用 it 替代 there。'],
  ['Few people knew the news, ___?', ['did they', 'didn’t they', 'do they', 'don’t they'], 'did they', 'few 表否定意义，过去时借助 did。', 'a few 才表示肯定的“一些”。'],
  ['There is a little milk in the bottle, ___?', ['is there', 'isn’t there', 'does there', 'doesn’t there'], 'isn’t there', 'a little 表肯定意义，前肯后否。', '不要把 a little 与 little 混为同一否定含义。'],
  ['Somebody has taken my pen, ___?', ['hasn’t he', 'haven’t they', 'didn’t they', 'hasn’t they'], 'haven’t they', 'somebody 的附加问句常用 they；has taken 对应 have。', '现代英语中单数不定代词可用 they 指代。'],
  ['Let us have a short break, ___?', ['will you', 'shall we', 'do we', 'won’t we'], 'will you', 'Let us 表示“让我们被允许”，常用 will you；Let’s 才用 shall we。', '不要忽略 let us 与 let’s 的语气差别。'],
  ['You must finish the form today, ___?', ['mustn’t you', 'needn’t you', 'don’t you', 'haven’t you'], 'mustn’t you', 'must 表义务时，附加问句常用 mustn’t。', '这里不是推测用法，不能按 have done 处理。'],
  ['We had better leave now, ___?', ['hadn’t we', 'didn’t we', 'wouldn’t we', 'haven’t we'], 'hadn’t we', 'had better 的附加问句常用 hadn’t + 主语。', 'had 在这里不是过去完成时助动词。'],
  ['You ought to tell her the truth, ___?', ['oughtn’t you', 'don’t you', 'shouldn’t you', 'didn’t you'], 'oughtn’t you', 'ought to 的附加问句可直接用 oughtn’t。', '不要随意把 ought to 改为一般动词结构。'],
])
