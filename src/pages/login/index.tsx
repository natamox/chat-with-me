import { Button, Form, Input } from 'antd';
import { FontSizeOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants';
import { useEffect, useState } from 'react';
import { authStore } from '@stores';
import { login, register } from './services';

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const authenticated = !!authStore.token;
  const [isLogin, setIsLogin] = useState(true);

  const onLogin = async ({ rtcUsername, rtcNickname, rtcPassword }: ISafeAny) => {
    try {
      if (isLogin) {
        await login({ username: rtcUsername, password: rtcPassword });
        return navigate(ROUTES.ROOM);
      }
      await register({ username: rtcUsername, password: rtcPassword, nickname: rtcNickname });
      setIsLogin(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authenticated && location.pathname === ROUTES.LOGIN) {
      navigate(ROUTES.ROOM);
    }
  }, [authenticated, location.pathname, navigate]);

  return (
    <StyledFormWrapper>
      <StyledFormContainer>
        <StyledFormTitle>{isLogin ? '登录' : '注册'}</StyledFormTitle>
        <Form onFinish={onLogin}>
          <Form.Item name="rtcUsername" rules={[{ required: true, message: '用户名必填' }]}>
            <Input placeholder="用户名" prefix={<UserOutlined />} />
          </Form.Item>
          {!isLogin && (
            <Form.Item name="rtcNickname" rules={[{ required: true, message: '昵称必填' }]}>
              <Input placeholder="昵称" prefix={<FontSizeOutlined />} />
            </Form.Item>
          )}
          <Form.Item name="rtcPassword" rules={[{ required: true, message: '密码必填' }]}>
            <Input.Password placeholder="密码" prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              {isLogin ? '登录' : '注册'}
            </Button>
          </Form.Item>
          <Button type="link" style={{ float: 'right' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? '去注册' : '去登录'}
          </Button>
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
