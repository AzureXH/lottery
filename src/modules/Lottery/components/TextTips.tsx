import React from "react";
import styles from "./TextTips.module.less";
import { ActionTree } from "../Lottery";
const TextTips = ({ addTimes, actionState }) => {
  return (
    <div className={styles["text-tips"]}>
      {actionState < ActionTree.working_1
        ? `添加次数 ：${addTimes}/3`
        : "少女炼成中~Loading"}
    </div>
  );
};

export default TextTips;
