import React from "react";
import styled from "styled-components";
import {mediumGray, darkGray, backgroundDarkGrey} from "../../styles/Colors";
import {SingleUser, MultiUser} from "../icons/UserIcons";

const ChatListContainer = styled.div`
  width: 25%;
  height: 100%;
  border: 1px solid ${mediumGray};
  overflow-y: auto;
  background: ${backgroundDarkGrey};
`;

const ChatNameContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 14px;
  height: 80px;
  padding: 30px;
  background: ${(props) =>
    props.selected ? `${darkGray}` : `${backgroundDarkGrey}`};

  svg {
    width: 30px;
    margin-right: 15px;
    flex-shrink: none;
  }

  span {
    margin-right: 5px;
  }

  @media (max-width: 615px) {
    padding: 30px 20px;
  }

  @media (max-width: 425px) {
    font-size: 12px;
  }
`;

const ChatNames = ({chat, chosenChat, updateChosenChat, selfMemberId}) => {
  const chatMembers = chat.members.filter(
    (member) => member.memberId !== selfMemberId
  );

  return (
    <ChatNameContainer
      onClick={() => updateChosenChat(chat.chatId)}
      selected={chat.chatId === chosenChat ? true : false}
    >
      {chatMembers.length > 1 ? <MultiUser /> : <SingleUser />}

      {chatMembers.map((member, i) => {
        if (i === chatMembers.length - 1) {
          return <span key={i}>{member.username}</span>;
        } else {
          return <span key={i}>{member.username},</span>;
        }
      })}
    </ChatNameContainer>
  );
};

const ChatList = ({chats, chosenChat, updateChosenChat, selfMemberId}) => {
  const sortedChats = [...chats].sort((a, b) => {
    if (a.lastMessage === null) return;
    return b.lastMessage - a.lastMessage;
  }); //most recent chats at top

  return (
    <ChatListContainer>
      {sortedChats.map((chat, i) => {
        return (
          <ChatNames
            chat={chat}
            chosenChat={chosenChat}
            updateChosenChat={updateChosenChat}
            selfMemberId={selfMemberId}
            key={i}
          />
        );
      })}
    </ChatListContainer>
  );
};

export default ChatList;
