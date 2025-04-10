import { useState } from "react";
import Lottery from "../Lottery/Lottery";
import HomeBackground from "@/assets/HomeBackground";
import styles from "./Home.module.less";
const Button = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  const [style, setStyle] = useState({});
  const onTouchStart = () => {
    setStyle({
      transform: "scale(0.8)",
    });
  };
  const onTouchEnd = () => {
    setStyle({
      transform: "scale(1)",
    });
  };
  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={onClick}
      className="relative w-[154px] h-[83px] transition-all"
      style={{
        ...style,
        backgroundImage: `url(${HomeBackground.btn})`,
        backgroundSize: "contain",
      }}
    >
      <div className="absolute text-[22px] top-[24px] left-[50px] text-[#BC83A3]">
        {children}
      </div>
    </div>
  );
};
const Home = () => {
  const [lotteryTimes, setLotteryTimes] = useState(0);
  return lotteryTimes === 0 ? (
    <div>
      <img
        src={HomeBackground.background}
        className="absolute w-screen h-screen"
      ></img>
      <div className={styles.card}>
        <img src={HomeBackground.cover} className="w-[154px] "></img>
      </div>
      <img
        src={HomeBackground.cover}
        className="absolute top-[120px] left-[275px] w-[650px] border-[2px] border-[#fff] border-solid rounded-[12px]"
      ></img>
      <div className="absolute bottom-[80px] right-[80px] flex">
        <Button onClick={() => setLotteryTimes(1)}>抽1次</Button>
        <Button onClick={() => setLotteryTimes(3)}>抽3次</Button>
        <Button onClick={() => setLotteryTimes(10)}>抽10次</Button>
        <Button onClick={() => setLotteryTimes(15)}>抽15次</Button>
      </div>
    </div>
  ) : (
    <Lottery
      lotteryTimes={lotteryTimes}
      onBack={() => setLotteryTimes(0)}
    ></Lottery>
  );
};

export default Home;
