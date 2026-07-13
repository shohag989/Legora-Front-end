"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import axiosSecure from '@/services/axiosSecure';
import toast from 'react-hot-toast';
import { FiSend, FiMessageSquare, FiUser, FiArrowLeft, FiClock, FiFileText } from 'react-icons/fi';
import Image from 'next/image';

interface Participant {
  _id: string;
  name: string;
  photoURL?: string;
  email: string;
  role: string;
}

interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessage?: string;
  lastMessageAt?: string;
}

interface Message {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    name: string;
    photoURL?: string;
  };
  text: string;
  createdAt: string;
}

export default function InboxPage() {
  return (
    <ProtectedRoute>
      <InboxContent />
    </ProtectedRoute>
  );
}

function InboxContent() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [convosLoading, setConvosLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axiosSecure.get('/chat/conversations');
        setConversations(res.data);
      } catch (err: any) {
        console.error('Error fetching conversations:', err);
        toast.error('Failed to load conversations.');
      } finally {
        setConvosLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages when selected conversation changes, and poll
  useEffect(() => {
    if (!selectedConvo) return;

    const fetchMessages = async (showLoading = false) => {
      if (showLoading) setMessagesLoading(true);
      try {
        const res = await axiosSecure.get(`/chat/messages/${selectedConvo._id}`);
        setMessages(res.data);
      } catch (err: any) {
        console.error('Error fetching messages:', err);
      } finally {
        if (showLoading) setMessagesLoading(false);
      }
    };

    fetchMessages(true);
    const interval = setInterval(() => fetchMessages(false), 4000);
    return () => clearInterval(interval);
  }, [selectedConvo]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvo) return;

    try {
      setSending(true);
      const res = await axiosSecure.post('/chat/message', {
        conversationId: selectedConvo._id,
        text: inputText.trim()
      });
      setMessages(prev => [...prev, res.data]);
      setInputText('');
      
      // Update local lastMessage in conversation list
      setConversations(prev => prev.map(c => 
        c._id === selectedConvo._id 
          ? { ...c, lastMessage: inputText.trim(), lastMessageAt: new Date().toISOString() }
          : c
      ));
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const getRecipient = (convo: Conversation) => {
    return convo.participants.find(p => p._id !== user?._id) || convo.participants[0];
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Background blur patterns */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xl flex h-[650px]">
        {/* Left Side: Conversations list */}
        <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col bg-white ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h1 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <FiMessageSquare className="text-indigo-600" />
              Inbox Messages
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {convosLoading ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 animate-pulse rounded-2xl bg-slate-150/70" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-xs font-bold text-slate-400">
                No active conversations yet. Visit a designer's portfolio to contact them!
              </div>
            ) : (
              conversations.map(convo => {
                const recipient = getRecipient(convo);
                const isSelected = selectedConvo?._id === convo._id;
                return (
                  <button
                    key={convo._id}
                    onClick={() => setSelectedConvo(convo)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${isSelected ? 'bg-indigo-50/50 border border-indigo-100/80 shadow-sm' : 'hover:bg-slate-50 border border-transparent'}`}
                  >
                    <div className="relative flex-shrink-0">
                      {recipient.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={recipient.photoURL}
                          alt={recipient.name}
                          className="h-10 w-10 rounded-full object-cover border border-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(recipient.name)}&background=E53935&color=fff`;
                          }}
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white uppercase">
                          {recipient.name.charAt(0)}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-slate-700 truncate">{recipient.name}</span>
                        <span className="text-[9px] text-slate-400 font-medium">
                          {convo.lastMessageAt ? new Date(convo.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold truncate">
                        {convo.lastMessage || 'Start writing...'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Message stream */}
        <div className={`flex-1 flex flex-col bg-slate-50/30 ${!selectedConvo ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
          {selectedConvo ? (
            <>
              {/* Active User Header */}
              <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedConvo(null)} 
                    className="md:hidden p-2 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    {getRecipient(selectedConvo).photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getRecipient(selectedConvo).photoURL}
                        alt={getRecipient(selectedConvo).name}
                        className="h-9 w-9 rounded-full object-cover border border-slate-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getRecipient(selectedConvo).name)}&background=E53935&color=fff`;
                        }}
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white uppercase">
                        {getRecipient(selectedConvo).name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xs font-extrabold text-slate-850 leading-tight">{getRecipient(selectedConvo).name}</h2>
                    <span className="text-[10px] text-slate-500 font-bold capitalize">{getRecipient(selectedConvo).role}</span>
                  </div>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-bold text-slate-400">Loading history...</span>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isOwn = msg.sender._id === user?._id || msg.sender === user?._id;
                    return (
                      <div key={msg._id} className={`flex items-end gap-2.5 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        {!isOwn && (
                          <div className="relative mb-1">
                            {msg.sender.photoURL ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={msg.sender.photoURL}
                                alt={msg.sender.name}
                                className="h-7 w-7 rounded-full object-cover border border-slate-100"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.name)}&background=E53935&color=fff`;
                                }}
                              />
                            ) : (
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white uppercase">
                                {msg.sender.name.charAt(0)}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="max-w-[70%]">
                          <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${isOwn ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'}`}>
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-slate-450 mt-1 block font-bold px-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="submit"
                  disabled={sending || !inputText.trim()}
                  className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-sm">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-150">
                <FiMessageSquare className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">Your Conversations</h3>
                <p className="text-xs text-slate-500 mt-1 font-semibold leading-relaxed">
                  Select a chat thread from the left or contact designers directly to discuss project requirements, deliver design services, and collaborate.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
