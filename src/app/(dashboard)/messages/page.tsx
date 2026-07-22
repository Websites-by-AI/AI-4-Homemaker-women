"use client";

import { useEffect, useState, useRef } from "react";

interface Conversation {
  id: number;
  content: string;
  created_at: string;
  is_read: boolean;
  sender_id: number;
  receiver_id: number;
  contact_id: number;
  contact_name: string;
  contact_email: string;
  contact_avatar: string | null;
  contact_role: string;
  unread_count: number;
}

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  isRead: boolean;
  createdAt: string;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
}

const avatarColors = [
  "from-blue-400 to-indigo-500",
  "from-emerald-400 to-teal-500",
  "from-purple-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-red-500",
  "from-cyan-400 to-blue-500",
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [allUsers, setAllUsers] = useState<{ id: number; name: string; email: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function fetchCurrentUser() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUserId(data.user.id);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }

  async function fetchConversations() {
    try {
      const res = await fetch("/api/messages");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  }

  async function openChat(contactId: number, contactName: string, contactEmail: string) {
    try {
      const res = await fetch(`/api/messages/${contactId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
        setSelectedContact(data.contact || { id: contactId, name: contactName, email: contactEmail });
        setShowNewChat(false);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact || sendingMessage) return;

    setSendingMessage(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: selectedContact.id,
          content: newMessage,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
        fetchConversations();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSendingMessage(false);
    }
  }

  async function openNewChat() {
    setShowNewChat(true);
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data.users.filter((u: { id: number }) => u.id !== currentUserId));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">پیام‌ها</h1>
        <p className="text-gray-500 mt-1">گفتگو با اعضای تیم</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: "calc(100vh - 220px)" }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-80 border-l border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <button
                onClick={openNewChat}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                + گفتگوی جدید
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">هنوز پیامی ندارید</p>
              ) : (
                conversations.map((conv, index) => (
                  <button
                    key={conv.id}
                    onClick={() => openChat(conv.contact_id, conv.contact_name, conv.contact_email)}
                    className={`w-full flex items-center gap-3 p-4 text-right hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                      selectedContact?.id === conv.contact_id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div
                      className={`w-11 h-11 bg-gradient-to-br ${avatarColors[index % avatarColors.length]} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                    >
                      {conv.contact_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conv.contact_name}
                        </h3>
                        {conv.unread_count > 0 && (
                          <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">{conv.content}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {selectedContact.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
                    <p className="text-xs text-gray-500">{selectedContact.email}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderId === currentUserId ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          msg.senderId === currentUserId
                            ? "bg-blue-600 text-white rounded-bl-sm"
                            : "bg-gray-100 text-gray-900 rounded-br-sm"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.senderId === currentUserId
                              ? "text-blue-200"
                              : "text-gray-400"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString("fa-IR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="پیام خود را بنویسید..."
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sendingMessage}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      ارسال
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-lg font-medium text-gray-900">
                    یک گفتگو انتخاب کنید
                  </h3>
                  <p className="text-gray-500 mt-2">
                    از لیست سمت راست گفتگوی خود را انتخاب کنید
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-900 mb-4">گفتگوی جدید</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    openChat(user.id, user.name, user.email);
                    setShowNewChat(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-right"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowNewChat(false)}
              className="w-full mt-4 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              انصراف
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
