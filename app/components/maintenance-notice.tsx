import { t } from "@lingui/macro";
import { Alert, AlertTitle, Link } from "@mui/material";

import { ContentWrapper } from "@/components/content-wrapper";

const allowedSeverities = new Set(["error", "info", "success", "warning"]);

export const MaintenanceNotice = () => {
  const noticeMessage =
    process.env.NEXT_PUBLIC_MAINTENANCE_NOTICE?.trim() ?? "";
  const noticeTitle = process.env.NEXT_PUBLIC_MAINTENANCE_NOTICE_TITLE?.trim();
  const noticeHref = process.env.NEXT_PUBLIC_MAINTENANCE_NOTICE_HREF?.trim();
  const rawSeverity =
    process.env.NEXT_PUBLIC_MAINTENANCE_NOTICE_SEVERITY?.trim() ?? "info";
  const noticeSeverity = allowedSeverities.has(rawSeverity)
    ? (rawSeverity as "error" | "info" | "success" | "warning")
    : "info";

  if (!noticeMessage) {
    return null;
  }

  return (
    <ContentWrapper sx={{ py: 0 }}>
      <Alert
        severity={noticeSeverity}
        variant="filled"
        sx={{
          width: "100%",
          borderRadius: 0,
          alignItems: "center",
          "& .MuiAlert-message": {
            width: "100%",
          },
        }}
      >
        {noticeTitle ? <AlertTitle>{noticeTitle}</AlertTitle> : null}
        {noticeMessage}
        {noticeHref ? (
          <>
            {" "}
            <Link
              href={noticeHref}
              color="inherit"
              underline="always"
              sx={{ fontWeight: 700 }}
            >
              {t({
                id: "maintenance_notice.learn_more",
                message: "Learn more",
              })}
            </Link>
          </>
        ) : null}
      </Alert>
    </ContentWrapper>
  );
};
