import { create } from 'zustand';
import api from "../services/api";
import toast from 'react-hot-toast';
import { io } from "socket.io-client";


export const useAuthStore = create((set, get) => ({
    authUser: null,
    socket: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,  // แก้ไขชื่อจาก isLogginIn เป็น isLoggingIn
    isUpdatingProfile: false,
    onlineUsers: [],

    // ฟังก์ชันเช็คสถานะการเข้าสู่ระบบ
    checkAuth: async () => {
        try {
            const res = await api.get("/auth/check");
            set({ authUser: res.data });
            return res.data;
        } catch (error) {
            console.error("Auth check error:", error);
            set({ authUser: null });
            return null;
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    
    // ฟังก์ชันอัพเดทข้อมูลผู้ใช้เพื่อให้ข้อมูลเพื่อนเป็นปัจจุบัน
    refreshUserData: async () => {
        try {
            const res = await api.get("/auth/check");
            set({ authUser: res.data });
            console.log("User data refreshed:", res.data);
            return res.data;
        } catch (error) {
            console.error("Failed to refresh user data:", error);
            return null;
        }
    },

    // ฟังก์ชันสมัครสมาชิก
    Signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await api.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            console.error("Signup error:", error);
            toast.error(error.response?.data?.message || "Sign Up Failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    // ฟังก์ชันเข้าสู่ระบบ
    Login: async (data) => {
        set({ isLoggingIn: true });  // แก้ไขชื่อจาก isLogginIn เป็น isLoggingIn
        try {
            const res = await api.post("/auth/signin", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
        } catch (error) {
            console.error("Login error:", error);
            toast.error(error.response?.data?.message || "Sign in Failed");
        } finally {
            set({ isLoggingIn: false });  // แก้ไขชื่อจาก isLogginIn เป็น isLoggingIn
        }
    },

    // ฟังก์ชันออกจากระบบ
    logout: async () => {
        try {
            const res = await api.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error(error.response?.data?.message || "Logout Failed");
        }
    },

    // ฟังก์ชันอัปเดตโปรไฟล์
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await api.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error(error.response?.data?.message || "Update Profile Failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    // ฟังก์ชันเชื่อมต่อ Socket
    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;
        const socketURL = import.meta.env.VITE_SOCKET_URL;
        try {
            const newSocket = io(socketURL, {
              query: { userId: authUser._id },
            });
            newSocket.connect();
            set({ socket: newSocket });
            newSocket.on("getOnlineUsers", (userIds) => {
              set({ onlineUsers: userIds });
            });
        } catch (error) {
            console.error("Socket connection error:", error);
        }
    },

    // ฟังก์ชันตัดการเชื่อมต่อ Socket
    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) {
            socket.disconnect();
            set({ socket: null });
        }
    },
}));
