import { FC, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowComponentProps } from "@src/features/AuthFlow/types";
import {
  getProviderIcon,
  getProviderLabel,
} from "@src/features/AuthFlow/utils";
import Button from "@src/components/core/Button";

const SocialOptions: FC<AuthFlowComponentProps> = ({
  options,
  update,
  data,
}) => {
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
      // handle SAML IDP flow
      const samlOption = data.samlChoices[0];
      if (samlOption.idp_init_flow) {
        const payload: AuthFlow.SamlParams = {
          provider_id: samlOption.provider_id,
          provider_name: samlOption.provider_name,
          idp_flow_state: samlOption.state,
        };
        update(AuthFlow.Choice.SAML, payload);
      } else {
        socialLogin(samlOption.redirect_uri);
      }
    }
  }, []);

  if (data.socialChoices.length === 0 && data.samlChoices.length === 0) {
    return null;
  }

  return (
    <Stack gap={1}>
      {data.socialChoices.map((provider: AuthFlow.SocialResponse) => {
        return (
          <Button
            key={`social-${provider.social_provider}`}
            color="secondary"
            fullWidth={true}
            onClick={() => {
              socialLogin(provider.redirect_uri);
            }}
          >
            {options.showSocialIcons && (
              <>
                {getProviderIcon(provider.social_provider)}
                <Box component="span" sx={{ marginRight: 1 }} />
              </>
            )}
            Continue with {getProviderLabel(provider.social_provider)}
          </Button>
        );
      })}
      {data.samlChoices.map((provider: AuthFlow.SamlResponse) => {
        return (
          <Button
            key={`saml-${provider.provider_id}`}
            color="secondary"
            fullWidth={true}
            onClick={() => {
              socialLogin(provider.redirect_uri);
            }}
          >
            Continue with {provider.provider_name}
          </Button>
        );
      })}
    </Stack>
  );
};

export default SocialOptions;
