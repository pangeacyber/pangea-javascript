import { FC, useState, useRef, CSSProperties, useEffect } from "react";
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

import { PopoutCard } from "@pangeacyber/react-shared";
import { useAuditContext } from "../../hooks/context";

// FIXME: Audit-log-viewer needs to expose its own types
import { AuditRecordFields } from "../../utils/fields";

import { getTransformValue, reorder } from "../../utils";

// FIXME: Split out drag-and-drop to it's own component
const getDraggingStyle = (
  style: CSSProperties = {},
  { isDragging }: DraggableStateSnapshot,
  idx: number
): CSSProperties => {
  if (style.transform) {
    const { x, y } = getTransformValue(style.transform);
    const transform = `translate(0px, ${isDragging ? idx * 36 + x : x}px)`;

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

const AuditColumnsSettingButton = () => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const { visibility, setVisibility, order, setOrder } = useAuditContext();
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
          <List sx={{ minHeight: `${order_.length * 38 + 2}px` }}>
            <DragDropContext onDragEnd={handleDrop}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <Stack sx={{ position: "relative" }}>
                      {order_.map((auditField, idx) => {
                        return (
                          <Draggable
                            key={auditField}
                            draggableId={auditField}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={getDraggingStyle(
                                  provided.draggableProps.style,
                                  snapshot,
                                  idx
                                )}
                              >
                                <Stack
                                  direction="row"
                                  spacing={0.5}
                                  alignItems="center"
                                >
                                  <ListItemIcon className="drag-handle">
                                    <div
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...provided.dragHandleProps,
                                        height: "24px",
                                      }}
                                    >
                                      <DragIndicatorIcon />
                                    </div>
                                  </ListItemIcon>
                                  <ListItemIcon>
                                    <Checkbox
                                      size="small"
                                      sx={{
                                        padding: "8px",
                                        "&.MuiCheckbox-root": {
                                          // FIXME: Color ActionActive
                                          color: "blue"
                                        },
                                      }}
                                      checked={get(vis_, auditField, false)}
                                      onChange={(event) => {
                                        setVis_((state) => ({
                                          ...state,
                                          [auditField]: event.target.checked,
                                        }));
                                      }}
                                    />
                                  </ListItemIcon>
                                  <ListItemText>
                                    <Typography variant="body2">
                                      {
                                        get(AuditRecordFields, auditField, {
                                          label: auditField,
                                        }).label
                                      }
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

export default AuditColumnsSettingButton;
