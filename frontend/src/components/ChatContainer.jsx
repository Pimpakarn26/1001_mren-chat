import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from './../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { formatMessageTime } from "../lib/utils"
import toast from 'react-hot-toast';

const ChatContainer = () => {
  console.log("ChatContainer rendered");
  
  const {
    messages,
    getMessage,
    selectedUser,
    isMessageLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    isFriend,
    friendRequestSent,
    friendRequestReceived,
    addFriend,
    acceptFriendRequest,
    setIsFriend,
    setFriendRequestSent,
    setFriendRequestReceived,
  } = useChatStore();
  
  console.log("Selected user in ChatContainer:", selectedUser);
  
  const { authUser, refreshUserData } = useAuthStore();
  const messagesEndRef = useRef(null);
  const [error, setError] = useState(null);

  const handleAddFriend = async () => {
    console.log("Add friend button clicked");
    try {
      await addFriend(selectedUser._id);
      setFriendRequestSent(true);
      toast.success("คำขอเป็นเพื่อนได้ถูกส่งแล้ว");
      // อัพเดทข้อมูลผู้ใช้หลังจากส่งคำขอเพื่อน
      await refreshUserData();
    } catch (err) {
      toast.error("ไม่สามารถเพิ่มเพื่อนได้ โปรดลองอีกครั้ง");
      console.error("Error adding friend:", err);
    }
  };

  const handleAcceptRequest = async () => {
    console.log("Accept friend request button clicked");
    try {
      await acceptFriendRequest(selectedUser._id);
      setIsFriend(true);
      setFriendRequestReceived(false);
      toast.success("ยอมรับคำขอเป็นเพื่อนเรียบร้อยแล้ว");
      getMessage(selectedUser._id);
      // อัพเดทข้อมูลผู้ใช้หลังจากยอมรับคำขอเพื่อน
      await refreshUserData();
    } catch (err) {
      toast.error("ไม่สามารถยอมรับคำขอเป็นเพื่อนได้ โปรดลองอีกครั้ง");
      console.error("Error accepting friend request:", err);
    }
  };

  //GetChat Messages
  useEffect(() => {
    console.log("Message fetch effect running, selectedUser:", selectedUser);
    if (!selectedUser?._id) return;
    
    try {
      //get history messages
      getMessage(selectedUser._id);
      //listen to socket
      subscribeToMessages();
    } catch (err) {
      console.error("Error loading messages:", err);
      setError("Failed to load messages");
    }

    return () => unsubscribeFromMessages();
  }, [
    selectedUser?._id,
    getMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // อัพเดทข้อมูลผู้ใช้เมื่อเลือกผู้ใช้รายใหม่
  useEffect(() => {
    if (selectedUser?._id) {
      refreshUserData().then(() => {
        console.log("User data refreshed before friendship check");
      });
    }
  }, [selectedUser?._id, refreshUserData]);

  useEffect(() => {
    console.log("Friendship check effect running, selectedUser:", selectedUser);
    console.log("authUser:", authUser);
    
    if (authUser && selectedUser) {
      try {
        // แปลง friends array ให้เป็น array ของ string เพื่อเปรียบเทียบง่ายขึ้น
        const userFriends = Array.isArray(authUser?.friends) 
          ? authUser.friends.map(id => id.toString()) 
          : [];
        
        // ตรวจสอบว่าเป็นเพื่อนกันแล้วหรือไม่
        const isUserFriend = userFriends.includes(selectedUser._id.toString());
        console.log("Is user friend? Array check:", isUserFriend);
        console.log("Friends list:", userFriends);
        console.log("Selected user ID:", selectedUser._id.toString());
        
        setIsFriend(isUserFriend);
        
        // ตรวจสอบคำขอเป็นเพื่อน
        const friendRequests = Array.isArray(authUser?.friendRequest) 
          ? authUser.friendRequest.map(id => id.toString()) 
          : [];
        
        const hasReceivedRequest = friendRequests.includes(selectedUser._id.toString());
        console.log("Has received friend request?", hasReceivedRequest);
        setFriendRequestReceived(hasReceivedRequest);
        
        const selectedUserFriendRequests = Array.isArray(selectedUser?.friendRequest) 
          ? selectedUser.friendRequest.map(id => id.toString()) 
          : [];
        
        const hasSentRequest = selectedUserFriendRequests.includes(authUser._id.toString());
        console.log("Has sent friend request?", hasSentRequest);
        setFriendRequestSent(hasSentRequest);
      } catch (err) {
        console.error("Error checking friendship status:", err);
      }
    }
  }, [
    setIsFriend,
    setFriendRequestReceived,
    setFriendRequestSent,
    authUser,
    selectedUser,
  ]);

  useEffect(() => {
    if (messagesEndRef.current && messages) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Render the welcome screen if no user is selected
  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-center">ยินดีต้อนรับสู่ SE Chat!</div>
        <div className="mt-4 text-center text-gray-500">
          เลือกบทสนทนาจากแถบด้านข้างเพื่อเริ่มแชท
        </div>
      </div>
    );
  }

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
   <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
              ref={messagesEndRef}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.webp"
                        : selectedUser.profilePic || "/avatar.webp"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">ยังไม่มีข้อความ เริ่มการสนทนาเลย!</p>
          </div>
        )}
      </div>
      {!isFriend && !friendRequestSent && !friendRequestReceived && (
        <div className="p-4 text-center bg-base-200">
          <p className="text-yellow-500">คุณต้องเป็นเพื่อนกับผู้ใช้นี้ก่อนจึงจะส่งข้อความได้</p>
          <button className="btn btn-primary btn-sm mt-2" onClick={handleAddFriend}>เพิ่มเพื่อน</button>
        </div>
      )}
      {!isFriend && friendRequestSent && !friendRequestReceived && (
        <div className="p-4 text-center bg-base-200">
          <p className="text-yellow-500">ส่งคำขอเป็นเพื่อนแล้ว รอการตอบรับ</p>
        </div>
      )}
      {!isFriend && !friendRequestSent && friendRequestReceived && (
        <div className="p-4 text-center bg-base-200">
          <p className="text-yellow-500">ผู้ใช้นี้ได้ส่งคำขอเป็นเพื่อนถึงคุณ</p>
          <button className="btn btn-primary btn-sm mt-2" onClick={handleAcceptRequest}>ยอมรับ</button>
        </div>
      )}
      {isFriend && <MessageInput />}
    </div>
  )
}

export default ChatContainer