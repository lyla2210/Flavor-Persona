export type Dimension = "EI" | "SN" | "TF" | "JP";
export type Pole = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
export type Locale = "zh" | "en";
export type LocalizedText = Record<Locale, string>;

export type Mbti =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

export type Question = {
  id: number;
  dimension: Dimension;
  prompt: LocalizedText;
  scene: LocalizedText;
  options: {
    key: "A" | "B";
    text: LocalizedText;
    pole: Pole;
  }[];
};

export const questions: Question[] = [
  {
    id: 1,
    dimension: "EI",
    prompt: { zh: "能量来源", en: "Energy Source" },
    scene: {
      zh: "这杯饮料被端上桌时，你希望周围的环境是：",
      en: "When this drink is brought to the table, what kind of environment would you like to be in?",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "热闹的露天派对，笑声和碰杯声不断。",
          en: "A lively outdoor party, with constant laughter and the clinking of glasses.",
        },
        pole: "E",
      },
      {
        key: "B",
        text: {
          zh: "安静的窗边角落，只有风声和光影。",
          en: "A quiet corner by the window, with only the sound of wind and shifting light and shadow.",
        },
        pole: "I",
      },
    ],
  },
  {
    id: 2,
    dimension: "EI",
    prompt: { zh: "能量来源", en: "Energy Source" },
    scene: {
      zh: "调酒师向你展示了两种极端的基酒，哪一种让你更有“想要品尝”的冲动？",
      en: 'The bartender shows you two extreme base spirits. Which one gives you a stronger urge to "want to taste it"?',
    },
    options: [
      {
        key: "A",
        text: {
          zh: "烈焰般翻涌的液体：隔着瓶身都能感受到那股向外扩张的热量，仿佛喝下它就能瞬间点燃意志。",
          en: "A liquid churning like blazing flames: Even through the bottle, you can feel the heat expanding outward, as if drinking it could instantly ignite your will.",
        },
        pole: "E",
      },
      {
        key: "B",
        text: {
          zh: "幽泉般深邃的液体：光线被它缓缓吸入其中，透着一种向内沉淀的凉意，仿佛能让喧嚣瞬间安静。",
          en: "A liquid as deep as a hidden spring: Light is slowly drawn into it, revealing a coolness that settles inward, as if it could silence all noise in an instant.",
        },
        pole: "I",
      },
    ],
  },
  {
    id: 3,
    dimension: "EI",
    prompt: { zh: "能量来源", en: "Energy Source" },
    scene: {
      zh: "喝到一半，你发现这味道惊为天人，你会：",
      en: "Halfway through the drink, you discover that this flavor is incredibly good. What would you do?",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "忍不住想发个动态或拍个照给朋友看，这种快乐必须立刻传递出去。",
          en: "You cannot help wanting to post a story or take a photo to show your friends; this kind of joy must be passed on immediately.",
        },
        pole: "E",
      },
      {
        key: "B",
        text: {
          zh: "闭上眼安静享受这几分钟，等以后有机会见面时再提起这段体验。",
          en: "Close your eyes and quietly enjoy these few minutes, then bring up this experience later when you have the chance to meet.",
        },
        pole: "I",
      },
    ],
  },
  {
    id: 4,
    dimension: "EI",
    prompt: { zh: "能量来源", en: "Energy Source" },
    scene: {
      zh: "酒馆里正在举行一场小型品鉴会，你会更享受哪种参与方式？",
      en: "A small tasting event is being held in the bar. Which way of participating would you enjoy more?",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "和其他人交换彼此的发现，在讨论中不断获得新的灵感。",
          en: "Exchange discoveries with other people and constantly gain new inspiration through discussion.",
        },
        pole: "E",
      },
      {
        key: "B",
        text: {
          zh: "独自慢慢品尝每一款饮料，按照自己的节奏形成感受。",
          en: "Slowly taste each drink alone and form your impressions at your own pace.",
        },
        pole: "I",
      },
    ],
  },
  {
    id: 5,
    dimension: "EI",
    prompt: { zh: "能量来源", en: "Energy Source" },
    scene: {
      zh: "你获得了一张神秘酒单，上面写着一种从未听说过的饮料。你更倾向于：",
      en: "You get a mysterious drink menu with a drink you have never heard of. You are more inclined to:",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "立刻找调酒师聊聊，听听背后的故事，甚至邀请朋友一起尝试。",
          en: "Immediately talk to the bartender, listen to the story behind it, and even invite friends to try it together.",
        },
        pole: "E",
      },
      {
        key: "B",
        text: {
          zh: "先自己研究酒单上的描述，在心里构想它的味道，再决定是否点单。",
          en: "First study the description on the menu yourself, imagine its taste in your mind, and then decide whether to order it.",
        },
        pole: "I",
      },
    ],
  },
  {
    id: 6,
    dimension: "SN",
    prompt: { zh: "感知方式", en: "Perception Style" },
    scene: {
      zh: "你轻抿了一口，发现这款饮料有一种非常奇特的味道，你脑海中跳出的第一个念头是：",
      en: "You take a small sip and find that this drink has a very peculiar taste. The first thought that pops into your mind is:",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "这应该是肉桂混合了苦橙皮的味道，颗粒感很明显。",
          en: '"This should be the taste of cinnamon mixed with bitter orange peel; the granular texture is obvious."',
        },
        pole: "S",
      },
      {
        key: "B",
        text: {
          zh: "这种味道像是在深秋的午后，踩在一堆干燥落叶上的感觉。",
          en: '"This taste feels like a late autumn afternoon, stepping on a pile of dry fallen leaves."',
        },
        pole: "N",
      },
    ],
  },
  {
    id: 7,
    dimension: "SN",
    prompt: { zh: "感知方式", en: "Perception Style" },
    scene: {
      zh: "调酒师递给你一瓶从未见过的液体，瓶身上贴着一张手绘标签，你首先关注的是：",
      en: "The bartender hands you a bottle of liquid you have never seen before, with a hand-drawn label on it. What do you notice first?",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "标签上标注的原材料配比、产地海拔以及保质期。",
          en: "The ingredient proportions, place-of-origin altitude, and shelf life marked on the label.",
        },
        pole: "S",
      },
      {
        key: "B",
        text: {
          zh: "标签上那幅抽象的插画，以及它给这瓶液体起的诗意名字。",
          en: "The abstract illustration on the label and the poetic name it gives this bottle of liquid.",
        },
        pole: "N",
      },
    ],
  },
  {
    id: 8,
    dimension: "SN",
    prompt: { zh: "感知方式", en: "Perception Style" },
    scene: {
      zh: "网站显示的“人格饮料”预热海报上只有一片朦胧的色块，你认为：",
      en: 'On the "personality drink" teaser poster displayed on the website, there is only a hazy block of color. You think:',
    },
    options: [
      {
        key: "A",
        text: {
          zh: "这太抽象了，如果不看到具体的杯型和装饰，很难想象它是什么。",
          en: "This is too abstract. Without seeing the specific glass shape and garnish, it is hard to imagine what it is.",
        },
        pole: "S",
      },
      {
        key: "B",
        text: {
          zh: "这很有意境，这种色彩的流动本身就预示了某种深层的人格特质。",
          en: "This is very atmospheric. This kind of flowing color itself suggests some deeper personality trait.",
        },
        pole: "N",
      },
    ],
  },
  {
    id: 9,
    dimension: "SN",
    prompt: { zh: "感知方式", en: "Perception Style" },
    scene: {
      zh: "你面前有两杯外观几乎完全相同的饮料，但配方不同。你会如何分辨它们？",
      en: "There are two drinks in front of you with almost identical appearances, but different recipes. How would you distinguish them?",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "仔细比较香气、入口的质感、酸甜比例和余味。",
          en: "Carefully compare the aroma, the texture on entry, the sweet-and-sour ratio, and the aftertaste.",
        },
        pole: "S",
      },
      {
        key: "B",
        text: {
          zh: "试着感受它们整体给人的不同印象，寻找隐藏在味道背后的特点。",
          en: "Try to feel the different overall impressions they give, and look for the characteristics hidden behind the taste.",
        },
        pole: "N",
      },
    ],
  },
  {
    id: 10,
    dimension: "SN",
    prompt: { zh: "感知方式", en: "Perception Style" },
    scene: {
      zh: "酒馆推出了一款名为「午夜来信」的限定调酒，却没有公布配方。你猜测它为什么会叫这个名字？",
      en: 'The bar has launched a limited-edition cocktail called "Midnight Letter," but has not released the recipe. Why do you guess it is called this?',
    },
    options: [
      {
        key: "A",
        text: {
          zh: "名字可能来自它的颜色、原料或风味，比如以深色威士忌为基底的特调。",
          en: "The name may come from its color, ingredients, or flavor, such as a special mix based on dark whiskey.",
        },
        pole: "S",
      },
      {
        key: "B",
        text: {
          zh: "名字可能源于某个故事或灵感，比如调酒师的个人经历，或一段与酒款诞生有关的往事。",
          en: "The name may come from a story or inspiration, such as the bartender's personal experience, or a past event related to the creation of the drink.",
        },
        pole: "N",
      },
    ],
  },
  {
    id: 11,
    dimension: "TF",
    prompt: { zh: "决策逻辑", en: "Decision Logic" },
    scene: {
      zh: "如果由你来为这款饮料命名，你更倾向于：",
      en: "If you were to name this drink, you would be more inclined to:",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "基于它的功能或成分，起一个如《青柠樱桃气泡香槟》这样直接的名字。",
          en: 'Base it on its function or ingredients and give it a direct name like "Lime Cherry Sparkling Champagne."',
        },
        pole: "T",
      },
      {
        key: "B",
        text: {
          zh: "基于它带给人的情绪，起一个如《重逢时的第一次呼吸》这样感性的名字。",
          en: 'Base it on the emotion it brings people and give it a sentimental name like "The First Breath at Reunion."',
        },
        pole: "F",
      },
    ],
  },
  {
    id: 12,
    dimension: "TF",
    prompt: { zh: "决策逻辑", en: "Decision Logic" },
    scene: {
      zh: "调酒师允许你为这杯酒加入最后一种配料来改善口感，你的出发点是：",
      en: "The bartender allows you to add one last ingredient to this cocktail to improve its taste. Your starting point is:",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "加入能让口感层次更分明、提升整体风味结构稳定性的功能性成分。",
          en: "Add a functional ingredient that can make the flavor layers more distinct and improve the stability of the overall flavor structure.",
        },
        pole: "T",
      },
      {
        key: "B",
        text: {
          zh: "加入能让这杯酒喝起来更柔和、更符合你此刻心情或温暖回忆的感性成分。",
          en: "Add a sentimental ingredient that can make this cocktail taste softer and more in line with your current mood or warm memories.",
        },
        pole: "F",
      },
    ],
  },
  {
    id: 13,
    dimension: "TF",
    prompt: { zh: "决策逻辑", en: "Decision Logic" },
    scene: {
      zh: "你新点的饮品十分难喝，刚好旁边新来了一个顾客也点了这杯饮料，ta与你对上视线似乎也是第一次尝试这款，你会跟ta分享你的真实感受吗？",
      en: "The drink you just ordered is very unpleasant. A new customer nearby happens to have also ordered this drink. They meet your gaze and seem to be trying this drink for the first time too. Would you share your true feelings with them?",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "如实分享自己觉得难喝的原因和原材料并强调是个人感受。",
          en: "Honestly share the reasons why you think it tastes bad and the ingredients, and emphasize that it is your personal feeling.",
        },
        pole: "T",
      },
      {
        key: "B",
        text: {
          zh: "大书特书有多难喝。",
          en: "Go on and on about how bad it tastes.",
        },
        pole: "F",
      },
    ],
  },
  {
    id: 14,
    dimension: "TF",
    prompt: { zh: "决策逻辑", en: "Decision Logic" },
    scene: {
      zh: "你和朋友共同设计一款双人特调，但你们对最终配方意见不一。你会优先考虑：",
      en: "You and a friend are designing a two-person special cocktail together, but you disagree on the final recipe. You would prioritize:",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "比较不同配方的实际效果，选择口感更平衡、逻辑更合理的一种。",
          en: "Compare the actual effects of different recipes and choose the one with better balance and more reasonable logic.",
        },
        pole: "T",
      },
      {
        key: "B",
        text: {
          zh: "理解彼此想表达的感受，找到一款能兼顾双方心意的饮料。",
          en: "Understand the feelings each of you wants to express and find a drink that can accommodate both of your intentions.",
        },
        pole: "F",
      },
    ],
  },
  {
    id: 15,
    dimension: "TF",
    prompt: { zh: "决策逻辑", en: "Decision Logic" },
    scene: {
      zh: "酒馆准备淘汰一款销量不佳的饮料，你恰好很喜欢它。你会如何看待这件事？",
      en: "The bar is preparing to discontinue a drink with poor sales, but you happen to like it very much. How would you view this matter?",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "即使很喜欢，但如果它的销量、成本和运营表现确实不理想，停产可能是合理的决定。",
          en: "Even if you like it very much, if its sales, cost, and operational performance are indeed unsatisfactory, discontinuing it may be a reasonable decision.",
        },
        pole: "T",
      },
      {
        key: "B",
        text: {
          zh: "即使它不受欢迎，也可能对某些人有特殊意义，值得考虑其他保留方式。比如和喜欢的熟客们约在每两周返场。",
          en: "Even if it is unpopular, it may still have special meaning to some people, and other ways of keeping it should be considered. For example, arrange with regulars who like it to bring it back every two weeks.",
        },
        pole: "F",
      },
    ],
  },
  {
    id: 16,
    dimension: "JP",
    prompt: { zh: "生活风格", en: "Lifestyle Style" },
    scene: {
      zh: "酒馆老板正在招募“一日调酒学徒”，你更希望：",
      en: 'The bar owner is recruiting a "one-day bartending apprentice." You would rather:',
    },
    options: [
      {
        key: "A",
        text: {
          zh: "挑选一张你感兴趣的配方表，根据指示调配出一杯饮品。",
          en: "Choose a recipe sheet you are interested in and make a drink according to the instructions.",
        },
        pole: "J",
      },
      {
        key: "B",
        text: {
          zh: "站在吧台后自由发挥，即兴创作出一杯带有你个人印记的绝版饮品。",
          en: "Stand behind the bar and freely improvise a one-of-a-kind drink with your personal mark.",
        },
        pole: "P",
      },
    ],
  },
  {
    id: 17,
    dimension: "JP",
    prompt: { zh: "生活风格", en: "Lifestyle Style" },
    scene: {
      zh: "如果这款饮料推荐分层饮用，你的习惯是：",
      en: "If this drink is recommended to be consumed in layers, your habit is:",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "严格按照建议的层级顺序，分阶段感受味道的进阶。",
          en: "Strictly follow the suggested layer order and experience the progression of flavor in stages.",
        },
        pole: "J",
      },
      {
        key: "B",
        text: {
          zh: "随心所欲，也许会搅拌一下，看看混合后会产生什么新奇味道。",
          en: "Do whatever you want; maybe stir it and see what novel flavor comes out after mixing.",
        },
        pole: "P",
      },
    ],
  },
  {
    id: 18,
    dimension: "JP",
    prompt: { zh: "生活风格", en: "Lifestyle Style" },
    scene: {
      zh: "酒吧老板看你喝得尽兴于是决定随机赠送你几个shot，并给了你选择的机会，你会？",
      en: "The bar owner sees you enjoying yourself and decides to randomly give you a few shots, and gives you the chance to choose. What would you do?",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "选择常规的、可控的口味，比如龙舌兰shot，梅子酒shot，菠萝酒shot。",
          en: "Choose conventional, controllable flavors, such as tequila shots, plum wine shots, and pineapple liqueur shots.",
        },
        pole: "J",
      },
      {
        key: "B",
        text: {
          zh: "选择完全没见过的组合，是酒吧老板实验性自创，很有创意但有可能是天堂也有可能是大雷。",
          en: "Choose a completely unfamiliar combination, an experimental creation by the bar owner. It is very creative, but it could be heaven or a huge disaster.",
        },
        pole: "P",
      },
    ],
  },
  {
    id: 19,
    dimension: "JP",
    prompt: { zh: "生活风格", en: "Lifestyle Style" },
    scene: {
      zh: "你计划在周末去一家新开的酒馆，途中却发现附近还有一家评价很高的隐藏小店。你会：",
      en: "You plan to go to a newly opened bar this weekend, but on the way you find that there is also a highly rated hidden small shop nearby. You would:",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "先完成原定计划，把新发现记下来，留待下次探索。",
          en: "First complete the original plan, note down the new discovery, and leave it for next time.",
        },
        pole: "J",
      },
      {
        key: "B",
        text: {
          zh: "临时改变路线，看看这次意外发现会带来什么惊喜。",
          en: "Temporarily change route and see what surprise this accidental discovery brings.",
        },
        pole: "P",
      },
    ],
  },
  {
    id: 20,
    dimension: "JP",
    prompt: { zh: "生活风格", en: "Lifestyle Style" },
    scene: {
      zh: "调酒师告诉你，今天可以免费定制一杯专属饮料，但你必须提前决定大致方向。你会：",
      en: "The bartender tells you that today you can customize a special drink for free, but you must decide the general direction in advance. You would:",
    },
    options: [
      {
        key: "A",
        text: {
          zh: "先想好想要的口味、颜色和整体风格，再让调酒师制作。",
          en: "First think about the taste, color, and overall style you want, and then let the bartender make it.",
        },
        pole: "J",
      },
      {
        key: "B",
        text: {
          zh: "先告诉调酒师几个模糊的灵感，剩下的交给现场的创作过程。",
          en: "First tell the bartender a few vague inspirations and leave the rest to the on-site creative process.",
        },
        pole: "P",
      },
    ],
  },
];
