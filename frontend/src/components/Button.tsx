import styled from "styled-components";
import {mediumBlue} from "../styles/Colors";

type StyledButtonProps = {
  size?: string;
};

// link about styled component props for future reference:
//https://www.atatus.com/blog/guide-to-typescript-and-styled-components/

const ButtonElement = styled.button<StyledButtonProps>`
  color: white;
  background-color: ${mediumBlue};
  border: none;
  padding: ${(props: StyledButtonProps) =>
    props.size === "small" ? "8px 15px 8px 15px" : "14px 40px 14px 40px"};
  border-radius: 4px;
  width: ${(props: StyledButtonProps) =>
    props.size === "small" ? "max-content" : "100%"};
  min-width: 135px;
  margin-bottom: ${(props: StyledButtonProps) =>
    props.size === "small" ? "0px" : "20px"};
  font-size: ${(props: StyledButtonProps) =>
    props.size === "small" ? "12px" : "16px"};

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 600px) {
    align-self: ${(props: StyledButtonProps) =>
      props.size === "small" ? "flex-start" : "center"};
  }
`;

const Button = ({
  size,
  onClick,
  children,
}: {
  size?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: any;
}) => {
  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <ButtonElement size={size} onClick={handleButtonClick}>
      {children}
    </ButtonElement>
  );
};

export default Button;
