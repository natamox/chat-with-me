import { INPUT_RULES } from '@constants';
import { ICreateRoomParams, createRoom } from '@pages/room/services';
import { Form, Input, Modal } from 'antd';
import React, { useState } from 'react';

interface IProps {
  visible: boolean;
  onCancel: () => void;
  onComplete: (id: ISafeAny) => void;
}
export function CreateRoomModal({ visible, onCancel, onComplete }: IProps) {
  const [form] = Form.useForm<ICreateRoomParams>();
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = () => {
    form
      .validateFields()
      .then((formData) => {
        setLoading(true);
        createRoom(formData)
          .then(onComplete)
          .finally(() => setLoading(false));
      })
      .catch(console.error);
  };

  return (
    <Modal open={visible} onCancel={onCancel} onOk={onSubmit} afterClose={form.resetFields} confirmLoading={loading}>
      <Form autoComplete="off" form={form} labelCol={{ span: 4 }} style={{ marginTop: 32 }}>
        <Form.Item name="roomName" label="房间名" rules={INPUT_RULES.required().rules}>
          <Input placeholder={INPUT_RULES.required().placeholder} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
