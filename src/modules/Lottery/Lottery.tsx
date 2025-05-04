import LotteryBackground from "@/assets/LotteryBackground";
import PersonAnimation from "@/assets/PersonAnimation";
import styles from "./Lottery.module.less";
import { useEffect, useRef, useState } from "react";
import PotAnimation from "@/assets/PotAnimation";
import AddWindow from "./components/AddWindow";
import TextTips from "./components/TextTips";
import { draw, ItemType, RarityLevel } from "@/algorithm/lottery";
import classNames from "classnames";
import AwardFrame from "./components/AwardFrame";
const Background = () => {
  return (
    <>
      <img className={styles.wall} src={LotteryBackground.wall}></img>
      <img className={styles.ground} src={LotteryBackground.ground}></img>
      <img className={styles.candle} src={LotteryBackground.candle}></img>
      <img className={styles.carpet} src={LotteryBackground.carpet}></img>
      <img className={styles.books} src={LotteryBackground.books}></img>
      <img className={styles.frame} src={LotteryBackground.frame}></img>
    </>
  );
};
const Stick = ({ actionState }: { actionState: ActionTree }) => {
  if (actionState === ActionTree.idle || actionState === ActionTree.addItem) {
    return <img src={LotteryBackground.stick} className={styles.stick}></img>;
  } else {
    return (
      <img
        src={LotteryBackground.stick}
        className={styles.stick}
        style={{ opacity: 0 }}
      ></img>
    );
  }
};

