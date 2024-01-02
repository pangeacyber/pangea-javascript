import { FC, ReactNode, useState } from "react";
import { Button, ButtonProps, Stack, TextField } from "@mui/material";
import PangeaModal from ".";
import { useBreakpoint } from "../PangeaFields/FieldsForm/hooks";

export interface PangeaDeleteModalProps {
  title: string;
  deleteLabel?: string;
  description?: string | ReactNode;
  onDelete: () => Promise<boolean | void>;
  marginLeft?: string;
  Button?: FC<ButtonProps>;
  confirmationName?: string;
}

const PangeaDeleteModal: FC<PangeaDeleteModalProps> = ({
  title,
  description,
  onDelete,
  deleteLabel,
  marginLeft = "auto",
  Button: CustomButton = Button,
  confirmationName,
}) => {
  const isSmall = useBreakpoint("sm");
  const [name, setName] = useState("");

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDisabled = !!confirmationName && name !== confirmationName;

  return (
    <>
      <CustomButton
        onClick={(event) => {
          setOpen(true);
          event.stopPropagation();
        }}
      />
      <PangeaModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
        size="small"
      >
        <Stack spacing={1}>
          {!!confirmationName ? (
            <TextField
              label={`Type name to confirm`}
              id="confirm-name-field"
              onChange={(e) => setName(e.target.value)}
              color="error"
              variant="standard"
              sx={{ marginTop: 0 }}
              onKeyDown={(event) => event.stopPropagation()}
            />
          ) : undefined}
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
            <Button
              variant="contained"
              onClick={() => setOpen(false)}
              color="secondary"
            >
              {!onDelete ? "Close" : "Cancel"}
            </Button>
            {!!onDelete && (
              <Button
                id="confirm-modal-btn"
                variant="contained"
                color={"error"}
                disabled={isDisabled || loading}
                sx={{ marginLeft }}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();

                  setLoading(true);
                  onDelete()
                    .then((isValid) => {
                      if (isValid === undefined || isValid) setOpen(false);
                      setLoading(false);
                    })
                    .catch((err) => {
                      setLoading(false);
                    });
                }}
              >
                {deleteLabel ?? "Delete"}
              </Button>
            )}
          </Stack>
        </Stack>
      </PangeaModal>
    </>
  );
};

export default PangeaDeleteModal;
