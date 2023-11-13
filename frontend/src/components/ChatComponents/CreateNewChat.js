import React, {useState, useEffect} from "react";
import styled from "styled-components";
import Spinner from "../icons/Spinner";
import {Input, ErrorMessage} from "../FormComponents";
import Button from "../Button";
import ExitIcon from "../icons/ExitIcon";
import {getMember, addNewChat} from "../../graphql";
import validateEmail from "../../utils/validateEmail";
import {API, graphqlOperation} from "aws-amplify";
import {backgroundDarkGrey, mediumGray} from "../../styles/Colors";

const Container = styled.div`
  display: flex;
  background: ${backgroundDarkGrey};
  border: 1px solid ${mediumGray};
  padding: 30px;
  position: relative;
  margin-bottom: 20px;
  align-items: center;

  @media (max-width: 540px) {
    flex-direction: column;
    padding: 30px;
  }
  @media (max-height: 1040px) and (max-width: 540px) {
    padding: 20px;
  }
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 315px;
  max-height: 150px;

  @media (max-width: 540px) {
    margin-bottom: ${(props) => (props.marginBottom ? "20px" : "0")};
  }
`;

const NewMemberContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  height: 55px;
  align-content: flex-start;
  overflow: auto;
`;
const Title = styled.label`
  font-weight: 500;
  margin-bottom: 20px;

  @media (max-width: 540px) {
    margin-bottom: 10px;
  }
`;

const NewMember = styled.div`
  font-size: 12px;
  margin: 0 15px 10px 0;
  align-self: flex-start;
`;

const errorStyles = {
  marginLeft: "10px",
  fontSize: "12px",
  alignSelf: "flex-start",
  maxWidth: "100px",
};

const CreateNewChat = ({chats, updateChats, updateShowCreateChat}) => {
  const [searchForMember, updateSearchForMember] = useState("");
  const [submitError, updateSubmitError] = useState("");
  const [loading, updateLoading] = useState(false);
  const [foundMember, updateFoundMember] = useState("");
  const [newChatMembers, updateNewChatMembers] = useState([]);

  const handleSearchMember = async () => {
    try {
      updateLoading(true);
      updateSubmitError("");
      updateFoundMember("");

      //validation
      if (!validateEmail(searchForMember)) {
        updateSubmitError(
          "Email address must be valid format, e.g. name@example.com"
        );
        updateLoading(false);

        return false;
      }

      const searchMember = await API.graphql(
        graphqlOperation(getMember, {
          email: searchForMember,
        })
      );

      if (searchMember.data.getMember.memberId === null) {
        updateFoundMember("not-found");
        updateLoading(false);
        return;
      }

      updateFoundMember({
        memberId: searchMember.data.getMember.memberId,
        username: searchMember.data.getMember.username,
      });
      updateLoading(false);
    } catch (e) {
      updateLoading(false);
      console.log(e);
      updateSubmitError("There was an error with this search");
    }
  };

  const handleAddNewChatMember = () => {
    updateNewChatMembers([...newChatMembers, foundMember]);
    updateFoundMember("");
  };

  const handleCreateChat = async () => {
    try {
      const addChat = await API.graphql(
        graphqlOperation(addNewChat, {
          input: {
            newMembers: newChatMembers,
          },
        })
      );
      console.log(addChat);

      //handle the new chat - pass to ChatList

      const data = addChat.data.addNewChat;

      updateChats([...chats, data]);
      updateShowCreateChat(false);
    } catch (e) {
      updateLoading(false);
      console.log(e);
      updateSubmitError("There was an error creating the chat");
    }
  };

  useEffect(() => {
    //add self to new chats when component loads
    updateNewChatMembers([
      {
        memberId: sessionStorage.getItem("memberId"),
        username: sessionStorage.getItem("username"),
      },
    ]);
  }, []);

  console.log(newChatMembers);

  return (
    <Container>
      <ColumnContainer marginBottom={true}>
        <div style={{display: "flex", alignItems: "center"}}>
          <Input
            type="text"
            id="search"
            value={searchForMember}
            onChange={(e) => updateSearchForMember(e.target.value)}
            placeholder="search friends by email..."
          />

          <div>
            {foundMember === "not-found" && (
              <ErrorMessage style={errorStyles}>not found</ErrorMessage>
            )}
            {submitError.length > 0 && (
              <ErrorMessage style={errorStyles}>{submitError}</ErrorMessage>
            )}
          </div>
        </div>
        {foundMember !== "" && foundMember !== "not-found" ? (
          <Button size="small" onClick={() => handleAddNewChatMember()}>
            Found - add to chat?
          </Button>
        ) : (
          <div style={{display: "flex"}}>
            <Button
              size="small"
              onClick={() => {
                handleSearchMember();
              }}
            >
              {loading ? <Spinner /> : "Search"}
            </Button>
          </div>
        )}
      </ColumnContainer>

      <ColumnContainer>
        <Title>New chat members</Title>
        <NewMemberContainer>
          {newChatMembers.length > 0 &&
            newChatMembers.map((member) => (
              <NewMember>{member.username}</NewMember>
            ))}
        </NewMemberContainer>

        <Button size="small" onClick={() => handleCreateChat()}>
          Create chat
        </Button>
      </ColumnContainer>
      <ExitIcon onClick={updateShowCreateChat} />
    </Container>
  );
};

export default CreateNewChat;
