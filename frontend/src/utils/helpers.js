import taskProgressIcon from "../assets/Time_atack_duotone.svg";
import wontDoTaskIcon from "../assets/close_ring_duotone-1.svg";
import taskDoneIcon from "../assets/Done_round_duotone.svg";

export const taskHeaders = [
  {
    id: 1,
    title: "Task in Progress",
    emoji: "⏰",
    icon: taskProgressIcon,
    bgColor: "bg-yellow",
    iconBgColor: "bg-orange",
  },
  {
    id: 2,
    title: "Task Completed",
    emoji: "🏋️",
    icon: taskDoneIcon,
    bgColor: "bg-limeGreen",
    iconBgColor: "bg-green",
  },
  {
    id: 3,
    title: "Task Won't Do",
    emoji: "🍵",
    icon: wontDoTaskIcon,
    bgColor: "bg-babyPink",
    iconBgColor: "bg-red",
  },
  {
    id: 4,
    title: "Task To Do",
    emoji: "📚",
    icon: null,
    bgColor: "bg-veryLightGray",
  },
];
