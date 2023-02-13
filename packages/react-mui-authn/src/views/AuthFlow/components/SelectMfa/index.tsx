import { Box, Button, Stack, Typography } from "@mui/material";

import { useAuthFlow, FlowStep } from "@pangeacyber/react-auth";

const SelectMfaView = () => {
  const { callNext, reset, flowData, error, step } = useAuthFlow();
  const nextStep =
    step === FlowStep.ENROLL_MFA_START
      ? FlowStep.ENROLL_MFA_SELECT
      : FlowStep.VERIFY_MFA_SELECT;

  const selectProvider = (provider: string) => {
    callNext(nextStep, { mfaProvider: provider });
  };

  return (
    <Stack gap={2}>
      <Stack>
        <Typography variant="h6">Select an MFA method</Typography>
        <Typography variant="caption">{flowData.email}</Typography>
      </Stack>
      <Stack>
        {flowData.mfaProviders?.map((provider) => {
          return (
            <Button key={provider} onClick={() => selectProvider(provider)}>
              Continue with {provider}
            </Button>
          );
        })}
      </Stack>
      {error && <Box sx={{ color: "red" }}>{error.summary}</Box>}
      <Stack direction="row" gap={2} my={2}>
        <Button variant="text" onClick={reset} sx={{ alignSelf: "flex-start" }}>
          Start Over
        </Button>
      </Stack>
    </Stack>
  );
};

export default SelectMfaView;
