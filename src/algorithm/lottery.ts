// 定义奖品种类和等级枚举
export enum RarityLevel {
  N,
  R,
  SR,
  SSR,
}

export enum ItemType {
  // 普通奖池
  N_OneMore = "N_OneMore",
  N_MoreTime = "N_MoreTime",
  N_Photo = "N_Photo",

  // 高级奖池
  R_PrivateSignCheki = "R_PrivateSignCheki",
  R_NoSignCheki = "R_NoSignCheki",

  // 稀有奖池
  SR_AudioTicket = "SR_AudioTicket",
  SR_VideoTicket = "SR_VideoTicket",
  SR_HolidayItem = "SR_HolidayItem",

  // 超稀有奖池
  SSR_Bento = "SSR_Bento",
  SSR_Taro = "SSR_Taro",
}

export const ItemTypeMap = {
  // 普通奖池
  N_OneMore: { label: "再来一章", value: ItemType.N_OneMore },
  N_MoreTime: { label: "增时券", value: ItemType.N_MoreTime },
  N_Photo: { label: "手机合影", value: ItemType.N_Photo },

  // 高级奖池
  R_PrivateSignCheki: { label: "私物签", value: ItemType.R_PrivateSignCheki },
  R_NoSignCheki: { label: "无签拍立得", value: ItemType.R_NoSignCheki },

  // 稀有奖池
  SR_AudioTicket: { label: "语音券", value: ItemType.SR_AudioTicket },
  SR_VideoTicket: { label: "视频券", value: ItemType.SR_VideoTicket },
  SR_HolidayItem: { label: "限定周边", value: ItemType.SR_HolidayItem },

  // 超稀有奖池
  SSR_Bento: { label: "便当券", value: ItemType.SSR_Bento },
  SSR_Taro: { label: "占卜券", value: ItemType.SSR_Taro },
};

// 单抽全局概率配置
const SINGLE_DRAW_CONFIG = {
  [RarityLevel.N]: {
    probability: 90,
    items: [
      { type: ItemType.N_OneMore, ratio: 10 }, // 9%
      { type: ItemType.N_MoreTime, ratio: 70 }, // 63%
      { type: ItemType.N_Photo, ratio: 20 }, // 18%
    ],
  },
  [RarityLevel.R]: {
    probability: 7,
    items: [
      { type: ItemType.R_PrivateSignCheki, ratio: 60 }, // 4.2%
      { type: ItemType.R_NoSignCheki, ratio: 40 }, // 2.8%
    ],
  },
  [RarityLevel.SR]: {
    probability: 2,
    items: [
      { type: ItemType.SR_AudioTicket, ratio: 30 }, // 0.6%
      { type: ItemType.SR_VideoTicket, ratio: 30 }, // 0.6%
      { type: ItemType.SR_HolidayItem, ratio: 40 }, // 0.8%
    ],
  },
  [RarityLevel.SSR]: {
    probability: 1,
    items: [
      { type: ItemType.SSR_Bento, ratio: 50 }, // 0.5%
      { type: ItemType.SSR_Taro, ratio: 50 }, // 0.5%
    ],
  },
};

// 多抽奖池分布配置
const MULTI_DRAW_POOLS = {
  [RarityLevel.N]: {
    probability: 90,
    items: [
      { type: ItemType.N_OneMore, ratio: 10 },
      { type: ItemType.N_MoreTime, ratio: 70 },
      { type: ItemType.N_Photo, ratio: 20 },
    ],
  },
  [RarityLevel.R]: {
    probability: 7,
    items: [
      { type: ItemType.R_PrivateSignCheki, ratio: 60 },
      { type: ItemType.R_NoSignCheki, ratio: 40 },
    ],
  },
  [RarityLevel.SR]: {
    probability: 2,
    items: [
      { type: ItemType.SR_AudioTicket, ratio: 30 },
      { type: ItemType.SR_VideoTicket, ratio: 30 },
      { type: ItemType.SR_HolidayItem, ratio: 40 },
    ],
  },
  [RarityLevel.SSR]: {
    probability: 1,
    items: [
      { type: ItemType.SSR_Bento, ratio: 50 },
      { type: ItemType.SSR_Taro, ratio: 50 },
    ],
  },
};

