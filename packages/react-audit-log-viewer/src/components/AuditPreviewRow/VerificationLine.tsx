import { FC } from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

import { Audit } from "../../types";
import { useVerification } from "../../hooks/context";

const VerificationLine: FC<{
  record: Audit.FlattenedAuditRecord;
}> = ({ record }) => {
  const theme = useTheme();
  const { isConsistentWithNext } = useVerification(record);

  return (
    <Box
      sx={{
        backgroundColor: isConsistentWithNext
          ? theme.palette.success.main
          : "transparent",
        width: "1px!important",
        display: "flex",
        margin: -1,
        marginRight: 2,
        marginLeft: 0,
        marginBottom: -1.5,
      }}
    />
  );
};

export default VerificationLine;
