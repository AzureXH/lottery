import styles from "./TextTips.module.less";
import { ActionTree } from "../Lottery";

const TextTips = ({
  addTimes,
  actionState,
}: {
  addTimes: number;
  actionState: ActionTree;
}) => {
  const renderWaveText = (text: string) => {
    return (
      <div
        className={
          actionState < ActionTree.award && actionState >= ActionTree.working_1
            ? styles["wave-text"]
            : ""
        }
      >
        {text.split("").map((char, index) => (
          <span key={index}>{char}</span>
        ))}
      </div>
    );
  };

  return (
    <div className={styles["text-tips"]}>
      {actionState < ActionTree.working_1
        ? `添加次数 ：${addTimes}/3`
        : renderWaveText("少女炼成中～Loading。。。")}
    </div>
  );
};

export default TextTips;
