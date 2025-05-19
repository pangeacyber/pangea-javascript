import { FC, useMemo, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  FieldsForm,
  FieldsFormSchema,
  PopoutCard,
} from "@pangeacyber/react-mui-shared";
import { getShareSettingsFields } from "./fields";

import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";

import { pickBy } from "lodash";
import { useFileViewerContext } from "../../../hooks/context";

interface Props {
  object: any;
  onSubmit: (values: any) => Promise<void>;

  onError?: (errors: any) => void;

  open: boolean;
  setOpen: (open: boolean) => void;
}

const ShareSettingsFieldsKeys = new Set(Object.keys(getShareSettingsFields()));

const ShareSettings: FC<Props> = ({
  object,
  onSubmit,

  onError,

  open,
  setOpen,
}) => {
  const theme = useTheme();
  const { configurations } = useFileViewerContext();
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  const buttonRef = useRef(null);

  const [obj, setObj] = useState(object);

  const fields = useMemo<FieldsFormSchema<any>>(() => {
    return getShareSettingsFields({
      maxAccessCount: configurations?.settings?.maxAccessCount,
      maxDate: configurations?.settings?.maxDate,
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        ref={buttonRef}
        sx={{ marginLeft: "auto" }}
        onClick={() => setOpen(!open)}
        size="small"
        data-testid="Share-Settings-Btn"
      >
        <SettingsIcon fontSize="small" />
      </IconButton>
      {isMedium ? (
        <PopoutCard
          anchorRef={buttonRef}
          open={open}
          setOpen={setOpen}
          placement={"bottom-end"}
          PopperProps={{
            style: {
              zIndex: theme.zIndex.modal + 2,
            },
          }}
        >
          <>
            <Stack
              direction="row"
              paddingBottom={1}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography color="textContrast">Settings</Typography>
              <IconButton
                sx={{ marginLeft: "auto" }}
                onClick={handleClose}
                size="small"
                data-testid="Settings-Close-Btn"
              >
                <CloseIcon fontSize="small" color="inherit" />
              </IconButton>
            </Stack>
            <FieldsForm
              object={obj}
              fields={fields}
              autoSave
              onError={onError}
              onSubmit={(values) => {
                return onSubmit(
                  // @ts-ignore
                  pickBy(values, (v, k) => ShareSettingsFieldsKeys.has(k))
                );
              }}
              StackSx={{
                ".MuiFormControl-root": {
                  margin: 0,
                },
              }}
            />
          </>
        </PopoutCard>
      ) : (
        open && (
          <Box
            className="Pangea-Flyout-Container"
            sx={{
              width: "220px",
              height: "468px",
              bgcolor: "#23315A",
              color: (theme.vars || theme).palette.primary.contrastText,
              position: "absolute",
              padding: 1,
              top: "24px",
              right: "-220px",
              borderRadius: "0px 12px 12px 0px",
              ".MuiTypography-root, .MuiStack-root > .MuiIconButton-root > .MuiSvgIcon-root":
                {
                  color: (theme.vars || theme).palette.primary.contrastText,
                },
            }}
          >
            <Stack
              direction="row"
              paddingBottom={1}
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography color="textContrast">Settings</Typography>
              <IconButton
                sx={{ marginLeft: "auto" }}
                onClick={handleClose}
                size="small"
                data-testid="Settings-Close-Btn"
              >
                <CloseIcon fontSize="small" color="inherit" />
              </IconButton>
            </Stack>
            <FieldsForm
              object={obj}
              fields={fields}
              autoSave
              onSubmit={(values) => {
                return onSubmit(
                  // @ts-ignore
                  pickBy(values, (v, k) => ShareSettingsFieldsKeys.has(k))
                );
              }}
              onError={onError}
              StackSx={{
                ".MuiFormControl-root": {
                  margin: 0,
                },
              }}
            />
          </Box>
        )
      )}
    </>
  );
};

export default ShareSettings;
