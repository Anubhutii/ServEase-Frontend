import React, { useEffect, useState, useRef } from 'react';
import { Card, Typography, Spin, Input, Button, List, Space, Tag, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../Services/axios';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { SendOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NegotiationPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // negotiation Id
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const isDark = theme === "dark";
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [loading, setLoading] = useState(true);
    const [negotiation, setNegotiation] = useState<any>(null);
    const [messageText, setMessageText] = useState('');
    const [offerPrice, setOfferPrice] = useState<number | ''>('');

    const fetchNegotiation = async () => {
        try {
            if (!id) return;
            // Ideally we should have an endpoint for single negotiation
            // or we just fetch user/provider negotiation history. Let's assume we have it.
            const res = await axios.get(`/api/negotiations/history/${id}`);
            setNegotiation(res.data.negotiation);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNegotiation();
        const interval = setInterval(fetchNegotiation, 5000); // Polling for real-time messages
        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [negotiation?.messages]);

    const handleSendMessage = async () => {
        if (!messageText.trim()) return;
        try {
            await axios.post(`/api/negotiations/${id}/messages`, {
                senderId: user?.id || user?._id,
                senderModel: "User", // This should be dynamic based on Context.
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
        if (!offerPrice) return;
        try {
            await axios.put(`/api/negotiations/${id}/offers`, {
                proposedById: user?.id || user?._id,
                proposedByModel: "User", // This should be dynamic based on Context.
                offered_price: Number(offerPrice)
            });
            setOfferPrice('');
            fetchNegotiation();
            message.success("Counter-offer submitted");
        } catch (error) {
            console.error(error);
            message.error("Failed to submit counter-offer");
        }
    };

    const handleFinalize = async () => {
        try {
            await axios.put(`/api/negotiations/${id}/finalize`);
            fetchNegotiation();
            message.success("Terms finalized successfully! A booking has been created.");
        } catch (error) {
            console.error(error);
            message.error("Failed to finalize negotiation");
        }
    }

    const textColor = isDark ? "text-white" : "text-gray-900";
    const mutedText = isDark ? "text-gray-400" : "text-gray-500";
    const cardClass = isDark ? "bg-slate-800 border-slate-700" : "";

    if (loading) return <div className="flex justify-center py-20"><Spin size="large" /></div>;

    return (
        <div className={`min-h-screen py-8 px-4 md:px-10 flex flex-col md:flex-row gap-6 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>

            {/* Messages Column */}
            <Card className={`flex-1 flex flex-col ${cardClass}`} bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0px' }}>
                <div className={`p-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <Title level={4} className={`mb-0 ${textColor}`}>Negotiation Chat</Title>
                </div>

                {/* Feed */}
                <div className={`flex-1 overflow-y-auto p-4 space-y-4`} style={{ minHeight: '400px', maxHeight: '600px' }}>
                    {negotiation?.messages?.map((msg: any, idx: number) => {
                        const isMe = msg.sender.toString() === (user?.id || user?._id)?.toString();
                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] rounded-xl p-3 ${isMe ? 'bg-indigo-600 text-white' : (isDark ? 'bg-slate-700 text-gray-200' : 'bg-gray-200 text-gray-800')}`}>
                                    <p className="mb-0">{msg.text}</p>
                                    <span className="text-[10px] opacity-70 mt-1 block text-right">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className={`p-4 border-t flex gap-2 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                    <Input
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        onPressEnter={handleSendMessage}
                        placeholder="Type a message..."
                        className="rounded-full px-4"
                        size="large"
                    />
                    <Button
                        type="primary"
                        shape="circle"
                        icon={<SendOutlined />}
                        size="large"
                        onClick={handleSendMessage}
                        className="bg-indigo-600 border-none"
                    />
                </div>
            </Card>

            {/* Negotiation Controls Column */}
            <div className="w-full md:w-80 flex flex-col gap-4">
                <Card className={`${cardClass}`}>
                    <Title level={5} className={textColor}>Overview</Title>
                    <Tag color={negotiation?.status === 'finalized' ? 'green' : 'gold'} className="mb-4">
                        {negotiation?.status?.toUpperCase()}
                    </Tag>
                    <p className={mutedText}><strong>Initial Job:</strong> {negotiation?.job?.title || 'Unknown Job'}</p>

                    <div className={`mt-4 p-4 rounded-xl ${isDark ? 'bg-slate-700' : 'bg-indigo-50 border border-indigo-100'}`}>
                        <Text className={`block mb-1 text-sm ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>Latest Proposed Price</Text>
                        <Title level={2} className={`mb-0 ${isDark ? 'text-white' : 'text-indigo-600'}`}>
                            ₹{negotiation?.price_offers[negotiation?.price_offers?.length - 1]?.offered_price || 0}
                        </Title>
                        {negotiation?.status !== 'finalized' && (
                            <Button type="primary" className="w-full mt-4 bg-green-500 hover:bg-green-600 border-none" onClick={handleFinalize}>
                                Accept & Finalize
                            </Button>
                        )}
                    </div>
                </Card>

                {negotiation?.status !== 'finalized' && (
                    <Card className={`${cardClass}`}>
                        <Title level={5} className={textColor}>Counter Offer</Title>
                        <div className="flex gap-2 mb-2">
                            <Input
                                type="number"
                                value={offerPrice}
                                onChange={e => setOfferPrice(Number(e.target.value))}
                                placeholder="₹ Amount"
                            />
                            <Button type="primary" onClick={handleSendOffer}>Send</Button>
                        </div>
                        <Text className={`text-xs ${mutedText}`}>Submitting an offer notifies the counterparty.</Text>
                    </Card>
                )}
            </div>

        </div>
    );
};

export default NegotiationPage;
