import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {API, graphqlOperation} from "aws-amplify";
import {GraphQLResult} from "@aws-amplify/api";
import {Observable} from "zen-observable-ts";
import ChatList from "../components/ChatComponents/ChatList";
import MessageArea from "../components/ChatComponents/MessageArea";
import Spinner from "../components/icons/Spinner";
import Button from "../components/Button";
import {darkGray, mediumGray} from "../styles/Colors";
import {
  GetMemberChatsResult,
  GetMessagesResult,
  Message,
  MemberMap,
  MemberChat,
} from "../types";

import {
  getAllChatMessages,
  newMessageSubscription,
  getMembersChats,
} from "../graphql";
import CreateNewChat from "../components/ChatComponents/CreateNewChat";

const ChatHomeContainer = styled.div`
  max-width: 1500px;
  margin: 10vh auto;
  padding: 0 20px;

  @media (max-height: 1000px) or (max-width: 600px) {
    margin: 5vh auto;
  }

  @media (max-width: 500px) {
    padding: 0 10px;
  }
`;

const ListAndMessageContainer = styled.div`
  display: flex;
  height: 900px;
  margin-top: 20px;
  @media (max-height: 1200px) and (min-width: 600px) {
    height: 800px;
  }
  @media (max-height: 1100px) and (min-width: 600px) {
    height: 700px;
  }

  @media (max-height: 1100px) and (min-width: 600px) {
    height: 700px;
  }

  @media (max-height: 815px) and (min-width: 600px) {
    height: 550px;
  }
  @media (max-height: 1000px) and (max-width: 600px) {
    height: 750px;
  }
  @media (max-height: 875px) and (max-width: 400px) {
    height: 600px;
  }
  @media (max-height: 800px) and (max-width: 600px) {
    height: 600px;
  }

  @media (max-height: 700px) and (max-width: 600px) {
    height: 550px;
  }
`;

const LoadingContainer = styled.div`
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const NoChats = styled.div`
  border: 1px solid ${mediumGray};
  background: ${darkGray};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  height: 500px;
  width: 100%;
`;

//message data structure

// Message = {
//   chatId: ChatId; //PK
//   createdAt: TimeStamp; //SK
//   messageId: MessageId; //GSI1: unique id in case we need to update or remove the message
//   author: MemberId;
//   content: string;
// };

type NewMessageSubscriptionResult = GraphQLResult & {
  value: {
    data: {
      newMessage: Message;
    };
  };
  provider: string;
};

const ChatHome = () => {
  const [showCreateChat, updateShowCreateChat] = useState<boolean>(false);
  const [messages, updateMessages] = useState<boolean | Message[]>(false);
  const [lastMessageKey, updateLastMessageKey] = useState<string | null>(null);
  const [chosenChat, updateChosenChat] = useState<string>("");
  const [memberMap, updateMemberMap] = useState<MemberMap>({});
  const [chats, updateChats] = useState<MemberChat[]>([]);
  const [newMessage, updateNewMessage] = useState<Message[]>([]);
  const [loadingMessages, updateLoadingMessages] = useState<boolean>(false);
  const [loading, updateLoading] = useState<boolean>(true);
  const [graphqlError, updateGraphqlError] = useState<boolean>(false);

  const memberId: string | null = sessionStorage.getItem("memberId");
  const selfMemberId: string | null = sessionStorage.getItem("memberId");

  const getChats = async (): Promise<any> => {
    const getMemberChatsResult = (await API.graphql(
      graphqlOperation(getMembersChats, {
        memberId,
      })
    )) as GetMemberChatsResult;

    // const memberChats = await API.graphql(
    //   graphqlOperation(getMembersChats, {
    //     memberId,
    //   })
    // );

    if (getMemberChatsResult.errors) updateGraphqlError(true);

    if (
      getMemberChatsResult.data &&
      typeof getMemberChatsResult.data !== "undefined" &&
      typeof getMemberChatsResult.data.getMembersChats !== "undefined"
    ) {
      let obj: MemberMap = {};
      getMemberChatsResult.data.getMembersChats.map((chat) => {
        chat.members.forEach((member) => {
          obj[member.memberId] = member.username;
        });
      });

      updateMemberMap(obj);
      updateChats(getMemberChatsResult.data.getMembersChats);
      updateLoading(false);
    }
  };

  const getMessages = async (chatId: string, lastMessageKey: string | null) => {
    updateLoadingMessages(true);

    const GetMessagesResult = (await API.graphql(
      graphqlOperation(getAllChatMessages, {
        chatId,
        lastMessageKey,
      })
    )) as GetMessagesResult;

    updateMessages([...GetMessagesResult.data.getAllChatMessages.messages]);
    updateLastMessageKey(
      GetMessagesResult.data.getAllChatMessages.lastMessageKey
    );
    updateLoadingMessages(false);
  };

  let messageSubscription: any;

  // may have broken this, check
  const setupMessageSubscription = async (chatId: string) => {
    // messageSubscription = await API.graphql(
    //   graphqlOperation(newMessageSubscription, {chatId})
    // );
    // if ("subscribe" in messageSubscription) {
    //   messageSubscription.subscribe({
    //     next: ({provider, value}: NewMessageSubscriptionResult) => {
    //       updateNewMessage([value.data.newMessage]);
    //     },
    //     error: (error: any) => console.warn(error),
    //   });
    // }

    messageSubscription = await API.graphql(
      graphqlOperation(newMessageSubscription, {chatId})
    ).subscribe({
      next: ({provider, value}: NewMessageSubscriptionResult) => {
        updateNewMessage([value.data.newMessage]);
      },
      error: (error: any) => console.warn(error),
    });
  };

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    if (chosenChat.length > 0) {
      getMessages(chosenChat, null);
      setupMessageSubscription(chosenChat);

      return () => {
        messageSubscription.unsubscribe();
      };
    }
  }, [chosenChat]);

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  if (graphqlError) {
    console.log(graphqlError);
    return <ChatHomeContainer>there was an error</ChatHomeContainer>;
  }

  return (
    <ChatHomeContainer>
      {showCreateChat ? (
        <CreateNewChat
          chats={chats}
          updateChats={updateChats}
          updateShowCreateChat={updateShowCreateChat}
          memberMap={memberMap}
          updateMemberMap={updateMemberMap}
        />
      ) : (
        <Button size="small" onClick={() => updateShowCreateChat(true)}>
          Add new chat?
        </Button>
      )}
      <ListAndMessageContainer>
        {chats.length > 0 ? (
          <>
            <ChatList
              chats={chats}
              chosenChat={chosenChat}
              updateChosenChat={updateChosenChat}
              selfMemberId={selfMemberId}
            />

            <MessageArea
              messages={messages}
              updateMessages={updateMessages}
              memberMap={memberMap}
              selfMemberId={selfMemberId}
              chatId={chosenChat}
              lastMessageKey={lastMessageKey}
              updateLastMessageKey={updateLastMessageKey}
              newMessage={newMessage}
              loadingMessages={loadingMessages}
            />
          </>
        ) : (
          <NoChats>
            <p>you have not been assigned to any chats yet</p>
          </NoChats>
        )}
      </ListAndMessageContainer>
    </ChatHomeContainer>
  );
};

export default ChatHome;
