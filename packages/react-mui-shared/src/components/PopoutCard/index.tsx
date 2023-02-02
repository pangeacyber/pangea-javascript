import React, { FC, MutableRefObject, useRef, useEffect } from "react";

import { PopperPlacementType } from "@mui/base";
import { Popper, Paper, Card } from "@mui/material";
import { SxProps } from "@mui/system";
import ClickAwayListener from "@mui/material/ClickAwayListener";

import Transitions from "../Transitions";

interface Props {
  anchorRef: MutableRefObject<HTMLDivElement | null>;
  open: boolean;
  setOpen: (open: boolean) => void;
  variant?: "default" | "purple";
  offsetY?: number;
  offsetX?: number;
  placement?: PopperPlacementType;
  cardSx?: SxProps;
  flatTop?: boolean;
  children?: React.ReactNode;
}

const PopperCard: FC<Props> = ({
  children,
  anchorRef,
  open,
  setOpen,
  offsetY,
  offsetX,
  placement = "bottom-start",
  cardSx: cardSxOverrides = {},
  flatTop = false,
}) => {
  const cardSx = {
    borderColor: "transparent",
    ...(flatTop
      ? {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }
      : {
          borderRadius: "12px",
        }),
    ":hover": {
      ...(flatTop
        ? {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }
        : {
            borderRadius: "12px",
          }),
    },
    boxShadow: "0px 0px 24px rgba(40, 48, 94, 0.12)",
    cursor: "default",
    ...cardSxOverrides,
  };
  const prevOpen = useRef(open);

  const handleClose = (event: MouseEvent | TouchEvent): void => {
    if (
      (anchorRef.current &&
        event?.target instanceof Element &&
        anchorRef.current.contains(event?.target)) ||
      // @ts-ignore FIXME localName does appear to exist
      event?.target?.localName === "body"
    ) {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef?.current?.focus();
    }

    prevOpen.current = open;
  }, [open, anchorRef]);

  const offset = [offsetX ?? 0, offsetY ?? 0];
  return (
    <Popper
      placement={placement}
      open={open}
      anchorEl={anchorRef.current}
      role={undefined}
      transition
      disablePortal={false}
      style={{
        zIndex: 1,
      }}
      popperOptions={{
        modifiers: [
          {
            name: "offset",
            options: {
              offset,
            },
          },
        ],
      }}
    >
      {({ TransitionProps }) => (
        <Transitions in={open} position={"top"} {...TransitionProps}>
          <Paper sx={{ padding: 0, zIndex: 1, bgcolor: "transparent" }}>
            <ClickAwayListener onClickAway={handleClose}>
              <Card
                sx={{
                  border: "1px solid",
                  padding: "16px",
                  ...cardSx,
                }}
              >
                {children}
              </Card>
            </ClickAwayListener>
          </Paper>
        </Transitions>
      )}
    </Popper>
  );
};

export default PopperCard;
