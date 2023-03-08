import { ChatMessageTypeEnum } from "@/generated/graphql";

export type Message = {
  content: string;
  timestamp: string;
  date: string;
  contentType?: ChatMessageTypeEnum;
  type: ChatMessageTypeEnum;
  isCurUserMessage?: boolean;
  id: number;
  trainingId?: number;
  username: string;
  parentId?: number;
  key: string;
};
