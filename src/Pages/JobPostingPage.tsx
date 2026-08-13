import React, { useState } from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from '../Services/axios';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';

const { TextArea } = Input;
const { Option } = Select;

const JobPostingPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    const isDark = theme === "dark";

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const payload = {
                title: values.title,
                description: values.description,
                category: values.category,
                location: {
                    type: "Point",
                    coordinates: [values.longitude || 0, values.latitude || 0],
                    address: values.address
                },
                budget_range: {
                    min: values.minBudget,
                    max: values.maxBudget,
                },
                deadline: values.deadline,
                phone: values.phone,
            };

            await axios.post('/api/jobs', payload, { headers: { Authorization: `Bearer ${token}` } });
            message.success('Job posted successfully!');
            navigate('/user-dashboard'); // Navigate to user dashboard
        } catch (error: any) {
            console.error(error);
            message.error(error.response?.data?.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen py-10 px-4 flex justify-center ${isDark ? "bg-slate-900" : "bg-gray-50"}`}>
            <Card
                className={`w-full max-w-2xl shadow-xl ${isDark ? "bg-slate-800 border-slate-700" : "bg-white"}`}
            >
                <h2 className={`text-2xl font-bold mb-6 text-center ${isDark ? "text-white" : "text-gray-800"}`}>Post a Request</h2>

                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ category: 'Plumber' }}
                >
                    <Form.Item
                        label={<span className={isDark ? "text-gray-200" : ""}>Job Title</span>}
                        name="title"
                        rules={[{ required: true, message: 'Please enter a title' }]}
                    >
                        <Input size="large" placeholder="E.g., Need a plumber for pipe leakage" />
                    </Form.Item>

                    <Form.Item
                        label={<span className={isDark ? "text-gray-200" : ""}>Category</span>}
                        name="category"
                        rules={[{ required: true, message: 'Please select a category' }]}
                    >
                        <Select size="large">
                            <Option value="Plumber">Plumber</Option>
                            <Option value="Electrician">Electrician</Option>
                            <Option value="Carpenter">Carpenter</Option>
                            <Option value="Cleaning">Cleaning</Option>
                            <Option value="AC Repair">AC Repair</Option>
                            <Option value="Other">Other</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label={<span className={isDark ? "text-gray-200" : ""}>Description</span>}
                        name="description"
                        rules={[{ required: true, message: 'Please provide detailed description' }]}
                    >
                        <TextArea rows={4} placeholder="Describe the work required in detail..." />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label={<span className={isDark ? "text-gray-200" : ""}>Min Budget (₹)</span>}
                            name="minBudget"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <InputNumber size="large" className="w-full" min={0} />
                        </Form.Item>

                        <Form.Item
                            label={<span className={isDark ? "text-gray-200" : ""}>Max Budget (₹)</span>}
                            name="maxBudget"
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <InputNumber size="large" className="w-full" min={0} />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label={<span className={isDark ? "text-gray-200" : ""}>Deadline</span>}
                        name="deadline"
                        rules={[{ required: true, message: 'Please set a deadline' }]}
                    >
                        <DatePicker size="large" className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label={<span className={isDark ? "text-gray-200" : ""}>Address</span>}
                        name="address"
                        rules={[{ required: true, message: 'Please provide an address' }]}
                    >
                        <Input size="large" placeholder="Street, City, Zip" />
                    </Form.Item>

                    <Form.Item
                        label={<span className={isDark ? "text-gray-200" : ""}>Mobile Number</span>}
                        name="phone"
                        rules={[{ required: true, message: 'Please provide your mobile number' }]}
                    >
                        <Input size="large" placeholder="E.g. 9876543210" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 border-none"
                            loading={loading}
                        >
                            Post Request
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default JobPostingPage;
