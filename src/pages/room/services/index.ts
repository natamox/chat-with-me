import { $http } from '@utils';

export interface IRoomParams {
  roomName: string;
  roomId: string;
}
export const createRoom = async ({ roomName }: IRoomParams) => {
  const res = await $http.post<IResponse<{ roomId: string }>>('room', { roomName });
  return res.data.data.roomId;
};
