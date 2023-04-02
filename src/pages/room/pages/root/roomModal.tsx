import { INPUT_RULES } from '@constants';
import { ERoomType } from '@pages/room/models';
import { IRoomParams, createRoom } from '@pages/room/services';
import { Form, Input, Modal } from 'antd';
import React, { useState } from 'react';

interface IProps {
  visible: boolean;
  type: ERoomType;
  onCancel: () => void;
  onComplete: (id: ISafeAny) => void;
}
export function RoomModal({ visible, type, onCancel, onComplete }: IProps) {
  const [form] = Form.useForm<IRoomParams>();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = () => {
    form
      .validateFields()
      .then((formData) => {
        if (type === ERoomType.Create) {
          setLoading(true);
          createRoom(formData)
            .then(onComplete)
            .finally(() => setLoading(false));
        } else {
          onComplete(formData.roomId);
        }
      })
      .catch(console.error);
  };

  return (
    <Modal open={visible} onCancel={onCancel} onOk={onSubmit} afterClose={form.resetFields} confirmLoading={loading}>
      <Form autoComplete="off" form={form} labelCol={{ span: 4 }} style={{ marginTop: 32 }}>
        {type === ERoomType.Create && (
          <Form.Item name="roomName" label="房间名" rules={INPUT_RULES.required().rules}>
            <Input placeholder={INPUT_RULES.required().placeholder} />
          </Form.Item>
        )}
        {type === ERoomType.Join && (
          <Form.Item name="roomId" label="房间号" rules={INPUT_RULES.required().rules}>
            <Input placeholder={INPUT_RULES.required().placeholder} />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
