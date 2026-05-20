// ===================================================================
// 全部逻辑包裹在 DOMContentLoaded 中
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // 定语从句 — 15 道题
  // ===================================================================
  const questionBanks = {
    attributive: [
      {
        id: "attr-1",
        stem: "A job interview is an important chance for people ______ want to get hired.",
        options: ["which", "who", "whom", "whose"],
        answer: 1,
        translation: "求职面试对于想要被录用的人来说是一个重要的机会。",
        explanation: "先行词 <strong>people</strong> 指人，关系词在从句中作主语，用 <strong>who</strong>。"
      },
      {
        id: "attr-2",
        stem: "That is the technician ______ we called to fix our internet connection.",
        options: ["who", "which", "whom", "whose"],
        answer: 2,
        translation: "那就是我们打电话请来修网络的技术员。",
        explanation: "先行词 technician 指人，关系词在从句中作 called 的<strong>宾语</strong>，用 <strong>whom</strong>（口语中也可用 who，正式语法用 whom）。"
      },
      {
        id: "attr-3",
        stem: "The system ______ controls the building's temperature failed last night.",
        options: ["who", "whom", "which", "whose"],
        answer: 2,
        translation: "那个控制大楼温度的系统昨晚坏了。",
        explanation: "先行词 <strong>system</strong> 指物，关系词在从句中作主语，用 <strong>which</strong>。"
      },
      {
        id: "attr-4",
        stem: "Practice answering common questions, focusing on stories ______ prove your abilities.",
        options: ["who", "which", "what", "that"],
        answer: 3,
        translation: "练习回答常见问题，重点讲述能证明你能力的故事。",
        explanation: "先行词 stories 指物，<strong>that</strong> 可指物在从句中作主语，且此处没有逗号（限制性定语从句），that 完全适用。"
      },
      {
        id: "attr-5",
        stem: "Employers also like people ______ attitudes match the job's needs.",
        options: ["who", "whom", "which", "whose"],
        answer: 3,
        translation: "雇主也喜欢那些态度符合工作需求的人。",
        explanation: "<strong>whose</strong> 表示所属关系，whose attitudes = the attitudes of the people。whose 在从句中作定语，修饰 attitudes。"
      },
      {
        id: "attr-6",
        stem: "Such people ______ have made great contributions should be respected.",
        options: ["who", "which", "as", "that"],
        answer: 2,
        translation: "做出过重大贡献的人应当受到尊重。",
        explanation: "<strong>such…as</strong> 是固定搭配，as 引导限制性定语从句。同类搭配：so…as, the same…as, as…as。"
      },
      {
        id: "attr-7",
        stem: "He failed the exam, ______ surprised all of us.",
        options: ["that", "it", "which", "what"],
        answer: 2,
        translation: "他考试没及格，这让我们所有人都很惊讶。",
        explanation: "逗号后是<strong>非限制性定语从句</strong>，which 指代前面整件事「他考试不及格」这件事，<strong>不能用 that</strong>。"
      },
      {
        id: "attr-8",
        stem: "The professor to ______ I spoke was very helpful.",
        options: ["who", "whom", "which", "that"],
        answer: 1,
        translation: "和我交谈过的那位教授非常乐于助人。",
        explanation: "介词 <strong>to</strong> 后必须用 <strong>whom</strong>（指人），不能用 who 或 that。介词 + which/whom 是正式表达。"
      },
      {
        id: "attr-9",
        stem: "This is the best film ______ I have ever seen.",
        options: ["which", "that", "who", "what"],
        answer: 1,
        translation: "这是我看过的最好的电影。",
        explanation: "先行词被<strong>最高级</strong> best 修饰时，关系代词只能用 <strong>that</strong>，不能用 which。"
      },
      {
        id: "attr-10",
        stem: "All ______ can be done has been done.",
        options: ["which", "that", "what", "who"],
        answer: 1,
        translation: "所有能做的都已经做了。",
        explanation: "先行词是 <strong>all</strong>（不定代词）时，关系代词只能用 <strong>that</strong>。同理：everything, nothing, something 等。"
      },
      {
        id: "attr-11",
        stem: "This is the very pen ______ I have been looking for.",
        options: ["which", "that", "it", "what"],
        answer: 1,
        translation: "这正是我一直在找的那支笔。",
        explanation: "先行词被 <strong>the very</strong> 修饰时，关系代词只能用 <strong>that</strong>。the very/the only/the last 修饰先行词 → 用 that。"
      },
      {
        id: "attr-12",
        stem: "The professor and his research ______ you told me about are quite famous.",
        options: ["which", "that", "who", "whom"],
        answer: 1,
        translation: "你告诉我的那位教授和他的研究都相当有名。",
        explanation: "先行词<strong>既有人又有物</strong>（professor + research）时，关系代词只能用 <strong>that</strong>。"
      },
      {
        id: "attr-13",
        stem: "______ is known to all, China is a country with the largest population.",
        options: ["It", "As", "What", "That"],
        answer: 1,
        translation: "众所周知，中国是世界上人口最多的国家。",
        explanation: "<strong>As</strong> 引导非限制性定语从句，指代整个主句内容，可置于句首。As is known to all = 众所周知。若选 It 则需改为 It is known to all that…"
      },
      {
        id: "attr-14",
        stem: "I will never forget the days ______ we spent together in the countryside.",
        options: ["when", "where", "that", "on which"],
        answer: 2,
        translation: "我永远不会忘记我们在乡下一起度过的那些日子。",
        explanation: "陷阱题。先行词 days 是时间，但从句 spent 后缺<strong>宾语</strong>（spend the days），所以用关系代词 <strong>that/which</strong>，而非关系副词 when。判断标准：看从句缺什么成分。"
      },
      {
        id: "attr-15",
        stem: "The house ______ roof was damaged in the storm has been repaired.",
        options: ["which", "that", "whose", "of which"],
        answer: 2,
        translation: "那座屋顶在暴风雨中受损的房子已经修好了。",
        explanation: "陷阱题。house 是物，表所属关系「房子的屋顶」可用 <strong>whose</strong> 或 of which。whose 既可指人也可指物，在从句中作定语（whose roof = the roof of the house）。"
      }
    ],
    noun: [
      // ============================================================
      // 一、主语从句 Subject Clause — 7 题 (noun-1 ~ noun-7)
      // ============================================================
      {
        id: "noun-1",
        stem: "______ the earth moves around the sun is a well-known fact.",
        options: ["What", "That", "Which", "It"],
        answer: 1,
        translation: "地球绕着太阳转是一个众所周知的事实。",
        explanation: "<strong>That</strong> 引导主语从句，在从句中不充当任何成分，只起连接作用。what 需要在从句中充当成分，此处从句结构完整（主谓宾齐全），故用 that。"
      },
      {
        id: "noun-2",
        stem: "______ he said at the meeting astonished everyone present.",
        options: ["That", "What", "Which", "It"],
        answer: 1,
        translation: "他在会上所说的话让在场的每个人都大吃一惊。",
        explanation: "<strong>What</strong> 引导主语从句，在从句中充当 said 的<strong>宾语</strong>，意为“所……的话”。that 不充当成分，此处从句缺宾语，故不能用 that。"
      },
      {
        id: "noun-3",
        stem: "______ happened last night remains a mystery.",
        options: ["That", "What", "Whether", "It"],
        answer: 1,
        translation: "昨晚发生了什么仍然是个谜。",
        explanation: "<strong>What</strong> 引导主语从句，在从句中充当<strong>主语</strong>，意为“所……的事”。that 虽可引导主语从句但不充当成分，此处从句缺主语。"
      },
      {
        id: "noun-4",
        stem: "______ we will go camping tomorrow depends on the weather.",
        options: ["If", "Whether", "That", "What"],
        answer: 1,
        translation: "我们明天是否去露营取决于天气。",
        explanation: "<strong>Whether</strong> 引导主语从句，意为“是否”。<strong>if 不能引导主语从句</strong>，这是 whether 和 if 的关键区别之一。"
      },
      {
        id: "noun-5",
        stem: "______ is widely believed that regular exercise benefits health.",
        options: ["That", "What", "It", "As"],
        answer: 2,
        translation: "人们普遍认为定期锻炼有益健康。",
        explanation: "<strong>It</strong> 作<strong>形式主语</strong>，真正的主语是后面 that 引导的从句。结构：It is + 过去分词 + that 从句。类似的还有 It is said/reported/suggested that…"
      },
      {
        id: "noun-6",
        stem: "______ comes first will get a special gift.",
        options: ["Who", "Whoever", "Whomever", "Whom"],
        answer: 1,
        translation: "最先到的人将获得一份特别的礼物。",
        explanation: "<strong>Whoever</strong> 引导主语从句，意为“无论谁 / 最先到的人”，在从句中充当<strong>主语</strong>。相当于 anyone who，<strong>无疑问含义</strong>。"
      },
      {
        id: "noun-7",
        stem: "______ you decide to do will have my full support.",
        options: ["That", "What", "Whatever", "Which"],
        answer: 2,
        translation: "无论你决定做什么，我都会全力支持。",
        explanation: "<strong>Whatever</strong> 引导主语从句，意为“无论什么”，在从句中充当 do 的<strong>宾语</strong>。相当于 anything that，无疑问含义。"
      },

      // ============================================================
      // 二、宾语从句 Object Clause — 10 题 (noun-8 ~ noun-17)
      // ============================================================
      {
        id: "noun-8",
        stem: "I firmly believe ______ our team will win the championship.",
        options: ["what", "that", "which", "whether"],
        answer: 1,
        translation: "我坚信我们队会赢得冠军。",
        explanation: "<strong>that</strong> 引导宾语从句，在从句中不充当任何成分，只起连接作用。宾语从句中 that 常可省略（正式文体建议保留）。"
      },
      {
        id: "noun-9",
        stem: "Could you tell me ______ the museum is open on Mondays?",
        options: ["that", "what", "if", "which"],
        answer: 2,
        translation: "你能告诉我博物馆周一是否开放吗？",
        explanation: "<strong>if</strong> 引导宾语从句，意为“是否”，在从句中不充当任何成分。宾语从句中 if 和 whether 通常可互换，但<strong>if 只能引导宾语从句</strong>。"
      },
      {
        id: "noun-10",
        stem: "I wonder ______ the price of this dress is.",
        options: ["how much", "what", "how many", "which"],
        answer: 1,
        translation: "我想知道这件裙子的价格是多少。",
        explanation: "<strong>what</strong> 引导宾语从句，意为“……是多少”。询问<strong>价格、人口、数量</strong>等常用 what。how much 也可问价格，但结构不同（How much is the dress?）。"
      },
      {
        id: "noun-11",
        stem: "I really appreciate ______ you have done for me.",
        options: ["that", "what", "which", "whether"],
        answer: 1,
        translation: "我真的很感激你为我所做的一切。",
        explanation: "<strong>what</strong> 引导宾语从句，意为“所……的事”，在从句中充当 done 的<strong>宾语</strong>。that 不充当成分，此处从句缺宾语，故用 what。"
      },
      {
        id: "noun-12",
        stem: "She couldn't decide ______ dress to wear for the party.",
        options: ["what", "which", "that", "who"],
        answer: 1,
        translation: "她无法决定穿哪件裙子去参加聚会。",
        explanation: "<strong>which</strong> 引导宾语从句，意为“（特定范围内的）哪一件”，在从句中充当<strong>定语</strong>修饰 dress。从有限选择中挑选时用 which，泛指时用 what。"
      },
      {
        id: "noun-13",
        stem: "Can you tell me ______ you invited to the dinner?",
        options: ["who", "whom", "whose", "which"],
        answer: 1,
        translation: "你能告诉我你邀请了谁来参加晚宴吗？",
        explanation: "<strong>whom</strong> 引导宾语从句，在从句中充当 invited 的<strong>宾语</strong>。正式语法中宾语用 whom；口语中常用 who 代替。"
      },
      {
        id: "noun-14",
        stem: "Do you know ______?",
        options: ["where does the train station locate", "where the train station is", "where is the train station", "where the train station locates"],
        answer: 1,
        translation: "你知道火车站在哪里吗？",
        explanation: "名词性从句必须用<strong>陈述语序</strong>（主语 + 谓语），不能用疑问语序。<strong>where the train station is</strong> = 陈述语序（主语 the train station + 谓语 is）。"
      },
      {
        id: "noun-15",
        stem: "The teacher wondered ______ mobile phone was ringing.",
        options: ["who", "whom", "whose", "which"],
        answer: 2,
        translation: "老师想知道谁的手机在响。",
        explanation: "<strong>whose</strong> 引导宾语从句，意为“谁的”，在从句中充当<strong>定语</strong>修饰 mobile phone。whose 既可指人也可指物，在从句中只能作定语。"
      },
      {
        id: "noun-16",
        stem: "He asked me ______ I could help him or not.",
        options: ["if", "that", "what", "whether"],
        answer: 3,
        translation: "他问我是否能帮他。",
        explanation: "<strong>whether</strong> 引导宾语从句，与 or not 直接连用。当与 <strong>or not 紧挨着</strong>使用时，只能用 whether，不能用 if（即 whether or not 是固定搭配）。"
      },
      {
        id: "noun-17",
        stem: "We argued about ______ caused the delay of the project.",
        options: ["that", "what", "if", "whether"],
        answer: 1,
        translation: "我们争论是什么导致了项目的延误。",
        explanation: "<strong>what</strong> 引导宾语从句，作介词 about 的<strong>宾语</strong>，在从句中充当主语。介词后不能用 that 或 if 引导名词性从句。"
      },

      // ============================================================
      // 三、表语从句 Predicative Clause — 8 题 (noun-18 ~ noun-25)
      // ============================================================
      {
        id: "noun-18",
        stem: "The truth is ______ nobody really knows the answer.",
        options: ["what", "that", "which", "whether"],
        answer: 1,
        translation: "事实是没有人真正知道答案。",
        explanation: "<strong>that</strong> 引导表语从句，在从句中不充当任何成分，只起连接作用。表语从句中 that 通常<strong>不可省略</strong>，区别于宾语从句。"
      },
      {
        id: "noun-19",
        stem: "This book is exactly ______ I have been looking for.",
        options: ["that", "what", "which", "whether"],
        answer: 1,
        translation: "这本书正是我一直在找的。",
        explanation: "<strong>what</strong> 引导表语从句，意为“所……的东西”，在从句中充当 looking for 的<strong>宾语</strong>。that 不充当成分，此处从句缺宾语。"
      },
      {
        id: "noun-20",
        stem: "The problem is ______ we can raise enough money in time.",
        options: ["if", "that", "whether", "what"],
        answer: 2,
        translation: "问题是我们能否及时筹到足够的钱。",
        explanation: "<strong>whether</strong> 引导表语从句，意为“是否”。<strong>表语从句中不用 if</strong>，只能用 whether。这是 whether 和 if 的又一关键区别。"
      },
      {
        id: "noun-21",
        stem: "It sounds ______ someone is knocking at the door.",
        options: ["that", "as if", "what", "whether"],
        answer: 1,
        translation: "听起来好像有人在敲门。",
        explanation: "<strong>as if</strong>（= as though）引导表语从句，意为“好像”。在名词性从句中，as if / as though <strong>只能引导表语从句</strong>。"
      },
      {
        id: "noun-22",
        stem: "He missed the early bus. That is ______ he was late this morning.",
        options: ["because", "why", "what", "that"],
        answer: 0,
        translation: "他错过了早班车。那就是他今天早上迟到的原因。",
        explanation: "<strong>because</strong> 引导表语从句，意为“因为”。在名词性从句中，because <strong>只能引导表语从句</strong>（还可引导原因状语从句）。结构：That/This/It is because…"
      },
      {
        id: "noun-23",
        stem: "He was late this morning. That is ______ he missed the early bus.",
        options: ["because", "why", "what", "that"],
        answer: 1,
        translation: "他今天早上迟到了。那就是为什么他错过了早班车。",
        explanation: "<strong>why</strong> 引导表语从句，意为“为什么 / ……的原因”。<strong>That is why… = 那就是为什么…… / 那就是……的原因</strong>。注意与 That is because…（那是因为……）的区别。"
      },
      {
        id: "noun-24",
        stem: "This is ______ the famous battle took place.",
        options: ["what", "where", "that", "which"],
        answer: 1,
        translation: "这就是那次著名战役发生的地方。",
        explanation: "<strong>where</strong> 引导表语从句，在从句中充当<strong>地点状语</strong>。此句也可理解为“这就是那次著名战役发生的地方”。"
      },
      {
        id: "noun-25",
        stem: "What I really want to know is ______ he plans to do next.",
        options: ["that", "what", "which", "whether"],
        answer: 1,
        translation: "我真正想知道的是他下一步打算做什么。",
        explanation: "<strong>what</strong> 引导表语从句，在从句中充当 do 的<strong>宾语</strong>，意为“什么”。此处有疑问含义，不能用 that（that 不充当成分）。"
      },

      // ============================================================
      // 四、同位语从句 Appositive Clause — 5 题 (noun-26 ~ noun-30)
      // ============================================================
      {
        id: "noun-26",
        stem: "The fact ______ smoking is harmful to health is widely accepted.",
        options: ["what", "that", "which", "whether"],
        answer: 1,
        translation: "吸烟有害健康这一事实已被广泛接受。",
        explanation: "<strong>that</strong> 引导同位语从句，解释说明抽象名词 <strong>fact</strong> 的具体内容，在从句中不充当任何成分。同位语从句中的 that <strong>不可省略</strong>。"
      },
      {
        id: "noun-27",
        stem: "We were excited at the news ______ our team had won the first prize.",
        options: ["what", "which", "that", "whether"],
        answer: 2,
        translation: "听到我们队获得了一等奖的消息，我们很兴奋。",
        explanation: "<strong>that</strong> 引导同位语从句，解释说明抽象名词 <strong>news</strong> 的具体内容。常见可接同位语从句的抽象名词：fact, news, hope, idea, belief, dream, doubt, problem 等。"
      },
      {
        id: "noun-28",
        stem: "They are faced with the problem ______ they should continue or give up.",
        options: ["if", "that", "whether", "what"],
        answer: 2,
        translation: "他们面临的问题是继续还是放弃。",
        explanation: "<strong>whether</strong> 引导同位语从句，解释说明抽象名词 <strong>problem</strong> 的具体内容，意为“是否”。同位语从句中不用 if。"
      },
      {
        id: "noun-29",
        stem: "Many people hold the dream ______ one day there will be no war in the world.",
        options: ["what", "which", "that", "whether"],
        answer: 2,
        translation: "许多人怀有将来世界没有战争的梦想。",
        explanation: "<strong>that</strong> 引导同位语从句，解释说明抽象名词 <strong>dream</strong> 的具体内容。同位语从句的 that <strong>不充当从句的任何成分</strong>，这是区别于定语从句的关键。"
      },
      {
        id: "noun-30",
        stem: "She had no idea ______ had taken her phone.",
        options: ["who", "that", "what", "whether"],
        answer: 0,
        translation: "她不知道是谁拿走了她的手机。",
        explanation: "<strong>who</strong> 引导同位语从句，在从句中充当<strong>主语</strong>，带有疑问含义（“谁”）。同位语从句不仅可用 that/whether 引导，还可以用 <strong>wh- 词</strong>引导，此时引导词在从句中充当成分。"
      }
    ],
    adverbial: [
      {
        id: "adv-1",
        stem: "______ it rains tomorrow, we will put off the sports meeting.",
        options: ["Unless", "If", "Because", "Although"],
        answer: 1,
        translation: "如果明天下雨，我们将推迟运动会。",
        explanation: "<strong>If</strong> 引导条件状语从句。<strong>主将从现</strong>：从句用一般现在时 (rains)，主句用将来时 (will put off)。"
      },
      {
        id: "adv-2",
        stem: "______ the police came into the room, the criminal escaped from the window.",
        options: ["While", "When", "As soon as", "Until"],
        answer: 1,
        translation: "当警察进入房间时，罪犯从窗户逃走了。",
        explanation: "<strong>When</strong> 引导时间状语从句。came into 是瞬间动作，只能用 when，<strong>不能用 while</strong>。while 只能用于延续性动作。"
      },
      {
        id: "adv-3",
        stem: "______ I was waiting for the bus, it began to rain.",
        options: ["When", "After", "While", "Before"],
        answer: 2,
        translation: "当我在等公交的时候，开始下雨了。",
        explanation: "<strong>While</strong> 引导时间状语从句，强调两个动作同时进行。was waiting 是延续性动作，while 和 when 都可以用，但 while 更强调「在……期间」。"
      },
      {
        id: "adv-4",
        stem: "______ I understand your point, I can't agree with you.",
        options: ["Because", "If", "While", "Unless"],
        answer: 2,
        translation: "虽然我理解你的观点，但我不能同意你。",
        explanation: "<strong>While</strong> 引导让步状语从句，意为「虽然、尽管」，表转折。此处 while 不是「当……时候」的意思。"
      },
      {
        id: "adv-5",
        stem: "______ time went by, the girl became stronger and more confident.",
        options: ["While", "When", "As", "Before"],
        answer: 2,
        translation: "随着时间的推移，这个女孩变得更强壮、更自信。",
        explanation: "<strong>As</strong> 引导时间状语从句，意为「随着」。强调两个变化同时发生：时间推移 + 女孩变强。"
      },
      {
        id: "adv-6",
        stem: "He won't leave the classroom ______ the lights are turned off.",
        options: ["until", "after", "when", "unless"],
        answer: 0,
        translation: "直到灯都关了，他才会离开教室。",
        explanation: "<strong>not...until...</strong> 句型，意为「直到……才」。won't leave 是否定形式，与 until 搭配使用。"
      },
      {
        id: "adv-7",
        stem: "I was lying awake for hours ______ the first hint of dawn appeared in the sky.",
        options: ["after", "until", "before", "when"],
        answer: 2,
        translation: "我在床上醒了几个小时，直到第一缕曙光出现在天空。",
        explanation: "<strong>before</strong> 引导时间状语从句，意为「在……之前」。这里意为「在第一缕曙光出现之前，我已经醒了几个小时」。"
      },
      {
        id: "adv-8",
        stem: "______ the children had finished their breakfast, they were told to read books.",
        options: ["Before", "While", "After", "Until"],
        answer: 2,
        translation: "孩子们吃完早饭后，被要求去读书。",
        explanation: "<strong>After</strong> 引导时间状语从句。had finished 用过去完成时，表示「吃完早饭」发生在「被要求读书」之前。"
      },
      {
        id: "adv-9",
        stem: "______ I get home, my father will start nagging me about homework.",
        options: ["As long as", "Until", "As soon as", "While"],
        answer: 2,
        translation: "我一到家，我爸就会开始唠叨我的作业。",
        explanation: "<strong>As soon as</strong> 引导时间状语从句，意为「一……就……」，表示两个动作几乎同时发生。"
      },
      {
        id: "adv-10",
        stem: "______ you are already here, you should study hard and make the most of it.",
        options: ["Although", "Unless", "Since", "Until"],
        answer: 2,
        translation: "既然你已经在这里了，就应该努力学习，充分利用它。",
        explanation: "<strong>Since</strong> 引导原因状语从句，意为「既然、因为」。与 because 相比，since 语气较弱，表示已知的或显然的原因。"
      },
      {
        id: "adv-11",
        stem: "______ there is a will, there is a way.",
        options: ["When", "If", "Where", "Unless"],
        answer: 2,
        translation: "有志者，事竟成。（在有意志的地方，就有路。）",
        explanation: "<strong>Where</strong> 引导地点状语从句，意为「在……地方」。这是一句著名的英语谚语。"
      },
      {
        id: "adv-12",
        stem: "You will miss the last bus ______ you hurry up right now.",
        options: ["if", "unless", "because", "although"],
        answer: 1,
        translation: "除非你现在赶快，否则你会错过末班车。",
        explanation: "<strong>unless</strong> 引导条件状语从句，意为「除非……；如果不……」。unless = if not，此处相当于 if you don't hurry up。"
      },
      {
        id: "adv-13",
        stem: "You can borrow my book ______ you return it on time.",
        options: ["as long as", "unless", "until", "before"],
        answer: 0,
        translation: "只要你按时归还，你就可以借我的书。",
        explanation: "<strong>as long as</strong> 引导条件状语从句，意为「只要」。等同于 so long as，表示唯一的条件。"
      },
      {
        id: "adv-14",
        stem: "______ she is young, she is very responsible and hardworking.",
        options: ["Because", "Although", "Unless", "Since"],
        answer: 1,
        translation: "虽然她很年轻，但她很有责任心而且很努力。",
        explanation: "<strong>Although</strong> 引导让步状语从句，意为「虽然、尽管」。although 和 though 通常可以互换，但 although 更正式。<strong>不能与 but 连用</strong>。"
      },
      {
        id: "adv-15",
        stem: "______ I fail this time, I will try again and never give up.",
        options: ["As if", "Only if", "Even if", "So that"],
        answer: 2,
        translation: "即使我这次失败了，我也会再试一次，永不放弃。",
        explanation: "<strong>Even if</strong> 引导让步状语从句，意为「即使、虽然」。even if 和 even though 通常可以互换，even though 更侧重「尽管已有的事实」。"
      },
      {
        id: "adv-16",
        stem: "The box is ______ heavy ______ I can't lift it by myself.",
        options: ["such...that...", "so...that...", "too...to...", "as...as..."],
        answer: 1,
        translation: "这个箱子如此重，以至于我一个人搬不动。",
        explanation: "<strong>so...that...</strong> 引导结果状语从句，意为「如此……以至于……」。so + 形容词/副词 + that 从句。比较 such...that...：such + 名词短语 + that 从句。"
      },
      {
        id: "adv-17",
        stem: "It was ______ a funny story ______ everyone in the room laughed loudly.",
        options: ["so...that...", "such...that...", "too...to...", "as...as..."],
        answer: 1,
        translation: "这是一个如此有趣的故事，以至于房间里每个人都大笑起来。",
        explanation: "<strong>such...that...</strong> 引导结果状语从句。such + a/an + 形容词 + 名词 + that 从句。如果只有形容词（无名词），用 so...that...。"
      },
      {
        id: "adv-18",
        stem: "He got up very early ______ he could catch the first bus to school.",
        options: ["even if", "as if", "so that", "as soon as"],
        answer: 2,
        translation: "他起得很早，以便能赶上第一班去学校的公交车。",
        explanation: "<strong>so that</strong> 引导目的状语从句，意为「以便……、为了……」。等同于 in order that。目的状语从句中常用情态动词 (can/could/will/would)。"
      },
      {
        id: "adv-19",
        stem: "The ______ you practice speaking English, the ______ your oral English will be.",
        options: ["more...better...", "much...good...", "more...best...", "many...well..."],
        answer: 0,
        translation: "你练习英语口语越多，你的口语就会越好。",
        explanation: "<strong>the + 比较级, the + 比较级</strong> 引导比较状语从句，意为「越……越……」。前半句相当于条件，后半句相当于结果。"
      },
      {
        id: "adv-20",
        stem: "She cried ______ she had lost something very precious to her.",
        options: ["so that", "even if", "as if", "now that"],
        answer: 2,
        translation: "她哭得好像丢了什么非常珍贵的东西一样。",
        explanation: "<strong>as if / as though</strong> 引导方式状语从句，意为「好像、仿佛」。当从句表示与事实相反的情况时，常用虚拟语气。"
      }
    ]
  };

  // ===================================================================
  // 状态
  // ===================================================================
  const tabKeys = ['attributive', 'noun', 'adverbial'];
  const tabMeta = {
    attributive: { countEl: 'attr-count', quizEl: 'attr-quiz' },
    noun:        { countEl: 'noun-count', quizEl: 'noun-quiz' },
    adverbial:   { countEl: 'adv-count',  quizEl: 'adv-quiz' }
  };
  let quizState = {};
  const noteTimers = {};

  // ===================================================================
  // 工具
  // ===================================================================
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  // ===================================================================
  // 构建卡片 HTML
  // ===================================================================
  function buildCardHTML(q, key, idx) {
    const state = quizState[key][idx];
    const noteContent = loadNote(q.id);
    const hasTrans = q.translation && q.translation.trim() !== '';
    const opts = q.options.map((opt, oi) => {
      let cls = 'opt';
      if (state.revealed) {
        if (oi === q.answer) cls += ' opt-correct';
        else if (oi === state.selected) cls += ' opt-wrong';
        cls += ' opt-disabled';
      }
      const mark = state.revealed && oi === q.answer ? ' ✓' : '';
      const xmark = state.revealed && oi === state.selected && oi !== q.answer ? ' ✗' : '';
      const dis = state.revealed ? ' disabled' : '';
      return `<button class="${cls}" data-qid="${q.id}" data-oi="${oi}"${dis}>${String.fromCharCode(65 + oi)}. ${opt}${mark}${xmark}</button>`;
    }).join('');
    const exp = state.revealed ? `<div class="q-explanation"><strong>解析：</strong>${q.explanation}</div>` : '';
    const retry = state.revealed ? `<button class="q-retry" data-key="${key}" data-idx="${idx}" data-qid="${q.id}">↺ 重做本题</button>` : '';
    const transBtn = hasTrans ? `<button class="q-trans-btn" data-qid="${q.id}" onclick="toggleTrans('${q.id}', this)">译</button>` : '';
    const transDiv = hasTrans ? `<div class="q-trans" id="trans-${q.id}">${escapeHTML(q.translation)}</div>` : '';
    return `
      <div class="quiz-card" id="card-${q.id}">
        <div class="q-number">第 ${idx + 1} 题</div>
        <div class="q-stem-row"><div class="q-stem-text">${q.stem}</div>${transBtn}</div>
        ${transDiv}
        <div class="q-options">${opts}</div>
        ${exp}${retry}
        <div class="q-note">
          <label for="note-${q.id}">📝 笔记（自动保存）</label>
          <textarea id="note-${q.id}" class="note-area" data-qid="${q.id}" placeholder="在这里记下你的思考和考点……">${escapeHTML(noteContent)}</textarea>
        </div>
      </div>`;
  }

  function renderCard(qid, key, idx, q) {
    const card = document.getElementById('card-' + qid);
    if (!card) return;
    // Preserve translation visibility state
    const transDiv = document.getElementById('trans-' + qid);
    const transWasOpen = transDiv && transDiv.classList.contains('show');
    const html = buildCardHTML(q, key, idx);
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const newCard = temp.querySelector('.quiz-card');
    if (newCard) {
      card.innerHTML = newCard.innerHTML;
    }
    // Restore translation visibility
    if (transWasOpen) {
      const newTrans = document.getElementById('trans-' + qid);
      const newBtn = card.querySelector('.q-trans-btn');
      if (newTrans) newTrans.classList.add('show');
      if (newBtn) newBtn.classList.add('active');
    }
  }

  function renderAllQuizzes() {
    for (const key of tabKeys) {
      const bank = questionBanks[key];
      const meta = tabMeta[key];

      const countEl = document.querySelector(`.count-em[data-bank="${key}"]`);
      if (countEl) countEl.textContent = bank.length;

      const container = document.getElementById(meta.quizEl);
      if (!container) continue;

      if (!quizState[key]) {
        quizState[key] = bank.map(() => ({ selected: null, correct: null, revealed: false }));
      }
      container.innerHTML = bank.map((q, i) => buildCardHTML(q, key, i)).join('');
    }
  }

  // ===================================================================
  // 答题
  // ===================================================================
  document.addEventListener('click', e => {
    const opt = e.target.closest('.opt');
    if (opt && !opt.disabled) {
      const qid = opt.dataset.qid;
      const oi = parseInt(opt.dataset.oi, 10);
      for (const k of tabKeys) {
        const i = questionBanks[k].findIndex(q => q.id === qid);
        if (i !== -1) {
          const q = questionBanks[k][i];
          quizState[k][i] = { selected: oi, correct: oi === q.answer, revealed: true };
          renderCard(qid, k, i, q);
          break;
        }
      }
    }
    const retry = e.target.closest('.q-retry');
    if (retry) {
      const key = retry.dataset.key;
      const idx = parseInt(retry.dataset.idx, 10);
      const q = questionBanks[key][idx];
      quizState[key][idx] = { selected: null, correct: null, revealed: false };
      renderCard(q.id, key, idx, q);
    }
  });

  // ===================================================================
  // 笔记
  // ===================================================================
  function loadNote(qid) {
    try { return localStorage.getItem('clause-note-' + qid) || ''; } catch (e) { return ''; }
  }
  function saveNote(qid, text) {
    try { localStorage.setItem('clause-note-' + qid, text); } catch (e) {}
  }
  document.addEventListener('input', e => {
    const ta = e.target.closest('.note-area');
    if (!ta) return;
    const qid = ta.dataset.qid;
    clearTimeout(noteTimers[qid]);
    noteTimers[qid] = setTimeout(() => saveNote(qid, ta.value), 400);
  });

  // ===================================================================
  // Tab 切换
  // ===================================================================
  function switchTab(targetId) {
    document.querySelectorAll('.tab').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === targetId);
    });
    document.querySelectorAll('.tab-content').forEach(s => {
      s.classList.toggle('active', s.id === targetId);
    });
  }
  window.switchTab = switchTab;

  // ===================================================================
  // 折叠刷题练习
  // ===================================================================
  function toggleQuiz(targetId, btn) {
    const container = document.getElementById(targetId);
    if (!container) return;
    const isOpen = container.style.display === 'block';
    if (isOpen) {
      container.style.display = 'none';
      btn.classList.remove('open');
    } else {
      container.style.display = 'block';
      btn.classList.add('open');
    }
  }
  window.toggleQuiz = toggleQuiz;

  // ===================================================================
  // 翻译切换
  // ===================================================================
  function toggleTrans(qid, btn) {
    const div = document.getElementById('trans-' + qid);
    if (!div) return;
    const isOpen = div.classList.contains('show');
    if (isOpen) {
      div.classList.remove('show');
      btn.classList.remove('active');
    } else {
      div.classList.add('show');
      btn.classList.add('active');
    }
  }
  window.toggleTrans = toggleTrans;

  // ===================================================================
  // callout 折叠（考点卡片）
  // ===================================================================
  function toggleCallout(targetId, btn) {
    const body = document.getElementById(targetId);
    if (!body) return;
    const isOpen = !body.classList.contains('collapsed');
    if (isOpen) {
      body.classList.add('collapsed');
      btn.classList.remove('open');
    } else {
      body.classList.remove('collapsed');
      btn.classList.add('open');
    }
  }
  window.toggleCallout = toggleCallout;

  const tabBtns = document.querySelectorAll('.tab');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
    });
  });

  // ===================================================================
  // 入口
  // ===================================================================
  renderAllQuizzes();

  // Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(r => console.log('SW registered:', r.scope))
        .catch(err => console.log('SW failed:', err));
    });
  }

});
