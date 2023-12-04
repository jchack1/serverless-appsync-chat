type GetMemberQueryResult = {
  data: {
    getMember: {
      memberId: string;
      email: string;
      username: string;
    };
  };
  errors: any;
};

type SearchMemberResult = {
  data: {
    getMember: {
      memberId: string | null;
      email: string | null;
      username: string | null;
    };
  };
  errors: any;
};

type Member = {
  memberId: string;
  username: string;
};

type Message = {
  chatId: string;
  createdAt: string | number;
  messageId: string;
  author: string;
  content: string;
};

type MemberChat = {
  chatId: string;
  members: Member[];
  lastMessage: any; //haven't done any work yet with lastMessage, at some point it should be a number, but right now could be anything
};

type MemberMap = {
  [memberId: string]: string;
};

type GetMemberChatsResult = {
  data: {
    getMembersChats: MemberChat[];
  };
  errors: any;
};

type GetMessagesResult = {
  data: {
    getAllChatMessages: {
      messages: Message[];
      lastMessageKey: string | null;
    };
  };
  errors: any;
};

type AddChatResult = {
  data: {
    addNewChat: MemberChat;
  };
  errors: any;
};

export {
  GetMemberQueryResult,
  GetMemberChatsResult,
  GetMessagesResult,
  Message,
  Member,
  MemberChat,
  AddChatResult,
  MemberMap,
  SearchMemberResult,
};
