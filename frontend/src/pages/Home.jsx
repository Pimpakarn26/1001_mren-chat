import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar"; 
import ChatContainer from "../components/ChatContainer";
import toast from "react-hot-toast";

const Home = () => {
  const { authUser, connectSocket, socket } = useAuthStore();
  const { selectedUser } = useChatStore();
  
  useEffect(() => {
    if (authUser) {
      console.log("Connecting socket from Home component");
      connectSocket();
    }
  }, [authUser, connectSocket]);
  
  // Additional socket event handlers for debugging
  useEffect(() => {
    if (socket) {
      console.log("Setting up socket event handlers");
      
      // Setup debugging listeners
      socket.on("connect", () => {
        console.log("Socket connected!");
        toast.success("Connected to chat server");
      });
      
      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        toast.error("Failed to connect to chat server");
      });
      
      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        if (reason === "io server disconnect") {
          connectSocket(); // Reconnect if the server disconnected
        }
      });
      
      return () => {
        socket.off("connect");
        socket.off("connect_error");
        socket.off("disconnect");
      };
    }
  }, [socket, connectSocket]);
  
  console.log("Selected user in Home:", selectedUser);
  
  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            <ChatContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;