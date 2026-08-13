import React, { useEffect, useState, useRef } from 'react';
import { Card, Typography, Spin, Input, Button, Tag, message } from 'antd';
import { CloseOutlined, SendOutlined, CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from '../Services/axios';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { useRole } from '../Context/RoleContext';

const { Text } = Typography;

interface UserChatboxProps {
    bookingId: string;
    onClose: () => void;
    isPage?: boolean;
}

const UserChatbox: React.FC<UserChatboxProps> = ({ bookingId, onClose, isPage }) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const { activeRole } = useRole();
    const isDark = theme === "dark";
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(true);
    const [negotiation, setNegotiation] = useState<any>(null);
    const [messageText, setMessageText] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchNegotiation = async () => {
        try {
            console.log("UserChatbox: fetching negotiation with bookingId:", bookingId);
            const res = await axios.get(`/api/negotiations/${bookingId}`);
            console.log("UserChatbox: fetch success, negotiation details:", res.data.negotiation);
            setNegotiation(res.data.negotiation);
        } catch (error: any) {
            console.error("UserChatbox: fetch failed!", error.response || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNegotiation();
        const interval = setInterval(fetchNegotiation, 4000);
        return () => clearInterval(interval);
    }, [bookingId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [negotiation?.messages]);

    const handleSendMessage = async () => {
        if (!messageText.trim() || !negotiation) return;
        try {
            await axios.post(`/api/negotiations/${negotiation._id}/messages`, {
                senderId: user?.id || user?._id,
                senderModel: activeRole === "provider" ? "ServiceProvider" : "User",
                text: messageText
            });
            setMessageText('');
            fetchNegotiation();
        } catch (error) {
            console.error(error);
            message.error("Failed to send message");
        }
    };



    const handleFinalizeOffer = async (offerId: string, action: 'accept' | 'decline') => {
        if (!negotiation) return;
        setActionLoading(true);
        try {
            await axios.put(`/api/negotiations/${negotiation._id}/finalize`, {
                action,
                offerId
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

    const textColor = isDark ? "text-white" : "text-gray-900";
    const cardClass = isDark ? "bg-slate-800 border-slate-700" : "bg-white";

    return (
        <>
            <style>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0.5;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .chatbox-slide-up {
                    animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
            <Card
                className={`fixed bottom-0 right-0 md:right-10 w-full md:w-[400px] h-[550px] shadow-2xl flex flex-col z-50 overflow-hidden border border-b-0 rounded-t-3xl chatbox-slide-up ${cardClass}`}
                bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0px' }}
            >
            {/* Header */}
            <div className={`p-3.5 flex justify-between items-center border-b ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-gray-200 bg-gray-50'} select-none`}>
                <div>
                    <Text strong className={textColor}>
                        {negotiation?.provider ? `Chat with Provider` : "Negotiation Chat"}
                    </Text>
                    {negotiation?.status && (
                        <Tag color={negotiation.status === 'active' ? 'green' : 'default'} className="ml-2 text-[10px]">
                            {negotiation.status}
                        </Tag>
                    )}
                </div>
                <Button type="text" shape="circle" icon={<CloseOutlined className={textColor} />} onClick={onClose} />
            </div>

            {loading ? (
                <div className="flex-1 flex justify-center items-center"><Spin /></div>
            ) : (
                <>
                    {/* Chat Messages Feed */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-slate-900/30">
                        {negotiation?.messages?.map((msg: any, idx: number) => {
                            const isMe = msg.senderId?.toString() === (user?.id || user?._id)?.toString();
                            return (
                                <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-2.5 rounded-2xl text-[13px] leading-snug shadow-sm ${
                                        isMe 
                                            ? 'bg-indigo-600 text-white rounded-br-none' 
                                            : isDark ? 'bg-slate-700 text-gray-200 rounded-bl-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                    }`}>
                                        <div className="break-words">{msg.text}</div>
                                        <div className={`text-[9px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Active Price Offer Banner */}
                    {activeOffer && (
                        <div className={`p-3 border-t border-b ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-blue-50/50 border-blue-100'} text-xs flex flex-col gap-2`}>
                            <div className="flex justify-between items-center">
                                <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                                    {isOfferByMe ? "Your proposed price:" : "Provider's proposed price:"}
                                </span>
                                <span className="font-bold text-sm text-indigo-500">₹{activeOffer.price}</span>
                            </div>
                            {!isOfferByMe && (
                                <div className="flex gap-2">
                                    <Button 
                                        type="primary" 
                                        size="small" 
                                        icon={<CheckOutlined />} 
                                        className="bg-green-600 hover:bg-green-700 border-none flex-1 text-[11px] h-7"
                                        loading={actionLoading}
                                        onClick={() => handleFinalizeOffer(activeOffer._id, 'accept')}
                                    >
                                        Accept
                                    </Button>
                                    <Button 
                                        danger 
                                        size="small" 
                                        icon={<CloseCircleOutlined />} 
                                        className="flex-1 text-[11px] h-7"
                                        loading={actionLoading}
                                        onClick={() => handleFinalizeOffer(activeOffer._id, 'decline')}
                                    >
                                        Decline
                                    </Button>
                                </div>
                            )}
                            {isOfferByMe && (
                                <span className="text-[10px] text-gray-400 italic">Waiting for provider response...</span>
                            )}
                        </div>
                    )}

                    {/* Chat Inputs Footer */}
                    <div className={`p-3 border-t ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-gray-200 bg-white'}`}>
                        {negotiation?.status === 'active' ? (
                            <div className="flex flex-col gap-2">
                                {/* Message input */}
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Type a message..."
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onPressEnter={handleSendMessage}
                                        className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                    />
                                    <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} className="bg-indigo-600 hover:bg-indigo-700 border-none" />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-xs text-gray-400 italic py-1">
                                This negotiation has been finalized.
                            </div>
                        )}
                    </div>
                </>
            )}
        </Card>
        </>
    );
};

export default UserChatbox;
