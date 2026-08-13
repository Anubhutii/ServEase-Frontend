import React, { useEffect, useState, useRef } from 'react';
import { Card, Typography, Spin, Input, Button, Tag, message } from 'antd';
import { CloseOutlined, SendOutlined, CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from '../Services/axios';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { useRole } from '../Context/RoleContext';

const { Text } = Typography;

interface ProviderChatboxProps {
    bookingId: string;
    onClose: () => void;
    isPage?: boolean;
    isInline?: boolean;
}

const ProviderChatbox: React.FC<ProviderChatboxProps> = ({ bookingId, onClose, isPage, isInline }) => {
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
            console.log("ProviderChatbox: fetching negotiation with bookingId:", bookingId);
            const res = await axios.get(`/api/negotiations/${bookingId}`);
            console.log("ProviderChatbox: fetch success, negotiation details:", res.data.negotiation);
            setNegotiation(res.data.negotiation);
        } catch (error: any) {
            console.error("ProviderChatbox: fetch failed!", error.response || error);
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

    const handleSendOffer = async () => {
        if (!offerPrice || !negotiation) return;
        try {
            await axios.put(`/api/negotiations/${negotiation._id}/offers`, {
                proposedBy: user?.id || user?._id,
                proposedByModel: activeRole === "provider" ? "ServiceProvider" : "User",
                price: Number(offerPrice)
            });
            setOfferPrice('');
            fetchNegotiation();
            message.success("Counter-offer submitted");
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
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
            <Card
                className={isInline
                    ? `w-full h-auto shadow-lg flex flex-col overflow-hidden border rounded-3xl ${cardClass}`
                    : isPage 
                        ? `w-full max-w-2xl h-[calc(100vh-100px)] shadow-xl flex flex-col overflow-hidden border ${cardClass}`
                        : `fixed bottom-5 right-5 w-80 md:w-96 h-[500px] shadow-2xl flex flex-col z-50 overflow-hidden border ${cardClass}`
                }
                bodyStyle={{ display: 'flex', flexDirection: 'column', padding: '0px' }}
            >
                {/* Header */}
                <div className={`p-3.5 flex justify-between items-center border-b ${isDark ? 'border-slate-700 bg-slate-800/80' : 'border-gray-200 bg-gray-50'} select-none`}>
                    <div>
                        <Text strong className={textColor}>
                            {negotiation?.user ? `Chat with ${negotiation.user.name}` : "Chat with Customer"}
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
                    <div className="min-h-[180px] flex justify-center items-center"><Spin /></div>
                ) : (
                    <>
                        {/* Chat Messages Feed */}
                        <div className="max-h-[320px] overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-slate-900/30 no-scrollbar">
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
                                    {isOfferByMe ? "Your proposed price:" : "Customer's proposed price:"}
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
                                <span className="text-[10px] text-gray-400 italic">Waiting for customer response...</span>
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
                                
                                {/* Counter Offer Input */}
                                {!activeOffer && (
                                    <div className="flex gap-2 items-center mt-1">
                                        <Input
                                            type="number"
                                            placeholder="Propose Price (₹)..."
                                            value={offerPrice}
                                            onChange={(e) => setOfferPrice(e.target.value ? Number(e.target.value) : '')}
                                            className="w-1/2 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                            size="small"
                                        />
                                        <Button 
                                            size="small"
                                            type="dashed"
                                            className="flex-1 text-[11px] hover:border-indigo-500 hover:text-indigo-500"
                                            onClick={handleSendOffer}
                                        >
                                            Propose Price
                                        </Button>
                                    </div>
                                )}
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

export default ProviderChatbox;
