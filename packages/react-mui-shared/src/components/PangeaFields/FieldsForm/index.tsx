import {
  FC,
  useMemo,
  useEffect,
  CSSProperties,
  useState,
  ReactNode,
  useCallback,
  Fragment,
  Ref,
} from "react";

import { FormikHelpers, useFormik } from "formik";
import isEmpty from "lodash/isEmpty";
import mapValues from "lodash/mapValues";
import keyBy from "lodash/keyBy";
import isEqual from "lodash/isEqual";
import * as yup from "yup";

import Button from "@mui/material/Button";
import {
  ButtonProps,
  Divider,
  Grid,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";

import FieldComponent from "./FieldComponent";
import {
  FieldFormSchema,
  FieldsFormSchema,
  FieldsFormSchemaWithoutGrouping,
  FormFieldLabelProps,
} from "./types";
import { FormikObject } from "./types/formik";
import { FormObject, GenericGroupedFields } from "../types";
import { useBreakpoint } from "./hooks";
import FieldGrouping from "../FieldGrouping";
import { useInternalState } from "../../../utils/hooks";
import { cleanFormikValues, parseFieldErrors } from "./utils/formik";
import { useGroupedFields } from "../hooks";

const Fields: FC<{
  formik: FormikObject;
  fields: FieldFormSchema[];
  width?: string;
  disabled?: boolean;
  useDivider?: boolean;
  spacing?: number;
  LabelProps?: FormFieldLabelProps;
}> = ({
  fields,
  formik,
  width = "100%",
  disabled,
  useDivider,
  spacing = 1,
  LabelProps,
}) => {
  return (
    <>
      {fields.map(({ name, ...field }) => {
        if (field?.isHidden && field.isHidden(formik?.values ?? {})) {
          return null;
        }

        return (
          <Grid
            item
            style={{
              // FIXME: This is a hack. We need to update the schema
              //  to be able to specify separate values
              width:
                (typeof field?.width === "string" ? field?.width : undefined) ??
                width,
            }}
            key={`grid-item-${name}`}
          >
            <FieldComponent
              field={field}
              name={name ?? field.label}
              formik={formik}
              disabled={disabled}
              LabelProps={{
                ...LabelProps,
                ...field?.LabelProps,
              }}
            />
            {useDivider && <Divider sx={{ paddingTop: 2 }} />}
          </Grid>
        );
      })}
    </>
  );
};

export interface SaveButtonProps<T extends FormObject = any>
  extends ButtonProps {
  values?: Partial<T>;
}

export interface FieldsFormProps<T extends FormObject = any> {
  title?: string | ReactNode;
  description?: string | ReactNode;

  object?: Partial<T>;

  fields: FieldsFormSchema<T>;
  validation?: {
    onValidate?: (object: any) => Record<string, string>;
    schema?: any;
    dependentFields?: [string, string][];
  };

  onChange?: (values: Record<string, unknown>) => void;
  onError?: (values: Record<string, unknown>) => void;
  onCancel?: () => void;
  onSubmit?: (
    values: Record<string, unknown>,
    formikHelpers: FormikHelpers<any>
  ) => Promise<void>;
  onIsChanged?: (changed: boolean) => void;
  formikRef?: Ref<any>;

  displayReadOnly?: boolean;

  multiColumn?: boolean;
  fieldWidth?: string;
  style?: CSSProperties;
  StackSx?: SxProps;
  clearable?: boolean;
  clearButtonLabel?: string;
  variant?: "standard" | "outlined";
  disabled?: boolean;
  caption?: string;
  saveTooltipTitle?: string;

  spacing?: number;
  useDivider?: boolean;

  validateOnMount?: boolean | undefined;
  enableReinitialize?: boolean;
  useInitialObject?: boolean;

  LabelProps?: FormFieldLabelProps;
  SaveButton?: FC<SaveButtonProps<T>>;

  autoSave?: boolean;
  autoSaveDelay?: number;
}

/**
 * The one form to rule them all.
 * Formik can be a pain, re-implementing forms can be a pain.
 * This component makes rending a form simple, essentially fully working off of a fields prop
 * to know what to render.
 *
 */
const FieldsForm: FC<FieldsFormProps> = ({
  displayReadOnly = false,
  object,
  fields: fieldsProps,
  onSubmit,
  validation,
  onChange,
  onCancel,
  onError,
  onIsChanged,
  autoSave,
  SaveButton = Button,
  multiColumn = false,
  fieldWidth: fieldWidthProp,
  style = {},
  StackSx,
  clearable = false,
  clearButtonLabel,
  title,
  description,
  disabled,
  caption,
  saveTooltipTitle,
  spacing = 2,
  useDivider = false,
  validateOnMount,
  enableReinitialize = true,
  useInitialObject,
  LabelProps,
  formikRef,
}) => {
  const isSmall = useBreakpoint("sm");
  const [isSubmitting, setSubmitting] = useState(false);

  // @ts-ignore
  const [fields, groups] = useGroupedFields<FieldFormSchema>(fieldsProps, {
    displayReadOnly,
  });

  const formSchema =
    validation?.schema ||
    yup.object().shape(
      mapValues(keyBy(fields, "name"), (value) => value.schema || null),
      validation?.dependentFields
    );

  const initialObject = useInitialObject ? undefined : object;
  const initialValues = useMemo(() => {
    const values: Record<string, any> = { ...object };
    fields.map((field) => {
      // Note: name should always be here.. it is technically just optional
      // on the interface but the fields useMemo hook will add it
      const name = field.name ?? field.label;

      values[name] =
        !!object && name in object ? object[name] : field?.default ?? "";
    });

    return values;

    // InitialObject being dyanmic changing the effect of onMount or onUpdate is not liked. But is desired.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, initialObject]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: enableReinitialize,
    validateOnMount: validateOnMount,
    validationSchema: formSchema,
    onSubmit: async (values, formikHelpers) => {
      setSubmitting(true);
      const values_ = cleanFormikValues(values, fields);
      if (!onSubmit) {
        setSubmitting(false);
        return;
      }

      onSubmit(values_, formikHelpers)
        .then(() => {
          setSubmitting(false);
          formikHelpers.setSubmitting(false);
        })
        .catch((err) => {
          setSubmitting(false);
          const setErrors = formikHelpers.setErrors;
          setErrors(parseFieldErrors(err));
        });
    },
    validate: validation?.onValidate,
  });

  useEffect(() => {
    // @ts-ignore
    if (formikRef) formikRef.current = formik;
    if (onChange && formik.values) {
      onChange(cleanFormikValues(formik.values, fields));
    }
  }, [onChange, formikRef, formik.values]);

  useEffect(() => {
    if (!!onError) onError(formik.errors);

    // onError may not be wrapped in useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.errors]);

  const isChanged =
    (formik.values &&
      !isEqual(formik.values, initialValues) &&
      !!formik.touched) ||
    isSubmitting;

  const canSave =
    formik.values &&
    ((!isEqual(formik.values, initialValues) && !!formik.touched) ||
      !!validateOnMount) &&
    isEmpty(formik.errors);

  const handleAutoSave = useCallback(() => {
    if (autoSave && canSave) {
      formik.submitForm();
    }

    // We don't want formik on change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSave, canSave, !!formik]);

  useInternalState(autoSave ? formik.values : undefined, handleAutoSave);

  const isSaveDisabled =
    (disabled ?? (!canSave && !isEmpty(formik.errors))) || isSubmitting;
  const numGroups = Object.keys(groups).length;
  const fieldWidth = multiColumn ? "50%" : fieldWidthProp ?? "100%";

  useEffect(() => {
    if (!onIsChanged) return;
    onIsChanged(isChanged);

    // onIsChanged may not be wrapped in useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChanged]);

  return (
    <Stack sx={{ height: "100%", ...StackSx }} spacing={spacing}>
      {(!!title || !!description) && (
        <Stack spacing={1}>
          {!!title &&
            (typeof title === "string" ? (
              <Typography variant="h6">{title}</Typography>
            ) : (
              title
            ))}
          {!!description &&
            (typeof description === "string" ? (
              <Typography variant="body2" color="textSecondary">
                {description}
              </Typography>
            ) : (
              description
            ))}
        </Stack>
      )}
      <form onSubmit={formik.handleSubmit} style={{ height: "100%" }}>
        <Stack sx={{ height: "100%" }}>
          <Stack sx={{ paddingTop: 0.5, ...style }}>
            <Grid container spacing={spacing} sx={{ paddingBottom: "2px" }}>
              {Object.keys(groups).map((label, idx) => (
                <Fragment key={`fragment-group-control-${label}-${idx}`}>
                  <FieldGrouping
                    label={label}
                    metadata={groups[label].metadata}
                    key={`form-group-control-${label}-${idx}`}
                    // @ts-ignore
                    formik={formik}
                  >
                    <Fields
                      width={fieldWidth}
                      fields={groups[label].fields}
                      formik={formik}
                      disabled={disabled}
                      spacing={spacing}
                      useDivider={
                        Object.keys(groups).length === 1
                          ? useDivider
                          : undefined
                      }
                      LabelProps={LabelProps}
                    />
                  </FieldGrouping>
                  {numGroups !== 1 && useDivider && numGroups - 1 !== idx && (
                    <Grid item sx={{ width: "100%" }}>
                      <Divider />
                    </Grid>
                  )}
                </Fragment>
              ))}
            </Grid>
          </Stack>
          {!!onSubmit && (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={{
                ...(isSmall && {
                  width: "100%",
                  "button, span": {
                    width: "100%",
                  },
                }),
              }}
              spacing={1}
              marginTop={2}
              alignItems="center"
              justifyContent="end"
              marginLeft="auto"
            >
              {!!caption && (
                <Typography variant="body2" color="info.main">
                  {caption}
                </Typography>
              )}
              {clearable && (
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    formik.resetForm();
                    if (onCancel) onCancel();
                  }}
                >
                  {clearButtonLabel ?? (displayReadOnly ? "Close" : "Cancel")}
                </Button>
              )}
              {!autoSave && !!onSubmit && (
                <Tooltip
                  title={
                    saveTooltipTitle ??
                    Object.values(formik?.errors ?? {}).join("\n\n")
                  }
                  hidden={isEmpty(formik?.errors ?? {})}
                >
                  <SaveButton
                    color="primary"
                    variant="contained"
                    disabled={isSaveDisabled}
                    onClick={() => formik.submitForm()}
                    values={formik?.values}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </SaveButton>
                </Tooltip>
              )}
            </Stack>
          )}
        </Stack>
      </form>
    </Stack>
  );
};

export default FieldsForm;
