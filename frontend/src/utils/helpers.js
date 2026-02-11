import taskProgressIcon from "../assets/Time_atack_duotone.svg";
import wontDoTaskIcon from "../assets/close_ring_duotone-1.svg";
import wontDoTaskImage from "../assets/close_ring_duotone.svg";
import taskDoneIcon from "../assets/Done_round_duotone.svg";

export const backendURLLocal = import.meta.env.VITE_BACKEND_URL_LOCAL;
export const backendURLProd = import.meta.env.VITE_BACKEND_URL_PROD;
export const POST = "POST";
export const DELETE = "DELETE";
export const PUT = "PUT";
export const PATCH = "PATCH";

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

export const statusButtons = [
  {
    id: "inProgress",
    title: "In Progress",
    image: taskProgressIcon,
    bgColor: "bg-orange",
  },
  {
    id: "completed",
    title: "Completed",
    image: taskDoneIcon,
    bgColor: "bg-green",
  },
  {
    id: "wontDo",
    title: "Won't Do",
    image: wontDoTaskImage,
    bgColor: "bg-red",
  },
];

export const deriveKey = async function (password, salt) {
  const encodedPassword = new TextEncoder().encode(password);
  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    encodedPassword,
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 600000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
};

export const encryptData = async function (data, password) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16)); // 128-bit salt
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12 bytes for AES-GCM
  const key = await deriveKey(password, salt);
  const encodedData = new TextEncoder().encode(data);

  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: 128, // 128-bit tag length
    },
    key,
    encodedData,
  );

  const ciphertext = encryptedContent.slice(
    0,
    encryptedContent.byteLength - 16,
  );
  const authTag = encryptedContent.slice(encryptedContent.byteLength - 16);

  return {
    ciphertext: new Uint8Array(ciphertext),
    iv,
    authTag: new Uint8Array(authTag),
    salt,
  };
};

export const decryptData = async function (encryptedData, password) {
  const { ciphertext, iv, authTag, salt } = encryptedData;
  const key = await deriveKey(password, salt);

  const dataWithAuthTag = new Uint8Array(ciphertext.length + authTag.length);
  dataWithAuthTag.set(ciphertext, 0);
  dataWithAuthTag.set(authTag, ciphertext.length);

  const decryptedContent = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    key,
    dataWithAuthTag,
  );

  return new TextDecoder().decode(decryptedContent);
};
