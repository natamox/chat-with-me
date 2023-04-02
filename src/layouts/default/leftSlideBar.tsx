import { LogoutOutlined, UserOutlined, VideoCameraAddOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { ROUTES } from '@constants';
import styled from '@emotion/styled';
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

  const menuItems: ItemType[] = [
    {
      key: ROUTES.Room,
      label: '房间',
      onClick: onNavigate,
      icon: <VideoCameraAddOutlined />,
    },
    {
      key: ROUTES.Math,
      label: '匹配',
      onClick: onNavigate,
      icon: <VideoCameraOutlined />,
    },
  ];

  const userItems: ItemType[] = [
    {
      key: 'uer',
      label: '用户',
      icon: <UserOutlined />,
    },
    {
      key: 'out',
      label: '登出',
      icon: <LogoutOutlined />,
    },
  ];

  return (
    <StyledContainer>
      <StyledMenu items={menuItems} selectedKeys={[activeKey]} />
      <StyledUserMenu items={userItems} selectedKeys={[]} />
    </StyledContainer>
  );
}

const StyledContainer = styled.div`
  display: flex;
  width: 320px;
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
