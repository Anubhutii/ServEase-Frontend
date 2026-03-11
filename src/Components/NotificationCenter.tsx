import React, { useState, useEffect } from 'react';
import { Popover, Badge, Button, List, Typography, Spin } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import axios from '../Services/axios';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import { useRole } from '../Context/RoleContext';

const { Text } = Typography;

const NotificationCenter: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { user, isLoggedIn } = useAuth();
    const { activeRole } = useRole();
    const { theme } = useTheme();

    const isDark = theme === 'dark';

    const fetchNotifications = async () => {
        if (!isLoggedIn) return;
        setLoading(true);
        try {
            const model = activeRole === 'user' ? 'User' : 'ServiceProvider';
            const id = user?.id || user?._id;
            const res = await axios.get(`/api/notifications?userId=${id}&userType=${model}`);
            setNotifications(res.data.notifications || []);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Polling
        return () => clearInterval(interval);
    }, [isLoggedIn, activeRole]);

    const markAsRead = async (id: string) => {
        try {
            await axios.put(`/api/notifications/${id}/read`);
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const content = (
        <div className={`w-80 max-h-96 overflow-y-auto ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            {loading && notifications.length === 0 ? (
                <div className="flex justify-center p-4"><Spin /></div>
            ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No new notifications</div>
            ) : (
                <List
                    dataSource={notifications}
                    renderItem={(item) => (
                        <List.Item
                            className={`p-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 ${!item.isRead ? (isDark ? 'bg-slate-800' : 'bg-blue-50') : ''}`}
                            onClick={() => {
                                if (!item.isRead) markAsRead(item._id);
                            }}
                        >
                            <div>
                                <Text strong className={isDark ? 'text-white' : ''}>{item.type}</Text>
                                <p className={`text-sm mb-0 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.message}</p>
                            </div>
                        </List.Item>
                    )}
                />
            )}
        </div>
    );

    return (
        <Popover
            content={content}
            title={<span className={isDark ? "text-white" : ""}>Notifications</span>}
            trigger="click"
            open={visible}
            onOpenChange={setVisible}
            placement="bottomRight"
            color={isDark ? '#1e293b' : '#fff'}
        >
            <Badge count={unreadCount} size="small">
                <Button
                    type="text"
                    icon={<BellOutlined className={isDark ? "text-gray-200" : "text-gray-600"} style={{ fontSize: '20px' }} />}
                />
            </Badge>
        </Popover>
    );
};

export default NotificationCenter;
