import React, {useState, useRef, useEffect} from "react";
import styled from "styled-components";
import {getAllChatMessages} from "../../graphql";
import {API, graphqlOperation} from "aws-amplify";
import Spinner from "../icons/Spinner";

import NewMessage from "../icons/NewMessage";
import LoadMore from "../icons/LoadMore";

import {darkGray, mediumBlue, darkBlue} from "../../styles/Colors";

// components and styling

const containerStyles = {
  display: "flex",
  flexDirection: "column",
  border: `1px solid ${darkGray}`,
  padding: "8%",
  overflowY: "auto",
  fontSize: "12px",
  background: `${darkGray}`,
  height: "100%",
};

const MessageContainer = styled.div`
  border: 1px solid ${darkGray};
  font-size: 12px;
  background: ${darkGray};
  position: relative;
  display: flex;
  flex-direction: column;
  height: 80%;
`;

const NewMessageNotifcation = styled.div`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: max-content;
  font-size: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-shadow: 2px 2px 7px #000000;

  svg {
    width: 20px;
    margin-right: 5px;
  }
`;

const SingleMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  align-self: ${(props) => (props.self ? "flex-end" : "flex-start")};
  max-width: 250px;
  background: ${(props) => (props.self ? `${mediumBlue}` : `${darkBlue}`)};
  padding: 15px;
  border-radius: ${(props) =>
    props.self ? "20px 20px 0 20px" : "20px 20px 20px 0"};
`;

const Author = styled.p`
  margin: 0 0 5px 0;

  font-size: 14px;
  font-weight: 600px;
`;

const DateTime = styled.div`
  margin: 0 0 10px 0;

  font-size: 10px;
  font-weight: 300;
`;

const Content = styled.div`
  margin: 0 0 10px 0;

  font-size: 12px;
  max-width: 60ch;
`;

const LoadMoreMessagesContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  cursor: pointer;
  width: max-content;
  align-self: center;
  svg {
    width: 20px;
  }
`;

//helper functions

const formatTimestamp = (timestamp) => {
  const dateObject = new Date(Number(timestamp));

  const formatted = new Intl.DateTimeFormat("en-CA", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObject);

  return formatted;
};

const scrollToBottom = (
  bottomRef,
  isScrolledToBottom,
  newMessageNotificationClicked
) => {
  if (isScrolledToBottom || newMessageNotificationClicked) {
    bottomRef.current.scrollIntoView({behavior: "smooth"});
  }
};

const checkIfScrolledToBottom = (containerRef, updateIsScrolledToBottom) => {
  const container = containerRef.current;
  const isAtBottom =
    container.scrollHeight - container.clientHeight <= container.scrollTop + 1;

  updateIsScrolledToBottom(isAtBottom);

  return isAtBottom;
};

const MessageViewport = ({
  messages,
  memberMap,
  selfMemberId,
  chatId,
  lastMessageKey,
  updateLastMessageKey,
  newMessage,
}) => {
  //loading state, bottom ref, sorting messages
  const [loadingOlderMessages, updateLoadingOlderMessages] = useState(false);
  const [sortedMessages, updateSortedMessages] = useState(false);
  const [isScrolledToBottom, updateIsScrolledToBottom] = useState(true);
  const [displayNewMessageNotification, updateDisplayNewMessageNotification] =
    useState(false);

  const bottomRef = useRef();
  const containerRef = useRef();

  const handleLoadOlderMessages = async () => {
    updateLoadingOlderMessages(true);
    const olderMessages = await API.graphql(
      graphqlOperation(getAllChatMessages, {
        chatId,
        lastMessageKey,
      })
    );

    olderMessages.data.getAllChatMessages.messages.forEach((msg) => {
      msg.createdAt = new Date(msg.createdAt).getTime();
    });

    const sortedOlderMessages =
      olderMessages.data.getAllChatMessages.messages.sort((a, b) => {
        return Number(a.createdAt) - Number(b.createdAt);
      });

    updateSortedMessages([...sortedOlderMessages, ...sortedMessages]);
    updateLastMessageKey(olderMessages.data.getAllChatMessages.lastMessageKey);
    updateLoadingOlderMessages(false);
  };

  useEffect(() => {
    messages.forEach((msg) => {
      msg.createdAt = new Date(msg.createdAt).getTime();
    });

    const sorted = messages.sort((a, b) => {
      return Number(a.createdAt) - Number(b.createdAt);
    });

    updateSortedMessages(sorted);
  }, []);

  useEffect(() => {
    scrollToBottom(bottomRef, isScrolledToBottom, false);
  }, [sortedMessages]);

  useEffect(() => {
    //only do this if we have a new message object, don't do anything if empty object on page load
    if (Object.keys(newMessage).length > 0 && newMessage.chatId === chatId) {
      //if user has scrolled up in the coversation, display a notification to let them know there is a new message
      const isAtBottom = checkIfScrolledToBottom(
        containerRef,
        updateIsScrolledToBottom
      );

      if (!isAtBottom) {
        updateDisplayNewMessageNotification(true);
      }
      //add newMessage to sortedMessages
      if (sortedMessages && Object.keys(newMessage).length > 0) {
        newMessage.createdAt = new Date(newMessage.createdAt).getTime();
        const updatedMessages = [...sortedMessages, newMessage];
        updateSortedMessages(updatedMessages);
      }
    }
  }, [newMessage]);

  useEffect(() => {
    if (displayNewMessageNotification === true && isScrolledToBottom === true) {
      updateDisplayNewMessageNotification(false);
    }
  }, [isScrolledToBottom]);

  if (messages.length === 0 && sortedMessages.length === 0) {
    return (
      <MessageContainer>
        <div ref={containerRef}>
          <p
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            start the conversation!
          </p>

          <div ref={bottomRef}></div>
        </div>
      </MessageContainer>
    );
  }

  return (
    //this outside div used to contain messages and new message notification

    <MessageContainer>
      {/* this div used to contain messages and "load more" functionality 
          ref couldn't be placed on styled component, so used regular html element with separate styling
      */}
      <div
        ref={containerRef}
        onScroll={() =>
          checkIfScrolledToBottom(containerRef, updateIsScrolledToBottom)
        }
        style={containerStyles}
      >
        {/* load more messages */}

        {lastMessageKey && (
          <LoadMoreMessagesContainer
            onClick={() => handleLoadOlderMessages(chatId, lastMessageKey)}
          >
            {loadingOlderMessages ? (
              <Spinner />
            ) : (
              <>
                {" "}
                <LoadMore />
                <p style={{marginLeft: "5px", fontSize: 10}}>
                  load older messages
                </p>
              </>
            )}
          </LoadMoreMessagesContainer>
        )}

        {/* display messages or loading icon*/}

        {sortedMessages !== false ? (
          sortedMessages.map((message, i) => {
            // console.dir(message);
            return (
              <SingleMessageContainer
                key={i}
                self={selfMemberId === message.author}
              >
                <Author>{memberMap[message.author]}</Author>
                <DateTime>{formatTimestamp(message.createdAt)}</DateTime>
                <Content>{message.content}</Content>
              </SingleMessageContainer>
            );
          })
        ) : (
          <Spinner />
        )}

        {/* to track if user scrolled to bottom of container */}
        <div ref={bottomRef}></div>
      </div>

      {displayNewMessageNotification && (
        <NewMessageNotifcation
          onClick={() => scrollToBottom(bottomRef, isScrolledToBottom, true)}
        >
          <NewMessage />
          new message
        </NewMessageNotifcation>
      )}
    </MessageContainer>
  );
};

export default MessageViewport;
