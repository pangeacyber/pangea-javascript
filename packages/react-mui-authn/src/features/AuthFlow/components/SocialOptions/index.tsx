import { FC } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { AuthFlow } from "@pangeacyber/vanilla-js";

import { AuthFlowViewOptions } from "@src/views/AuthFlow/types";
import {
  getSocialProviderIcon,
  getSocialProviderLabel,
} from "@src/features/AuthFlow/utils";
import Button from "@src/components/core/Button";

interface Props {
  data: AuthFlow.StateData;
  options: AuthFlowViewOptions;
}

const SocialOptions: FC<Props> = ({ data, options }) => {
  const theme = useTheme();

  const socialLogin = (redirect: string) => {
    window.location.href = redirect;
  };

  if (data.socialChoices.length === 0) {
    return null;
  }

  return (
    <>
      {data?.setEmail && (
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
      </Stack>
    </>
  );
};

export default SocialOptions;
