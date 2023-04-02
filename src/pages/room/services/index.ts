import { $http } from '@utils';

export interface ICreateRoomParams {
  roomName: string;
}
export const createRoom = async ({ roomName }: ICreateRoomParams) => {
  const res = await $http.post<IResponse<{ roomId: string }>>('room', { roomName });
  return res.data.data.roomId;
};
