import { LogoutOutlined, UserOutlined, VideoCameraAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { ROUTES } from '@constants';
import styled from '@emotion/styled';
import { authStore } from '@stores';
import { Menu } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { useLocation, useNavigate } from 'react-router-dom';

export function LeftSlideBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = location.pathname.match(/\/\w+/)?.at(0) ?? '';

  const onNavigate = ({ key }: { key: string }) => {
    navigate(key);
  };

  const onLogOut = () => {
    authStore.clear();
    onNavigate({ key: ROUTES.LOGIN });
  };

  const menuItems: ItemType[] = [
    {
      key: ROUTES.ROOM,
      label: '房间',
      onClick: onNavigate,
      icon: <VideoCameraAddOutlined />,
    },
  ];

  const userItems: ItemType[] = [
    // {
    //   key: ROUTES.USER,
    //   label: '用户',
    //   onClick: onNavigate,
    //   icon: <UserOutlined />,
    // },
    {
      key: ROUTES.LOGIN,
      label: '登出',
      onClick: onLogOut,
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <StyledContainer>
      <StyledMenu items={menuItems} selectedKeys={[activeKey]} />
      <StyledUserMenu items={userItems} selectedKeys={[activeKey]} />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  min-width: 200px;
  max-width: 240px;
  flex-direction: column;
`;

const StyledMenu = styled(Menu)`
  padding-top: 12px;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const StyledUserMenu = styled(Menu)`
  padding: 16px 0px;
  border-top: 1px solid #e9ecf2;
`;
