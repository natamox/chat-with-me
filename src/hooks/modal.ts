/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

export interface IModalProps<CompArgs extends any[] = [], ReqArgs extends any[] = []> {
  visible: boolean;
  loading: boolean;
  onCancel: () => void;
  onComplete: (...args: CompArgs) => void;
  onSubmit: (...args: ReqArgs) => void;
}

export interface IUseModalOptions<CompArgs extends any[], Submit extends (...args: any[]) => Promise<any>> {
  afterCancel?: () => void;
  afterComplete?: (...arg: CompArgs) => void;
  afterSubmit?: (res: Submit extends () => Promise<infer P> ? P : never) => void;
  request?: Submit;
}

export function useModal<
  // eslint-disable-next-line @typescript-eslint/ban-types
  ModalProps extends Partial<IModalProps<any[], any[]>> = {},
  Submit = ModalProps['onSubmit'] extends (...args: infer P) => void
    ? (...args: P) => Promise<any>
    : () => Promise<void>,
  CompArgs = ModalProps['onComplete'] extends (...args: infer P) => void ? P : [],
>(
  options?: IUseModalOptions<
    CompArgs extends any[] ? CompArgs : never,
    Submit extends (...args: any[]) => Promise<any> ? Submit : never
  >,
): [
  () => void,
  IModalProps<
    CompArgs extends any[] ? CompArgs : never,
    ModalProps['onSubmit'] extends (...args: infer P) => void ? P : []
  >,
] {
  const {
    afterCancel = () => {},
    afterComplete = () => {},
    afterSubmit = () => {},
    request = Promise.resolve,
  } = options || {};
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const open = () => {
    setVisible(true);
  };

  const onSubmit = async (...args: ISafeAny) => {
    setLoading(true);
    return request(...args)
      .then((res) => {
        setLoading(false);
        afterSubmit(res);
        return res;
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onComplete = (...args: ISafeAny) => {
    setVisible(false);
    afterComplete(...args);
  };

  const onCancel = () => {
    setVisible(false);
    afterCancel();
  };

  return [open, { visible, loading, onCancel, onComplete, onSubmit }];
}
