import React, {useEffect, useState} from "react";
// import {useQuery, gql} from "@apollo/client";
import styled from "styled-components";
import {API, graphqlOperation, Hub} from "aws-amplify";

import ChatList from "../components/ChatComponents/ChatList";
import MessageArea from "../components/ChatComponents/MessageArea";

import {
  getAllChatMessages,
  newMessageSubscription,
} from "../components/ChatComponents/graphql";
import {CONNECTION_STATE_CHANGE} from "@aws-amplify/pubsub";

const lightBlue = "#f5f6fc";
const mediumBlue = "#dce1f7";

const getMembersChats = `query getMembersChats(
  $memberId: String
) {
  getMembersChats(memberId: $memberId) {
    chatId
    members {
      memberId
      username
    }
    lastMessage
  }
}
`;

const NoChats = styled.div`
  border: 1px solid ${mediumBlue};
  background: ${lightBlue};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Lato", sans-serif;
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

  // Hub.listen("api", (data) => {
  //   const {payload} = data;
  //   if (payload.event === CONNECTION_STATE_CHANGE) {
  //     const connectionState = payload.data.connectionState;
  //     console.log(connectionState);
  //   }
  // });

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
    return <div>loading</div>;
  }

  if (graphqlError) {
    return <div>there was an error</div>;
  }
  console.log(`chats: ${chats}`);

  return (
    <div>
      <h1>Chats Home</h1>
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
    </div>
  );
};

export default ChatHome;
