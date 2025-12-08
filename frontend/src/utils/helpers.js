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
    prop: "inProgress",
  },
  {
    id: 2,
    title: "Task Completed",
    emoji: "🏋️",
    icon: taskDoneIcon,
    bgColor: "bg-limeGreen",
    iconBgColor: "bg-green",
    prop: "completed",
  },
  {
    id: 3,
    title: "Task Won't Do",
    emoji: "🍵",
    icon: wontDoTaskIcon,
    bgColor: "bg-babyPink",
    iconBgColor: "bg-red",
    prop: "wontDo",
  },
  {
    id: 4,
    title: "Task To Do",
    emoji: "📚",
    icon: null,
    bgColor: "bg-veryLightGray",
    prop: "toDo",
  },
];

export const iconData = [
  {
    id: 1,
    emoji: "👩‍💻",
  },
  {
    id: 2,
    emoji: "💬",
  },
  {
    id: 3,
    emoji: "🍵",
  },
  {
    id: 4,
    emoji: "🏋️",
  },
  {
    id: 5,
    emoji: "📚",
  },
  {
    id: 6,
    emoji: "⏰",
  },
];
