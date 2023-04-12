import { INPUT_RULES } from '@constants';
import { ERoomType as RoomType } from '@pages/room/models';
import { ERoomType } from '@model';
import { createRoom, IRoomParams, match } from '@pages/room/services';
import { Alert, Button, Form, Input, message, Modal, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useInterval, useRequest, useTimeout } from 'ahooks';
import form from 'antd/es/form';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Loading } from '@components';

interface IProps {
  visible: boolean;
  onCancel: () => void;
}
export function MatchModal({ visible, onCancel }: IProps) {
  const navigate = useNavigate();
  const [timeCount, setTimeCount] = useState(60);
  const [timeGap, setTimeGap] = useState<number | undefined>(undefined);

  const { loading, run } = useRequest(match, {
    manual: true,
    onSuccess: (res) => {
      if (!res.roomId) return message.warning('匹配超时，匹配结束');
      navigate(`match/${res.roomId}`);
    },
  });

  const onSubmit = () => {
    run();
    setTimeGap(1000);
  };

  useInterval(() => {
    setTimeCount((cur) => {
      if (cur === 0) {
        setTimeGap(undefined);
        return 60;
      }
      return cur - 1;
    });
  }, timeGap);

  const description = (
    <>
      <p>开始匹配不可取消，一分钟后还未匹配到自动取消</p>
      <p style={{ color: 'red' }}>倒计时：{timeCount} S</p>
    </>
  );

  const footer = (
    <Space>
      <Button onClick={onCancel}>取消</Button>
      <Button onClick={onSubmit} type="primary">
        开始匹配
      </Button>
    </Space>
  );

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={onSubmit}
      closable={false}
      footer={loading ? null : footer}
      maskClosable={false}
    >
      <StyledAlert message="Warning" description={description} type="warning" showIcon />
      {loading && <Loading />}
    </Modal>
  );
}

const StyledAlert = styled(Alert)`
  margin: 24px;
`;
