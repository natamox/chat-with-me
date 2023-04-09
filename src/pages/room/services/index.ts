import { $http } from '@utils';

export interface IRoomParams {
  roomName: string;
  roomId: string;
}
export const createRoom = async ({ roomName }: IRoomParams) => {
  const res = await $http.post<IResponse<{ roomId: string }>>('room', { roomName });
  return res.data.data.roomId;
};

export const findRoom = async (roomId: string) => {
  const res = await $http.get<IResponse<boolean>>('room', { params: { roomId } });
  return res.data.data;
};
