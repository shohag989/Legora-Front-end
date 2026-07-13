"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import axiosSecure from '@/services/axiosSecure';
import toast from 'react-hot-toast';
import { 
  FiSend, 
  FiMessageSquare, 
  FiArrowLeft, 
  FiSearch, 
  FiPaperclip,
  FiUser
} from 'react-icons/fi';
import Link from 'next/link';
import { uploadImage } from '@/utils/uploadImage';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [convosLoading, setConvosLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Uploading file to cloud storage...');
    try {
      const fileUrl = await uploadImage(file);
      toast.success('File uploaded successfully!', { id: toastId });
      
      const res = await axiosSecure.post('chat/message', {
        conversationId: selectedConvo?._id,
        text: `📎 Attached File: ${fileUrl}`
      });
      
      setMessages(prev => {
        if (prev.some(m => m._id === res.data._id)) return prev;
        return [...prev, res.data];
      });
      
      setConversations(prev => prev.map(c => 
        c._id === selectedConvo?._id 
          ? { ...c, lastMessage: `📎 Attached File`, lastMessageAt: new Date().toISOString() }
          : c
      ));
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to upload file.', { id: toastId });
    }
  };

  const isImageMsg = (text: string) => {
    return text.startsWith('📎 Attached File:') && (
      text.endsWith('.png') || 
      text.endsWith('.jpg') || 
      text.endsWith('.jpeg') || 
      text.endsWith('.gif') || 
      text.endsWith('.webp') ||
      text.includes('i.ibb.co')
    );
  };

  const getImageUrl = (text: string) => {
    const match = text.match(/https?:\/\/[^\s]+/);
    return match ? match[0] : '';
  };

  const isLinkMsg = (text: string) => {
    if (isImageMsg(text)) return false;
    return /https?:\/\/[^\s]+/.test(text);
  };

  const getUrlsInText = (text: string) => {
    const matches = text.match(/https?:\/\/[^\s]+/g);
    return matches || [];
  };

  const formatTextWithLinks = (text: string, isOwn: boolean) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, idx) => {
      if (urlRegex.test(part)) {
        return (
          <a 
            key={idx} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`underline break-all ${isOwn ? 'text-indigo-200 hover:text-white' : 'text-indigo-650 hover:text-indigo-900'}`}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const LinkPreview = ({ url, isOwn }: { url: string; isOwn: boolean }) => {
    let hostname = '';
    try {
      hostname = new URL(url).hostname;
    } catch (e) {
      hostname = 'Link';
    }

    const isServiceLink = url.includes('/services/');
    const isDashboardLink = url.includes('/dashboard');

    return (
      <div className={`mt-2.5 border-t pt-2.5 text-left ${isOwn ? 'border-white/10' : 'border-slate-100'}`}>
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block rounded-xl p-2.5 transition-all group border ${
            isOwn 
              ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' 
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200/50 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg border transition-colors ${
              isOwn 
                ? 'bg-white/5 border-white/10 text-white' 
                : 'bg-white border-slate-200 text-slate-550 group-hover:text-slate-900'
            }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[9px] font-bold uppercase tracking-wider truncate ${isOwn ? 'text-white/60' : 'text-slate-400'}`}>
                {hostname}
              </p>
              <h4 className={`text-[11px] font-extrabold truncate ${isOwn ? 'text-white' : 'text-slate-850 group-hover:underline'}`}>
                {isServiceLink ? 'View Gig Service Listing' : isDashboardLink ? 'Open User Dashboard' : 'Open Shared Link'}
              </h4>
            </div>
          </div>
        </a>
      </div>
    );
  };

  // Fetch all conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axiosSecure.get('chat/conversations');
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
        const res = await axiosSecure.get(`chat/messages/${selectedConvo._id}`);
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

  // Scroll to bottom on new messages inside container
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConvo) return;

    try {
      setSending(true);
      const res = await axiosSecure.post('chat/message', {
        conversationId: selectedConvo._id,
        text: inputText.trim()
      });
      
      setMessages(prev => {
        if (prev.some(m => m._id === res.data._id)) return prev;
        return [...prev, res.data];
      });
      
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

  // Filter threads based on search term
  const filteredConvos = conversations.filter(convo => {
    const recipient = getRecipient(convo);
    return recipient?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50/40 font-sans text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-msg {
          opacity: 0;
          animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div className="max-w-6xl mx-auto bg-white border border-slate-200/70 rounded-[24px] shadow-sm flex h-[700px] overflow-hidden">
        
        {/* Left Side: Conversations list */}
        <div className={`w-full md:w-80 border-r border-slate-200/70 flex flex-col bg-white ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          {/* Header section with minimal title and search */}
          <div className="p-5 border-b border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-sm font-extrabold tracking-tight text-slate-900 uppercase">
                Messages
              </h1>
              <span className="text-[10px] font-bold text-slate-400">
                {conversations.length} Active
              </span>
            </div>

            {/* Clean Apple-style search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/50 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
              />
              <FiSearch className="absolute left-3 top-2.5 text-slate-450 w-3.5 h-3.5" />
            </div>
          </div>

          {/* Conversations scrollbar container */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {convosLoading ? (
              <div className="space-y-2 p-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-50 border border-slate-100" />
                ))}
              </div>
            ) : filteredConvos.length === 0 ? (
              <div className="p-8 text-center text-xs font-bold text-slate-400">
                No conversations found
              </div>
            ) : (
              filteredConvos.map(convo => {
                const recipient = getRecipient(convo);
                const isSelected = selectedConvo?._id === convo._id;
                return (
                  <button
                    key={convo._id}
                    onClick={() => setSelectedConvo(convo)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-300 transform hover:translate-x-1 active:scale-[0.98] ${
                      isSelected 
                        ? 'bg-slate-50 border-slate-200/80 shadow-sm' 
                        : 'hover:bg-slate-50/50 border-transparent'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      {recipient.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={recipient.photoURL}
                          alt={recipient.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(recipient.name)}&background=0F172A&color=fff`;
                          }}
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white uppercase border border-slate-100">
                          {recipient.name.charAt(0)}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {recipient.name}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">
                          {convo.lastMessageAt ? new Date(convo.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-450 truncate">
                        {convo.lastMessage || 'Start conversation'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Message stream */}
        <div className={`flex-1 flex flex-col bg-white ${!selectedConvo ? 'hidden md:flex items-center justify-center bg-slate-50/20' : 'flex'}`}>
          {selectedConvo ? (
            <>
              {/* Minimal Active User Header */}
              <div className="p-4 border-b border-slate-200/70 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedConvo(null)} 
                    className="md:hidden p-2 text-slate-450 hover:text-slate-800 transition-colors"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </button>
                  
                  {getRecipient(selectedConvo).role === 'designer' ? (
                    <Link 
                      href={`/designers/${getRecipient(selectedConvo)._id}`} 
                      className="flex items-center gap-3 hover:opacity-85 transition-opacity group"
                    >
                      {getRecipient(selectedConvo).photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getRecipient(selectedConvo).photoURL}
                          alt={getRecipient(selectedConvo).name}
                          className="h-8 w-8 rounded-full object-cover border border-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getRecipient(selectedConvo).name)}&background=0F172A&color=fff`;
                          }}
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white uppercase">
                          {getRecipient(selectedConvo).name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h2 className="text-xs font-bold text-slate-900 group-hover:underline flex items-center gap-1.5">
                          {getRecipient(selectedConvo).name}
                          <span className="text-[8px] font-bold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded uppercase">
                            Pro
                          </span>
                        </h2>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Click to view designer profile 🔗</span>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3">
                      {getRecipient(selectedConvo).photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getRecipient(selectedConvo).photoURL}
                          alt={getRecipient(selectedConvo).name}
                          className="h-8 w-8 rounded-full object-cover border border-slate-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getRecipient(selectedConvo).name)}&background=0F172A&color=fff`;
                          }}
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white uppercase">
                          {getRecipient(selectedConvo).name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h2 className="text-xs font-bold text-slate-900">
                          {getRecipient(selectedConvo).name}
                        </h2>
                        <span className="text-[8px] font-black tracking-widest text-slate-450 bg-slate-100 border border-slate-150 px-1.5 py-0.5 rounded uppercase block mt-0.5">
                          {getRecipient(selectedConvo).role}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message History list */}
              <div 
                ref={chatContainerRef} 
                className="flex-1 overflow-y-auto p-6 bg-white"
              >
                {messagesLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Syncing...</span>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isOwn = msg.sender._id === user?._id;
                    
                    // Collapse logic (Messenger style)
                    const nextMsg = messages[idx + 1];
                    const getSenderId = (m: any) => typeof m.sender === 'object' ? m.sender._id : m.sender;
                    const isSameSenderAsNext = nextMsg && getSenderId(nextMsg) === getSenderId(msg);
                    
                    const timeDiffMs = nextMsg ? new Date(nextMsg.createdAt).getTime() - new Date(msg.createdAt).getTime() : Infinity;
                    const isWithinFiveMinutes = timeDiffMs < 5 * 60 * 1000;
                    
                    const hideTimestamp = isSameSenderAsNext && isWithinFiveMinutes;
                    const showAvatar = !isOwn && (!isSameSenderAsNext || !isWithinFiveMinutes);

                    return (
                      <div 
                        key={msg._id} 
                        className={`flex items-end gap-2.5 animate-msg ${isOwn ? 'justify-end' : 'justify-start'} ${
                          hideTimestamp ? 'mb-1' : 'mb-4.5'
                        }`}
                      >
                        {!isOwn && (
                          <div className="relative flex-shrink-0">
                            {showAvatar ? (
                              msg.sender.photoURL ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={msg.sender.photoURL}
                                  alt={msg.sender.name}
                                  className="h-7 w-7 rounded-full object-cover border border-slate-100"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender.name)}&background=0F172A&color=fff`;
                                  }}
                                />
                              ) : (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white uppercase border border-slate-100">
                                  {msg.sender.name.charAt(0)}
                                </div>
                              )
                            ) : (
                              <div className="w-7 h-7" /> // Alignment placeholder spacer
                            )}
                          </div>
                        )}
                        <div className="max-w-[70%] space-y-1 text-left">
                          {isImageMsg(msg.text) ? (
                            <div className="space-y-1">
                              <a 
                                href={getImageUrl(msg.text)} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm hover:shadow-md transition-all group"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src={getImageUrl(msg.text)} 
                                  alt="Attachment" 
                                  className="max-h-60 w-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                                />
                              </a>
                            </div>
                          ) : (
                            <div className={`p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                              isOwn 
                                ? 'bg-slate-900 text-white rounded-br-none' 
                                : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/30'
                            }`}>
                              {formatTextWithLinks(msg.text, isOwn)}
                              {isLinkMsg(msg.text) && (
                                <LinkPreview url={getUrlsInText(msg.text)[0] || ""} isOwn={isOwn} />
                              )}
                            </div>
                          )}
                          {!hideTimestamp && (
                            <span className={`text-[8px] font-bold text-slate-400 px-1.5 block ${isOwn ? 'text-right' : 'text-left'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Composer - Clean border-t block */}
              <div className="p-4 border-t border-slate-100 bg-white">
                <form onSubmit={handleSendMessage} className="border border-slate-200/80 rounded-xl p-2 flex items-center gap-2 focus-within:border-slate-400 transition-colors">
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-400 hover:text-slate-600 transition-all transform hover:rotate-12 duration-200 cursor-pointer"
                  >
                    <FiPaperclip className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                  />
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 bg-transparent py-1 text-xs font-semibold focus:outline-none placeholder-slate-400 text-slate-800"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="h-8 px-4 rounded-lg bg-slate-900 hover:bg-slate-850 text-white transition-all flex items-center justify-center cursor-pointer text-xs font-extrabold disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95"
                  >
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-sm">
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-150 text-slate-500 flex items-center justify-center">
                <FiMessageSquare className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Select a conversation</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  Choose a direct message thread from the left sidebar or visit designer pages to initiate collaborations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
