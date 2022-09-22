import React, { FC, useState, useRef } from "react";
import pick from "lodash/pick";
import { useTheme } from "@mui/material/styles";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import {
  Stack,
  Box,
  IconButton,
  Typography,
  Button,
  ButtonProps,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useVerification } from "../../hooks/context";
import { Audit } from "../../types";
import { PopoutCard } from "@pangeacyber/react-shared";
import { arweaveViewTransactionUrl } from "../../utils/arweave";

const VerificationRow: FC<{ label: string, children?: React.ReactNode }> = ({ label, children }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{ height: "30px", color: "text.primary" }}
    >
      <Typography sx={{ width: "160px" }} color="textSecondary" variant="body2">
        {label}
      </Typography>
      <Box sx={{ marginLeft: "auto" }}>{children}</Box>
    </Stack>
  );
};

interface CopyProps extends ButtonProps {
  label: string;
}

const CopyButton: FC<CopyProps> = ({ label, value, ...props }) => {
  return (
    <Button
      onClick={() => {
        if (value && typeof value === "string") {
          navigator.clipboard.writeText(value);

          // FIXME: Support custom alert handler
          window.alert(`Successfully copied ${label} to clipboard.`);
        }
      }}
      endIcon={
        <CopyAllIcon
          fontSize="small"
          color={props.disabled ? "inherit" : "action"}
        />
      }
      {...props}
    >
      <Typography
        variant="body2"
        color={props.disabled ? "inherit" : "action.active"}
      >
        Copy
      </Typography>
    </Button>
  );
};

interface VerificationModalProps {
  record: Audit.AuditRecord;
  root?: Audit.Root;
  isPendingVerification: boolean;
  isMembershipValid: boolean;
  transactionId?: string;
}

const VerificationModal: FC<VerificationModalProps> = ({
  record,
  root,
  isPendingVerification,
  isMembershipValid,
  transactionId,
}) => {
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);

  const artifacts: Audit.VerificationArtifact = {
    envelope: record?.envelope ?? {},
    root,
    ...pick({ ...record }, ["root", "leaf_index", "membership_proof", "hash"]),
  };

  const verificationCmd = () => {
    return `echo $'${JSON.stringify(artifacts)
      .replace(/'/g, "\\'")
      .replace(/\\"/g, '\\\\"')}' | python -m pangea.verify_audit`;
  };

  return (
    <>
      <IconButton
        ref={buttonRef}
        onClick={(event) => {
          setOpen(!open);
          event.preventDefault();
        }}
      >
        <LockOutlinedIcon
          fontSize="small"
          // @ts-ignore
          color={
            isMembershipValid
              ? "success"
              : isPendingVerification
              ? "secondary.main"
              : "error"
          }
        />
      </IconButton>
      <PopoutCard
        anchorRef={buttonRef}
        open={open}
        setOpen={setOpen}
        placement="right"
      >
        <Stack
          spacing={1}
          onClick={(event) => {
            event.stopPropagation();
          }}
          sx={{ width: "300px" }}
        >
          <Typography variant="h6">Tamperproofing Validation</Typography>
          <Stack>
            <VerificationRow label="Status">
              <Stack direction="row" spacing={1} pr={0.5} alignItems="center">
                {isMembershipValid ? (
                  <>
                    <Typography color="success.main" variant="body2">
                      Verified
                    </Typography>
                    <CheckCircleOutlinedIcon color="success" fontSize="small" />
                  </>
                ) : isPendingVerification ? (
                  <>
                    <Typography color="textSecondary" variant="body2">
                      Unverified
                    </Typography>
                    <CheckCircleOutlinedIcon color="inherit" fontSize="small" />
                  </>
                ) : (
                  <>
                    <Typography color="textSecondary" variant="body2">
                      Failed
                    </Typography>
                    <CancelOutlinedIcon color="error" fontSize="small" />
                  </>
                )}
              </Stack>
            </VerificationRow>
            {!isPendingVerification ? (
              <>
                <VerificationRow label="Verification Artifacts">
                  <CopyButton
                    value={JSON.stringify(artifacts)}
                    label="Verification Artifacts"
                  />
                </VerificationRow>
                <VerificationRow label="Verification Command">
                  <CopyButton
                    value={verificationCmd()}
                    label="Verification Command"
                  />
                </VerificationRow>
                {!!transactionId && (
                  <VerificationRow label="Published Root">
                    {/* FIXME <DocsLinkButton
                      href={arweaveViewTransactionUrl(transactionId)}
                      buttonProps={{
                        sx: {
                          marginLeft: "0!important",
                          color: "text.primary",
                        },
                      }}
                    >
                      View
                    </DocsLinkButton> */}
                  </VerificationRow>
                )}
              </>
            ) : (
              <Stack direction="row">
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ paddingTop: 1 }}
                >
                  Cannot verify membership, log has not been published yet.
                </Typography>
              </Stack>
            )}
            {!isMembershipValid && !isPendingVerification && (
              <Stack direction="row">
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ paddingTop: 1 }}
                >
                  Message has failed tamperproof validation. Please contact
                  Pangea.
                </Typography>
              </Stack>
            )}
          </Stack>
          {/* FIXME <DocsLinkButton href={DocsPages.Tamperproof} service={Service.Audit}>
            Learn about Tamperproofing
            </DocsLinkButton> */}
        </Stack>
      </PopoutCard>
    </>
  );
};

export const AuditSecureColumn: GridColDef = {
  field: "__secure__",
  sortable: false,
  resizable: false,
  width: 50,
  editable: false,
  filterable: false,
  disableColumnMenu: true,
  headerName: "",
  renderHeader: (params) => {
    return (
      <Stack>
        <CheckCircleOutlinedIcon fontSize="small" color="success" />
      </Stack>
    );
  },
  renderCell: (params) => {
    const theme = useTheme()
    const {
      isMembershipValid,
      root,
      isPendingVerification,
      transactionId,
      isConsistentWithPrevious,
      isConsistentWithNext,
    } = useVerification(params.row, Number(params.id));

    return (
      <Stack
        sx={{
          height: "100%",
          marginRight: "auto",
          alignItems: "center",
          marginLeft: "-8px",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: isConsistentWithPrevious
              ? theme.palette.success.main
              : "transparent",
            width: "1px",
            display: "flex",
            flexGrow: 1,
            marginBottom: "-4px",
            transition: "background-color 1s ease;",
          }}
        />
        <VerificationModal
          isMembershipValid={isMembershipValid}
          isPendingVerification={isPendingVerification}
          transactionId={transactionId}
          root={root}
          record={params.row}
        />
        <Box
          sx={{
            backgroundColor: isConsistentWithNext
              ? theme.palette.success.main
              : "transparent",
            width: "1px",
            display: "flex",
            flexGrow: 1,
            marginTop: "-4px",
            transition: "background-color 1s ease;",
          }}
        />
      </Stack>
    );
  },
};
