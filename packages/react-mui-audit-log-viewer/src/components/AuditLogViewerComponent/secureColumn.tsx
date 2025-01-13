import React, { FC, useState, useRef, ReactNode } from "react";
import pick from "lodash/pick";
import { useTheme } from "@mui/material/styles";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import {
  Stack,
  Box,
  IconButton,
  Typography,
  Button,
  ButtonProps,
  Link,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useAuditContext, useVerification } from "../../hooks/context";
import { Audit } from "../../types";
import { PopoutCard } from "@pangeacyber/react-mui-shared";
import { arweaveViewTransactionUrl } from "../../utils/arweave";

const VerificationRow: FC<{ label: string; children?: React.ReactNode }> = ({
  label,
  children,
}) => {
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
  const { handleVerificationCopy } = useAuditContext();
  return (
    <Button
      variant="text"
      onClick={() => {
        if (value && typeof value === "string") {
          navigator.clipboard.writeText(value);
          const message = `Successfully copied ${label} to clipboard.`;
          if (!!handleVerificationCopy) {
            handleVerificationCopy(message, value);
          } else {
            window.alert(`Successfully copied ${label} to clipboard.`);
          }
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
  unpublishedRoot?: Audit.Root;
  isPendingVerification: boolean;
  isMembershipValid: boolean;
  transactionId?: string;
  children?: ReactNode;
}

const VerificationModal: FC<VerificationModalProps> = ({
  record,
  root,
  unpublishedRoot,
  isPendingVerification,
  isMembershipValid,
  transactionId,
  children,
}) => {
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);

  const artifacts: Audit.VerificationArtifact = {
    envelope: record?.envelope ?? {},
    root,
    unpublished_root: unpublishedRoot,
    ...pick({ ...record }, [
      "root",
      "leaf_index",
      "membership_proof",
      "hash",
      "published",
    ]),
  };

  const verificationArtifacts = (isEmbedded: boolean = false) => {
    // Replacing \\n is for the public_key which is embed
    // inside a dictionary that is expressed as a string...

    if (!isEmbedded) return JSON.stringify(artifacts);
    return JSON.stringify(artifacts)
      .replace(/'/g, "\\'")
      .replace(/\\"/g, '\\\\"')
      .replace(/\\\\n/g, "\\\\\\\\\\\\\\\\n");
  };

  const verificationCmd = () => {
    return `echo $'${verificationArtifacts(
      true
    )}' | python -m pangea.verify_audit`;
  };

  const imported = record?.imported ?? record?.ingested;
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
            isMembershipValid &&
            (record?.valid_signature === undefined || !!record?.valid_signature)
              ? "success"
              : isPendingVerification
                ? "secondary.main"
                : "error"
          }
          data-testid={`Pangea-VerificationLock-${
            isMembershipValid ? "Verified" : "Unverified"
          }`}
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
                ) : !!imported ? (
                  <>
                    <Typography color="success.main" variant="body2">
                      Imported
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
            {record?.valid_signature !== undefined && (
              <VerificationRow label="Signed">
                <Stack direction="row" spacing={1} pr={0.5} alignItems="center">
                  {!!record?.valid_signature ? (
                    <>
                      <Typography color="success.main" variant="body2">
                        Verified
                      </Typography>
                      <CheckCircleOutlinedIcon
                        color="success"
                        fontSize="small"
                      />
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
            )}
            {!isPendingVerification ? (
              <>
                <VerificationRow label="Verification Artifacts">
                  <CopyButton
                    value={verificationArtifacts()}
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
                    <Link
                      href={arweaveViewTransactionUrl(transactionId)}
                      underline="none"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        width: "fit-content",
                      }}
                    >
                      <Button
                        className="text"
                        endIcon={<OpenInNewIcon fontSize="small" />}
                        sx={{
                          marginLeft: "0!important",
                          color: "text.primary",
                        }}
                      >
                        <Typography variant="body2">View</Typography>
                      </Button>
                    </Link>
                  </VerificationRow>
                )}
              </>
            ) : !!imported ? (
              <Stack direction="row">
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ paddingTop: 1 }}
                >
                  Tamperproofing is not available for imported logs
                </Typography>
              </Stack>
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
            {record?.valid_signature !== undefined &&
              !record?.valid_signature && (
                <Stack direction="row">
                  <Typography
                    color="textSecondary"
                    variant="body2"
                    sx={{ paddingTop: 1 }}
                  >
                    Audit log has failed Vault signature verification. Please
                    contact Pangea.
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
          {!!children && children}
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
    const theme = useTheme();
    const {
      isMembershipValid,
      root,
      unpublishedRoot,
      isPendingVerification,
      transactionId,
      isConsistentWithPrevious,
      isConsistentWithNext,
      VerificationModalChildComp,
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
          className="Pangea-VerificationLine-Box"
        />
        <VerificationModal
          isMembershipValid={isMembershipValid}
          isPendingVerification={isPendingVerification}
          transactionId={transactionId}
          root={root}
          unpublishedRoot={unpublishedRoot}
          record={params.row}
        >
          {!!VerificationModalChildComp && <VerificationModalChildComp />}
        </VerificationModal>
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
          className="Pangea-VerificationLine-Box"
        />
      </Stack>
    );
  },
};
