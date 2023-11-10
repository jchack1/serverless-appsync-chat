import styled from "styled-components";

const Button = styled.button`
  color: white;
  background-color: blue;
  border: none;
  padding: 14px 40px 14px 40px;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 20px;
  font-size: 1rem;

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 600px) {
    align-self: center;
  }
`;

export default Button;
