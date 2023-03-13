import React, { useRef, useEffect, useMemo } from "react";
import ReactDom from "react-dom";

import keyBy from "lodash/keyBy";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

enum ReactJsonView {
  CollapseBtn = ".collapsed-icon",
  ExpandBtn = ".expanded-icon",
  ObjectEl = ".object-key",
  VariableEl = ".variable-value",
}

export const HIGHLIGHTED_CLASS = "Pangea-Highlight";

export interface Highlight {
  value: string;
  color: "highlight" | "error";
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
          el.className = `${el.className} ${HIGHLIGHTED_CLASS}`;
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
        const values: { val: string; isHighlighted: boolean }[] = [];
        highlights_.forEach((hl) => {
          const [first, ...rest] = left.split(hl.value);
          values.push({
            val: first,
            isHighlighted: false,
          });
          values.push({
            val: hl.value,
            isHighlighted: true,
          });

          left = rest.join(hl.value);
        });

        values.push({
          val: left,
          isHighlighted: false,
        });

        ReactDom.render(
          <div style={{ display: "inline-block", color: "rgb(203, 75, 22)" }}>
            {values.map(({ val, isHighlighted }, idx) => (
              <span
                className={`string-value ${isHighlighted && HIGHLIGHTED_CLASS}`}
                key={`string-value-${val}-${idx}-${text}`}
              >
                {val}
              </span>
            ))}
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
