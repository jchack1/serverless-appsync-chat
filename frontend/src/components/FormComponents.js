import styled from "styled-components";

const backgroundGray = "#262626";
const messageBoxGray = "#383838";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  margin-top: 50px;
  width: 80vw;
  max-width: 600px;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-weight: 400;
  margin-bottom: 5px;
`;
const Input = styled.input`
  margin-bottom: 20px;
  padding: 8px 15px;
  border-radius: 4px;
  outline: none;
  color: white;
  background-color: ${messageBoxGray};
  border: 1px solid ${messageBoxGray};
  font-size: 0.8rem;

  &:focus {
    outline: 2px solid blue;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export {FormContainer, Input, Label, InputContainer};
