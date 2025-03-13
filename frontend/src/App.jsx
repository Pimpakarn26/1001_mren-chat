import { Route, Routes, Navigate } from 'react-router'; // เพิ่ม import ของ Navigate
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Setting from './pages/Setting';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useEffect } from 'react';
import { Loader } from "lucide-react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const {theme} = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <Home /> : <Navigate to="/signin" />} />

        {/* การจัดการการเข้าใช้งานหน้า Signup และ Login */}
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
        <Route path="/signin" element={!authUser ? <Login /> : <Navigate to="/" />} />

        {/* หน้า Setting ไม่ต้องตรวจสอบ authUser */}
        <Route path="/settings" element={<Setting />} />

        {/* การเข้าถึงหน้า Profile */}
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/signin" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
