import React from "react";
import styled from "styled-components";

const blue = "#1a54f3";
const lightBlue = "#f5f6fc";
const mediumBlue = "#dce1f7";
const borderGray = "#383838";
const backgroundGray = "#262626";

const ChatListContainer = styled.div`
  width: 25%;
  height: 100%;
  border: 1px solid ${backgroundGray};
  overflow-y: auto;
`;

const ChatNameContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 14px;
  height: 80px;
  padding: 30px;
  background: ${(props) => (props.selected ? `${backgroundGray}` : "none")};

  svg {
    width: 30px;
    margin-right: 15px;
    flex-shrink: none;
  }

  span {
    margin-right: 5px;
  }

  @media (max-width: 615px) {
    svg {
      width: 20px;
    }
    padding: 30px 20px;
  }
`;

const SingleUserSVG = () => {
  return <i class="fa fa-user user-icon" aria-hidden="true"></i>;
};

const MultiUserSVG = () => {
  return <i class="fa fa-users user-icon" aria-hidden="true"></i>;
};

const HamburgerIcon = () => {
  return (
    <div style={{height: 20, width: 20, marginLeft: 10, transition: "1.2s"}}>
      <svg width="20px" height="14px" viewBox="0 0 20 14" version="1.1">
        <g
          id="Page-1"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            id="Artboard-Copy-54"
            transform="translate(-15.000000, -17.000000)"
            // fill={props.sideMenuOpen ? "white" : blue}
            fill={blue}
            fillRule="nonzero"
          >
            <g id="Group-12" transform="translate(15.000000, 17.000000)">
              <rect
                id="bar-1"
                style={
                  {
                    // transform: props.sideMenuOpen
                    //     ? 'rotate(45deg)'
                    //     : 'rotate(0deg)'
                  }
                }
                x="0"
                y="0"
                width="20"
                height="2"
              />
              <rect id="bar-2" x="0" y="6" width="20" height="2" />
              <rect id="bar-3" x="0" y="12" width="15" height="2" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

const ChatNames = ({chat, chosenChat, updateChosenChat, selfMemberId}) => {
  const chatMembers = chat.members.filter(
    (member) => member.memberId !== selfMemberId
  );

  return (
    <ChatNameContainer
      onClick={() => updateChosenChat(chat.chatId)}
      selected={chat.chatId === chosenChat ? true : false}
    >
      {chatMembers.length > 1 ? <MultiUserSVG /> : <SingleUserSVG />}

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
