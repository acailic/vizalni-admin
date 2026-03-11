import { Box, Card, Typography } from "@mui/material";
import { ReactNode } from "react";

import { ContentWrapper } from "@/components/content-wrapper";
import { Flex } from "@/components/flex";
import { HomepageSectionTitle } from "@/homepage/generic";
import { Step1 } from "@/homepage/step1";
import { Step2 } from "@/homepage/step2";
import { Step3 } from "@/homepage/step3";

export const Tutorial = ({
  headline,
  step1,
  step2,
  step3,
}: {
  headline: string;
  step1: string;
  step2: string;
  step3: string;
}) => {
  const steps = [
    { illustration: <Step1 />, label: step1 },
    { illustration: <Step2 />, label: step2 },
    { illustration: <Step3 />, label: step3 },
  ];

  return (
    <Box sx={{ borderTop: "4px solid", borderColor: "primary.main" }}>
      <ContentWrapper
        sx={{
          py: { xs: 10, md: 14, lg: 18 },
          backgroundColor: "background.paper",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <HomepageSectionTitle>{headline}</HomepageSectionTitle>
          <Flex
            sx={(t) => ({
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: { xs: 4, md: 5 },
              width: "100%",
              [t.breakpoints.up("lg")]: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "stretch",
              },
            })}
          >
            {steps.map((step, index) => (
              <Card
                key={index}
                sx={{
                  flex: 1,
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 20px 44px rgba(15, 23, 42, 0.08)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 3,
                    py: 2,
                    bgcolor: "primary.main",
                    color: "white",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {String(index + 1).padStart(2, "0")}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
                  >
                    Workflow
                  </Typography>
                </Box>
                <Box sx={{ backgroundColor: "#F8FAFC" }}>
                  {step.illustration}
                </Box>
                <HomepageTutorialStep>{step.label}</HomepageTutorialStep>
              </Card>
            ))}
          </Flex>
        </Box>
      </ContentWrapper>
    </Box>
  );
};

const HomepageTutorialStep = ({ children }: { children: ReactNode }) => (
  <Typography
    variant="h3"
    component="p"
    sx={{ px: { xs: 4, md: 5 }, py: { xs: 4, md: 5 }, fontWeight: "bold" }}
  >
    {children}
  </Typography>
);
