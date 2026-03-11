import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, message } from 'antd';
import axios from '../Services/axios';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';

const { TextArea } = Input;

type BidSubmissionModalProps = {
    job: any;
    isVisible: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

const BidSubmissionModal: React.FC<BidSubmissionModalProps> = ({ job, isVisible, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { theme } = useTheme();
    const [form] = Form.useForm();

    const isDark = theme === "dark";

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                job: job._id,
                provider: user?.id || user?._id,
                proposed_price: values.proposed_price,
                estimated_timeline: values.estimated_timeline,
                proposal_description: values.proposal_description,
            };

            await axios.post('/api/bids', payload);
            message.success('Bid submitted successfully');
            form.resetFields();
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error("Bid submission error:", error);
            message.error(error.response?.data?.message || 'Failed to submit bid');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={<span className={isDark ? "text-white" : ""}>Submit Bid for {job?.title}</span>}
            open={isVisible}
            onCancel={onClose}
            footer={null}
            className={isDark ? "dark-modal" : ""}
            styles={{
                body: { backgroundColor: isDark ? '#1e293b' : '#fff' },
                header: { backgroundColor: isDark ? '#1e293b' : '#fff', borderBottom: isDark ? '1px solid #334155' : '1px solid #f0f0f0' },
            }}
            closeIcon={<span className={isDark ? "text-gray-400" : ""}>X</span>}
        >
            <div className={`mb-4 p-3 rounded-lg ${isDark ? 'bg-slate-800 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                <p><strong>Category:</strong> {job?.category}</p>
                <p><strong>Client Budget:</strong> ₹{job?.budget_range?.min} - ₹{job?.budget_range?.max}</p>
                <p><strong>Description:</strong> {job?.description}</p>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label={<span className={isDark ? "text-gray-300" : ""}>Proposed Price (₹)</span>}
                    name="proposed_price"
                    rules={[{ required: true, message: 'Please enter your proposed price' }]}
                >
                    <InputNumber size="large" className="w-full" min={1} />
                </Form.Item>

                <Form.Item
                    label={<span className={isDark ? "text-gray-300" : ""}>Estimated Timeline</span>}
                    name="estimated_timeline"
                    rules={[{ required: true, message: 'E.g., 3 days, 1 week...' }]}
                >
                    <Input size="large" placeholder="E.g., 2 days" />
                </Form.Item>

                <Form.Item
                    label={<span className={isDark ? "text-gray-300" : ""}>Proposal Description</span>}
                    name="proposal_description"
                    rules={[{ required: true, message: 'Please provide a proposal description' }]}
                >
                    <TextArea rows={4} placeholder="Explain why you're the best fit for this job..." />
                </Form.Item>

                <Form.Item className="mb-0 text-right">
                    <Button onClick={onClose} className="mr-2">Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={loading} className="bg-gradient-to-r from-blue-500 to-indigo-600 border-none">
                        Submit Bid
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BidSubmissionModal;
