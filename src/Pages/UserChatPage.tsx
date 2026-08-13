import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';
import UserChatbox from '../Components/UserChatbox';

const UserChatPage: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div className={`min-h-screen py-6 px-4 md:px-10 flex flex-col items-center ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
            {/* Back Button */}
            <div className="w-full max-w-2xl mb-4 text-left">
                <Button 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/user-dashboard')}
                    className="dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                >
                    Back to Dashboard
                </Button>
            </div>

            {/* Chatbox Rendered directly */}
            {bookingId && (
                <UserChatbox 
                    bookingId={bookingId} 
                    onClose={() => navigate('/user-dashboard')} 
                    isPage={true}
                />
            )}
        </div>
    );
};

export default UserChatPage;
