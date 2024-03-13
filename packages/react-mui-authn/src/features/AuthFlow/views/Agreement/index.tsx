import { FC, UIEvent, useEffect, useMemo, useState } from "react";
import { Stack, SxProps, Tooltip, Typography, useTheme } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import LexicalViewer from "./component";
import { formatDateString } from "@src/utils";
import Button from "@src/components/core/Button";
import { isDark } from "../../utils";

const AgreementView: FC<AuthFlowComponentProps> = ({
  options,
  data,
  update,
  reset,
}) => {
  const [disable, setDisable] = useState<boolean>(true);
  const theme = useTheme();
  const darkMode = useMemo(() => !isDark(theme.palette.text.primary), [theme]);
  const content = data?.agreements[0].text || "";

  // FIXME: workaround for missing palette.action.disabledBackground and palette.action.disabled
  const buttonStyle: SxProps =
    darkMode && disable
      ? {
          color: `${theme.palette.text.primary}!important`,
          backgroundColor: `${theme.palette.primary.main}!important`,
          opacity: "0.5",
        }
      : {};

  const acceptAgreement = (accept: boolean) => {
    const payload: AuthFlow.AgreementsParams = {
      agreed: [data?.agreements[0].id],
    };
    update(AuthFlow.Choice.AGREEMENTS, payload);
  };

  const acceptHeading = (): string => {
    if (data?.agreements[0].type === "privacy_policy") {
      return options?.privacyHeading || "";
    } else {
      return options?.eulaHeading || "";
    }
  };

  useEffect(() => {
    const el = document.getElementById("agreement-container");
    if (el) {
      el.scrollTop = 0;
    }

    // Removing scroll-to-bottom requirement, but leaving this code here
    // if (el && el.scrollHeight - el.scrollTop === el.clientHeight) {
    //   setDisable(false);
    // } else {
    //   setDisable(true);
    // }
    setDisable(false);
  }, [data]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;
    if (bottom) {
      setDisable(false);
    }
  };

  return (
    <Stack gap={2} sx={{ borderWidth: "1px" }} ml={-1} mr={-1}>
      <Typography variant="h6">{acceptHeading()}</Typography>
      <Stack direction="row" justifyContent="center">
        <Typography variant="body1">
          Published Data:{" "}
          {formatDateString(data?.agreements[0].published_at || "")}
        </Typography>
      </Stack>
      <Stack
        id="agreement-container"
        onScroll={handleScroll}
        sx={{
          maxHeight: "400px",
          padding: "0 4px",
          overflowY: "auto",
          textAlign: "initial",
          // @ts-ignore
          fontSize: theme.typography.fontSize || "0.825em",
          fontColor: theme.palette.text.primary,
          "& :focus-visible": {
            outline: "none",
          },
          "& a": {
            cursor: "pointer",
            // @ts-ignore
            color: window.BRANDING?.link_color || "inherit",
          },
        }}
      >
        <LexicalViewer
          content={content}
          key={`agreement-viewer-${data?.agreements[0].type}`}
        />
      </Stack>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        <Button fullWidth color="secondary" onClick={reset}>
          Decline
        </Button>
        <Tooltip
          title={disable ? "Scroll through entire agreement to accept" : ""}
        >
          <span style={{ width: "100%" }}>
            <Button
              fullWidth
              color="primary"
              disabled={disable}
              onClick={() => {
                acceptAgreement(true);
              }}
              sx={{ ...buttonStyle }}
            >
              Accept
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default AgreementView;
