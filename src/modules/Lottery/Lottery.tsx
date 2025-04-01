import LotteryBackground from "@/assets/LotteryBackground";
import PersonAnimation from "@/assets/PersonAnimation";
import styles from "./Lottery.module.less";
import { useEffect, useRef, useState } from "react";
import PotAnimation from "@/assets/PotAnimation";
import AddWindow from "./components/AddWindow";
import TextTips from "./components/TextTips";
import { multiDraw, singleDraw } from "@/algorithm/lottery";
const Background = () => {
  return (
    <>
      {/* <img
        className={styles["background-test"]}
        src={LotteryBackground.background}
      ></img> */}
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
const Pot = ({ actionState }: { actionState: ActionTree }) => {
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
      src: PotAnimation.potN,
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
  return <img src={PersonAnimation.personIdle} className={styles.person}></img>;
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
const Lottery = () => {
  const [addTimes, setAddTimes] = useState(0);
  const [actionState, setActionState] = useState<ActionTree>(ActionTree.idle);
  const [awardsState, setAwardState] = useState({});
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
    if (workingTimes.current > 6 && actionState < ActionTree.award) {
      multiDraw(10000);
      setActionState(ActionTree.award);
      return;
    }
    if (nextStateMap.hasOwnProperty(actionState)) {
      timer = window.setTimeout(() => {
        workingTimes.current++;
        setActionState(nextStateMap[actionState]);
      }, 1000);
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
      {actionState < ActionTree.working_1 && (
        <AddWindow addTimes={addTimes} onAddItem={onClickAddItem}></AddWindow>
      )}
      <Stick actionState={actionState}></Stick>
      <Person actionState={actionState}></Person>
      <Pot actionState={actionState}></Pot>
      <TextTips addTimes={addTimes} actionState={actionState}></TextTips>
    </div>
  );
};

export default Lottery;
