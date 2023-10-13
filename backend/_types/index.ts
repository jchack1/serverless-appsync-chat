type MemberId = string;
type TimeStamp = number;
type ChatId = string;
type MessageId = string;

//get all messages in a chat by querying chat id, sort by date, get about 20 per page
export type Message = {
  chatId: ChatId; //PK
  createdAt: TimeStamp; //SK
  messageId: MessageId; //GSI1: unique id in case we need to update or remove the message
  author: MemberId;
  content: string;
};

export type ChatMember = {
  memberId: MemberId; //PK, can use to get all chats for a member
  lastMessage: TimeStamp; //sort chats by activity
  chatId: ChatId; //GSI1, can use to get all members in a chat
  displayName: string; //member's chosen display name
};

export type AddToExistingChatInput = {
  memberId: MemberId; //PK, can use to get all chats for a member
  chatId: ChatId; //GSI1, can use to get all members in a chat
  displayName: string; //member's chosen display name
};

export type AddMembersToNewChatInput = {
  memberId: MemberId; //PK, can use to get all chats for a member
  displayName: string; //member's chosen display name
};

export type RemoveChatMemberInput = {
  memberId: MemberId;
  chatId: ChatId;
};

type Member = {
  memberId: MemberId;
  displayName: string;
};

//returns all chat members in a chat via display names, as well as the timestamp of the last message
export type MemberChat = {
  chatId: ChatId;
  members: Member[];
  lastMessage: TimeStamp;
};

export type GetMessagesInput = {
  chatId: ChatId;
  lastMessageKey: string | null; // we only get 10 messages at a time, so if we already retrieved some messages, need to know where we left off last time
};
