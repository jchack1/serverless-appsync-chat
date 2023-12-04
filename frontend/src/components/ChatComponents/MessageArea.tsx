import React, {useState} from "react";
import styled from "styled-components";
import {v4 as uuidv4} from "uuid";
import {addNewMessage} from "../../graphql";
import MessageViewport from "./MessageViewport";
import {API, graphqlOperation} from "aws-amplify";
import Spinner from "../icons/Spinner";
import {mediumGray, darkGray, mediumBlue, white} from "../../styles/Colors";
import {Message, MemberMap} from "../../types";

type MessageAreaProps = {
  messages: Message[] | boolean;
  updateMessages: React.Dispatch<React.SetStateAction<Message[] | boolean>>;
  memberMap: MemberMap;
  selfMemberId: string | null;
  chatId: string;
  lastMessageKey: string | null;
  updateLastMessageKey: React.Dispatch<React.SetStateAction<string | null>>;
  newMessage: Message[];
  loadingMessages: boolean;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  height: 900px;
  background: ${darkGray};
  border: 1px solid ${mediumGray};

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

const PreLoadContainer = styled(Container)`
  border: 1px solid ${mediumGray};
  font-size: 12px;
`;

const TextAreaContainer = styled.div`
  width: 92%;
  height: 20%;
  display: flex;
  border: 1px solid ${mediumGray};
  align-self: center;
  margin-bottom: 30px;
  border-radius: 10px;
  background: ${mediumGray};
`;

const TextInput = styled.textarea`
  width: 90%;
  font-size: 12px;
  border: none;
  resize: none;
  background: none;
  color: ${white};

  &:focus {
    outline: 1px solid ${mediumBlue};
  }
`;

const SendButton = styled.button`
  width: 60px;
  height: 100%;
  border: none;
  border-radius: 10px;
  background: none;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: 1px solid ${mediumBlue};
  }

  svg {
    width: 20px;
  }
`;

const TextArea = ({handleAddMessage}: any) => {
  const [text, updateText] = useState("");

  return (
    <TextAreaContainer>
      <TextInput
        value={text}
        onChange={(e) => updateText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            try {
              handleAddMessage(text, updateText);
            } catch (e) {
              console.log(e);
            }
          }
        }}
      />
      <SendButton
        type="submit"
        onClick={() => {
          try {
            handleAddMessage(text, updateText);
          } catch (e) {
            console.log(e);
          }
        }}
      >
        <svg
          aria-hidden="true"
          fill="none"
          stroke={mediumBlue}
          strokeWidth={1.5}
          transform="rotate(330)"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </SendButton>
    </TextAreaContainer>
  );
};

/**
 *
 * MAIN COMPONENT
 *
 */
const MessageArea = ({
  messages,
  updateMessages,
  memberMap,
  selfMemberId,
  chatId,
  lastMessageKey,
  updateLastMessageKey,
  newMessage,
  loadingMessages,
}: MessageAreaProps) => {
  const handleAddMessage = async (
    data: string,
    updateText: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const addMessage = await API.graphql(
      graphqlOperation(addNewMessage, {
        messageId: `message_${uuidv4()}`,
        author: selfMemberId,
        content: data,
        chatId: chatId,
      })
    );

    updateText("");

    return addMessage;
  };

  // states if chat hasn't been chosen yet or no messages in the chat
  if (messages === false || messages === undefined) {
    return (
      <PreLoadContainer>
        <p
          style={{display: "flex", justifyContent: "center", marginTop: "50px"}}
        >
          choose a chat to get started
        </p>
      </PreLoadContainer>
    );
  }

  if (loadingMessages) {
    return (
      <PreLoadContainer>
        <div
          style={{display: "flex", justifyContent: "center", margin: "auto"}}
        >
          <Spinner />
        </div>
      </PreLoadContainer>
    );
  }

  return (
    <Container>
      <MessageViewport
        messages={messages}
        memberMap={memberMap}
        selfMemberId={selfMemberId}
        chatId={chatId}
        lastMessageKey={lastMessageKey}
        updateLastMessageKey={updateLastMessageKey}
        newMessage={newMessage}
      />
      <TextArea handleAddMessage={handleAddMessage} />
    </Container>
  );
};

export default MessageArea;
