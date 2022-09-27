import { FC, useState } from "react";

import {
  Button,
  Link,
  Stack,
  Typography,
} from "@mui/material";

import * as yup from "yup";
import { useFormik } from "formik";

import CodeField from "@src/components/fields/CodeField";

interface CodeProps {
  formTitle?: string;
  bodyContent?: string;
  submitLabel?: string;
};

const CodeForm: FC<CodeProps> = ({ 
  formTitle = "",
  bodyContent = "",
  submitLabel = ""
}) => {
  const [submitting, setSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      code: "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      code: yup.string().required("Six-digit code is required"),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
      }, 3000);
    },
  });

  const isPotentialValidCode = formik.values.code.length === 6;

  return (
    <Stack>
      {formTitle && <Typography variant="h5" sx={{ mt: 1, mb: 3 }}>{formTitle}</Typography>}
      {bodyContent && <Typography variant="body2" sx={{ mb: 3 }}>{bodyContent}</Typography>}

      <form onSubmit={formik.handleSubmit}>
        <CodeField
          name="code"
          formik={formik}
          field={{
            label: "Code",
          }}
        />
      </form>
      <Button
        id="confirm-modal-btn"
        color="primary"
        type="submit"
        disableRipple
        disableElevation
        disabled={!isPotentialValidCode || submitting}
        sx={{ mt: 2 }}
      >
        {submitting ? (
          "Sending..."
        ) : (
          submitLabel
        )}
      </Button>
      <Stack spacing={1} sx={{ mt: 4 }}>
        <Typography variant="caption">
          <Link
            underline="none"
            href="#"
          >
            Send me a new code
          </Link>
        </Typography>
        <Typography variant="caption">
          <Link
            underline="none"
            href="#"
          >
            Choose another way
          </Link>
        </Typography>
      </Stack>
    </Stack>
  )
};


export default CodeForm;