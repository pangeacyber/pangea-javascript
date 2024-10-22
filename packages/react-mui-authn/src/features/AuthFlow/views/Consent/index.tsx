import { FC } from "react";
import { Button, Stack, Typography } from "@mui/material";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import AuthFlowLayout from "../Layout";
import { BodyText } from "@src/components/core/Text";

const ConsentView: FC<AuthFlowComponentProps> = (props) => {
  const { options, data, update, reset } = props;

  // const title = `Authorize ${options.brandName}`;

  const authorize = () => {
    const payload: AuthFlow.ConsentParams = {
      scope_selections: (data.scopes || []).map((s: AuthFlow.Scope) => {
        return { scope: s.name, is_allowed: true };
      }),
    };
    update(AuthFlow.Choice.CONSENT, payload);
  };

  return (
    <AuthFlowLayout title="Authorize">
      <Stack gap={1.5} textAlign="left">
        <BodyText>
          {options.brandName} wants to access your {data.username} account.
        </BodyText>
        <BodyText>
          This application is requesting the following permissions:
        </BodyText>
        {(data.scopes || []).map((s: AuthFlow.Scope) => {
          return (
            <Stack gap={0.5} key={`scope-${s.name}`}>
              <Typography variant="body2">{s.name}</Typography>
              <BodyText>{s.description}</BodyText>
            </Stack>
          );
        })}
        {!!options.clientSiteUrl && (
          <BodyText>
            Authorizing will redirect to <u>{options.clientSiteUrl}</u>
          </BodyText>
        )}
        <Stack
          direction="row"
          gap={2}
          mt={2}
          alignItems="center"
          justifyContent="center"
        >
          <Button fullWidth color="secondary" onClick={reset}>
            Cancel
          </Button>
          <Button
            fullWidth
            color="primary"
            onClick={() => {
              authorize();
            }}
          >
            Authorize
          </Button>
        </Stack>
      </Stack>
    </AuthFlowLayout>
  );
};

export default ConsentView;
