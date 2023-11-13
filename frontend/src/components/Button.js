import styled from "styled-components";
import {mediumBlue} from "../styles/Colors";

const ButtonElement = styled.button`
  color: white;
  background-color: ${mediumBlue};
  border: none;
  padding: ${(props) =>
    props.size === "small" ? "8px 15px 8px 15px" : "14px 40px 14px 40px"};
  border-radius: 4px;
  width: ${(props) => (props.size === "small" ? "max-content" : "100%")};
  min-width: 135px;
  margin-bottom: ${(props) => (props.size === "small" ? "0px" : "20px")};
  font-size: ${(props) => (props.size === "small" ? "12px" : "16px")};

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 600px) {
    align-self: ${(props) =>
      props.size === "small" ? "flex-start" : "center"};
  }
`;

const Button = ({size, onClick, children}) => {
  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <ButtonElement size={size} onClick={handleButtonClick}>
      {children}
    </ButtonElement>
  );
};

export default Button;
