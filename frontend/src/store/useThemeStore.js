import { create } from "zustand";

export const useThemeStore = create((set) => ({
  // อ่านค่าจาก localStorage หากมี ไม่งั้นจะใช้ค่า default เป็น "dark"
  theme: localStorage.getItem("chat-theme") || "dark",
  
  setTheme: (theme) => {
    // เก็บค่าธีมใหม่ลง localStorage และอัพเดทสถานะใน store
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