// 抽奖函数
function drawFromPool(pool: (typeof SINGLE_DRAW_CONFIG)[RarityLevel.N]) {
  const itemThreshold = Math.random() * 100;
  let itemAccumulated = 0;

  for (const item of pool.items) {
    itemAccumulated += item.ratio;
    if (itemThreshold < itemAccumulated) {
      return item.type;
    }
  }
  return pool.items[0].type; // 防止浮点数计算误差
}

// 确定稀有度
function determineRarity(): RarityLevel {
  const threshold = Math.random() * 100;
  let accumulated = 0;

  for (const [rarity, config] of Object.entries(SINGLE_DRAW_CONFIG)) {
    accumulated += config.probability;
    if (threshold < accumulated) {
      return Number(rarity) as RarityLevel;
    }
  }
  return RarityLevel.N; // 防止浮点数计算误差
}

// 单抽实现
function singleDraw(): { item: ItemType; rarity: RarityLevel } {
  const rarity = determineRarity();
  const pool = SINGLE_DRAW_CONFIG[rarity];
  const item = drawFromPool(pool);

  return {
    item,
    rarity,
  };
}

// 多抽实现
function multiDraw(times: number) {
  const results: { item: ItemType; rarity: RarityLevel }[] = [];
  const stats = {
    rarity: {
      [RarityLevel.N]: 0,
      [RarityLevel.R]: 0,
      [RarityLevel.SR]: 0,
      [RarityLevel.SSR]: 0,
    },
    items: {} as Record<ItemType, number>,
  };

  // 保底机制
  let guaranteedRarity: RarityLevel | null = null;
  if (times === 15) {
    guaranteedRarity = RarityLevel.SSR;
  } else if (times === 10) {
    guaranteedRarity = RarityLevel.SR;
  } else if (times === 3) {
    guaranteedRarity = RarityLevel.R;
  }

  for (let i = 0; i < times; i++) {
    let result;

    // 在最后一次抽取时检查是否需要触发保底
    if (i === times - 1 && guaranteedRarity) {
      const hasGuaranteedRarity = results.some((r) => {
        switch (guaranteedRarity) {
          case RarityLevel.SSR:
            return r.rarity === RarityLevel.SSR;
          case RarityLevel.SR:
            return r.rarity === RarityLevel.SR || r.rarity === RarityLevel.SSR;
          case RarityLevel.R:
            return (
              r.rarity === RarityLevel.R ||
              r.rarity === RarityLevel.SR ||
              r.rarity === RarityLevel.SSR
            );
          default:
            return false;
        }
      });

      if (!hasGuaranteedRarity) {
        // 未保底，需要触发保底抽取
        const pool = MULTI_DRAW_POOLS[guaranteedRarity];
        const item = drawFromPool(pool);
        result = { item, rarity: guaranteedRarity };
      } else {
        // 保底触发，进行普通抽
        result = singleDraw();
      }
    } else {
      result = singleDraw();
    }

    results.push(result);
    stats.rarity[result.rarity]++;
    stats.items[result.item] = (stats.items[result.item] || 0) + 1;
  }

  // 输出统计信息
  console.log("抽奖统计：", {
    总次数: times,
    稀有度分布: Object.entries(stats.rarity).map(
      ([rarity, count]) => `${rarity}: ${((count / times) * 100).toFixed(2)}%`
    ),
    物品分布: Object.entries(stats.items).map(
      ([item, count]) => `${item}: ${((count / times) * 100).toFixed(2)}%`
    ),
    物品列表: results.map((r) => r.item),
  });
  results.sort((a, b) => {
    if (a.rarity !== b.rarity) {
      return b.rarity - a.rarity; // 稀有度高的在前
    }
    // 同稀有度按物品名称排序
    return ItemTypeMap[a.item].label.localeCompare(ItemTypeMap[b.item].label);
  });
  return results;
}

export function draw(drawTimes: number) {
  const times = Number(localStorage.getItem("total_lottery_times"));
  localStorage.setItem("total_lottery_times", times + drawTimes + "");
  if (drawTimes === 1) {
    return [singleDraw()];
  } else {
    return multiDraw(drawTimes);
  }
}
