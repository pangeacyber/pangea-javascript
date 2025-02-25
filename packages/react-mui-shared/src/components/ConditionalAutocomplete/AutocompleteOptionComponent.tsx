import { FC, HTMLAttributes } from "react";
import { AutocompleteValueOption } from "./types";
import { ListItem, Stack, Typography } from "@mui/material";

import startCase from "lodash/startCase";
import get from "lodash/get";

export interface OptionComponentProps {
  option: string | any;

  options: Record<string, AutocompleteValueOption>;

  // List option props;
  props?: HTMLAttributes<HTMLLIElement> & {
    key: any;
  };
}

const AutocompleteOptionComponent: FC<OptionComponentProps> = ({
  option,
  options: optionsMap,
  props,
}) => {
  const optionValue: string = option;

  return (
    <ListItem {...props}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="body2">
          {startCase(optionValue.replace(":", ""))}
        </Typography>
        {!!get(optionsMap, optionValue, { value: undefined }).value && (
          <Typography variant="body2" color="textSecondary">
            {optionsMap[optionValue].value.replace(":", "")}
          </Typography>
        )}
      </Stack>
    </ListItem>
  );
};

export default AutocompleteOptionComponent;
