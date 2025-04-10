// N级奖励
import N_MoreTime from "./N/more_time.png";
import N_OneMore from "./N/one_more.png";
import N_Photo from "./N/photo.png";
import N_Star from "./N/star.png";

// R级奖励
import R_NoSignCheki from "./R/no_sign_cheki.png";
import R_PrivateSignCheki from "./R/private_sign_cheki.png";
import R_Star from "./R/star.png";

// SR级奖励
import SR_AudioTicket from "./SR/audio_ticket.png";
import SR_HolidayItem from "./SR/pendant.png";
// import SR_Rope from "./SR/rope.png";
import SR_VideoTicket from "./SR/video_ticket.png";
import SR_Star from "./SR/star.png";

// SSR级奖励
import SSR_Bento from "./SSR/bento.png";
import SSR_Taro from "./SSR/taro.png";
import SSR_Star from "./SSR/star.png";
import { RarityLevel } from "@/algorithm/lottery";

export const AwardImages: Record<
  keyof typeof RarityLevel,
  Record<string, string>
> = {
  N: {
    N_MoreTime,
    N_OneMore,
    N_Photo,
    Star: N_Star,
  },
  R: {
    R_NoSignCheki,
    R_PrivateSignCheki,
    Star: R_Star,
  },
  SR: {
    SR_AudioTicket,
    SR_HolidayItem,
    // SR_Rope,
    SR_VideoTicket,
    Star: SR_Star,
  },
  SSR: {
    SSR_Bento,
    SSR_Taro,
    Star: SSR_Star,
  },
};

export default {
  images: AwardImages,
};
