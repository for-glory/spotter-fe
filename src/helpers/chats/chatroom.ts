import { ChatMessageTypeEnum } from "@/generated/graphql";
import { RoomType } from "@/ts/enums/chat";
import dayjs from "dayjs";
import { Message as MessageType } from "@/ts/types/chat";
import { v4 as uuidv4 } from "uuid";

const { first_name, last_name } = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const getVisibleMessage = (message: any, id: number) => {
  if (
    (message.type !== ChatMessageTypeEnum.OperationRequired &&
      !message?.operation_data?.visibleFor?.length) ||
    (message.type !== ChatMessageTypeEnum.OperationRequired &&
      message?.operation_data?.visibleFor?.length &&
      message?.operation_data?.visibleFor.find(
        (i: number) => Number(i) === Number(id)
      ))
  ) {
    return message;
  }
};

const mapChats = (chat: any, userId: any) => {
  const lastMsg: any = getVisibleMessage(chat.message, userId);

  return {
    roomId: chat?.id?.toString(),
    roomName: chat.participant.chat_name,
    avatar: chat.participant.avatar ? chat.participant.avatar : "",
    users: chat.participants,
    status: lastMsg?.type,
    lastMessage: lastMsg?.message,
    type: RoomType.Chat,
    userId,
    participantId: chat.participants.find(
      (participant: { user_id: number }) =>
        Number(participant.user_id) !== Number(userId)
    )?.user_id,
    locked: chat.locked,
    symbols: `${chat.participant.chat_name
      .split(" ")[0]
      .charAt(0)} ${chat.participant.chat_name.split(" ")[1].charAt(0)}`,
    unread: chat.unread[userId],
    operation_data: chat?.message?.operation_data
  };
};

export const mapRequests = (chats: any, id: string) => {
  return Object.values(chats).reduce((acc: any[], cur: any) => {
    acc.push({
      avatar: cur.participants?.filter(
        (i: { user_id: number }) => Number(i.user_id) === Number(id)
      )[0]?.avatar,
      status: cur.type,
      roomId: cur.id.toString(),
      roomName: cur.sender_name,
      lastMessage: {
        time: cur?.operation_data?.time,
        address: cur?.operation_data?.address,
      },
      type: RoomType.Chat,
      id: cur.id,
      trainingId: cur?.operation_data?.training_id,
      participantId: cur.participants.find(
        (participant: { user_id: number }) =>
          Number(participant.user_id) !== Number(id)
      )?.user_id,
      key: uuidv4(),
      operation_data: cur?.operation_data
    });
    return acc;
  }, []);
};

export const mapRequestMessages = (message: any) => {
  return [
    {
      content: message?.message,
      username: message.sender_name,
      date: dayjs(message.created_at).format("D MMM YYYY"),
      timestamp: dayjs(message.created_at).format("hh:mm a"),
      type: message.type,
      id: message.id,
      trainingId: message?.operation_data?.training_id,
    },
  ];
};

const mapMessages = (chat: any, userId: number) => {
  return Object.values(chat?.messages).reduce(
    (acc: MessageType[], cur: any) => {
      if (getVisibleMessage(cur, userId)) {
        acc.push({
          ...cur,
          parentId: cur?.parent_id,
          content: cur?.message,
          username: cur.sender_name,
          date: dayjs(cur.created_at).format("D MMM YYYY"),
          timestamp: dayjs(cur.created_at).format("hh:mm a"),
          type: cur.type,
          id: cur.id,
          isCurUserMessage:
            cur.sender_name === `${first_name} ${last_name}` &&
            (cur.type === ChatMessageTypeEnum.Message ||
              cur.type === ChatMessageTypeEnum.Attachment),
          trainingId: cur?.operation_data?.training_id,
          key: uuidv4(),
        });
      }
      return acc;
    },
    []
  );
};

export { mapChats, mapMessages };
