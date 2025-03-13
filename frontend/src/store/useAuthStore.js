import { create } from 'zustand'
import api from "../services/api"
import Signup from '../pages/Signup';
import toast from 'react-hot-toast';
import Login from '../pages/Login';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isUpdatingProfile: false,
        checkAuth: async () => {
            try {
                const res = await api.get("/auth/check");
                set({ authUser: res.data });
            } catch (error) {
                set({ authUser: null });
            }finally{
                set({ isCheckingAuth: false });
            }
    },
    Signup: async (data) => {
      set({isSigningUp: true});
      try{
        const res = await api.post("/auth/signup", data);
        set({authUser: res.data});
        toast.success("Account created successfully");
      }catch(error){
        toast.error(error.response.data.message || "Sign Up Failed");
      }finally{
        set({isSigningUp: false});
      }
    },
    Login: async (data) => {
        et({isLogginIn: true});
      try{
        const res = await api.post("/auth/signin", data);
        set({authUser: res.data});
        toast.success("ALogged in successfully");
      }catch(error){
        toast.error(error.response.data.message || "Sign in Failed");
      }finally{
        set({isLogginIn: false});
      }
    },
    logout:async () => {
      try{
        await api.post("/auth/logout");
        set({authUser: null});
        toast.success("Logged out successfully");
      }catch(error){
        toast.error(error.response.data.message || "Logout in Failed");
      }
    },
    updateProfile: async (data) => {
      set({isUpdatingProfile: true});
      try{
        const res = await api.put("/auth/update-profile", data);
        set({authUser: res.data});
        toast.success("Profile updated successfully");
      }catch(error){
        toast.error(error.response.data.message || "Update Profile Failed");
      }finally{
        set({isUpdatingProfile: false});
      }
    },
}));