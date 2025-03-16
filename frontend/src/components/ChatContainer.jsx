import React from 'react'
import { useEffect, useRef } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from './../store/useChatStore';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { formatMessageTime } from "../lib/utils"

const ChatContainer = () => {
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
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  const handleAddFriend = () => {
    addFriend(selectedUser._id);
    setFriendRequestSent(true);
  };

  const handleAcceptRequest = () => {
    acceptFriendRequest(selectedUser._id);
    setIsFriend(true);
    setFriendRequestReceived(false);
    getMessage(selectedUser._id);
  };

  //GetChat Messages
  useEffect(() => {
    //get history messages
    getMessage(selectedUser._id);
    //listen to socket
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (authUser && selectedUser) {
      setIsFriend(authUser?.friends?.includes(selectedUser._id));
      setFriendRequestReceived(
        authUser?.friendRequests?.includes(selectedUser._id)
      );
      setFriendRequestSent(
        selectedUser?.friendRequests?.includes(authUser._id)
      );
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

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
   <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messagesEndRef}
          >
            <div className=" chat-image avatar">
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
        ))}
      </div>
      {!isFriend && !friendRequestSent && !friendRequestReceived && (
        <div className="p-4 text-center text-red-500" onClick={handleAddFriend}>
          You must be friend with this user to send message.
          <button className="btn btn-sm mt-2">Add Friend</button>
        </div>
      )}
      {!isFriend && friendRequestSent && !friendRequestReceived && (
        <div className="p-4 text-center text-yellow-500">
          Friend request sent Waiting for acceptance.
        </div>
      )}
      {!isFriend && !friendRequestSent && friendRequestReceived && (
        <div
          className="p-4 text-center text-yellow-500"
          onClick={handleAcceptRequest}
        >
          This user has sent you .
          <button className="btn btn-sm mt-2">Accept</button>
        </div>
      )}
      <MessageInput />
    </div>
  )
}

export default ChatContainer