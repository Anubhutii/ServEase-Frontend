import React, { useEffect, useState } from 'react';
import { Tabs, Card, Typography, Spin, Tag, Button, List } from 'antd';
import axios from '../Services/axios';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const isDark = theme === "dark";

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        activeBookings: [],
        history: [],
        jobs: []
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const userId = user?.id || user?._id;

            const [activeRes, historyRes, jobsRes] = await Promise.all([
                axios.get(`/api/dashboard/user/active-bookings/${userId}`),
                axios.get(`/api/dashboard/user/orders/${userId}`),
                axios.get(`/api/dashboard/user/jobs/${userId}`)
            ]);

            setData({
                activeBookings: activeRes.data.bookings,
                history: historyRes.data.orders,
                jobs: jobsRes.data.jobs,
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
    const mutedText = isDark ? "text-gray-400" : "text-gray-500";
    const cardClass = isDark ? "bg-slate-800 border-slate-700" : "";

    const renderActiveBookings = () => (
        <List
            itemLayout="horizontal"
            dataSource={data.activeBookings}
            renderItem={(item: any) => (
                <Card className={`mb-4 w-full ${cardClass}`}>
                    <div className="flex justify-between">
                        <div>
                            <Title level={5} className={textColor}>{item.job?.title || "Direct Provider Booking"}</Title>
                            <Text className={mutedText}>{item.service_details}</Text>
                            <div className="mt-2 text-sm text-indigo-500 font-medium">Final Price: ₹{item.final_price}</div>
                        </div>
                        <Tag color="blue">{item.status}</Tag>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <Button size="small" type="primary" onClick={() => navigate(`/negotiation/${item._id}`)}>
                            Message Provider
                        </Button>
                        <Button size="small" danger>Cancel</Button>
                    </div>
                </Card>
            )}
            locale={{ emptyText: <Text className={textColor}>No active bookings.</Text> }}
        />
    );

    const renderMyJobs = () => (
        <List
            itemLayout="horizontal"
            dataSource={data.jobs}
            renderItem={(job: any) => (
                <Card className={`mb-4 w-full ${cardClass}`}>
                    <div className="flex justify-between">
                        <div>
                            <Title level={5} className={textColor}>{job.title}</Title>
                            <Text className={mutedText}>{job.category} • Budget: ₹{job.budget_range?.min} - ₹{job.budget_range?.max}</Text>
                        </div>
                        <Tag color={job.status === 'open' ? 'green' : 'default'}>{job.status}</Tag>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className={`font-semibold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                            {job.bidCount} Bids Received
                        </div>
                        <Button type="primary" onClick={() => navigate(`/jobs/${job._id}/bids`)}>
                            Review Bids
                        </Button>
                    </div>
                </Card>
            )}
            locale={{ emptyText: <Text className={textColor}>You haven't posted any jobs yet.</Text> }}
        />
    );

    const renderOrderHistory = () => (
        <List
            itemLayout="horizontal"
            dataSource={data.history}
            renderItem={(item: any) => (
                <Card className={`mb-4 w-full ${cardClass}`}>
                    <div className="flex justify-between">
                        <Text strong className={textColor}>{item.job?.title || "Service Booked"}</Text>
                        <Tag color={item.status === 'completed' ? 'success' : 'error'}>{item.status}</Tag>
                    </div>
                    <div className={`mt-2 ${mutedText}`}>Completed on: {new Date(item.completion_date || item.createdAt).toLocaleDateString()}</div>
                </Card>
            )}
            locale={{ emptyText: <Text className={textColor}>No order history.</Text> }}
        />
    );

    const items = [
        { key: '1', label: 'Active Bookings', children: renderActiveBookings() },
        { key: '2', label: 'My Posted Jobs', children: renderMyJobs() },
        { key: '3', label: 'Order History', children: renderOrderHistory() },
    ];

    if (loading) return <div className="flex justify-center py-20"><Spin size="large" /></div>;

    return (
        <div className={`min-h-screen py-8 px-4 md:px-10 ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
            <div className="flex justify-between items-center mb-8">
                <Title level={2} className={`mb-0 ${textColor}`}>User Dashboard</Title>
                <Button type="primary" size="large" className="bg-gradient-to-r from-purple-500 to-indigo-500 border-none" onClick={() => navigate('/post-job')}>
                    Post a New Job
                </Button>
            </div>

            <div className={`p-6 rounded-xl shadow-sm ${isDark ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </div>
    );
};

export default UserDashboard;
