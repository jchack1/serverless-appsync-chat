import styled from "styled-components";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  width: 80vw;
  max-width: 600px;
`;

const Label = styled.label`
  margin-bottom: 10px;
`;
const Input = styled.input`
  margin-bottom: 20px;
`;

export {FormContainer, Input, Label};
