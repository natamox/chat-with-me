import { ERoomType, IRoom } from '@model';
import { $http } from '@utils';

export interface IRoomParams {
  roomName: string;
  roomId: string;
  type: ERoomType;
}
export const createRoom = async ({ roomName, type }: IRoomParams) => {
  const res = await $http.post<IResponse<{ roomId: string }>>('room', { roomName, type });
  return res.data.data.roomId;
};

export const getRoom = async (roomId: string) => {
  const res = await $http.get<IResponse<IRoom>>('room', { params: { roomId } });
  return res.data.data;
};

export const getRoomList = async () => {
  const res = await $http.get<IResponseList<Pick<IRoom, 'roomId' | 'roomName' | 'users' | 'type'>>>('room/list');
  return res.data.data.items;
};

export const match = async () => {
  const res = await $http.get<IResponse<{ roomId: string | null }>>('room/match');
  return res.data.data;
};
