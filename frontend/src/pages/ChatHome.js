import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {API, graphqlOperation} from "aws-amplify";
import ChatList from "../components/ChatComponents/ChatList";
import MessageArea from "../components/ChatComponents/MessageArea";
import Spinner from "../components/icons/Spinner";
import Button from "../components/Button";
import {darkGray, mediumGray} from "../styles/Colors";

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

const ChatHome = () => {
  const [showCreateChat, updateShowCreateChat] = useState(false);
  const [messages, updateMessages] = useState(false);
  const [lastMessageKey, updateLastMessageKey] = useState(false);
  const [chosenChat, updateChosenChat] = useState("");
  const [memberMap, updateMemberMap] = useState({});
  const [chats, updateChats] = useState([]);
  const [newMessage, updateNewMessage] = useState({});
  const [loadingMessages, updateLoadingMessages] = useState(false);
  const [loading, updateLoading] = useState(true);
  const [graphqlError, updateGraphqlError] = useState(false);
  const memberId = sessionStorage.getItem("memberId");
  const selfMemberId = sessionStorage.getItem("memberId");

  const getChats = async () => {
    const memberChats = await API.graphql(
      graphqlOperation(getMembersChats, {
        memberId,
      })
    );

    if (memberChats.errors) updateGraphqlError(true);

    if (
      memberChats.data &&
      typeof memberChats.data !== "undefined" &&
      typeof memberChats.data.getMembersChats !== "undefined"
    ) {
      let obj = {};
      memberChats.data.getMembersChats.map((chat) => {
        chat.members.forEach((member) => {
          obj[member.memberId] = member.username;
        });
      });

      updateMemberMap(obj);
      updateChats(memberChats.data.getMembersChats);
      updateLoading(false);
    }
  };

  const getMessages = async (chatId, lastMessageKey) => {
    updateLoadingMessages(true);

    const messages = await API.graphql(
      graphqlOperation(getAllChatMessages, {
        chatId,
        lastMessageKey,
      })
    );

    updateMessages([...messages.data.getAllChatMessages.messages]);
    updateLastMessageKey(messages.data.getAllChatMessages.lastMessageKey);
    updateLoadingMessages(false);
  };

  let messageSubscription;

  const setupMessageSubscription = (chatId) => {
    messageSubscription = API.graphql(
      graphqlOperation(newMessageSubscription, {chatId})
    ).subscribe({
      next: ({provider, value}) => {
        updateNewMessage(value.data.newMessage);
      },
      error: (error) => console.warn(error),
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
