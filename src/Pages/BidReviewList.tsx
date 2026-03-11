import React, { useEffect, useState } from 'react';
import { Card, Typography, Spin, Tag, Button, List, Space, Modal, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../Services/axios';
import { useTheme } from '../Context/ThemeContext';

const { Title, Text } = Typography;

const BidReviewList: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const isDark = theme === "dark";

    const [loading, setLoading] = useState(true);
    const [bids, setBids] = useState<any[]>([]);
    const [job, setJob] = useState<any>(null);

    const fetchBids = async () => {
        setLoading(true);
        try {
            // First get job details
            // If we don't have an endpoint for single job, we might need one or get it from bids response
            const res = await axios.get(`/api/jobs/${jobId}/bids`);
            setBids(res.data.bids || []);
            if (res.data.bids && res.data.bids.length > 0) {
                setJob(res.data.bids[0].job);
            }
        } catch (error) {
            console.error("Fetch bids error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobId) fetchBids();
    }, [jobId]);

    const handleAction = async (bidId: string, action: 'accept' | 'reject') => {
        try {
            await axios.put(`/api/bids/${bidId}/status`, { status: action === 'accept' ? 'accepted' : 'rejected' });
            message.success(`Bid ${action}ed successfully`);
            fetchBids();
        } catch (error: any) {
            message.error(error.response?.data?.message || `Failed to ${action} bid`);
        }
    };

    const handleNegotiate = (bidId: string) => {
        // Initiate negotiation in the backend then redirect
        axios.post(`/api/negotiations/initiate`, { bidId })
            .then(res => navigate(`/negotiation/${res.data.negotiation._id}`))
            .catch(err => {
                console.error(err);
                message.error("Failed to initiate negotiation");
            });
    };

    const textColor = isDark ? "text-white" : "text-gray-900";
    const mutedText = isDark ? "text-gray-400" : "text-gray-500";
    const cardClass = isDark ? "bg-slate-800 border-slate-700" : "";

    if (loading) return <div className="flex justify-center py-20"><Spin size="large" /></div>;

    return (
        <div className={`min-h-screen py-8 px-4 md:px-10 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
            <Button onClick={() => navigate(-1)} className="mb-4">
                &larr; Back to Dashboard
            </Button>

            <div className={`p-6 mb-8 rounded-xl shadow-sm ${cardClass}`}>
                <Title level={3} className={textColor}>Review Bids</Title>
                {job && (
                    <div className="mt-2">
                        <Text className={`block text-lg ${textColor}`}>Job: {job.title}</Text>
                        <Text className={mutedText}>Client Budget: ₹{job.budget_range?.min} - ₹{job.budget_range?.max}</Text>
                    </div>
                )}
            </div>

            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={bids}
                renderItem={(bid: any) => (
                    <List.Item>
                        <Card className={`w-full ${cardClass}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <Title level={4} className={textColor}>
                                        {bid.provider?.name || "Service Provider"}
                                    </Title>
                                    <Text className={mutedText}>{bid.provider?.email}</Text>

                                    <div className="mt-4">
                                        <p className={textColor}><strong>Proposed Price:</strong> ₹{bid.proposed_price}</p>
                                        <p className={textColor}><strong>Estimated Timeline:</strong> {bid.estimated_timeline}</p>
                                        <div className={`mt-2 p-3 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-gray-50'}`}>
                                            <Text className={textColor}>{bid.proposal_description}</Text>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <Tag color={bid.status === 'pending' ? 'gold' : bid.status === 'accepted' ? 'green' : bid.status === 'under_negotiation' ? 'purple' : 'red'} className="mb-4">
                                        {bid.status.toUpperCase()}
                                    </Tag>

                                    {bid.status === 'pending' && (
                                        <>
                                            <Button type="primary" className="w-full bg-green-600 hover:bg-green-700 border-none" onClick={() => handleAction(bid._id, 'accept')}>
                                                Accept Bid
                                            </Button>
                                            <Button type="primary" className="w-full bg-purple-600 hover:bg-purple-700 border-none" onClick={() => handleNegotiate(bid._id)}>
                                                Negotiate
                                            </Button>
                                            <Button danger className="w-full" onClick={() => handleAction(bid._id, 'reject')}>
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {bid.status === 'under_negotiation' && (
                                        <Button type="primary" className="w-full bg-purple-600 hover:bg-purple-700 border-none" onClick={() => navigate(`/negotiation`)}> {/* Need proper link */}
                                            Continue Negotiation
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </List.Item>
                )}
                locale={{ emptyText: <Text className={textColor}>No bids received yet.</Text> }}
            />
        </div>
    );
};

export default BidReviewList;
