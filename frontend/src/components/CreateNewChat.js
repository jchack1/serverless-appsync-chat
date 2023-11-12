import React, {useState} from "react";
import styled from "styled-components";
import Spinner from "./Spinner";
import {Input, ErrorMessage} from "./FormComponents";
import Button from "./Button";
import {getMember} from "../graphql";
import validateEmail from "../utils/validateEmail";
import {API, graphqlOperation} from "aws-amplify";

const Container = styled.div`
  display: flex;

  @media (max-width: 475px) {
    flex-direction: column;
  }
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 275px;
  max-height: 150px;
`;

const NewMemberContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;
const Title = styled.label`
  font-weight: 500;
  margin-bottom: 20px;
`;

const NewMember = styled.p`
  font-size: 12px;
  margin: 5px 0;
`;

const errorStyles = {
  marginLeft: "10px",
  fontSize: "12px",
  alignSelf: "flex-start",
};

const CreateNewChat = () => {
  const [searchForMember, updateSearchForMember] = useState("");
  const [validationError, updateValidationError] = useState("");
  const [loading, updateLoading] = useState(false);
  const [foundMember, updateFoundMember] = useState("");
  const [newChatMembers, updateNewChatMembers] = useState([]);

  const handleSearchMember = async () => {
    try {
      updateLoading(true);
      updateValidationError("");
      updateFoundMember("");

      //validation
      if (!validateEmail(searchForMember)) {
        updateValidationError(
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

      console.log(searchMember.data);

      if (searchMember.data.getMember.memberId === null) {
        updateFoundMember("not-found");
        updateLoading(false);
        return;
      }

      updateFoundMember(searchMember.data.getMember);
      updateLoading(false);
    } catch (e) {
      updateLoading(false);
      console.log(e);
      updateValidationError("There was an error with this search");
    }
  };

  const handleAddNewChatMember = () => {
    updateNewChatMembers([...newChatMembers, foundMember]);
    updateFoundMember("");
  };

  return (
    <Container>
      <ColumnContainer>
        <Title htmlFor="search">Create new chat</Title>
        <div style={{display: "flex"}}>
          <Input
            type="text"
            id="search"
            value={searchForMember}
            onChange={(e) => updateSearchForMember(e.target.value)}
            placeholder="search by email..."
          />

          <div>
            {foundMember === "not-found" && (
              <ErrorMessage style={errorStyles}>not found</ErrorMessage>
            )}
            {validationError.length > 0 && (
              <ErrorMessage style={errorStyles}>{validationError}</ErrorMessage>
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
              {loading ? <Spinner /> : "Search for member"}
            </Button>
          </div>
        )}
      </ColumnContainer>

      {newChatMembers.length > 0 && (
        <ColumnContainer>
          <Title>New chat members</Title>
          <NewMemberContainer>
            {newChatMembers.map((member) => (
              <NewMember>{member.username}</NewMember>
            ))}
          </NewMemberContainer>
        </ColumnContainer>
      )}
    </Container>
  );
};

export default CreateNewChat;
