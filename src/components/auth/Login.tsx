import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { LoginApi } from '../../services/authAPI';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const Login = () => {

    const { user } = useSelector((state: RootState) => state.auth)
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.internsDetails === undefined || user.internsDetails === "") {
                navigate("/fillUpForm");
            } else {
                navigate("/");
            }
        }
    }, [user, navigate])


    const handleSubmit = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await LoginApi(values);
            message.success('Login successful!');
            dispatch(setUser(response.user))
            if (response.user.internsDetails === "") {
                navigate("/fillUpForm");
            }
            else {
                navigate("/")
            }
        } catch (error) {
            message.error('Login failed! Please try again.');
            console.error('API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f5f5f5',
            }}
        >
            <Card style={{ width: 500, padding: 20 }}>
                <Form
                    name="loginForm"
                    style={{ maxWidth: 400 }}
                    onFinish={handleSubmit}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label="E-Mail"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="E-Mail"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Password"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%' }}
                            size="large"
                            loading={loading}
                        >
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
