import Home from "./modules/Home/Home";
import "./App.css";
import { useEffect } from "react";
import { AwardImages } from "@/assets/Award";
import HomeBackground from "@/assets/HomeBackground";
import LotteryBackground from "@/assets/LotteryBackground";
import PersonAnimation from "@/assets/PersonAnimation";
import PotAnimation from "@/assets/PotAnimation";

function preloadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
}
function App() {
  useEffect(() => {
    // 收集所有需要预加载的图片
    const imagesToPreload = [
      ...Object.values(AwardImages).flatMap((obj) => Object.values(obj)),
      ...Object.values(HomeBackground),
      ...Object.values(LotteryBackground),
      ...Object.values(PersonAnimation),
      ...Object.values(PotAnimation),
    ];

    // 预加载所有图片
    Promise.all(imagesToPreload.map((src) => preloadImage(src))).catch(
      console.error
    );
  }, []);
  return <Home></Home>;
}

export default App;
