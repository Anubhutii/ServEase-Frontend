import React, { useEffect, useState } from 'react';
import { Tabs, Card, Typography, Spin, Row, Col, Statistic, Tag, Button } from 'antd';
import axios from '../Services/axios';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import BidSubmissionModal from '../Components/BidSubmissionModal';

const { Title, Text } = Typography;

const ProviderDashboard: React.FC = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [data, setData] = useState({
        activeOrders: [],
        history: [],
        bids: [],
        jobs: [],
        analytics: { totalEarnings: 0, completedJobs: 0 }
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const providerId = user?.id || user?._id; // Replace with proper provider reference if needed

            const [activeRes, historyRes, bidsRes, jobsRes, analyticsRes] = await Promise.all([
                axios.get(`/api/dashboard/provider/active-orders/${providerId}`),
                axios.get(`/api/dashboard/provider/orders/${providerId}`),
                axios.get(`/api/dashboard/provider/bids/${providerId}`),
                axios.get(`/api/dashboard/provider/search-jobs`),
                axios.get(`/api/dashboard/provider/analytics/${providerId}`)
            ]);

            setData({
                activeOrders: activeRes.data.orders,
                history: historyRes.data.orders,
                bids: bidsRes.data.bids,
                jobs: jobsRes.data.jobs,
                analytics: analyticsRes.data
            });
        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const textColor = isDark ? "text-white" : "text-gray-900";

    const renderActiveOrders = () => (
        <div className="space-y-4">
            {data.activeOrders.map((order: any) => (
                <Card key={order._id} className={isDark ? "bg-slate-800 border-slate-700" : ""}>
                    <div className="flex justify-between items-center">
                        <div>
                            <Title level={5} className={textColor}>{order.job?.title || "Direct Booking"}</Title>
                            <Text className={isDark ? "text-gray-400" : "text-gray-500"}>{order.service_details}</Text>
                        </div>
                        <Tag color="cyan">{order.status}</Tag>
                    </div>
                    <div className="mt-3 font-semibold text-lg text-indigo-500">
                        ₹{order.final_price}
                    </div>
                    {order.status === 'pending' && order.booking_type === 'direct' && (
                        <div className="mt-4 flex gap-2">
                            <Button type="primary" className="bg-green-600 hover:bg-green-700 border-none">Accept</Button>
                            <Button type="primary" className="bg-purple-600 hover:bg-purple-700 border-none">Negotiate</Button>
                            <Button danger>Decline</Button>
                        </div>
                    )}
                </Card>
            ))}
            {data.activeOrders.length === 0 && <Text className={textColor}>No active orders.</Text>}
        </div>
    );

    const renderBids = () => (
        <div className="space-y-4">
            {data.bids.map((bid: any) => (
                <Card key={bid._id} className={isDark ? "bg-slate-800 border-slate-700" : ""}>
                    <div className="flex justify-between">
                        <Text strong className={textColor}>{bid.job?.title}</Text>
                        <Tag color={bid.status === 'pending' ? 'gold' : bid.status === 'accepted' ? 'green' : 'red'}>
                            {bid.status}
                        </Tag>
                    </div>
                    <div className="mt-2 text-sm">
                        <Text className={isDark ? "text-gray-400" : "text-gray-500"}>Proposed Price: ₹{bid.proposed_price}</Text>
                        <br />
                        <Text className={isDark ? "text-gray-400" : "text-gray-500"}>Timeline: {bid.estimated_timeline}</Text>
                    </div>
                </Card>
            ))}
            {data.bids.length === 0 && <Text className={textColor}>No submitted bids yet.</Text>}
        </div>
    );

    const renderJobSearch = () => (
        <div className="space-y-4">
            {data.jobs.map((job: any) => (
                <Card key={job._id} className={isDark ? "bg-slate-800 border-slate-700" : ""}>
                    <div className="flex justify-between">
                        <div>
                            <Title level={5} className={textColor}>{job.title}</Title>
                            <Text type="secondary">{job.category}</Text>
                        </div>
                        <Button type="primary" onClick={() => { setSelectedJob(job); setIsModalVisible(true); }}>Submit Bid</Button>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        Budget: ₹{job.budget_range?.min} - ₹{job.budget_range?.max}
                    </div>
                </Card>
            ))}
            {data.jobs.length === 0 && <Text className={textColor}>No jobs available currently.</Text>}
        </div>
    );


    const items = [
        { key: '1', label: 'Active Orders', children: renderActiveOrders() },
        { key: '2', label: 'My Bids', children: renderBids() },
        { key: '3', label: 'Find Jobs', children: renderJobSearch() },
        { key: '4', label: 'Order History', children: <Text className={textColor}>History List Here</Text> },
    ];

    if (loading) return <div className="flex justify-center py-20"><Spin size="large" /></div>;

    return (
        <div className={`min-h-screen py-8 px-4 md:px-10 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
            <Title level={2} className={`mb-8 ${textColor}`}>Provider Dashboard</Title>

            <Row gutter={[16, 16]} className="mb-8">
                <Col xs={24} sm={12}>
                    <Card className={isDark ? "bg-slate-800 border-slate-700 text-white" : ""}>
                        <Statistic
                            title={<span className={isDark ? "text-gray-300" : ""}>Total Earnings</span>}
                            value={data.analytics.totalEarnings}
                            prefix="₹"
                            valueStyle={{ color: isDark ? '#fff' : '#000' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12}>
                    <Card className={isDark ? "bg-slate-800 border-slate-700" : ""}>
                        <Statistic
                            title={<span className={isDark ? "text-gray-300" : ""}>Completed Jobs</span>}
                            value={data.analytics.completedJobs}
                            valueStyle={{ color: isDark ? '#fff' : '#000' }}
                        />
                    </Card>
                </Col>
            </Row>

            <div className={`p-6 rounded-xl shadow-sm ${isDark ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
                <Tabs defaultActiveKey="1" items={items} />
                {selectedJob && (
                    <BidSubmissionModal
                        job={selectedJob}
                        isVisible={isModalVisible}
                        onClose={() => { setIsModalVisible(false); setSelectedJob(null); }}
                        onSuccess={fetchData}
                    />
                )}
            </div>
        </div>
    );
};

export default ProviderDashboard;
