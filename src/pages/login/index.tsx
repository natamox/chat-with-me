import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants';
import { useEffect } from 'react';
import { authStore } from '@stores';
import { login } from './services';

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = !!authStore.token;

  const onLogin = ({ rtcUsername, rtcPassword }: ISafeAny) => {
    login({ username: rtcUsername, password: rtcPassword })
      .then(() => {
        navigate(ROUTES.Room);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (authenticated && location.pathname === ROUTES.Login) {
      navigate(ROUTES.Room);
    }
  }, [authenticated, location.pathname, navigate]);

  return (
    <StyledFormWrapper>
      <StyledFormContainer>
        <StyledFormTitle>Login</StyledFormTitle>
        <Form onFinish={onLogin}>
          <Form.Item name="rtcUsername" rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input placeholder="Username" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item name="rtcPassword" rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input.Password placeholder="Password" prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </StyledFormContainer>
    </StyledFormWrapper>
  );
}

const StyledFormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledFormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 40px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

const StyledFormTitle = styled.h2`
  text-align: center;
  margin-bottom: 30px;
`;
