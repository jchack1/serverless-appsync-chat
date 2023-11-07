import React, {useState, useRef, useEffect} from "react";
import styled from "styled-components";
import {getAllChatMessages} from "./graphql";
import {API, graphqlOperation} from "aws-amplify";

const blue = "#1a54f3";
const lightBlue = "#f5f6fc";

// components and styling

const containerStyles = {
  display: "flex",
  flexDirection: "column",
  border: `1px solid ${lightBlue}`,
  padding: "8%",
  overflowY: "auto",
  fontSize: "12px",
  fontFamily: "Lato, sans-serif",
  background: `${lightBlue}`,
  height: "100%",
};

const MessageContainer = styled.div`
  border: 1px solid ${lightBlue};
  font-size: 12px;
  font-family: "Lato", sans-serif;
  background: ${lightBlue};
  position: relative;
  display: flex;
  flex-direction: column;
  height: 80%;
`;

const NewMessageNotifcation = styled.div`
  color: blue;
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
  background: ${(props) => (props.self ? "#dce1f7" : "#fff")};
  padding: 15px;
  border-radius: ${(props) =>
    props.self ? "10px 10px 0 10px" : "10px 10px 10px 0"};
`;

const Author = styled.p`
  margin: 0 0 5px 0;
  font-family: "Lato", sans-serif;

  font-size: 14px;
  font-weight: 600px;
`;

const DateTime = styled.div`
  margin: 0 0 10px 0;
  font-family: "Lato", sans-serif;

  font-size: 10px;
  font-weight: 300;
`;

const Content = styled.div`
  margin: 0 0 10px 0;
  font-family: "Lato", sans-serif;

  font-size: 12px;
  max-width: 60ch;
`;

const LoadMoreMessagesContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  svg {
    width: 20px;
  }
`;

const LoadMoreSVG = () => {
  return (
    <svg
      aria-hidden="true"
      fill={"none"}
      stroke={blue}
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 9.75v6.75m0 0l-3-3m3 3l3-3m-8.25 6a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const NewMessageSVG = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke={blue}
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
      />
    </svg>
  );
};

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

    const sortedOlderMessages =
      olderMessages.data.getAllChatMessages.messages.sort((a, b) => {
        return Number(a.createdAt) - Number(b.createdAt);
      });

    updateSortedMessages([...sortedOlderMessages, ...sortedMessages]);
    updateLastMessageKey(olderMessages.data.getAllChatMessages.lastMessageKey);
    updateLoadingOlderMessages(false);
  };

  useEffect(() => {
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
              <div style={{width: "20px"}}>Loading...</div>
            ) : (
              <>
                {" "}
                <LoadMoreSVG />
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
            return (
              <SingleMessageContainer
                key={i}
                self={selfMemberId === message.author}
              >
                <Author>{memberMap[message.author]}</Author>
                {/* <DateTime>{formatTimestamp(message.createdAt)}</DateTime> */}
                <Content>{message.content}</Content>
              </SingleMessageContainer>
            );
          })
        ) : (
          <div style={{width: "20px"}}>Loading...</div>
        )}

        {/* to track if user scrolled to bottom of container */}
        <div ref={bottomRef}></div>
      </div>

      {displayNewMessageNotification && (
        <NewMessageNotifcation
          onClick={() => scrollToBottom(bottomRef, isScrolledToBottom, true)}
        >
          <NewMessageSVG />
          new message
        </NewMessageNotifcation>
      )}
    </MessageContainer>
  );
};

export default MessageViewport;
