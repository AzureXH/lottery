import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import AddwindowImage from "@/assets/AddWindow";
import styles from "./AddWindow.module.less";
interface AddButtonProps {
  text: string;
  onClick: () => void;

  itemMovePosition?: {
    top: number;
    left: number;
  };
  itemImg?: string;
  hasAdd?: boolean;
}
interface AddButtonRef {
  play: () => Promise<void>;
}
const AddButton = forwardRef(
  (
    { text, itemMovePosition, itemImg, onClick }: AddButtonProps,
    ref: ForwardedRef<AddButtonRef>
  ) => {
    const [style, setStyle] = useState({});
    const containerRef = useRef<HTMLDivElement>(null);
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
    useImperativeHandle(ref, () => ({
      play: () => {
        return new Promise((resolve) => {
          if (containerRef.current) {
            const img = document.createElement("img");
            img.src = itemImg!;
            img.className = styles["btn-item-img"];
            containerRef.current.appendChild(img);
            setTimeout(() => {
              let end = 0; // 因为有三个style改变了，所以ontransitionend会执行三次
              img.style.top = `${itemMovePosition?.top}px`;
              img.style.left = `${itemMovePosition?.left}px`;
              img.style.opacity = "0";
              img.ontransitionend = () => {
                end++;
                if (end === 3) {
                  resolve();
                }
              };
            }, 100);
          }
        });
      },
    }));
    return (
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={onClick}
        style={style}
        className={styles["btn-container"]}
      >
        <img src={AddwindowImage.btnIcon} className={styles["btn-icon"]} />
        <span className="text-[#BC83A3]">{text}</span>
        {itemImg && <img src={itemImg} className={styles["btn-item-img"]} />}
      </div>
    );
  }
);
interface Props {
  addTimes: number;
  onAddItem: () => void;
}
const buttons = [
  {
    id: 1,
    text: "花朵",
    img: AddwindowImage.flower,
    itemMovePosition: {
      top: 180,
      left: 200,
    },
  },
  {
    id: 2,
    text: "香草",
    img: AddwindowImage.grass,
    itemMovePosition: {
      top: 180,
      left: -80,
    },
  },
  {
    id: 3,
    text: "雨露",
    img: AddwindowImage.rain,
    itemMovePosition: {
      top: 180,
      left: -360,
    },
  },
];
const AddWindow = ({ addTimes, onAddItem }: Props) => {
  const buttonRefs = useRef<AddButtonRef[]>([]);
  return (
    <div className={styles.container}>
      <img src={AddwindowImage.lotteryWindow} className={styles.window} />
      <div className={styles.btns}>
        <AddButton
          onClick={async () => {
            if (addTimes >= 3) {
              return;
            }
            for (let i = 0; i < 3 - addTimes; i++) {
              const randomIndex = Math.floor(Math.random() * (3 - addTimes));
              await buttonRefs.current[randomIndex].play();
              onAddItem();
            }
          }}
          text="一键添加"
        ></AddButton>
        <div className={styles["item-btns"]}>
          {buttons.map((item, index) => (
            <AddButton
              ref={(el) => {
                buttonRefs.current[index] = el!;
              }}
              key={item.id}
              onClick={() => {
                if (addTimes >= 3) {
                  return;
                }
                buttonRefs.current[index].play();
                onAddItem();
              }}
              text={item.text}
              itemMovePosition={item.itemMovePosition}
              itemImg={item.img}
            ></AddButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddWindow;
