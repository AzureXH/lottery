import { ItemType, ItemTypeMap, RarityLevel } from "@/algorithm/lottery";
import { ActionTree } from "../Lottery";
import styles from "../Lottery.module.less";
import s from "./AwardFrame.module.less";
import { AwardImages } from "@/assets/Award";
import classNames from "classnames";

const cssMap: Record<
  1 | 3 | 10 | 15,
  {
    frameCss: string;
    itemContainerCss: string;
    starCss: string;
    itemCss: string;
    starContainerCss: string;
    itemTextCss: string;
  }
> = {
  1: {
    frameCss: "!p-0 items-end !pb-[8px]",
    itemContainerCss: "flex-1",
    starContainerCss: "absolute top-[-16px] left-[16px]",
    starCss: "!static size-[40px]",
    itemCss: "size-[80px] !relative",
    itemTextCss: "mt-[8px] text-[24px] !relative text-[#ffadbb]",
  },
  3: {
    frameCss: "w-[360px]",
    itemContainerCss: "flex-1",
    starContainerCss: "",
    starCss: "!static size-[24px]",
    itemCss: "!relative size-[70px]",
    itemTextCss: "text-[16px] !relative text-[#ffadbb]",
  },
  10: {
    frameCss: `w-[640px] !h-[200px] !top-[44px] !left-[174px] !pl-[16px] !pt-[8px] ${s["frame-10"]}`,
    itemContainerCss: "!w-[100px] !mr-[16px] !mb-[8px]",
    starContainerCss: "",
    starCss: "!static size-[20px]",
    itemCss: "!relative size-[50px]",
    itemTextCss: "!relative text-[#ffadbb]",
  },
  15: {
    frameCss: `w-[720px] !h-[210px] !top-[44px] !left-[134px] !pl-0 !pt-[16px] ${s["frame-15"]}`,
    itemContainerCss: "!min-w-[80px] !max-w-[112px] !w-fit !mb-[8px] !mr-[8px]",
    starContainerCss: "",
    starCss: "!static size-[20px]",
    itemCss: "!relative size-[50px]",
    itemTextCss: "!relative text-[#ffadbb]",
  },
};
const rarityOrder = {
  [RarityLevel.N]: 0,
  [RarityLevel.R]: 1,
  [RarityLevel.SR]: 2,
  [RarityLevel.SSR]: 3,
};
const AwardItem = ({
  item,
  rarity,
  awardsNum,
}: {
  item: ItemType;
  rarity: RarityLevel;
  awardsNum: 1 | 3 | 10 | 15;
}) => {
  return (
    <div
      className={classNames(
        "flex flex-col items-center !w-[80px]",
        cssMap[awardsNum].itemContainerCss
      )}
    >
      <div className={classNames("flex", cssMap[awardsNum].starContainerCss)}>
        {new Array(rarity + 1).fill(0).map((_, index) => {
          return (
            <img
              src={
                AwardImages[RarityLevel[rarity] as keyof typeof RarityLevel]
                  .Star
              }
              key={index}
              className={classNames(cssMap[awardsNum].starCss)}
            ></img>
          );
        })}
      </div>
      <img
        src={AwardImages[RarityLevel[rarity] as keyof typeof RarityLevel][item]}
        className={classNames(cssMap[awardsNum].itemCss)}
      />
      <span className={cssMap[awardsNum].itemTextCss}>
        {ItemTypeMap[item].label}
      </span>
    </div>
  );
};
const AwardFrame = ({
  actionState,
  awardsState,
}: {
  actionState: ActionTree;
  awardsState: {
    item: ItemType;
    rarity: RarityLevel;
  }[];
}) => {
  const highestRarity = awardsState.length
    ? awardsState.reduce(
        (highest, current) =>
          rarityOrder[current.rarity] > rarityOrder[highest]
            ? current.rarity
            : highest,
        awardsState[0].rarity
      )
    : RarityLevel.N;
  const awardFrameClass = {
    [RarityLevel.N]: styles["award-frame-n"],
    [RarityLevel.R]: styles["award-frame-r"],
    [RarityLevel.SR]: styles["award-frame-sr"],
    [RarityLevel.SSR]: styles["award-frame-ssr"],
  }[highestRarity];

  return (
    actionState === ActionTree.award && (
      <div
        className={classNames(
          awardFrameClass,
          cssMap[awardsState.length as 1 | 3 | 10 | 15].frameCss
        )}
      >
        {awardsState.map(({ item, rarity }, index) => (
          <AwardItem
            item={item}
            rarity={rarity}
            key={index}
            awardsNum={awardsState.length as 1 | 3 | 10 | 15}
          ></AwardItem>
        ))}
      </div>
    )
  );
};

export default AwardFrame;
