// 定义奖品种类和等级枚举
enum RarityLevel {
  N = "普通",
  R = "高级",
  SR = "稀有",
  SSR = "超稀有",
}

enum ItemType {
  // 普通奖池
  RepeatChapter = "再来一章",
  TimeCoupon = "增时券",
  PhotoWithPhone = "手机合影",

  // 高级奖池
  PersonalSign = "私物签",
  UnsignedPolaroid = "无签拍立得",

  // 稀有奖池
  VoiceCoupon = "语音券",
  VideoCoupon = "视频券",
  HolidayItem = "节日限定周边",

  // 超稀有奖池
  BentoCoupon = "手制便当兑换券",
  FortuneTicket = "占卜券",
}

// 单抽全局概率配置
const SINGLE_DRAW_CONFIG = {
  [RarityLevel.N]: {
    probability: 90,
    items: [
      { type: ItemType.RepeatChapter, ratio: 10 }, // 实际概率 = 90% * 10% = 9%
      { type: ItemType.TimeCoupon, ratio: 70 }, // 90% * 70% = 63%
      { type: ItemType.PhotoWithPhone, ratio: 20 }, // 90% * 20% = 18%
    ],
  },
  [RarityLevel.R]: {
    probability: 7,
    items: [
      { type: ItemType.PersonalSign, ratio: 60 }, // 7% * 60% = 4.2%
      { type: ItemType.UnsignedPolaroid, ratio: 40 }, // 7% * 40% = 2.8%
    ],
  },
  [RarityLevel.SR]: {
    probability: 2,
    items: [
      { type: ItemType.VoiceCoupon, ratio: 30 }, // 2% * 30% = 0.6%
      { type: ItemType.VideoCoupon, ratio: 30 }, // 2% * 30% = 0.6%
      { type: ItemType.HolidayItem, ratio: 40 }, // 2% * 40% = 0.8%
    ],
  },
  [RarityLevel.SSR]: {
    probability: 1,
    items: [
      { type: ItemType.BentoCoupon, ratio: 50 }, // 1% * 50% = 0.5%
      { type: ItemType.FortuneTicket, ratio: 50 }, // 1% * 50% = 0.5%
    ],
  },
};

// 多抽奖池分布配置
const MULTI_DRAW_POOLS = {
  [RarityLevel.N]: [
    { type: ItemType.RepeatChapter, probability: 10 },
    { type: ItemType.TimeCoupon, probability: 70 },
    { type: ItemType.PhotoWithPhone, probability: 20 },
  ],
  [RarityLevel.R]: [
    { type: ItemType.PersonalSign, probability: 60 },
    { type: ItemType.UnsignedPolaroid, probability: 40 },
  ],
  [RarityLevel.SR]: [
    { type: ItemType.VoiceCoupon, probability: 30 },
    { type: ItemType.VideoCoupon, probability: 30 },
    { type: ItemType.HolidayItem, probability: 40 },
  ],
  [RarityLevel.SSR]: [
    { type: ItemType.BentoCoupon, probability: 50 },
    { type: ItemType.FortuneTicket, probability: 50 },
  ],
};

// 单抽算法实现
export function singleDraw(): { item: ItemType; rarity: RarityLevel } {
  // 第一步：确定奖池等级
  const poolThreshold = Math.random() * 100;
  let accumulated = 0;

  for (const [rarity, config] of Object.entries(SINGLE_DRAW_CONFIG)) {
    accumulated += config.probability;
    if (poolThreshold < accumulated) {
      // 第二步：在奖池内抽选具体物品
      const items = config.items;
      const itemThreshold = Math.random() * 100;
      let itemAccumulated = 0;

      for (const item of items) {
        itemAccumulated += item.ratio;
        if (itemThreshold < itemAccumulated) {
          return {
            item: item.type,
            rarity: rarity as RarityLevel,
          };
        }
      }
    }
  }

  throw new Error("抽奖算法异常");
}

// 多抽算法实现（假设已确定奖池等级）
export function multiDraw(times: number) {
  const res = [];
  // 第一步：确定奖池等级
  const poolThreshold = Math.random() * 100;
  let accumulated = 0;

  for (const [rarity, config] of Object.entries(MULTI_DRAW_POOLS)) {
    accumulated += config.probability;
    if (poolThreshold < accumulated) {
      // 第二步：在奖池内抽选具体物品
      const items = config.items;
      const itemThreshold = Math.random() * 100;
      let itemAccumulated = 0;

      for (const item of items) {
        itemAccumulated += item.ratio;
        if (itemThreshold < itemAccumulated) {
          return {
            item: item.type,
            rarity: rarity as RarityLevel,
          };
        }
      }
    }
  }

  for (let i = 0; i < times; i++) {
    res.push(singleDraw());
  }
  const raritySum: Record<string, number> = {
    N: 0,
    R: 0,
    SR: 0,
    SSR: 0,
  };
  const itemSum: Record<string, number> = {};
  for (const item of res) {
    raritySum[item.rarity] = (raritySum[item.rarity] || 1) + 1;
    itemSum[item.item] = (itemSum[item.item] || 1) + 1;
  }
  console.log(raritySum, itemSum);
  return res;
}
