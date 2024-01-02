import { FC } from "react";
import {
  FormControlLabel,
  FormGroup,
  Typography,
  Stack,
  Tooltip,
  TypographyProps,
} from "@mui/material";
import { SxProps } from "@mui/system";
import { FieldComponentProps } from "./types";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const Description: FC<{ description: any; sx?: SxProps }> = ({
  description,
  sx = {},
}) => {
  if (!description) return null;

  if (typeof description === "string") {
    return (
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ paddingLeft: 1, ...sx }}
      >
        {description}
      </Typography>
    );
  }

  return <>{description}</>;
};

const Label: FC<{ label: any; props?: TypographyProps }> = ({
  label,
  props = {},
}) => {
  if (!label) return null;

  if (typeof label === "string") {
    return (
      <Typography
        sx={{
          alignSelf: "start",
          marginBottom: 0.5,
        }}
        color="textSecondary"
        variant="body2"
        {...props}
      >
        {label}
      </Typography>
    );
  }

  return <>{label}</>;
};

interface FieldControlProps extends FieldComponentProps<any> {
  children: React.ReactNode;
}

const FieldControlFormGroup: FC<FieldControlProps> = ({
  children,
  label,
  LabelProps,
  description,
  DescriptionProps,
  FieldControlProps,
}) => {
  const {
    ignoreFormGroup = false,
    formGroupSx = {},
    formControlLabelSx = {},
    descriptionPosition,
  } = FieldControlProps ?? {};

  if (!ignoreFormGroup) {
    return (
      <FormGroup sx={formGroupSx}>
        <FormControlLabel
          control={<>{children}</>}
          label={
            <Stack>
              <Stack
                direction="row"
                sx={{
                  paddingLeft: 0,
                  alignItems: "start",
                  minWidth: LabelProps?.minWidth ?? "140px",
                }}
                spacing={0.5}
              >
                <Label
                  label={label}
                  props={{
                    ...(LabelProps?.placement === "start"
                      ? { sx: { marginBottom: 0 } }
                      : {}),
                    ...(LabelProps?.TypographyProps ?? {}),
                  }}
                />
                {LabelProps?.info && (
                  <Tooltip title={LabelProps.info}>
                    <InfoOutlinedIcon
                      fontSize="small"
                      color="info"
                      sx={{ marginTop: "2px!important" }}
                    />
                  </Tooltip>
                )}
              </Stack>
              {descriptionPosition === "label" && (
                <Description description={description} />
              )}
            </Stack>
          }
          labelPlacement={LabelProps?.placement ?? "top"}
          sx={{
            // @ts-ignore
            margin: 0,
            // @ts-ignore
            alignItems: "start",
            ...(LabelProps?.placement === "start"
              ? {
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }
              : {
                  width: "100%",
                }),
            ...formControlLabelSx,
            ...(LabelProps?.FormControlLabelSx ?? {}),
          }}
        />
      </FormGroup>
    );
  }

  return <>{children}</>;
};

const FieldControl: FC<FieldControlProps> = (props) => {
  const {
    description,
    errors,
    children,
    FieldControlProps,
    LabelProps,
    DescriptionProps,
  } = props;
  const {
    descriptionPosition = "component",
    ignoreErrors = false,
    componentStackSx = {},
  } = FieldControlProps ?? {};

  return (
    <FieldControlFormGroup {...props}>
      <Stack
        sx={{
          width: "100%",
          ...(LabelProps?.placement === "start"
            ? {
                alignItems: "end",
              }
            : {}),
          ...componentStackSx,
        }}
      >
        {descriptionPosition === "component" &&
          DescriptionProps?.placement === "top" && (
            <Description description={description} />
          )}
        {children}
        {!ignoreErrors && !!errors && (
          <Typography color="error" variant="body2" sx={{ paddingLeft: 1 }}>
            {errors}
          </Typography>
        )}
        {!errors &&
          descriptionPosition === "component" &&
          DescriptionProps?.placement !== "top" && (
            <Description description={description} />
          )}
      </Stack>
    </FieldControlFormGroup>
  );
};

export function withFieldControl<F extends Function>(fn: F): F {
  return ((props: FieldComponentProps) => {
    const Component = () => fn(props);

    return (
      <FieldControl {...props}>
        <Component />
      </FieldControl>
    );
  }) as any;
}

export default FieldControl;
