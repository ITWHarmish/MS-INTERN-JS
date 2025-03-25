import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { LoginApi } from '../../services/authAPI';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Cookies from 'js-cookie';
import toshalImg from "../../assets/toshal logo without bg.png";

const Login = () => {

    const { user } = useSelector((state: RootState) => state.auth)
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.admin) {
                navigate("/hrPolicy");
            }
            else if (user.internsDetails === undefined || user.internsDetails === "") {
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
            Cookies.set('ms_intern_jwt', response.token, { expires: 15 })
            dispatch(setUser(response.user))
            if (response.user.admin) {
                navigate("/hrPolicy");
            }
            if (response.user.internsDetails === "") {
                navigate("/fillUpForm");
            }
            else {
                navigate("/");
            }
        } catch (error) {
            message.error('Login failed! Please try again.');
            console.error('API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='container'>
            <div className="left-section">
                <img src={toshalImg} alt="" />
            </div>
                <Card style={{ 
                                width: 450, 
                                padding: "50px 30px", 
                                color: "white", 
                                border: "1px solid rgba(255, 255, 255, 0.386)", 
                                background: "rgba(0, 0, 0, 0.406)", 
                                backdropFilter: "blur(10px)", 
                                borderTopRightRadius: 30, 
                                borderBottomLeftRadius: 30,
                                borderTopLeftRadius: 0,
                                borderBottomRightRadius: 0,
                                textAlign: "center" 
                            }}>     
                    <Form
                        name="loginForm"
                        style={{ maxWidth: 500 }}
                        onFinish={handleSubmit}
                        autoComplete="off"
                        layout="vertical"
                    >
                        <Form.Item
                          
                          
                            label="E-MAIL"
                            name="email"
                            rules={[
                                { required: true, message: 'Please enter your email!' },
                                { type: 'email', message: 'Please enter a valid email!' },
                            ]}
                        >
                            <Input
                             style={{
                                color: "white",
                                borderBottomRightRadius: "12px",
                                borderTopLeftRadius: "12px",
                                borderTopRightRadius: "0px",
                                borderBottomLeftRadius: "0px",
                              }}
                                prefix={<UserOutlined />}
                                placeholder="E-MAIL"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="PASSWORD"
                            name="password"
                            rules={[{ required: true, message: 'Please enter your password!' }]}
                        >
                            <Input.Password
                             style={{
                                color: "white",
                                borderBottomRightRadius: "12px",
                                borderTopLeftRadius: "12px",
                                borderTopRightRadius: "0px",
                                borderBottomLeftRadius: "0px",
                              }}
                                prefix={<LockOutlined />}
                                placeholder="PASSWORD"
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
                                LOG IN
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
        </div>
    );
};

export default Login;
