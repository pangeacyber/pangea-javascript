import { FC, ReactNode } from "react";

import {
  Typography,
  Stack,
  Box,
  ContainerProps,
  IconButton,
} from "@mui/material";
import { SxProps } from "@mui/system";
import Container from "@mui/material/Container";
import MUIModal, { ModalProps } from "@mui/material/Modal";

import CloseIcon from "@mui/icons-material/Close";
import { useBreakpoint } from "../PangeaFields/FieldsForm/hooks";

export interface PangeaModalProps extends ModalProps {
  title?: string;
  description?: string | React.ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
  size?: "small" | "mild" | "medium" | "large" | "xl";
  displayCloseIcon?: boolean;
  autoScroll?: boolean;
  loading?: boolean;
  ContainerProps?: Partial<ContainerProps>;
  BoxSx?: SxProps;
}

const PangeaModal: FC<PangeaModalProps> = ({
  children,
  title,
  description,
  footer,
  header,
  size,
  autoScroll = true,
  ContainerProps = {},
  displayCloseIcon = false,
  BoxSx = {},
  ...props
}) => {
  const isSmall = useBreakpoint("sm");
  const width = {
    default: "auto",
    small: "400px",
    mild: "500px",
    medium: "700px",
    large: "800px",
    xl: "90%",
    page: "calc(100% - 32px)",
  }[isSmall ? "page" : (size ?? "default")];

  return (
    <MUIModal
      BackdropProps={{
        sx: {
          bgcolor: "rgba(35, 49, 90, 0.5)",
        },
      }}
      {...props}
      onClose={(event, reason) => {
        if (!!displayCloseIcon && reason === "backdropClick") {
          // Do not close on click away if modal is using close icon
          return;
        }

        if (props.onClose) props.onClose(event, reason);
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          // FIXME: Should come from theme styling
          boxShadow: "0px 0px 24px 0px rgba(40, 48, 94, 0.12)",
          borderRadius: 2,
          alignItems: "center",
          paddingY: 3,
          width,
          maxWidth: "1200px",
          maxHeight: "calc(100vh - 50px)",
          ...BoxSx,
        }}
      >
        <Container
          onClick={(e) => {
            // Stop propagation prevent popups inside of the modal to not close
            // e.stopPropagation();
          }}
          sx={{
            maxWidth: "1600px!important",
          }}
          {...ContainerProps}
        >
          <Stack spacing={1}>
            {(!!header || !!displayCloseIcon) && (
              <Stack direction="row" justifyContent="space-between">
                {!!header ? (
                  <>{header}</>
                ) : (
                  !!title && (
                    <>
                      <Typography
                        variant={size === "small" ? "h6" : "h5"}
                        sx={{ overflow: "hidden", wordBreak: "break-all" }}
                      >
                        {title}
                      </Typography>
                    </>
                  )
                )}
                {!!displayCloseIcon && (
                  // @ts-ignore
                  <IconButton
                    sx={{ marginLeft: "auto" }}
                    onClick={props.onClose}
                    size="small"
                    data-testid="Modal-Close-Btn"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            )}
            {!!title && (!!header || !displayCloseIcon) && (
              <>
                <Typography
                  variant={size === "small" ? "h6" : "h4"}
                  sx={{ overflow: "hidden", wordBreak: "break-all" }}
                >
                  {title}
                </Typography>
              </>
            )}
            {!!description && typeof description === "string" ? (
              <Typography variant="body2">{description}</Typography>
            ) : (
              !!description && description
            )}
            {autoScroll ? (
              <Box
                sx={{
                  overflowY: "auto",
                  overflowX: "hidden",
                  maxHeight: "calc(100vh - 150px)",
                }}
              >
                {children}
              </Box>
            ) : (
              children
            )}
            {!!footer && (
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignSelf="end"
                sx={{
                  ...(isSmall && {
                    width: "100%",
                    button: {
                      width: "100%",
                    },
                  }),
                }}
              >
                {footer}
              </Stack>
            )}
          </Stack>
        </Container>
      </Box>
    </MUIModal>
  );
};

export default PangeaModal;
