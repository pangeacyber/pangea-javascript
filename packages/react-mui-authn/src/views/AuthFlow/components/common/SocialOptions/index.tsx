import { FC } from "react";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { AuthFlowViewOptions } from "@src/views/AuthFlow/types";
import { getProviderIcon, getProviderLabel } from "@src/views/AuthFlow/utils";
import Button from "@src/components/core/Button";

interface Props {
  data: any;
  options: AuthFlowViewOptions;
}

interface Provider {
  provider: string;
  redirect_uri: string;
}

const SocialOptions: FC<Props> = ({ data, options }) => {
  const theme = useTheme();

  const socialLogin = (redirect: string) => {
    window.location.href = redirect;
  };

  return (
    <Stack gap={2}>
      {data.passwordSignup && data.socialSignup?.length > 0 && (
        <Box width="100%">
          <Divider>
            <Typography
              variant="overline"
              sx={{
                color: theme.palette.divider,
              }}
            >
              Other ways to Log in
            </Typography>
          </Divider>
        </Box>
      )}
      {data.socialSignup?.length > 0 && (
        <Stack gap={2}>
          {data.socialSignup.map((provider: Provider) => {
            return (
              <Button
                variant="contained"
                color="secondary"
                fullWidth={true}
                onClick={() => {
                  socialLogin(provider.redirect_uri);
                }}
                key={provider.provider}
              >
                {options.showSocialIcons && (
                  <>
                    {getProviderIcon(provider.provider)}
                    <Box component="span" sx={{ marginRight: 1 }} />
                  </>
                )}
                Continue with {getProviderLabel(provider.provider)}
              </Button>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
};

export default SocialOptions;
