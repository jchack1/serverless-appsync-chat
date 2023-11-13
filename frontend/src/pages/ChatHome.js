import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {Auth, API, graphqlOperation} from "aws-amplify";
import {useNavigate} from "react-router-dom";
import ChatList from "../components/ChatComponents/ChatList";
import MessageArea from "../components/ChatComponents/MessageArea";
import Spinner from "../components/icons/Spinner";
import {darkGray, mediumGray} from "../styles/Colors";

import {
  getAllChatMessages,
  newMessageSubscription,
  getMembersChats,
} from "../graphql";
import CreateNewChat from "../components/CreateNewChat";

const ChatHomeContainer = styled.div`
  max-width: 1000px;
  margin: 15vh auto;
  padding: 0 20px;
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

const Text = styled.p`
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
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
  const navigate = useNavigate();
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
        />
      ) : (
        <Text onClick={() => updateShowCreateChat(true)}>Add new chat?</Text>
      )}
      <div style={{display: "flex", height: "500px"}}>
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
      </div>
    </ChatHomeContainer>
  );
};

export default ChatHome;
