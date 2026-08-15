import React, { useEffect, useState, useRef } from 'react';
import { Spin, Input, Button, message } from 'antd';
import { motion } from 'framer-motion';
import {
  Send,
  X,
  IndianRupee,
  Check,
  Ban,
  User,
  Sparkles,
} from 'lucide-react';
import axios from '../Services/axios';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { useRole } from '../Context/RoleContext';

interface ProviderChatboxProps {
  bookingId: string;
  onClose: () => void;
  isPage?: boolean;
  isInline?: boolean;
}

const ProviderChatbox: React.FC<ProviderChatboxProps> = ({
  bookingId,
  onClose,
  isPage: _isPage,
  isInline: _isInline,
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { activeRole } = useRole();
  const isDark = theme === "dark";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [negotiation, setNegotiation] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [offerPrice, setOfferPrice] = useState<number | ''>('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNegotiation = async () => {
    try {
      const res = await axios.get(`/api/negotiations/${bookingId}`);
      setNegotiation(res.data.negotiation);
    } catch (error: any) {
      console.error("ProviderChatbox: fetch failed!", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNegotiation();
    const interval = setInterval(fetchNegotiation, 3500);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [negotiation?.messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !negotiation) return;
    const textToSend = messageText.trim();
    setMessageText('');
    try {
      await axios.post(`/api/negotiations/${negotiation._id}/messages`, {
        senderId: user?.id || user?._id,
        senderModel: activeRole === "provider" ? "ServiceProvider" : "User",
        text: textToSend,
      });
      fetchNegotiation();
    } catch (error) {
      console.error(error);
      message.error("Failed to send message");
    }
  };

  const handleSendOffer = async () => {
    if (!offerPrice || !negotiation) return;
    try {
      await axios.put(`/api/negotiations/${negotiation._id}/offers`, {
        proposedBy: user?.id || user?._id,
        proposedByModel: activeRole === "provider" ? "ServiceProvider" : "User",
        price: Number(offerPrice),
      });
      setOfferPrice('');
      fetchNegotiation();
      message.success("Counter-offer submitted to customer");
    } catch (error) {
      console.error(error);
      message.error("Failed to submit counter-offer");
    }
  };

  const handleFinalizeOffer = async (offerId: string, action: 'accept' | 'decline') => {
    if (!negotiation) return;
    setActionLoading(true);
    try {
      await axios.put(`/api/negotiations/${negotiation._id}/finalize`, {
        action,
        offerId,
      });
      fetchNegotiation();
      message.success(`Offer ${action}ed successfully`);
    } catch (error) {
      console.error(error);
      message.error(`Failed to ${action} offer`);
    } finally {
      setActionLoading(false);
    }
  };

  const activeOffer = negotiation?.price_offers?.find((o: any) => o.status === 'pending');
  const isOfferByMe = activeOffer?.proposedBy?.toString() === (user?.id || user?._id)?.toString();

  const customerName = negotiation?.user?.name || "Customer";

  return (
    <div className={`flex flex-col h-[500px] w-full select-text ${isDark ? "bg-slate-900 text-slate-100" : "bg-white text-slate-800"}`}>
      
      {/* ================= HEADER ================= */}
      <div className={`px-4 py-3 border-b flex items-center justify-between gap-3 ${
        isDark ? "bg-slate-900/90 border-slate-800" : "bg-slate-50 border-slate-200"
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {customerName.charAt(0).toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold m-0 truncate leading-tight">
                {customerName}
              </h4>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                <User className="w-2.5 h-2.5" />
                <span>Client</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 m-0 truncate">
              {negotiation?.booking?.job?.title || "Customer Booking Negotiation"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col justify-center items-center gap-2">
          <Spin />
          <span className="text-xs text-slate-400">Connecting chat...</span>
        </div>
      ) : (
        <>
          {/* ================= MESSAGE FEED ================= */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${
            isDark ? "bg-slate-950/50" : "bg-slate-50/60"
          }`}>
            
            <div className="text-center py-1">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-3 h-3" />
                <span>Real-time customer negotiation</span>
              </div>
            </div>

            {negotiation?.messages?.map((msg: any, idx: number) => {
              const isMe = msg.senderId?.toString() === (user?.id || user?._id)?.toString();
              const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs leading-relaxed ${
                    isMe
                      ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-br-xs"
                      : isDark
                      ? "bg-slate-800 text-slate-100 rounded-bl-xs border border-slate-700/80"
                      : "bg-white text-slate-800 rounded-bl-xs border border-slate-200/90"
                  }`}>
                    <p className="m-0 break-words font-medium">{msg.text}</p>
                    <div className={`text-[9px] mt-1 text-right font-medium ${
                      isMe ? "text-blue-200" : "text-slate-400"
                    }`}>
                      {timeStr}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {(!negotiation?.messages || negotiation.messages.length === 0) && (
              <div className="text-center py-10 text-xs text-slate-400">
                <p className="m-0">No messages yet. Chat with the customer to confirm timing and requirements!</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ================= ACTIVE PRICE PROPOSAL BANNER ================= */}
          {activeOffer && (
            <div className={`p-3 border-t border-b flex flex-col gap-2 ${
              isDark ? "bg-slate-800/80 border-slate-700" : "bg-blue-50/70 border-blue-100"
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                    <IndianRupee className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold">
                    {isOfferByMe ? "Your proposed price:" : "Customer's offer:"}
                  </span>
                </div>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  ₹{activeOffer.price}
                </span>
              </div>

              {!isOfferByMe && (
                <div className="flex gap-2 pt-1">
                  <Button
                    type="primary"
                    size="small"
                    icon={<Check className="w-3 h-3" />}
                    loading={actionLoading}
                    onClick={() => handleFinalizeOffer(activeOffer._id, 'accept')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 border-none font-bold text-xs h-7 rounded-lg text-white"
                  >
                    Accept Offer
                  </Button>
                  <Button
                    danger
                    size="small"
                    icon={<Ban className="w-3 h-3" />}
                    loading={actionLoading}
                    onClick={() => handleFinalizeOffer(activeOffer._id, 'decline')}
                    className="flex-1 font-bold text-xs h-7 rounded-lg"
                  >
                    Decline
                  </Button>
                </div>
              )}

              {isOfferByMe && (
                <span className="text-[10px] text-slate-400 italic">
                  Waiting for customer acceptance...
                </span>
              )}
            </div>
          )}

          {/* ================= INPUT FOOTER ================= */}
          <div className={`p-3 border-t ${
            isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}>
            {negotiation?.status === 'active' || !negotiation?.status ? (
              <div className="space-y-2">
                
                {/* Message input */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Type message to customer..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onPressEnter={handleSendMessage}
                    className="rounded-xl text-xs h-9 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                  />
                  <Button
                    type="primary"
                    icon={<Send className="w-3.5 h-3.5" />}
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="rounded-xl h-9 px-3.5 bg-blue-600 hover:bg-blue-700 border-none text-white shadow-xs flex items-center justify-center"
                  />
                </div>

                {/* Counter Offer Input */}
                {!activeOffer && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Propose Price (₹)..."
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value ? Number(e.target.value) : '')}
                      className="rounded-xl text-xs h-8 dark:bg-slate-800 dark:border-slate-700 dark:text-white w-1/2"
                      size="small"
                    />
                    <Button
                      size="small"
                      type="dashed"
                      onClick={handleSendOffer}
                      disabled={!offerPrice}
                      className="flex-1 rounded-xl text-xs font-bold h-8 text-blue-600 dark:text-blue-400 hover:border-blue-500"
                    >
                      Propose Price Quote
                    </Button>
                  </div>
                )}

              </div>
            ) : (
              <div className="text-center text-xs text-slate-400 italic py-1">
                This negotiation has been finalized.
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};

export default ProviderChatbox;
