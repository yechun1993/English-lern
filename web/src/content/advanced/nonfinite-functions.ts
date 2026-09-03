import { createAdvancedQuestions } from './advanced-utils'

export const nonfiniteFunctions = createAdvancedQuestions('非谓语作定语、状语与宾补', 201, [
  ['The girl ___ under the tree is my cousin.', ['read', 'reads', 'reading', 'to read'], 'reading', '现在分词作后置定语，表示女孩正在进行的动作。', '不能用谓语 reads，因为句中已有 is。'],
  ['I have something important ___ you.', ['tell', 'to tell', 'telling', 'told'], 'to tell', '不定式常作不定代词后的后置定语，表示将要做的事。', 'something 后不能直接接动词原形。'],
  ['It is time for us ___ the meeting room.', ['leave', 'to leave', 'leaving', 'left'], 'to leave', 'It is time for somebody to do 是常用表达。', '不要把 for us 后误接动名词。'],
  ['I saw him ___ the road and enter the bank.', ['cross', 'to cross', 'crossing', 'crossed'], 'cross', 'see somebody do 强调看见动作全过程。', 'see somebody doing 强调看见动作正在进行。'],
  ['We heard someone ___ at the door when we were having dinner.', ['knock', 'to knock', 'knocking', 'knocked'], 'knocking', 'hear somebody doing 强调听到动作正在发生。', '若强调完整的一次敲门，才可能用原形。'],
  ['She had her hair ___ before the interview.', ['cut', 'to cut', 'cutting', 'cuts'], 'cut', 'have something done 表示请别人完成某事。', 'hair 与 cut 是被动关系。'],
  ['The coach got the players ___ harder for the final match.', ['train', 'to train', 'training', 'trained'], 'to train', 'get somebody to do 表示“使/让某人去做”。', 'make 后才接动词原形。'],
  ['With the lights ___, the room looked warm and welcoming.', ['turn on', 'to turn on', 'turned on', 'turning on'], 'turned on', 'with + 宾语 + 过去分词表示灯被打开的状态。', 'lights 与 turn on 是被动关系。'],
  ['___ tired after the trip, he went to bed early.', ['Feel', 'Feeling', 'Felt', 'To feel'], 'Feeling', '现在分词短语作原因状语，其逻辑主语是 he。', '分词的逻辑主语必须和主句主语一致。'],
  ['___ from the hill, the lake looks like a mirror.', ['See', 'Seeing', 'Seen', 'To see'], 'Seen', '过去分词作条件/方式状语，lake 是“被看见”。', '不要误用 Seeing，湖不能主动看。'],
  ['___ the report, she sent it to her supervisor.', ['Finish', 'Finishing', 'Having finished', 'To finish'], 'Having finished', 'having done 表示该动作先于主句动作完成。', '仅用 finishing 不突出先后关系。'],
  ['The bridge ___ last year has made travel much easier.', ['build', 'building', 'built', 'to build'], 'built', '过去分词作定语，bridge 是被建成的。', 'building 表示正在建造的桥。'],
  ['She was the first student ___ the answer.', ['find', 'finding', 'to find', 'found'], 'to find', '序数词后常用不定式作定语。', 'first 后不能直接接谓语形式。'],
  ['There are several ways ___ this problem.', ['solve', 'solving', 'to solve', 'solved'], 'to solve', 'way 后可用不定式表示解决的方法。', '这里不需要已经被解决的被动意义。'],
  ['The teacher asked us ___ quiet during the test.', ['keep', 'to keep', 'keeping', 'kept'], 'to keep', 'ask somebody to do 是常用宾补结构。', 'ask 后不能直接接宾语加动词原形。'],
  ['The long speech kept the audience ___ for nearly an hour.', ['wait', 'to wait', 'waiting', 'waited'], 'waiting', 'keep somebody doing 表示让某人持续处于某动作中。', 'waited 表示被动，语义不合。'],
  ['I find it difficult ___ so much information in one day.', ['remember', 'to remember', 'remembering', 'remembered'], 'to remember', 'find it + adjective + to do，it 是形式宾语。', 'difficult 后通常接不定式说明具体困难。'],
  ['When I came in, I noticed the window ___.', ['break', 'to break', 'broken', 'breaking'], 'broken', 'notice + 宾语 + 过去分词表示发现宾语处于被动状态。', 'window 不能主动 break。'],
  ['The package ___ on the desk is for Mr. Wang.', ['lay', 'lying', 'laid', 'to lie'], 'lying', 'lie 的现在分词 lying 作定语，表示“放在桌上的”。', 'laid 是 lay 的过去式/过去分词，含义不同。'],
  ['The instructions are easy ___.', ['follow', 'to follow', 'following', 'followed'], 'to follow', '形容词后用不定式主动形式可表达被动意义：容易被遵循。', '不必改为 to be followed。'],
])
