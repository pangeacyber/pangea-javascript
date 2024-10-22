import React, { useRef, useEffect, useMemo } from "react";
import ReactDom from "react-dom";

import keyBy from "lodash/keyBy";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Tooltip } from "@mui/material";

enum ReactJsonView {
  CollapseBtn = ".collapsed-icon",
  ExpandBtn = ".expanded-icon",
  ObjectEl = ".object-key",
  VariableEl = ".variable-value",
}

export type HighlightColor = "success" | "highlight" | "error";
export interface Highlight {
  value: string;
  prefix?: string;
  suffix?: string;
  color: "success" | "highlight" | "error";
  info?: string;
}

interface HighlightOptions {}

export const useReactJsonViewHighlight = (
  highlights: Highlight[],
  options: HighlightOptions = {}
): React.MutableRefObject<HTMLDivElement | undefined> => {
  const ref = useRef<HTMLDivElement>();

  const textToHighlightMap = useMemo(() => {
    return keyBy(highlights, (c) => c.value.replace(/"/g, ""));
  }, [highlights]);

  const subscribeToExpand = async () => {
    if (!ref.current) return;
    const node = ref.current;

    setTimeout(function () {
      const queryKeys = node.querySelectorAll(ReactJsonView.CollapseBtn);
      queryKeys.forEach((el) => {
        // @ts-ignore
        el.onclick = () => {
          applyHighlights();
          // We apply text highlighting by finding the dom elements with matching text
          //  then apply classNames. Everytime the react-json-viewer is expanded/collapsed
          //  all DOM elements are re-rendered. To we subscribed to the collapsed-icon
          //  to ensure that when it is clicked we will re-run apply highlights.
          subscribeToCollapse();
        };
      });
    }, 100);
  };

  const subscribeToCollapse = async () => {
    if (!ref.current) return;
    const node = ref.current;

    setTimeout(function () {
      const queryKeys = node.querySelectorAll(ReactJsonView.ExpandBtn);
      queryKeys.forEach((el) => {
        // @ts-ignore
        el.onclick = () => {
          subscribeToExpand();
        };
      });
    }, 100);
  };

  const applyHighlights = async () => {
    if (!ref.current) return;
    const node = ref.current;

    setTimeout(function () {
      const queryKeys = node.querySelectorAll(ReactJsonView.ObjectEl);
      queryKeys.forEach((el) => {
        const text = el.textContent;

        const change = get(textToHighlightMap, text?.replace(/"/g, "") ?? "");
        if (change) {
          el.className = `${el.className} PangeaHighlight-${change.color}`;
        }
      });

      const queryValues = node.querySelectorAll(ReactJsonView.VariableEl);
      queryValues.forEach((el) => {
        if (!el.textContent) return;
        let text = el.textContent?.replace(/"/g, "") ?? "";
        const highlights_ = highlights.filter((hl) => {
          const hasHighlight = text.includes(hl.value);
          if (hasHighlight) {
            const [first, ...rest] = text.split(hl.value);
            text = rest.join(hl.value);
            return true;
          }

          return false;
        });

        if (isEmpty(highlights_)) return;

        let left: string = el.textContent;
        let checkIdx: number = 0;
        const values: { val: string; highlight: string; title?: string }[] = [];

        for (let idx = 0; idx < highlights_.length; idx++) {
          const hl = highlights_[idx];
          const [first, ...rest] = left.slice(checkIdx).split(hl.value);
          const previous = left.slice(0, checkIdx) + first;
          const next = rest.length ? rest[0] : "";

          if (
            previous.endsWith(
              (hl.prefix ?? "").charAt((hl.prefix ?? "").length - 1)
            ) &&
            next.startsWith((hl.suffix ?? "").charAt(0))
          ) {
            values.push({
              val: previous,
              highlight: "",
            });
            values.push({
              val: hl.value,
              highlight: hl.color,
              title: hl.info,
            });

            left = rest.join(hl.value);
            checkIdx = 0;
          } else {
            if (checkIdx < left.length) {
              idx--;
              checkIdx = previous.length + hl.value.length;
            } else {
              checkIdx = 0;
            }
          }
        }

        values.push({
          val: left,
          highlight: "",
        });

        ReactDom.render(
          <div style={{ display: "inline-block", color: "rgb(203, 75, 22)" }}>
            {values.map(({ val, highlight, title }, idx) =>
              !!title ? (
                <Tooltip
                  title={title}
                  key={`tooltip-string-value-${val}-${idx}-${text}`}
                >
                  <span
                    className={`string-value ${!!highlight && `PangeaHighlight-${highlight}`}`}
                    key={`string-value-${val}-${idx}-${text}`}
                  >
                    {val}
                  </span>
                </Tooltip>
              ) : (
                <span
                  className={`string-value ${!!highlight && `PangeaHighlight-${highlight}`}`}
                  key={`string-value-${val}-${idx}-${text}`}
                >
                  {val}
                </span>
              )
            )}
          </div>,
          el
        );
      });
    }, 100);
  };

  useEffect(() => {
    if (!ref.current) return;
    subscribeToCollapse();
    subscribeToExpand();
    applyHighlights();
  }, [ref.current, highlights]);

  return ref;
};