const rarityOrder = {
  [RarityLevel.N]: 0,
  [RarityLevel.R]: 1,
  [RarityLevel.SR]: 2,
  [RarityLevel.SSR]: 3,
};
const Pot = ({
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
  // 首先定义状态与图片的映射关系
  const POT_STATES = [
    {
      type: "potIdle",
      src: PotAnimation.potIdle,
      // 匹配 idle/addItem 状态时显示
      visibleStates: [
        ActionTree.idle,
        ActionTree.addItem,
        ActionTree.working_1,
        ActionTree.working_2,
        ActionTree.working_3,
      ],
    },
    {
      type: "working1",
      src: PotAnimation.potWorking1,
      visibleStates: [ActionTree.working_1],
    },
    {
      type: "working2",
      src: PotAnimation.potWorking2,
      visibleStates: [ActionTree.working_2],
    },
    {
      type: "working3",
      src: PotAnimation.potWorking3,
      visibleStates: [ActionTree.working_3],
    },
    {
      type: "award",
      src: (() => {
        switch (highestRarity) {
          case RarityLevel.SSR:
            return PotAnimation.potSSR;
          case RarityLevel.SR:
            return PotAnimation.potSR;
          case RarityLevel.R:
            return PotAnimation.potR;
          default:
            return PotAnimation.potN;
        }
      })(),
      visibleStates: [ActionTree.award],
    },
  ];

  // 渲染组件
  return (
    <>
      {POT_STATES.map(({ type, src, visibleStates }) => (
        <img
          key={type}
          src={src}
          className={styles.pot}
          style={{
            // 当前状态在可见列表中则显示，否则隐藏
            opacity: visibleStates.includes(actionState) ? 1 : 0,
          }}
        />
      ))}
    </>
  );
};
const Person = ({ actionState }: { actionState: ActionTree }) => {
  const PERSON_STATES = [
    {
      type: "personIdle",
      src: PersonAnimation.personIdle,
      visibleStates: [ActionTree.idle],
      zindex: 0,
    },
    {
      type: "personLight",
      src: PersonAnimation.personLight,
      lightSrc: PersonAnimation.light,
      visibleStates: [ActionTree.addItem],
    },
    {
      type: "personWorking",
      src: PersonAnimation.personWorking,
      visibleStates: [
        ActionTree.working_1,
        ActionTree.working_2,
        ActionTree.working_3,
      ],
    },
    {
      type: "personAward",
      src: PersonAnimation.personAward,
      visibleStates: [ActionTree.award],
    },
  ];

  return (
    <>
      <img
        className={classNames(
          actionState === ActionTree.idle && styles["person-dialog-frame"],
          (actionState === ActionTree.working_1 ||
            actionState === ActionTree.working_2 ||
            actionState === ActionTree.working_3) &&
            styles["person-dialog-frame-working"],
          actionState !== ActionTree.idle &&
            actionState !== ActionTree.working_1 &&
            actionState !== ActionTree.working_2 &&
            actionState !== ActionTree.working_3 &&
            styles["person-dialog-frame-hidden"]
        )}
        src={PersonAnimation.dialogFrame}
      />

      <span
        className={classNames(
          styles["person-dialog-text"],
          actionState !== ActionTree.idle && styles["person-dialog-text-hidden"]
        )}
      >
        还差一点就完成了...再加点什么呢...
      </span>
      <span
        className={classNames(
          styles["person-dialog-text-working"],
          actionState !== ActionTree.working_1 &&
            actionState !== ActionTree.working_2 &&
            actionState !== ActionTree.working_3 &&
            styles["person-dialog-text-working-hidden"]
        )}
      >
        感觉不错，应该会有新发现
      </span>
      <img
        className={styles.light}
        src={PersonAnimation.light}
        style={{
          opacity: actionState === ActionTree.addItem ? 1 : 0,
        }}
      ></img>
      {PERSON_STATES.map(({ type, src, visibleStates, zindex }) => (
        <img
          key={type}
          src={src}
          className={styles.person}
          style={{
            opacity: visibleStates.includes(actionState) ? 1 : 0,
            zIndex: zindex === 0 ? 0 : 1,
          }}
        />
      ))}
    </>
  );
};

export enum ActionTree {
  idle,
  addItem,
  working_1,
  working_2,
  working_3,
  award,
}
export enum Award {
  N,
  R,
  SR,
  SSR,
}
const LotterTimesLabel = () => {
  const times = localStorage.getItem("total_lottery_times");
  return (
    <div className="absolute right-[24px] top-[16px] border-[#F38FBA] border-[1px] border-solid rounded-[12px] !pl-[16px] !pr-[16px] !pt-[2px] !pb-[2px] text-white bg-[#f9f0fdb3]">
      <div className="text-[16px] text-[#BC83A3]">
        累计已炼成：{times || 0}次
      </div>
    </div>
  );
};
const Lottery = ({
  lotteryTimes,
  onBack,
}: {
  lotteryTimes: number;
  onBack: () => void;
}) => {
  const [addTimes, setAddTimes] = useState(0);
  const [actionState, setActionState] = useState<ActionTree>(ActionTree.idle);
  const [awardsState, setAwardState] = useState<
    {
      item: ItemType;
      rarity: RarityLevel;
    }[]
  >([]);
  const [backIconStyle, setBackIconStyle] = useState({});

  const onClickAddItem = () => {
    setAddTimes((prev) => {
      if (prev + 1 >= 3) {
        setActionState(ActionTree.working_1);
        return 3;
      } else {
        setActionState(ActionTree.addItem);
        return prev + 1;
      }
    });
  };
  const workingTimes = useRef(0);
  useEffect(() => {
    const nextStateMap: Record<number, number> = {
      [ActionTree.working_1]: ActionTree.working_2,
      [ActionTree.working_2]: ActionTree.working_3,
      [ActionTree.working_3]: ActionTree.working_1,
    };
    let timer = null;
    if (workingTimes.current >= 6 && actionState < ActionTree.award) {
      setAwardState(draw(lotteryTimes));
      setActionState(ActionTree.award);
      return;
    }
    if (nextStateMap.hasOwnProperty(actionState)) {
      timer = window.setTimeout(() => {
        workingTimes.current++;
        setActionState(nextStateMap[actionState]);
      }, 500);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [actionState]);
  return (
    <div className={styles.page}>
      <Background></Background>
      {(actionState === ActionTree.award ||
        actionState === ActionTree.idle) && (
        <div className="absolute top-[16px] left-[16px] z-1000">
          <div
            className="relative transition-all w-[100px] h-[60px]"
            style={backIconStyle}
            onTouchStart={() => {
              setBackIconStyle({
                transform: "scale(0.8)",
              });
            }}
            onTouchEnd={() => {
              setBackIconStyle({
                transform: "scale(1)",
              });
            }}
            onClick={() => onBack()}
          >
            <img src={LotteryBackground.btn} className="w-[100px]" />
            <img
              src={LotteryBackground.backIcon}
              className="absolute w-[8px] top-[16px] left-[22px]"
            />
            <span className="absolute text-[16px] w-[32px] top-[14px] left-[36px] text-[#BC83A3]">
              返回
            </span>
          </div>
        </div>
      )}
      {actionState < ActionTree.working_1 && (
        <AddWindow addTimes={addTimes} onAddItem={onClickAddItem}></AddWindow>
      )}
      <Stick actionState={actionState}></Stick>
      <Person actionState={actionState}></Person>
      <AwardFrame
        actionState={actionState}
        awardsState={awardsState}
      ></AwardFrame>
      <Pot actionState={actionState} awardsState={awardsState}></Pot>
      {actionState < ActionTree.award && (
        <TextTips addTimes={addTimes} actionState={actionState}></TextTips>
      )}
      {actionState >= ActionTree.working_1 && (
        <LotterTimesLabel></LotterTimesLabel>
      )}
    </div>
  );
};

export default Lottery;
