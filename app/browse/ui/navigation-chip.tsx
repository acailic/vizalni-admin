import { ReactNode, useEffect, useState } from "react";
import { styled, keyframes } from "@mui/material";

import { Flex } from "@/components/flex";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const StyledFlex = styled(Flex)(({ theme }) => ({
  boxShadow: theme.shadows[1],
  transition: "background-color 0.2s ease",
  "&.pulse": {
    animation: `${pulse} 0.5s ease-in-out`,
  },
}));

export const NavigationChip = ({
  children,
  backgroundColor,
}: {
  children: ReactNode;
  backgroundColor: string;
}) => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    setIsPulsing(true);
    const timer = setTimeout(() => setIsPulsing(false), 500);
    return () => clearTimeout(timer);
  }, [children]);

  return (
    <StyledFlex
      className={isPulsing ? "pulse" : ""}
      data-testid="navChip"
      justifyContent="center"
      alignItems="center"
      minWidth={36}
      height={28}
      borderRadius={14}
      typography="caption"
      bgcolor={backgroundColor}
      sx={{ color: "white", fontWeight: 600 }}
      aria-label={`Count: ${children}`}
    >
      {children}
    </StyledFlex>
  );
};
