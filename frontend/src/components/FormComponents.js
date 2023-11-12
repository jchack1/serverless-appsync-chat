import styled from "styled-components";
import {mediumGray, lightRed, white, mediumBlue} from "../styles/Colors";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  margin-top: 20px;
  width: 80vw;
  max-width: 600px;
`;

const Label = styled.label`
  font-weight: 400;
  margin-bottom: 5px;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 8px 15px;
  border-radius: 4px;
  outline: none;
  color: ${white};
  background-color: ${mediumGray};
  border: 1px solid ${mediumGray};
  font-size: 0.8rem;

  &:focus {
    outline: 2px solid ${mediumBlue};
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  margin-top: 20vh;
`;

const ErrorMessage = styled.p`
  color: ${lightRed};
  align-self: center;
`;

export {FormContainer, Input, Label, InputContainer, PageWrapper, ErrorMessage};
