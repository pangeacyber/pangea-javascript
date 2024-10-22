import {
  FC,
  useState,
  useRef,
  CSSProperties,
  useEffect,
  ReactNode,
  MutableRefObject,
} from "react";
import { useTheme } from "@mui/material/styles";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableStateSnapshot,
} from "react-beautiful-dnd";

import get from "lodash/get";
import {
  Stack,
  IconButton,
  Typography,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Button,
  List,
} from "@mui/material";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import PopoutCard from "../../../PopoutCard";

import { getTransformValue, reorder } from "../../../../utils";

const draggingMap: Record<number, number> = {};

const getScrollOffset = (
  idx: number,
  isDragging: boolean,
  scrollRef?: MutableRefObject<HTMLElement | undefined>
) => {
  if (isDragging) {
    if (!(idx in draggingMap))
      draggingMap[idx] = scrollRef?.current?.scrollTop ?? 0;
    return get(draggingMap, idx, scrollRef?.current?.scrollTop ?? 0);
  } else {
    delete draggingMap[idx];
    return scrollRef?.current?.scrollTop ?? 0;
  }
};

const getDraggingStyle = (
  style: CSSProperties = {},
  { isDragging }: DraggableStateSnapshot,
  idx: number,
  scrollRef?: MutableRefObject<HTMLElement | undefined>
): CSSProperties => {
  if (style.transform) {
    const { x, y } = getTransformValue(style.transform);
    const transform = `translate(0px, ${
      isDragging
        ? idx * 36 + x - getScrollOffset(idx, isDragging, scrollRef)
        : x
    }px)`;

    return {
      ...style,
      opacity: 1,
      transform,
      top: "auto !important",
      left: "auto !important",
    };
  }

  return {
    ...style,
    opacity: 1,
    top: "auto !important",
    left: "auto !important",
  };
};

export interface Visibility {
  [key: string]: {
    isVisible: boolean;
    label: string;
  };
}

export const ColumnsPopoutHeader: FC<{
  columnsPopoutProps: ColumnsPopoutProps;
  children: ReactNode;
}> = ({ columnsPopoutProps, children }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2}>
      {children}
      <ColumnsPopout {...columnsPopoutProps} />
    </Stack>
  );
};

export interface ColumnsPopoutProps {
  order: string[];
  setOrder: (order: string[]) => void;
  visibility: Visibility;
  setVisibility: (visibility: Visibility) => void;
}

const ColumnsPopout: FC<ColumnsPopoutProps> = ({
  visibility,
  setVisibility,
  order,
  setOrder,
}) => {
  const theme = useTheme();
  const scrollRef = useRef<any>(undefined);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  const [vis_, setVis_] = useState(visibility);
  const [order_, setOrder_] = useState(order);

  useEffect(() => {
    setVis_(visibility);
    setOrder_(order);
  }, [open]);

  const handleDrop = (result: DropResult) => {
    const target = result.destination?.index;
    const source = result.source.index;

    if (target !== undefined)
      setOrder_((state) => reorder(state, source, target));
  };

  const handleSubmit = () => {
    setVisibility(vis_);
    setOrder(order_);
    setOpen(false);
  };

  return (
    <Stack alignItems="center" justifyContent="center">
      <IconButton ref={buttonRef} onClick={() => setOpen(!open)}>
        <SettingsOutlinedIcon fontSize="small" />
      </IconButton>
      <PopoutCard
        anchorRef={buttonRef}
        open={open}
        setOpen={setOpen}
        placement={"bottom-end"}
      >
        <div id="draggable-portal" />
        <Stack sx={{ position: "relative", width: "180px" }}>
          <Typography variant="h6">Configure Table</Typography>
          <Stack
            sx={{
              maxHeight: "calc(100vh - 300px)",
              overflowY: "auto",
              overflowX: "hidden",
            }}
            ref={scrollRef}
            className="PangeaConfigureTable-ScrollContainer"
          >
            <Stack sx={{ position: "relative", height: "100%" }}>
              <List
                sx={{
                  minHeight: `${order_.length * 38 + 2}px`,
                }}
              >
                <DragDropContext onDragEnd={handleDrop}>
                  <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <Stack sx={{ position: "relative" }}>
                          {order_.map((fieldKey, idx) => {
                            const fieldLabel = get(visibility, fieldKey, {
                              label: fieldKey,
                            })?.label;
                            return (
                              <Draggable
                                key={fieldKey}
                                draggableId={fieldKey}
                                index={idx}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    style={getDraggingStyle(
                                      provided.draggableProps.style,
                                      snapshot,
                                      idx,
                                      scrollRef
                                    )}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={0.5}
                                      alignItems="center"
                                    >
                                      <ListItemIcon
                                        className="drag-handle"
                                        sx={{ width: "24px", minWidth: "24px" }}
                                      >
                                        <div
                                          {...provided.dragHandleProps}
                                          style={{
                                            ...provided.dragHandleProps,
                                            height: "24px",
                                            width: "24px",
                                          }}
                                        >
                                          <DragIndicatorIcon />
                                        </div>
                                      </ListItemIcon>
                                      <ListItemIcon
                                        sx={{ width: "40px", minWidth: "40px" }}
                                      >
                                        <Checkbox
                                          size="small"
                                          sx={{
                                            padding: "8px",
                                            "&.MuiCheckbox-root": {
                                              color:
                                                theme.palette.action.active,
                                            },
                                          }}
                                          checked={
                                            get(vis_, fieldKey, {
                                              isVisible: false,
                                            }).isVisible
                                          }
                                          onChange={(event) => {
                                            setVis_((state) => ({
                                              ...state,
                                              [fieldKey]: {
                                                label: fieldLabel,
                                                isVisible: event.target.checked,
                                              },
                                            }));
                                          }}
                                        />
                                      </ListItemIcon>
                                      <ListItemText>
                                        <Typography variant="body2">
                                          {fieldLabel}
                                        </Typography>
                                      </ListItemText>
                                    </Stack>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                        </Stack>
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </List>
            </Stack>
          </Stack>
          <Stack spacing={1} direction="row" alignSelf="end">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </PopoutCard>
    </Stack>
  );
};

export default ColumnsPopout;
