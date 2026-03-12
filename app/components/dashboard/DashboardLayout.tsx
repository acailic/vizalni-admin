import { Container, ContainerProps, Stack } from "@mui/material";

import { AppLayout } from "@/components/layout";

export const DashboardLayout = ({
  children,
  maxWidth = "lg",
}: ContainerProps) => {
  return (
    <AppLayout>
      <Container maxWidth={maxWidth} sx={{ py: 4 }}>
        <Stack spacing={3}>{children}</Stack>
      </Container>
    </AppLayout>
  );
};
