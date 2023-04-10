import { INPUT_RULES } from '@constants';
import { ERoomType as RoomType } from '@pages/room/models';
import { ERoomType } from '@model';
import { createRoom, IRoomParams } from '@pages/room/services';
import { Form, Input, Modal } from 'antd';
import React, { useState } from 'react';

interface IProps {
  visible: boolean;
  type: RoomType;
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
        if (type === RoomType.Create) {
          setLoading(true);
          createRoom({ ...formData, type: ERoomType.Chat })
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
        {type === RoomType.Create && (
          <Form.Item name="roomName" label="房间名" rules={INPUT_RULES.required().rules}>
            <Input placeholder={INPUT_RULES.required().placeholder} />
          </Form.Item>
        )}
        {type === RoomType.Join && (
          <Form.Item
            name="roomId"
            label="房间号"
            rules={[
              { required: true, message: '房间号必填！' },
              { pattern: /^\d{7}$/, message: '请确认房间号格式正确！' },
            ]}
          >
            <Input placeholder="房间号由七位数字组成！" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
