import { FC, ReactNode, useEffect, useState } from "react";
import { Button, ButtonProps, Stack, TextField } from "@mui/material";
import { AuthPasswordField, PangeaModal } from "@pangeacyber/react-mui-shared";
import { useBreakpoint } from "../../utils";

export interface PangeaDeleteModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string | ReactNode;
  onContinue: (password: string) => Promise<boolean | void>;
}

const PasswordConfirmationModal: FC<PangeaDeleteModalProps> = ({
  open,
  onClose,
  title,
  description,
  onContinue,
}) => {
  const isSmall = useBreakpoint("sm");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setName("");
    onClose();
  };

  useEffect(() => {
    setName("");
  }, [open]);

  return (
    <>
      <PangeaModal
        open={open}
        onClose={handleClose}
        title={title}
        description={description}
        size="small"
      >
        <Stack spacing={2}>
          <AuthPasswordField
            name="confirm-password"
            label={`Continue by entering the password below`}
            value={name}
            onValueChange={setName}
            FieldProps={{
              type: "passwordWithPolicy",
              policy: undefined,
              InputProps: {
                fullWidth: true,
              },
            }}
          />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            marginLeft="auto"
            alignSelf="end"
            sx={{
              ...(isSmall && {
                width: "100%",
                paddingTop: 1,
                button: {
                  width: "100%",
                },
              }),
            }}
          >
            <Button variant="contained" onClick={handleClose} color="secondary">
              {"Cancel"}
            </Button>
            <Button
              id="confirm-modal-btn"
              variant="contained"
              color={"primary"}
              disabled={loading}
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();

                setLoading(true);
                onContinue(name)
                  .then((isValid) => {
                    if (isValid === undefined || isValid) onClose();
                    setLoading(false);
                  })
                  .catch((err) => {
                    setLoading(false);
                  });
              }}
            >
              {"Continue"}
            </Button>
          </Stack>
        </Stack>
      </PangeaModal>
    </>
  );
};

export default PasswordConfirmationModal;
