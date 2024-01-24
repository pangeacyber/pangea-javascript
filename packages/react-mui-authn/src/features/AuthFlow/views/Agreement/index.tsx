import { FC, UIEvent, useEffect, useState } from "react";
import { Stack, Typography, useTheme } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import LexicalViewer from "./component";
import IdField from "@src/components/fields/IdField";
import Button from "@src/components/core/Button";

const AgreementView: FC<AuthFlowComponentProps> = ({
  options,
  data,
  update,
  reset,
}) => {
  const [disable, setDisable] = useState<boolean>(true);
  const theme = useTheme();

  const content = data?.agreements[0].text || "";

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
    if (el && el.scrollHeight - el.scrollTop === el.clientHeight) {
      setDisable(false);
    } else {
      setDisable(true);
    }
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
      <IdField
        value={data?.email}
        resetCallback={reset}
        resetLabel={options.cancelLabel}
      />
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
        <Button
          fullWidth
          color="primary"
          disabled={disable}
          onClick={() => {
            acceptAgreement(true);
          }}
        >
          Accept
        </Button>
      </Stack>
    </Stack>
  );
};

export default AgreementView;
