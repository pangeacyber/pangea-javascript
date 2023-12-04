import { FC, useEffect } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import {
  getSocialProviderIcon,
  getSocialProviderLabel,
} from "@src/features/AuthFlow/utils";
import Button from "@src/components/core/Button";

const SocialOptions: FC<AuthFlowComponentProps> = ({ options, data }) => {
  const theme = useTheme();

  const socialLogin = (redirect: string) => {
    window.location.href = redirect;
  };

  useEffect(() => {
    // auto-redirect if one SAML provider is the only option
    if (
      data &&
      data.authChoices.length === 0 &&
      data.socialChoices.length === 0 &&
      data.samlChoices.length === 1
    ) {
      const samlOption = data.samlChoices[0];
      socialLogin(samlOption.redirect_uri);
    }
  }, []);

  if (data.socialChoices.length === 0 && data.samlChoices.length === 0) {
    return null;
  }

  return (
    <>
      {(data?.authChoices.length > 0 || !!data.setEmail) && (
        <Box width="100%">
          <Divider>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.divider,
              }}
            >
              {options.socialHeading}
            </Typography>
          </Divider>
        </Box>
      )}
      <Stack gap={1}>
        {data.socialChoices.map((provider: AuthFlow.SocialResponse) => {
          return (
            <Button
              color="secondary"
              fullWidth={true}
              onClick={() => {
                socialLogin(provider.redirect_uri);
              }}
              key={provider.social_provider}
            >
              {options.showSocialIcons && (
                <>
                  {getSocialProviderIcon(provider.social_provider)}
                  <Box component="span" sx={{ marginRight: 1 }} />
                </>
              )}
              Continue with {getSocialProviderLabel(provider.social_provider)}
            </Button>
          );
        })}
        {data.samlChoices.map((provider: AuthFlow.SamlResponse) => {
          return (
            <Button
              color="secondary"
              fullWidth={true}
              onClick={() => {
                socialLogin(provider.redirect_uri);
              }}
              key={provider.provider_id}
            >
              Continue with {provider.provider_name}
            </Button>
          );
        })}
      </Stack>
    </>
  );
};

export default SocialOptions;
