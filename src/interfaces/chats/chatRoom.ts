import { RoomType } from "@/ts/enums/chat";
import { Maybe } from "graphql/jsutils/Maybe";
import { ComputedRef } from "vue";

export type chatRoom = {
  roomId: any;
  roomName: any;
  avatar: ComputedRef<Maybe<string> | undefined>;
  status: any;
  lastMessage: string;
  lastTime: string;
  type: RoomType;
  userId: number;
  symbols: string;
  participantId: number;
  unread: number;
  key: string;
};
