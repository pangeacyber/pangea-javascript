import { FC } from "react";

import {
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface CodeProps {
  formTitle?: string;
  bodyContent?: string;
}

const CodeForm: FC<CodeProps> = ({ formTitle = "", bodyContent = "" }) => {
  return (
    <Stack>
      { formTitle && <Typography variant="h3">{formTitle}</Typography> }
      { bodyContent && <Typography variant="body1">{bodyContent}</Typography> }
      <Stack direction="row" mb={2}>
        <TextField />
      </Stack>
    </Stack>    
  )
};

export default CodeForm;